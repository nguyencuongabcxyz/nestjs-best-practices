import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class CatchAllFilter implements ExceptionFilter {
  private readonly logger = new Logger(CatchAllFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const isHttp = exception instanceof HttpException;

    const timestamp = new Date().toISOString();
    const path = req.url;

    if (!isHttp) {
      const body: ErrorResponse = {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong in the server',
        context: { timestamp, path },
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          module: 'Unknown',
          details: null,
        },
      };
      this.logger.error({ ...body, trace: (exception as Error)?.stack });
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(body);
    }

    const response = exception.getResponse() as Record<string, any>;
    const isValidationException =
      exception instanceof BadRequestException &&
      Array.isArray(response.message);
    const status = exception.getStatus();

    const body: ErrorResponse = {
      statusCode: status,
      message: isValidationException
        ? 'Input validation failed'
        : response.message,
      context: { timestamp, path },
      error: {
        code: isValidationException
          ? 'VALIDATION_ERROR'
          : response.code || 'UNKNOWN_ERROR',
        module: isValidationException
          ? 'ValidationPipe'
          : response.module || 'Unknown',
        details: isValidationException ? response.message : response.details,
      },
    };

    this.logger.error({ ...body, trace: exception.stack });
    res.status(status).json(body);
  }
}

class ErrorResponseContext {
  /**
   * The ISO 8601 timestamp indicating when the error occurred.
   * @example '2025-11-04T07:09:52.809Z'
   */
  timestamp: string;

  /**
   * The request path that triggered the error.
   * @example '/users'
   */
  path: string;
}

class ErrorResponseError {
  /**
   * A short readable error code representing the error type.
   * @example 'INTERNAL_SERVER_ERROR'
   */
  code: string;

  /**
   * The name of the application module or service where the error originated.
   * @example 'UserService'
   */
  module: string;

  /**
   * Additional structured information about the error, if available.
   * @example { userId: '123' }
   */
  details?: any;
}

export class ErrorResponse {
  /**
   * The HTTP status code associated with the error.
   * @example 500
   */
  statusCode: number;

  /**
   * A human-readable message summarizing the error.
   * @example 'Something went wrong on the server.'
   */
  message: string;

  /**
   * Metadata about the request context where the error occurred.
   */
  context: ErrorResponseContext;

  /**
   * Detailed information about the error (included only in non-production environments).
   */
  error: ErrorResponseError;
}
