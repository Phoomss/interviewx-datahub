-- DropForeignKey
ALTER TABLE "professions" DROP CONSTRAINT "professions_industry_id_fkey";

-- DropIndex
DROP INDEX "professions_industry_id_key_key";

-- AlterTable
ALTER TABLE "professions" ALTER COLUMN "industry_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "industry_professions" (
    "id" TEXT NOT NULL,
    "industry_id" TEXT NOT NULL,
    "profession_id" TEXT NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "industry_professions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profession_skills" (
    "id" TEXT NOT NULL,
    "profession_id" TEXT NOT NULL,
    "skill_id" TEXT NOT NULL,
    "is_core" BOOLEAN NOT NULL DEFAULT true,
    "relevance" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profession_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profession_interview_categories" (
    "id" TEXT NOT NULL,
    "profession_id" TEXT NOT NULL,
    "interview_category_id" TEXT NOT NULL,
    "relevance" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profession_interview_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interview_category_formats" (
    "id" TEXT NOT NULL,
    "interview_category_id" TEXT NOT NULL,
    "interview_format_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interview_category_formats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "industry_professions_profession_id_idx" ON "industry_professions"("profession_id");

-- CreateIndex
CREATE UNIQUE INDEX "industry_professions_industry_id_profession_id_key" ON "industry_professions"("industry_id", "profession_id");

-- CreateIndex
CREATE INDEX "profession_skills_skill_id_idx" ON "profession_skills"("skill_id");

-- CreateIndex
CREATE UNIQUE INDEX "profession_skills_profession_id_skill_id_key" ON "profession_skills"("profession_id", "skill_id");

-- CreateIndex
CREATE INDEX "profession_interview_categories_interview_category_id_idx" ON "profession_interview_categories"("interview_category_id");

-- CreateIndex
CREATE UNIQUE INDEX "profession_interview_categories_profession_id_interview_cat_key" ON "profession_interview_categories"("profession_id", "interview_category_id");

-- CreateIndex
CREATE INDEX "interview_category_formats_interview_format_id_idx" ON "interview_category_formats"("interview_format_id");

-- CreateIndex
CREATE UNIQUE INDEX "interview_category_formats_interview_category_id_interview__key" ON "interview_category_formats"("interview_category_id", "interview_format_id");

-- CreateIndex
CREATE UNIQUE INDEX "professions_key_key" ON "professions"("key");

-- AddForeignKey
ALTER TABLE "professions" ADD CONSTRAINT "professions_industry_id_fkey" FOREIGN KEY ("industry_id") REFERENCES "industries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "industry_professions" ADD CONSTRAINT "industry_professions_industry_id_fkey" FOREIGN KEY ("industry_id") REFERENCES "industries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "industry_professions" ADD CONSTRAINT "industry_professions_profession_id_fkey" FOREIGN KEY ("profession_id") REFERENCES "professions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profession_skills" ADD CONSTRAINT "profession_skills_profession_id_fkey" FOREIGN KEY ("profession_id") REFERENCES "professions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profession_skills" ADD CONSTRAINT "profession_skills_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profession_interview_categories" ADD CONSTRAINT "profession_interview_categories_profession_id_fkey" FOREIGN KEY ("profession_id") REFERENCES "professions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profession_interview_categories" ADD CONSTRAINT "profession_interview_categories_interview_category_id_fkey" FOREIGN KEY ("interview_category_id") REFERENCES "interview_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_category_formats" ADD CONSTRAINT "interview_category_formats_interview_category_id_fkey" FOREIGN KEY ("interview_category_id") REFERENCES "interview_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_category_formats" ADD CONSTRAINT "interview_category_formats_interview_format_id_fkey" FOREIGN KEY ("interview_format_id") REFERENCES "interview_formats"("id") ON DELETE CASCADE ON UPDATE CASCADE;
