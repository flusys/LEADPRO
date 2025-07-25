import { createLogger, format, transports } from 'winston';
import { existsSync, mkdirSync } from 'fs';
import { envConfig } from '@flusys/flusysnest/core/config';

// Custom log display format
const customFormat = format.printf(({ timestamp, level, message, stack, context }) => {
    return `${timestamp} - [${level.toUpperCase().padEnd(7)}] - [${context || 'App'}] - ${stack || message}`;
});


// Ensure logs directory exists
if (!existsSync('logs')) {
    mkdirSync('logs');
}

// For development environment
const devLogger = {
    format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        customFormat,
    ),
    transports: [new transports.Console()],
};

// For production environment
const prodLogger = {
    format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.json(),
    ),
    transports: [
        new transports.File({
            filename: 'logs/error.log',
            level: 'error',
        }),
        new transports.File({
            filename: 'logs/combine.log',
            level: 'silly',
        }),
    ],
};

const instanceLogger = envConfig.isProduction() ? prodLogger : devLogger;
const loggerInstance = createLogger(instanceLogger);
export const instance = loggerInstance;
