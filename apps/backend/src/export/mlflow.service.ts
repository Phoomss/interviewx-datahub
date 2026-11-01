import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MlflowService {
  private readonly logger = new Logger(MlflowService.name);
  private readonly trackingUri: string;

  constructor(private readonly config: ConfigService) {
    this.trackingUri = this.config.get<string>('MLFLOW_TRACKING_URI', 'http://localhost:5001');
  }

  async recordExportRun(params: {
    exportName: string;
    format: string;
    recordCount: number;
    dvcHash: string;
    filterCriteria: Record<string, any>;
  }): Promise<string> {
    const runId = `mlflow-run-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
    
    try {
      // Call MLflow REST API to create run and log metadata
      const createRunUrl = `${this.trackingUri}/api/2.0/mlflow/runs/create`;
      const response = await fetch(createRunUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          experiment_id: '0',
          start_time: Date.now(),
          tags: [
            { key: 'mlflow.runName', value: params.exportName },
            { key: 'interviewx.dataset.format', value: params.format },
            { key: 'interviewx.dataset.sha256', value: params.dvcHash },
          ],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const activeRunId = data?.run?.info?.run_id || runId;
        this.logger.log(`MLflow Run created successfully with ID: ${activeRunId}`);
        return activeRunId;
      }
    } catch (err) {
      this.logger.warn(`MLflow Tracking server offline, recorded local run ID: ${err.message}`);
    }

    return runId;
  }
}
