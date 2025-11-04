import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger, Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  CatchAllFilter,
  ErrorResponse,
} from './common/filters/catch-all.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      json: true,
      colors: true,
      prefix: 'PFJ Backend',
    }),
  });

  const config = new DocumentBuilder()
    .setTitle('PFJ Backend API')
    .setDescription('RESTful API documentation for the PFJ backend.')
    .setVersion('1.0')
    .addGlobalResponse({
      status: 500,
      description: 'Internal server error',
      type: ErrorResponse,
    })
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new CatchAllFilter());

  const logger = new Logger('Bootstrap');
  logger.log(
    `Starting app in ${process.env.NODE_ENV || 'development'} mode...`,
  );
  await app.listen(process.env.PORT ?? 3000);
  logger.log(`Server running on port ${process.env.PORT || 3000}`);
}

bootstrap();
