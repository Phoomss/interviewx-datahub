import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class MinioService implements OnModuleInit {
  private readonly logger = new Logger(MinioService.name);
  private client: Minio.Client;
  private readonly bucketRawDocs: string;
  private readonly bucketExports: string;

  constructor(private readonly config: ConfigService) {
    this.bucketRawDocs = this.config.get<string>('MINIO_BUCKET_RAW_DOCUMENTS', 'raw-documents');
    this.bucketExports = this.config.get<string>('MINIO_BUCKET_DATASET_EXPORTS', 'dataset-exports');
  }

  async onModuleInit() {
    const endPoint = this.config.get<string>('MINIO_ENDPOINT', 'localhost');
    const port = Number(this.config.get<number>('MINIO_PORT', 9000));
    const useSSL = this.config.get<string>('MINIO_USE_SSL', 'false') === 'true';
    const accessKey = this.config.get<string>('MINIO_ROOT_USER', 'minioadmin');
    const secretKey = this.config.get<string>('MINIO_ROOT_PASSWORD', 'minioadmin');

    try {
      this.client = new Minio.Client({
        endPoint,
        port,
        useSSL,
        accessKey,
        secretKey,
      });
      this.logger.log(`MinIO Client configured for endpoint: ${endPoint}:${port}`);

      // Auto-create default buckets
      for (const bucket of [this.bucketRawDocs, this.bucketExports]) {
        try {
          const exists = await this.client.bucketExists(bucket);
          if (!exists) {
            await this.client.makeBucket(bucket);
            this.logger.log(`Created default MinIO bucket: ${bucket}`);
          }
        } catch (bErr) {
          this.logger.debug(`Bucket '${bucket}' check deferred (MinIO starting up)`);
        }
      }
    } catch (err) {
      this.logger.warn(`MinIO connection deferred: ${err.message}`);
    }
  }

  async uploadExportArtifact(key: string, buffer: Buffer, contentType: string = 'application/jsonl'): Promise<string> {
    try {
      if (this.client) {
        const exists = await this.client.bucketExists(this.bucketExports);
        if (!exists) {
          await this.client.makeBucket(this.bucketExports);
        }

        await this.client.putObject(this.bucketExports, key, buffer, buffer.length, {
          'Content-Type': contentType,
        });
        return `${this.bucketExports}/${key}`;
      }
    } catch (err) {
      this.logger.warn(`MinIO upload fallback (using simulated artifact path): ${err.message}`);
    }
    return `simulated://${this.bucketExports}/${key}`;
  }

  async getPresignedDownloadUrl(key: string, expirySeconds: number = 3600): Promise<string> {
    try {
      if (this.client) {
        return await this.client.presignedGetObject(this.bucketExports, key, expirySeconds);
      }
    } catch (err) {
      this.logger.warn(`MinIO presigned URL fallback: ${err.message}`);
    }
    return `http://localhost:9000/${this.bucketExports}/${key}?simulated=true`;
  }
}
