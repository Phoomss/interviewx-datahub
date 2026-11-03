import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { QualityValidationService } from './quality-validation.service';
import { TrainingEligibilityService } from './training-eligibility.service';
import { ConsentModule } from '../consent/consent.module';

@Module({
  imports: [ConsentModule],
  controllers: [DocumentsController],
  providers: [DocumentsService, QualityValidationService, TrainingEligibilityService],
  exports: [DocumentsService, QualityValidationService, TrainingEligibilityService],
})
export class DocumentsModule {}
