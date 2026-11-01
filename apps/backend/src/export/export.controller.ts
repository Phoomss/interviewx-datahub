import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ExportService } from './export.service';
import { CreateExportDto } from './dto/create-export.dto';

@ApiTags('Dataset Exports & MLflow Lineage')
@Controller('datasets')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Post('export')
  @ApiOperation({ summary: 'สั่งส่งออกชุดข้อมูลสำหรับฝึกสอน LLM (Alpaca, ShareGPT, ChatML) พร้อม PII Gate และ MLflow Tracking' })
  @ApiResponse({ status: 201, description: 'สร้างและส่งออก Dataset สำเร็จ' })
  createExport(@Body() dto: CreateExportDto, @Req() req: any) {
    const userId = req.user?.id;
    return this.exportService.createExport(dto, userId);
  }

  @Get('exports')
  @ApiOperation({ summary: 'ดึงรายการประวัติ Dataset ที่ส่งออกทั้งหมด' })
  @ApiResponse({ status: 200, description: 'รายการ Dataset สำเร็จ' })
  listExports() {
    return this.exportService.listExports();
  }

  @Get('exports/:id/download')
  @ApiOperation({ summary: 'รับ Presigned Download URL สำหรับดาวน์โหลดไฟล์ .jsonl จาก MinIO' })
  @ApiResponse({ status: 200, description: 'รับ URL ดาวน์โหลดสำเร็จ' })
  getDownloadUrl(@Param('id') id: string) {
    return this.exportService.getDownloadUrl(id);
  }
}
