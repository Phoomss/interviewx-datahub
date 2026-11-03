-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('UPLOADED', 'PARSING', 'PARSED', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'ARCHIVED', 'PARSE_FAILED');

-- CreateEnum
CREATE TYPE "ExportFormat" AS ENUM ('ALPACA', 'SHAREGPT', 'CHATML', 'EMBEDDING', 'JSON', 'JSONL', 'CSV', 'XLSX');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('QUEUED', 'RUNNING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('SYNTHETIC', 'REAL_AUTHORIZED', 'PARTNER');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'ML_ENGINEER', 'ANNOTATOR', 'VIEWER');

-- CreateTable
CREATE TABLE "annotation_reviews" (
    "id" TEXT NOT NULL,
    "document_id" TEXT NOT NULL,
    "reviewer_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "corrections" JSONB,
    "review_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "annotation_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "action" TEXT NOT NULL,
    "entity_name" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "ip_address" TEXT,
    "payload_diff" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consent_records" (
    "id" TEXT NOT NULL,
    "subject_identifier" TEXT NOT NULL,
    "consent_type" TEXT NOT NULL,
    "agreement_document_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "granted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "consent_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dataset_exports" (
    "id" TEXT NOT NULL,
    "export_name" TEXT NOT NULL,
    "created_by_id" TEXT NOT NULL,
    "export_format" "ExportFormat" NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'QUEUED',
    "record_count" INTEGER NOT NULL DEFAULT 0,
    "storage_path" TEXT,
    "filter_criteria" JSONB NOT NULL,
    "dvc_hash" TEXT,
    "mlflow_run_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "dataset_exports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dataset_records" (
    "id" TEXT NOT NULL,
    "job_id" TEXT,
    "dataset_type" TEXT NOT NULL,
    "industry_id" TEXT,
    "profession_id" TEXT,
    "interview_category" TEXT,
    "interview_subcategory" TEXT,
    "seniority_level" TEXT,
    "language" TEXT NOT NULL DEFAULT 'en',
    "is_synthetic" BOOLEAN NOT NULL DEFAULT true,
    "content" JSONB NOT NULL,
    "quality_status" TEXT NOT NULL DEFAULT 'VERIFIED',
    "validation_result" JSONB,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dataset_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "file_size_bytes" INTEGER NOT NULL,
    "storage_path" TEXT NOT NULL,
    "source_type" "SourceType" NOT NULL DEFAULT 'SYNTHETIC',
    "is_synthetic" BOOLEAN NOT NULL DEFAULT true,
    "status" "DocumentStatus" NOT NULL DEFAULT 'UPLOADED',
    "consent_id" TEXT,
    "uploaded_by_id" TEXT,
    "synthetic_job_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "industries" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_th" TEXT,
    "description" TEXT,
    "icon" TEXT,
    "is_custom" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "industries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interview_categories" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_th" TEXT,
    "description" TEXT,
    "subcategories" JSONB NOT NULL,
    "is_custom" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interview_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interview_formats" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_th" TEXT,
    "description" TEXT,
    "is_custom" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interview_formats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parsed_profiles" (
    "id" TEXT NOT NULL,
    "document_id" TEXT NOT NULL,
    "raw_text" TEXT,
    "structured_data" JSONB NOT NULL,
    "provenance" JSONB,
    "confidence_score" DOUBLE PRECISION,
    "extractor_version" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parsed_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pii_vault" (
    "id" TEXT NOT NULL,
    "document_id" TEXT NOT NULL,
    "full_name" TEXT,
    "email" TEXT,
    "phone_number" TEXT,
    "address" TEXT,
    "national_id" TEXT,
    "date_of_birth" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pii_vault_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professions" (
    "id" TEXT NOT NULL,
    "industry_id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_th" TEXT,
    "description" TEXT,
    "suggested_skills" JSONB,
    "profession_specific_fields" JSONB,
    "is_custom" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "professions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seniority_levels" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_th" TEXT,
    "min_years_exp" DOUBLE PRECISION,
    "max_years_exp" DOUBLE PRECISION,
    "is_custom" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seniority_levels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skill_categories" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_th" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "skill_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_th" TEXT,
    "description" TEXT,
    "proficiency_levels" JSONB,
    "is_custom" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "synthetic_jobs" (
    "id" TEXT NOT NULL,
    "job_name" TEXT NOT NULL,
    "created_by_id" TEXT NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'QUEUED',
    "target_count" INTEGER NOT NULL,
    "generated_count" INTEGER NOT NULL DEFAULT 0,
    "generation_config" JSONB NOT NULL,
    "failure_reason" TEXT,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "synthetic_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'ANNOTATOR',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "audit_logs_entity_name_entity_id_idx" ON "audit_logs"("entity_name" ASC, "entity_id" ASC);

-- CreateIndex
CREATE INDEX "audit_logs_user_id_created_at_idx" ON "audit_logs"("user_id" ASC, "created_at" DESC);

-- CreateIndex
CREATE INDEX "dataset_records_created_at_idx" ON "dataset_records"("created_at" DESC);

-- CreateIndex
CREATE INDEX "dataset_records_dataset_type_industry_id_profession_id_idx" ON "dataset_records"("dataset_type" ASC, "industry_id" ASC, "profession_id" ASC);

-- CreateIndex
CREATE INDEX "dataset_records_quality_status_idx" ON "dataset_records"("quality_status" ASC);

-- CreateIndex
CREATE INDEX "documents_created_at_idx" ON "documents"("created_at" DESC);

-- CreateIndex
CREATE INDEX "documents_status_is_synthetic_idx" ON "documents"("status" ASC, "is_synthetic" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "industries_key_key" ON "industries"("key" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "interview_categories_key_key" ON "interview_categories"("key" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "interview_formats_key_key" ON "interview_formats"("key" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "parsed_profiles_document_id_key" ON "parsed_profiles"("document_id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "pii_vault_document_id_key" ON "pii_vault"("document_id" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "professions_industry_id_key_key" ON "professions"("industry_id" ASC, "key" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "seniority_levels_key_key" ON "seniority_levels"("key" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "skill_categories_key_key" ON "skill_categories"("key" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "skills_category_id_name_key" ON "skills"("category_id" ASC, "name" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email" ASC);

-- AddForeignKey
ALTER TABLE "annotation_reviews" ADD CONSTRAINT "annotation_reviews_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "annotation_reviews" ADD CONSTRAINT "annotation_reviews_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dataset_exports" ADD CONSTRAINT "dataset_exports_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dataset_records" ADD CONSTRAINT "dataset_records_industry_id_fkey" FOREIGN KEY ("industry_id") REFERENCES "industries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dataset_records" ADD CONSTRAINT "dataset_records_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "synthetic_jobs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dataset_records" ADD CONSTRAINT "dataset_records_profession_id_fkey" FOREIGN KEY ("profession_id") REFERENCES "professions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_consent_id_fkey" FOREIGN KEY ("consent_id") REFERENCES "consent_records"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_synthetic_job_id_fkey" FOREIGN KEY ("synthetic_job_id") REFERENCES "synthetic_jobs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_uploaded_by_id_fkey" FOREIGN KEY ("uploaded_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parsed_profiles" ADD CONSTRAINT "parsed_profiles_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pii_vault" ADD CONSTRAINT "pii_vault_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professions" ADD CONSTRAINT "professions_industry_id_fkey" FOREIGN KEY ("industry_id") REFERENCES "industries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skills" ADD CONSTRAINT "skills_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "skill_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "synthetic_jobs" ADD CONSTRAINT "synthetic_jobs_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
