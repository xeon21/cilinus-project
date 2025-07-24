// 생성: backend/src/resource/resource.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as fs from 'fs/promises';
import * as path from 'path';
import { ResourceLogDto } from '../dto/resource.dto';
import * as os from 'os';
import * as osUtils from 'os-utils';
import { promisify } from 'util';
import { exec } from 'child_process';
import { ResourceRepository } from './resource.repository';
import { DeviceStatusSummaryDto, DeviceStatusStatisticsDto } from '../dto/device-status.dto';

const execAsync = promisify(exec);
const getCpuUsage = promisify(osUtils.cpuUsage);

const LOG_FILE_PATH = path.join(
  __dirname,
  '..',
  '..',
  'logs',
  'resource-usage.log',
);

@Injectable()
export class ResourceService {
  private readonly logger = new Logger(ResourceService.name);

  constructor(private readonly resourceRepository: ResourceRepository) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async logResourceUsage() {
    try {
      // 실제 메모리 사용량 계산
      const totalMemory = os.totalmem();
      const freeMemory = os.freemem();
      const usedMemory = totalMemory - freeMemory;
      const memoryUsagePercent = (usedMemory / totalMemory) * 100;

      // 실제 디스크 사용량 계산 (Windows)
      let diskUsagePercent = 0;
      let diskUsageGB = 0;
      let totalDiskGB = 0;
      try {
        if (process.platform === 'win32') {
          // PowerShell을 사용하여 C 드라이브 정보 가져오기
          const psCommand = `powershell -Command "Get-PSDrive -Name C | Select-Object Used, Free, @{Name='Size';Expression={$_.Used + $_.Free}} | ConvertTo-Json"`;
          const { stdout } = await execAsync(psCommand);
          
          this.logger.log(`PowerShell Output: ${stdout}`);
          
          const driveInfo = JSON.parse(stdout);
          
          if (driveInfo) {
            // PowerShell은 바이트 단위로 반환
            const usedBytes = driveInfo.Used || 0;
            const freeBytes = driveInfo.Free || 0;
            const totalBytes = driveInfo.Size || 1;
            
            // 바이트를 GB로 변환
            diskUsageGB = usedBytes / (1024 * 1024 * 1024);
            const freeSpaceGB = freeBytes / (1024 * 1024 * 1024);
            totalDiskGB = totalBytes / (1024 * 1024 * 1024);
            
            diskUsagePercent = (diskUsageGB / totalDiskGB) * 100;
            
            this.logger.log(`디스크 정보 - Total: ${totalDiskGB.toFixed(2)}GB, Used: ${diskUsageGB.toFixed(2)}GB, Free: ${freeSpaceGB.toFixed(2)}GB, Usage: ${diskUsagePercent.toFixed(2)}%`);
          } else {
            throw new Error('Failed to parse PowerShell output');
          }
        } else {
          // Linux/Mac
          const { stdout } = await execAsync('df -BG / | tail -1');
          const parts = stdout.trim().split(/\s+/);
          if (parts.length >= 4) {
            // df 출력: Filesystem 1G-blocks Used Available Use% Mounted
            totalDiskGB = parseInt(parts[1]) || 1;
            diskUsageGB = parseInt(parts[2]) || 0;
            diskUsagePercent = parseInt(parts[4].replace('%', '')) || 0;
            
            this.logger.log(`디스크 정보 (Linux/Mac) - Total: ${totalDiskGB}GB, Used: ${diskUsageGB}GB, Usage: ${diskUsagePercent}%`);
          }
        }
      } catch (diskError) {
        this.logger.warn('Failed to get disk usage, using default', diskError);
        diskUsageGB = 100; // 100GB fallback
        diskUsagePercent = 10; // 10% fallback
      }

      const usage: ResourceLogDto = {
        timestamp: new Date().toISOString(),
        memory: memoryUsagePercent,
        disk: diskUsageGB, // GB 단위로 변경
      };

      const logEntry = JSON.stringify(usage) + '\n';

      await fs.appendFile(LOG_FILE_PATH, logEntry);
      this.logger.log(`리소스 사용량 기록 - Memory: ${usage.memory.toFixed(2)}%, Disk: ${usage.disk.toFixed(2)}GB (${diskUsagePercent.toFixed(2)}%)`);
    } catch (error) {
      this.logger.error('Failed to write resource log', error);
    }
  }

  async getResourceHistory(): Promise<ResourceLogDto[]> {
    try {
      const fileContent = await fs.readFile(LOG_FILE_PATH, 'utf-8');
      const lines = fileContent.trim().split('\n');
      const logs = lines.map((line) => JSON.parse(line) as ResourceLogDto);

      // 최근 12시간 데이터만 필터링 (720분)
      const twelveHoursAgo = new Date(
        new Date().getTime() - 12 * 60 * 60 * 1000,
      );
      return logs.filter((log) => new Date(log.timestamp) > twelveHoursAgo);
    } catch (error) {
      if (error.code === 'ENOENT') {
        this.logger.warn('Log file not found, returning empty array.');
        return [];
      }
      this.logger.error('Failed to read resource log', error);
      return [];
    }
  }

  async getDeviceStatusSummary(): Promise<DeviceStatusSummaryDto> {
    try {
      this.logger.log('디바이스 상태 통계 조회 시작');
      
      // 전체 디바이스 수 조회
      const total = await this.resourceRepository.getTotalDeviceCount();
      this.logger.log(`전체 디바이스 수: ${total}`);
      
      // 상태별 통계 조회
      const statusData = await this.resourceRepository.getDeviceStatusStatistics();
      
      // 상태별 비율 계산 및 DTO 변환
      const statusBreakdown: DeviceStatusStatisticsDto[] = [];
      
      // DB에서 사용하는 상태값을 프론트엔드에서 사용하는 값으로 매핑
      const statusMapping = {
        'active': 'online',
        'inactive': 'offline',
        'ready': 'warning',
        'error': 'error'
      };
      
      // 모든 상태에 대해 기본값 0으로 초기화
      const allStatuses = ['online', 'offline', 'warning', 'error'];
      const statusCounts = allStatuses.reduce((acc, status) => {
        acc[status] = 0;
        return acc;
      }, {} as Record<string, number>);
      
      // DB 결과를 프론트엔드 상태로 매핑
      statusData.forEach(item => {
        const mappedStatus = statusMapping[item.status] || item.status;
        if (statusCounts.hasOwnProperty(mappedStatus)) {
          statusCounts[mappedStatus] = item.count;
        }
      });
      
      // DTO 배열 생성
      allStatuses.forEach(status => {
        const count = statusCounts[status];
        const percentage = total > 0 ? (count / total) * 100 : 0;
        
        statusBreakdown.push({
          status,
          count,
          percentage: Math.round(percentage * 100) / 100 // 소수점 2자리까지
        });
      });
      
      const result: DeviceStatusSummaryDto = {
        total,
        statusBreakdown,
        timestamp: new Date().toISOString()
      };

      this.logger.log('디바이스 상태 통계 조회 완료');
      this.logger.log(`전송 데이터: ${JSON.stringify(result)}`);
      
      return result;
    } catch (error) {
      this.logger.error('Failed to get device status summary', error);
      throw error;
    }
  }
}
