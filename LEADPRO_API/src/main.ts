import { NestFactory } from '@nestjs/core';
import { Logger, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { DataSource } from 'typeorm';
import { AppModule } from './app.module';
import { seedData } from '@flusys/flusysnest/core/data';
import { envConfig } from '@flusys/flusysnest/core/config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Seed Package Data;
  // const dataSource = app.get(DataSource);
  // await seedData(dataSource, 'Lead Pro', 'lead_pro');

  app.enableCors({
    origin: envConfig.getOrigins(),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
  });

  // Version Control
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.use(cookieParser());

  // Global Prefix
  // app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Billings example')
    .setDescription('The Billings API description')
    .setVersion('1.0')
    .addTag('Billings')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Application is running on port ${port}`);
}

bootstrap();