import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Request, Response } from 'express';

@Catch()
export class CatchAllFilter implements ExceptionFilter {
  private readonly logger = new Logger(CatchAllFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const isProd = process.env.NODE_ENV === 'production';
    const isHttp = exception instanceof HttpException;

    const status = isHttp
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = isHttp
      ? (exception.getResponse() as any)?.message || exception.message
      : 'Something went wrong in the server';

    const base: ErrorResponse = {
      statusCode: status,
      message,
      context: {
        timestamp: new Date().toISOString(),
        path: req.url,
      },
    };

    if (!isProd) {
      base.error = {
        code: isHttp
          ? (exception.getResponse() as any)?.code
          : 'INTERNAL_SERVER_ERROR',
        module: isHttp ? (exception.getResponse() as any)?.module : 'Unknown',
        details: isHttp ? (exception.getResponse() as any)?.details : null,
        trace: isHttp ? exception.stack : (exception as Error)?.stack,
      };
    }

    this.logger.error(base);
    res.status(status).json(base);
  }
}

class ErrorResponseContext {
  @ApiProperty({
    description: 'The ISO 8601 timestamp indicating when the error occurred.',
    example: '2025-11-04T07:09:52.809Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'The request path that triggered the error.',
    example: '/users',
  })
  path: string;
}

class ErrorResponseError {
  @ApiProperty({
    description: 'A short readable error code representing the error type.',
    example: 'INTERNAL_SERVER_ERROR',
  })
  code: string;

  @ApiProperty({
    description:
      'The name of the application module or service where the error originated.',
    example: 'UserService',
  })
  module: string;

  @ApiProperty({
    description:
      'Additional structured information about the error, if available.',
    example: { userId: '123' },
    nullable: true,
    required: false,
  })
  details?: any;

  @ApiProperty({
    description: 'The stack trace of the error.',
    example:
      'Error: Something went wrong\n    at UsersService.getUsers (.../users.service.ts:14:11)\n    at UsersController.getUsers (.../users.controller.ts:47:30)',
    required: false,
  })
  trace?: string;
}

export class ErrorResponse {
  @ApiProperty({
    description: 'The HTTP status code associated with the error.',
    example: 500,
  })
  statusCode: number;

  @ApiProperty({
    description: 'A human-readable message summarizing the error.',
    example: 'Something went wrong on the server.',
  })
  message: string;

  @ApiProperty({
    description: 'Metadata about the request context where the error occurred.',
    type: () => ErrorResponseContext,
  })
  context: ErrorResponseContext;

  @ApiProperty({
    description:
      'Detailed information about the error (included only in non-production environments).',
    type: () => ErrorResponseError,
    required: false,
  })
  error?: ErrorResponseError;
}
