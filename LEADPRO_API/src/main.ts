import { NestFactory } from '@nestjs/core';
import { Logger, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { DataSource } from 'typeorm';
import { AppModule } from './app.module';
import { envConfig } from '@flusys/flusysnest/core/config';
import { WinstonModule } from 'nest-winston';
import { instance } from './winston.logger';
import { TransformResponseInterceptor } from '@flusys/flusysnest/shared/interceptors';
import { seedData } from '@flusys/flusysnest/core/data';
import { seedMenuV1Data } from './persistence/seeds/menu_v1.seed';
import { seedMenuV2Data } from './persistence/seeds/menu_v2.seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance: instance,
    }),
  });

  // Seed Package Data;
  const dataSource = app.get(DataSource);
  // await seedData(dataSource);
  //  await seedMenuV1Data(dataSource);
  //  await seedMenuV2Data(dataSource);

  app.enableCors({
    origin: envConfig.getOrigins(),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
  });


  app.useGlobalInterceptors(new TransformResponseInterceptor());

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

  const port = envConfig.getPort() || 3000;
  await app.listen(port);
  console.log(`Application is running on port ${port}`);
}

bootstrap();