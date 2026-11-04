import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TrainingService } from './training.service';

describe('TrainingService - Fine-Tuning Pipeline & Model Registry Gate', () => {
  let service: TrainingService;
  let mockPrisma: any;
  let mockConfig: any;

  beforeEach(() => {
    mockPrisma = {
      trainingJob: {
        create: mock((args: any) => Promise.resolve({ id: 'job-1', ...args.data })),
        findUnique: mock((args: any) => Promise.resolve(null)),
        findMany: mock(() => Promise.resolve([])),
        update: mock((args: any) => Promise.resolve({ id: args.where.id, ...args.data })),
      },
      datasetExport: {
        findUnique: mock((args: any) => Promise.resolve(null)),
      },
      modelVersion: {
        create: mock((args: any) => Promise.resolve({ id: 'model-1', ...args.data })),
        findUnique: mock((args: any) => Promise.resolve(null)),
        findFirst: mock(() => Promise.resolve(null)),
        findMany: mock(() => Promise.resolve([])),
        update: mock((args: any) => Promise.resolve({ id: args.where.id, ...args.data })),
      },
    };

    mockConfig = {
      get: mock((key: string, def?: any) => def),
    };

    service = new TrainingService(mockPrisma, mockConfig);
  });

  it('should create training job with default PEFT hyperparameters', async () => {
    mockPrisma.datasetExport.findUnique.mockResolvedValue({ id: 'exp-1' });

    const job = await service.createTrainingJob({
      jobName: 'Qwen Technical Interviewer',
      baseModel: 'Qwen/Qwen2.5-7B-Instruct',
      datasetExportId: 'exp-1',
    });

    expect(job).toBeDefined();
    expect(job.status).toBe('QUEUED');
    expect(mockPrisma.trainingJob.create).toHaveBeenCalled();
  });

  it('should throw NotFoundException if datasetExport does not exist', async () => {
    mockPrisma.datasetExport.findUnique.mockResolvedValue(null);

    await expect(
      service.createTrainingJob({
        jobName: 'Failed Job',
        baseModel: 'Qwen/Qwen2.5-7B-Instruct',
        datasetExportId: 'non-existent',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should promote model to STAGING without gate restrictions', async () => {
    mockPrisma.modelVersion.findUnique.mockResolvedValue({
      id: 'model-1',
      name: 'interviewx-tech',
      version: 'v1.0.0',
      status: 'CANDIDATE',
      benchmarkScore: 0.75,
      minQualityScore: 0.80,
      piiScanPassed: true,
    });

    const res = await service.promoteModel('model-1', {
      targetStatus: 'STAGING',
    });

    expect(res).toBeDefined();
    expect(mockPrisma.modelVersion.update).toHaveBeenCalled();
  });

  it('should block promotion to PRODUCTION if benchmark score is below threshold', async () => {
    mockPrisma.modelVersion.findUnique.mockResolvedValue({
      id: 'model-fail-1',
      name: 'interviewx-low-score',
      version: 'v1.0.0',
      status: 'CANDIDATE',
      benchmarkScore: 0.72,
      minQualityScore: 0.80,
      piiScanPassed: true,
    });

    await expect(
      service.promoteModel('model-fail-1', {
        targetStatus: 'PRODUCTION',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should block promotion to PRODUCTION if Zero PII scan failed', async () => {
    mockPrisma.modelVersion.findUnique.mockResolvedValue({
      id: 'model-leak-1',
      name: 'interviewx-leaky',
      version: 'v1.0.0',
      status: 'CANDIDATE',
      benchmarkScore: 0.92,
      minQualityScore: 0.80,
      piiScanPassed: false, // PII Leak detected
    });

    await expect(
      service.promoteModel('model-leak-1', {
        targetStatus: 'PRODUCTION',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should promote model to PRODUCTION when passing all gates and record publication timestamp', async () => {
    mockPrisma.modelVersion.findUnique.mockResolvedValue({
      id: 'model-pass-1',
      name: 'interviewx-approved',
      version: 'v1.0.0',
      status: 'STAGING',
      benchmarkScore: 0.91,
      minQualityScore: 0.80,
      piiScanPassed: true,
      deploymentEndpoint: null,
    });

    const res = await service.promoteModel(
      'model-pass-1',
      {
        targetStatus: 'PRODUCTION',
        deploymentEndpoint: 'http://inference.interviewx.internal/v1/models/interviewx-approved',
      },
      'admin-usr-1',
    );

    expect(res).toBeDefined();
    expect(mockPrisma.modelVersion.update).toHaveBeenCalled();
  });

  it('should return active production model metadata for InterviewX Core', async () => {
    mockPrisma.modelVersion.findFirst.mockResolvedValue({
      id: 'model-prod-1',
      name: 'interviewx-tech-prod',
      version: 'v1.2.0',
      baseModel: 'Qwen/Qwen2.5-7B-Instruct',
      artifactUri: 'minio://checkpoints/model-prod-1',
      deploymentEndpoint: 'http://inference.interviewx.internal/v1/models/interviewx-tech-prod',
      benchmarkScore: 0.94,
      publishedAt: new Date(),
    });

    const active = await service.getActiveProductionModel('interviewx-tech-prod');
    expect(active.name).toBe('interviewx-tech-prod');
    expect(active.version).toBe('v1.2.0');
    expect(active.deploymentEndpoint).toBeDefined();
  });
});
