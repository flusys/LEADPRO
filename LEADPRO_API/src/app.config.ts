import { ENTITY_ARRAY } from '@flusys/flusysnest/persistence/entities';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const appDataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '123456',
    database: 'LEADPRO',
    entities: [
        __dirname + '/**/*.entity{.ts,.js}',
        ...ENTITY_ARRAY
    ],
    migrationsTableName: 'migrations',
    migrations: [
        __dirname + '/migrations/*{.ts,.js}'
    ],
    namingStrategy: new SnakeNamingStrategy(),
});

export const appconfig = () => ({
    userJwtSecret: 'project2025',
    cookieDomainName: 'localhost',
    userTokenCookieName: 'refreshToken',
    userTokenExpiredTime: 24 * 60 * 60,
    userRefreshTokenExpiredTime: 168 * 60 * 60,
    isLive: false,
    companyPremised: false,
});
