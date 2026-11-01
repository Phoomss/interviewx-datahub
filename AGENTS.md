# AGENTS.md

# InterviewX DataHub

## Project Overview
InterviewX DataHub is an internal data management platform for collecting, processing, validating, annotating, and preparing Resume / CV / Profile datasets for InterviewX LLM development.

## Primary Objective
Build a reliable Dataset Management Platform that starts with Synthetic Data and gradually supports authorized real-world Resume / CV data.

## Technology Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- Zod

### Backend
- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- Swagger

### AI Service
- Python
- FastAPI
- Pydantic
- PyMuPDF
- python-docx
- Pandas / Polars

### Infrastructure
- Docker Compose
- Redis
- MinIO
- MLflow
- DVC

### Package Management
- Bun for JavaScript / TypeScript (package manager & runtime)
- Follow the existing Python dependency manager if present.

## Architecture Rules

1. NestJS owns core business logic and REST API.
2. FastAPI handles AI and data processing.
3. Next.js communicates with NestJS.
4. PostgreSQL stores structured data.
5. MinIO stores documents and artifacts.
6. Redis handles background jobs.
7. Keep services independently maintainable.
8. Use DTOs and schema validation.
9. Do not duplicate business logic between NestJS and FastAPI.

## Development Rules

1. Inspect the repository before modifying code.
2. Read only the relevant context files for each task.
3. Follow existing project conventions.
4. Never overwrite existing working functionality without justification.
5. Avoid unnecessary dependencies.
6. Do not hardcode secrets.
7. Write tests for critical business logic.
8. Update documentation when contracts or architecture change.
9. Never use fake data to simulate successful production operations.
10. Keep implementation modular and maintainable.

## Data Privacy Rules

1. Synthetic and real-world data must be distinguishable.
2. Never use real personal data without valid authorization and legal basis.
3. Separate PII from training records.
4. Verify consent and usage permissions before training export.
5. Block PII leakage during dataset export.
6. Maintain audit logs.
7. Support consent withdrawal and data deletion workflows.

## AI Data Rules

1. Validate AI outputs using Pydantic.
2. Never assume extracted information is correct.
3. Preserve extraction provenance.
4. Require human review before approval.
5. Separate synthetic data from real-world data.
6. Prevent train/test data leakage.
7. Never fabricate training or evaluation metrics.

## Workflow

Before implementation:
1. Inspect repository.
2. Read relevant context.
3. Identify dependencies.
4. Define implementation plan.
5. Identify affected modules.

After implementation:
1. Run tests.
2. Run type checks.
3. Run lint.
4. Verify integration.
5. Update documentation.
6. Report completed work and known issues.

## Context Index

- Project overview: [00-PROJECT-CONTEXT.md](file:///Users/mac/Desktop/interviewx-datahub/context/00-PROJECT-CONTEXT.md)
- Requirements: [01-REQUIREMENTS.md](file:///Users/mac/Desktop/interviewx-datahub/context/01-REQUIREMENTS.md)
- Architecture: [02-ARCHITECTURE.md](file:///Users/mac/Desktop/interviewx-datahub/context/02-ARCHITECTURE.md)
- Database: [03-DATABASE.md](file:///Users/mac/Desktop/interviewx-datahub/context/03-DATABASE.md)
- API contracts: [04-API-CONTRACT.md](file:///Users/mac/Desktop/interviewx-datahub/context/04-API-CONTRACT.md)
- Data pipeline: [05-DATA-PIPELINE.md](file:///Users/mac/Desktop/interviewx-datahub/context/05-DATA-PIPELINE.md)
- Synthetic data: [06-SYNTHETIC-DATA.md](file:///Users/mac/Desktop/interviewx-datahub/context/06-SYNTHETIC-DATA.md)
- LLM training: [07-LLM-TRAINING.md](file:///Users/mac/Desktop/interviewx-datahub/context/07-LLM-TRAINING.md)
- Security: [08-SECURITY-PRIVACY.md](file:///Users/mac/Desktop/interviewx-datahub/context/08-SECURITY-PRIVACY.md)
- UI/UX: [09-UI-UX.md](file:///Users/mac/Desktop/interviewx-datahub/context/09-UI-UX.md)
- Testing: [10-TESTING.md](file:///Users/mac/Desktop/interviewx-datahub/context/10-TESTING.md)
- Roadmap: [11-ROADMAP.md](file:///Users/mac/Desktop/interviewx-datahub/context/11-ROADMAP.md)


Always read only the context files relevant to the current task.