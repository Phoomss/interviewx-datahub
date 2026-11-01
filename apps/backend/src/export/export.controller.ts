import { Controller, Get, Post, Body, Param, Req, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { ExportService } from './export.service';
import { CreateExportDto } from './dto/create-export.dto';

@ApiTags('Dataset Exports & MLflow Lineage')
@Controller('datasets')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Post('export')
  @ApiOperation({ summary: 'สั่งส่งออกชุดข้อมูลสำหรับฝึกสอน LLM / วิเคราะห์ข้อมูล (JSON, JSONL, CSV, XLSX, Alpaca, ShareGPT, ChatML)' })
  @ApiResponse({ status: 201, description: 'สร้างและส่งออก Dataset สำเร็จ' })
  createExport(@Body() dto: CreateExportDto, @Req() req: any) {
    const userId = req.user?.id;
    return this.exportService.createExport(dto, userId);
  }

  @Post('exports')
  @ApiOperation({ summary: 'สั่งส่งออกชุดข้อมูล (Alias)' })
  createExportAlias(@Body() dto: CreateExportDto, @Req() req: any) {
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
  @ApiOperation({ summary: 'รับ Presigned Download URL สำหรับดาวน์โหลดไฟล์จาก MinIO' })
  @ApiResponse({ status: 200, description: 'รับ URL ดาวน์โหลดสำเร็จ' })
  getDownloadUrl(@Param('id') id: string) {
    return this.exportService.getDownloadUrl(id);
  }

  @Get('exports/:id/file')
  @ApiOperation({ summary: 'ดาวน์โหลดไฟล์ Dataset โดยตรงจาก Object Storage (Direct Streaming)' })
  async downloadFile(@Param('id') id: string, @Res() res: Response) {
    try {
      const exp = await this.exportService.getExport(id);
      const { stream, exportName } = await this.exportService.getExportStream(id);
      const ext = exp.storagePath ? exp.storagePath.split('.').pop() || 'jsonl' : 'jsonl';
      const contentTypeMap: Record<string, string> = {
        json: 'application/json',
        jsonl: 'application/jsonlines',
        csv: 'text/csv; charset=utf-8',
        xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      };
      res.setHeader('Content-Type', contentTypeMap[ext] || 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="${exportName}.${ext}"`);
      stream.pipe(res);
    } catch (err: any) {
      return res.status(404).json({ success: false, message: 'ไม่พบไฟล์ Dataset Export ใน Object Storage' });
    }
  }
}
