import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccessModule, AuthModule } from '@flusys/flusysnest/pages';
import { CacheModule } from '@flusys/flusysnest/shared/modules';
import { AppRoutingModule } from './app-routing.module';
import { appconfig, appDataSource } from './app.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CashModule } from './modules/cash/cash.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { EncryptionModule } from './modules/encryption/encryption.module';
import { ExpenseModule } from './modules/expense/expense.module';
import { RegistrationModule } from './modules/registration/registration.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appconfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(appDataSource.options),

    CacheModule.forRoot(true, 8.64e7, 10000),
    RegistrationModule,

    AppRoutingModule,
    AuthModule,
    AccessModule,

    CashModule,
    ExpenseModule,
    DashboardModule,
    EncryptionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtService,
    {
      provide: APP_PIPE,
      useFactory: () => new ValidationPipe({ transform: true }),
    },
  ],
})
export class AppModule {}
