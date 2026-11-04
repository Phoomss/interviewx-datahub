import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { StorageModule } from './storage/storage.module';
import { DocumentsModule } from './documents/documents.module';
import { ExportModule } from './export/export.module';
import { ConsentModule } from './consent/consent.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { SyntheticModule } from './synthetic/synthetic.module';
import { TaxonomyModule } from './taxonomy/taxonomy.module';
import { AuthModule } from './auth/auth.module';
import { QueueModule } from './queue/queue.module';
import { TrainingModule } from './training/training.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
    }),
    PrismaModule,
    StorageModule,
    AuthModule,
    QueueModule,
    DocumentsModule,
    ExportModule,
    ConsentModule,
    AnalyticsModule,
    SyntheticModule,
    TaxonomyModule,
    TrainingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
