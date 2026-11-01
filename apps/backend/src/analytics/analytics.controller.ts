import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';

@ApiTags('Enterprise Governance & Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('bias-distribution')
  @ApiOperation({ summary: 'ดึงข้อมูลสถิติความหลากหลายของข้อมูลและตรวจสอบความลำเอียง (Data Bias & Diversity Metrics)' })
  @ApiResponse({ status: 200, description: 'ดึงข้อมูลสถิติสำเร็จ' })
  getBiasAndDiversityMetrics() {
    return this.analyticsService.getBiasAndDiversityMetrics();
  }

  @Get('system-metrics')
  @ApiOperation({ summary: 'ดึงข้อมูลประสิทธิภาพระบบ สถานะคิวงาน และอัตราแคช (Queue & Scale Health)' })
  @ApiResponse({ status: 200, description: 'ดึงข้อมูลประสิทธิภาพสำเร็จ' })
  getSystemPerformanceMetrics() {
    return this.analyticsService.getSystemPerformanceMetrics();
  }

  @Get('audit-logs')
  @ApiOperation({ summary: 'ดึงประวัติการเข้าถึงและการกระทำในระบบทั้งหมด (Comprehensive Audit Trail)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  getAuditLogs(@Query('page') page: number = 1, @Query('limit') limit: number = 20) {
    return this.analyticsService.getAuditLogs(Number(page), Number(limit));
  }
}
