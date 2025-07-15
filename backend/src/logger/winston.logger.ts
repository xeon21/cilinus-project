// src/logger/winston.logger.ts

import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

const logDir = 'logs'; // 로그 저장 디렉토리

export const winstonLoggerOptions: winston.LoggerOptions = {
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
  ),
  transports: [
    // 콘솔 로그
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        nestWinstonModuleUtilities.format.nestLike('App', {
          prettyPrint: true,
        }),
      ),
    }),

    // info.log - 일별 로그 파일 (회전됨)
    new winston.transports.DailyRotateFile({
      dirname: logDir,
      filename: 'application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '10m',
      maxFiles: '14d',
      level: 'info',
    }),

    // error.log - 에러 전용 로그
    new winston.transports.File({
      dirname: logDir,
      filename: 'error.log',
      level: 'error',
    }),
  ],
};
