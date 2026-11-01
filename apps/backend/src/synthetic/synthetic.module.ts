import { Module } from '@nestjs/common';
import { SyntheticController } from './synthetic.controller';
import { SyntheticService } from './synthetic.service';
import { PrismaModule } from '../prisma/prisma.module';
import { DocumentsModule } from '../documents/documents.module';

@Module({
  imports: [PrismaModule, DocumentsModule],
  controllers: [SyntheticController],
  providers: [SyntheticService],
  exports: [SyntheticService],
})
export class SyntheticModule {}
