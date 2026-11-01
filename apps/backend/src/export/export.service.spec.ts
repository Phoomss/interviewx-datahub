import { ExportService } from './export.service';
import { ExportDatasetFormat } from './dto/create-export.dto';

describe('ExportService - Pre-Export Safety Gate & Formatters', () => {
  let service: ExportService;
  const mockPrisma: any = {
    document: { findMany: jest.fn() },
    datasetExport: { create: jest.fn(), findMany: jest.fn() },
    user: { findFirst: jest.fn() },
  };
  const mockMinio: any = {
    uploadExportArtifact: jest.fn().mockResolvedValue('dataset-exports/test/export.jsonl'),
    getPresignedDownloadUrl: jest.fn().mockResolvedValue('http://localhost:9000/download'),
  };
  const mockMlflow: any = {
    recordExportRun: jest.fn().mockResolvedValue('mlflow-run-123'),
  };

  beforeEach(() => {
    service = new ExportService(mockPrisma, mockMinio, mockMlflow);
  });

  it('should strip PII fields and redact email/phone from summary and experiences', () => {
    const dirtyProfile = {
      full_name: 'John Candidate',
      email: 'john@secret.com',
      phone_number: '0812345678',
      address: '123 Bangkok Road',
      professional_summary: 'Senior Engineer reachable at john@secret.com or 081-234-5678.',
      skills: ['NestJS', 'PostgreSQL'],
      experiences: [
        {
          company_name: 'Tech Corp',
          role_title: 'Lead Engineer',
          start_date: '2021-01',
          end_date: 'Present',
          responsibilities: ['Call 0812345678 for references or email john@secret.com'],
        },
      ],
    };

    const sanitized = (service as any).stripAndSanitizePII(dirtyProfile);

    expect(sanitized.full_name).toBeUndefined();
    expect(sanitized.email).toBeUndefined();
    expect(sanitized.phone_number).toBeUndefined();
    expect(sanitized.address).toBeUndefined();
    expect(sanitized.professional_summary).toContain('[REDACTED_EMAIL]');
    expect(sanitized.professional_summary).toContain('[REDACTED_PHONE]');
    expect(sanitized.experiences[0].responsibilities[0]).toContain('[REDACTED_PHONE]');
    expect(sanitized.experiences[0].responsibilities[0]).toContain('[REDACTED_EMAIL]');
  });

  it('should format clean record into valid Alpaca format', () => {
    const profile = {
      professional_summary: 'Senior Engineer',
      skills: ['Python', 'FastAPI'],
      experiences: [],
    };

    const formatted = (service as any).formatRecord(profile, ExportDatasetFormat.ALPACA);
    const parsed = JSON.parse(formatted);

    expect(parsed.instruction).toBeDefined();
    expect(parsed.input).toContain('Senior Engineer');
    expect(parsed.output).toContain('Python, FastAPI');
  });

  it('should format clean record into valid ChatML format with system, user, and assistant roles', () => {
    const profile = {
      professional_summary: 'Data Scientist',
      skills: ['PyTorch', 'SQL'],
      experiences: [],
    };

    const formatted = (service as any).formatRecord(profile, ExportDatasetFormat.CHATML);
    const parsed = JSON.parse(formatted);

    expect(Array.isArray(parsed.messages)).toBe(true);
    expect(parsed.messages[0].role).toBe('system');
    expect(parsed.messages[1].role).toBe('user');
    expect(parsed.messages[2].role).toBe('assistant');
  });
});
