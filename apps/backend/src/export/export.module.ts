import { Module } from '@nestjs/common';
import { ExportController } from './export.controller';
import { ExportService } from './export.service';
import { MlflowService } from './mlflow.service';

@Module({
  controllers: [ExportController],
  providers: [ExportService, MlflowService],
  exports: [ExportService],
})
export class ExportModule {}
