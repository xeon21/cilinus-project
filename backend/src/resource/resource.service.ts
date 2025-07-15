// 생성: backend/src/resource/resource.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as fs from 'fs/promises';
import * as path from 'path';

const LOG_FILE_PATH = path.join(__dirname, '..', '..', 'logs', 'resource-usage.log');

export interface ResourceLog {
    timestamp: string;
    memory: number;
    disk: number;
}

@Injectable()
export class ResourceService {
  private readonly logger = new Logger(ResourceService.name);

  @Cron(CronExpression.EVERY_MINUTE)
  async logResourceUsage() {
    // 실제로는 여기서 시스템 리소스 사용량을 가져옵니다.
    // 예: const memoryUsage = process.memoryUsage().rss / (1024 * 1024);

    // 현재는 Mock 데이터 생성
    const usage = {
      timestamp: new Date().toISOString(),
      memory: 50 + Math.random() * 10, // 50% ~ 60% 사이의 랜덤 값
      disk: 45 + Math.random() * 5,   // 45% ~ 50% 사이의 랜덤 값
    };

    const logEntry = JSON.stringify(usage) + '\n';

    try {
      await fs.appendFile(LOG_FILE_PATH, logEntry);
    } catch (error) {
      this.logger.error('Failed to write resource log', error);
    }
  }

  async getResourceHistory(): Promise<ResourceLog[]> {
        try {
            const fileContent = await fs.readFile(LOG_FILE_PATH, 'utf-8');
            const lines = fileContent.trim().split('\n');
            const logs = lines.map(line => JSON.parse(line) as ResourceLog);

            // 최근 12시간 데이터만 필터링 (720분)
            const twelveHoursAgo = new Date(new Date().getTime() - 12 * 60 * 60 * 1000);
            return logs.filter(log => new Date(log.timestamp) > twelveHoursAgo);

        } catch (error) {
            if (error.code === 'ENOENT') {
                this.logger.warn('Log file not found, returning empty array.');
                return [];
            }
            this.logger.error('Failed to read resource log', error);
            return [];
        }
    }
}