import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

export interface DeviceFailureAlertData {
  deviceId: string;
  reason: 'timeout' | 'disconnected';
  lastSeen: Date;
  failureTime: Date;
  metadata?: any;
}

@Injectable()
export class EmailService {
  private logger = new Logger('EmailService');
  private adminEmails: string[];

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {
    // 관리자 이메일은 환경변수에서 콤마로 구분된 목록으로 가져옴
    const adminEmailsStr = this.configService.get<string>(
      'ADMIN_EMAILS',
      'admin@cilinus.com',
    );
    this.adminEmails = adminEmailsStr.split(',').map((email) => email.trim());

    this.logger.log(
      `Email service initialized. Admin emails: ${this.adminEmails.join(', ')}`,
    );
  }

  async sendDeviceFailureAlert(data: DeviceFailureAlertData): Promise<boolean> {
    try {
      const { deviceId, reason, lastSeen, failureTime, metadata } = data;

      const subject = `[긴급] ESL 디바이스 장애 알림 - ${deviceId}`;
      const reasonText = reason === 'timeout' ? '응답 시간 초과' : '연결 끊김';
      const downtime = Math.floor(
        (failureTime.getTime() - lastSeen.getTime()) / 1000,
      );

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f4f4f4;
            }
            .alert-box {
              background-color: #fff;
              border-left: 5px solid #dc3545;
              padding: 20px;
              margin-bottom: 20px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
              color: #dc3545;
              margin-bottom: 20px;
            }
            .info-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            .info-table th {
              text-align: left;
              padding: 10px;
              background-color: #f8f9fa;
              border: 1px solid #dee2e6;
              width: 30%;
            }
            .info-table td {
              padding: 10px;
              border: 1px solid #dee2e6;
            }
            .footer {
              margin-top: 30px;
              font-size: 12px;
              color: #666;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="alert-box">
              <h2 class="header">ESL 디바이스 장애 감지</h2>
              <p>아래 디바이스에서 장애가 감지되었습니다. 즉시 확인이 필요합니다.</p>
              
              <table class="info-table">
                <tr>
                  <th>디바이스 ID</th>
                  <td>${deviceId}</td>
                </tr>
                <tr>
                  <th>장애 유형</th>
                  <td>${reasonText}</td>
                </tr>
                <tr>
                  <th>마지막 응답 시간</th>
                  <td>${lastSeen.toLocaleString('ko-KR')}</td>
                </tr>
                <tr>
                  <th>장애 감지 시간</th>
                  <td>${failureTime.toLocaleString('ko-KR')}</td>
                </tr>
                <tr>
                  <th>다운타임</th>
                  <td>${downtime}초</td>
                </tr>
                ${
                  metadata
                    ? `
                <tr>
                  <th>추가 정보</th>
                  <td>${JSON.stringify(metadata, null, 2)}</td>
                </tr>
                `
                    : ''
                }
              </table>
              
              <p style="margin-top: 20px;">
                <strong>조치 사항:</strong><br>
                1. 디바이스의 네트워크 연결 상태를 확인하세요.<br>
                2. 디바이스의 전원 상태를 확인하세요.<br>
                3. 필요시 디바이스를 재시작하세요.
              </p>
            </div>
            
            <div class="footer">
              <p>이 메일은 Cilinus ESL 모니터링 시스템에서 자동으로 발송되었습니다.</p>
              <p>문의사항은 시스템 관리자에게 연락하세요.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const text = `
ESL 디바이스 장애 알림

디바이스 ID: ${deviceId}
장애 유형: ${reasonText}
마지막 응답 시간: ${lastSeen.toLocaleString('ko-KR')}
장애 감지 시간: ${failureTime.toLocaleString('ko-KR')}
다운타임: ${downtime}초

조치 사항:
1. 디바이스의 네트워크 연결 상태를 확인하세요.
2. 디바이스의 전원 상태를 확인하세요.
3. 필요시 디바이스를 재시작하세요.
      `;

      this.logger.log(
        `Sending device failure alert email for device: ${deviceId}`,
      );
      this.logger.debug(`Email recipients: ${this.adminEmails.join(', ')}`);
      this.logger.debug(`Email content - Subject: ${subject}`);

      await this.mailerService.sendMail({
        to: this.adminEmails,
        subject,
        text,
        html,
      });

      this.logger.log(
        `Device failure alert email sent successfully for device: ${deviceId}`,
      );
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to send device failure alert email: ${error.message}`,
      );
      this.logger.error(error.stack);
      return false;
    }
  }

  async testEmailConfiguration(): Promise<boolean> {
    try {
      const testSubject =
        '[테스트] Cilinus ESL 모니터링 시스템 이메일 설정 확인';
      const testHtml = `
        <h2>이메일 설정 테스트</h2>
        <p>이 메일은 Cilinus ESL 모니터링 시스템의 이메일 설정을 확인하기 위한 테스트 메일입니다.</p>
        <p>테스트 시간: ${new Date().toLocaleString('ko-KR')}</p>
      `;

      await this.mailerService.sendMail({
        to: this.adminEmails[0], // 첫 번째 관리자 이메일로만 테스트
        subject: testSubject,
        html: testHtml,
      });

      this.logger.log('Test email sent successfully');
      return true;
    } catch (error) {
      this.logger.error(`Failed to send test email: ${error.message}`);
      return false;
    }
  }
}
