import { ENTITY_ARRAY } from '@flusys/flusysnest/persistence/entities';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { envConfig } from '@flusys/flusysnest/core/config';
import { IAppConfig } from '@flusys/flusysnest/core/interfaces';

export const appDataSource = new DataSource({
    type: 'mysql',
    ...envConfig.getTypeOrmConfig(),
    entities: [
        ...ENTITY_ARRAY,
        __dirname + '/**/*.entity{.ts,.js}'
    ],
    migrationsTableName: 'migrations',
    migrations: [
        __dirname + '/persistence/migrations/*{.ts,.js}'
    ],
    migrationsRun: false,
    synchronize: false,
    namingStrategy: new SnakeNamingStrategy(),
});

export const appconfig = (): IAppConfig => ({
    userJwtSecret: 'project2025',
    cookieDomainName: envConfig.getCookieDomainName(),
    userTokenCookieName: 'refreshToken',
    userTokenExpiredTime: 24 * 60 * 60,
    userRefreshTokenExpiredTime: 168 * 60 * 60,
    organizationPremised: false,
    uploader: 'file',
});
