import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { APP_PIPE } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppRoutingModule } from './app-routing.module';
import { AuthModule, AccessModule } from '@flusys/flusysnest/pages';
import { appconfig, appDataSource } from './app.config';
import { RegistrationModule } from './modules/registration/registration.module';
import { CashModule } from './modules/cash/cash.module';
import { ExpenseModule } from './modules/expense/expense.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { EncryptionModule } from './modules/encryption/encryption.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appconfig],
      isGlobal: true,
    }),

    CacheModule.register({
      ttl: 8.64e+7, // One day in millisecond
      isGlobal: true,
    }),

    TypeOrmModule.forRoot(appDataSource.options),
    RegistrationModule,
    
    AppRoutingModule,
    AuthModule,
    AccessModule,
    
    CashModule,
    ExpenseModule,
    DashboardModule,
    EncryptionModule
  ],
  controllers: [AppController],
  providers: [AppService, JwtService,
    {
      provide: APP_PIPE,
      useFactory: () => new ValidationPipe({ transform: true })
    }
  ],
})
export class AppModule { }