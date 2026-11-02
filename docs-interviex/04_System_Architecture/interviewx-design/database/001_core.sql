-- InterviewX physical baseline: PostgreSQL 16+, UTC timestamps. Proposed, not approved.
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;
CREATE SCHEMA IF NOT EXISTS identity;
CREATE SCHEMA IF NOT EXISTS content;
CREATE SCHEMA IF NOT EXISTS interview;
CREATE SCHEMA IF NOT EXISTS evaluation;
CREATE SCHEMA IF NOT EXISTS privacy;
CREATE SCHEMA IF NOT EXISTS platform;

CREATE TABLE identity.users (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), email citext NOT NULL UNIQUE,
 display_name text, current_status text, skill_level text,
 account_status text NOT NULL DEFAULT 'active' CHECK (account_status IN ('active','suspended','deleting')),
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(), deleted_at timestamptz
);
CREATE TABLE identity.auth_identities (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES identity.users(id) ON DELETE CASCADE,
 provider text NOT NULL CHECK (provider IN ('email','google','facebook')),
 provider_subject text NOT NULL, password_hash text, verified_at timestamptz,
 created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(provider,provider_subject),
 CONSTRAINT email_has_hash CHECK (provider <> 'email' OR password_hash IS NOT NULL)
);
CREATE INDEX ix_auth_user ON identity.auth_identities(user_id);
CREATE TABLE identity.refresh_sessions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES identity.users(id) ON DELETE CASCADE,
 token_hash text NOT NULL UNIQUE, expires_at timestamptz NOT NULL, revoked_at timestamptz, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ix_refresh_active ON identity.refresh_sessions(user_id,expires_at) WHERE revoked_at IS NULL;
CREATE TABLE identity.roles (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), code text NOT NULL UNIQUE);
CREATE TABLE identity.permissions (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), code text NOT NULL UNIQUE);
CREATE TABLE identity.user_roles (
 user_id uuid NOT NULL REFERENCES identity.users(id), role_id uuid NOT NULL REFERENCES identity.roles(id),
 assigned_by uuid REFERENCES identity.users(id), assigned_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(user_id,role_id)
);
CREATE TABLE identity.role_permissions (
 role_id uuid NOT NULL REFERENCES identity.roles(id), permission_id uuid NOT NULL REFERENCES identity.permissions(id), PRIMARY KEY(role_id,permission_id)
);

CREATE TABLE content.rubric_versions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), rubric_key text NOT NULL, version text NOT NULL,
 criteria jsonb NOT NULL, lifecycle text NOT NULL DEFAULT 'draft' CHECK (lifecycle IN ('draft','published','archived')),
 published_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(rubric_key,version),
 CHECK (jsonb_typeof(criteria) = 'object')
);
CREATE TABLE content.ai_config_versions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), config_key text NOT NULL, version text NOT NULL,
 model_identifier text NOT NULL, prompt_hash text NOT NULL, parameters jsonb NOT NULL DEFAULT '{}'::jsonb,
 lifecycle text NOT NULL DEFAULT 'draft' CHECK (lifecycle IN ('draft','published','archived')),
 published_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(config_key,version)
);
CREATE TABLE content.question_bank (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), stable_key text NOT NULL, version int NOT NULL CHECK(version>0),
 category text NOT NULL, locale text NOT NULL, question_text text NOT NULL,
 lifecycle text NOT NULL DEFAULT 'draft' CHECK(lifecycle IN ('draft','published','archived')),
 created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(stable_key,version)
);
CREATE INDEX ix_bank_discovery ON content.question_bank(category,locale,lifecycle);

CREATE TABLE interview.sessions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES identity.users(id),
 interview_type text NOT NULL, locale text NOT NULL DEFAULT 'th', mode text NOT NULL DEFAULT 'text' CHECK(mode IN ('text','voice','mixed')),
 difficulty text, rubric_version_id uuid NOT NULL REFERENCES content.rubric_versions(id),
 ai_config_version_id uuid NOT NULL REFERENCES content.ai_config_versions(id),
 status text NOT NULL DEFAULT 'active' CHECK(status IN ('active','completed','cancelled','deleting')),
 started_at timestamptz NOT NULL DEFAULT now(), completed_at timestamptz, deleted_at timestamptz
);
CREATE INDEX ix_sessions_history ON interview.sessions(user_id,started_at DESC) WHERE deleted_at IS NULL;
CREATE TABLE interview.session_questions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), session_id uuid NOT NULL REFERENCES interview.sessions(id),
 question_bank_id uuid REFERENCES content.question_bank(id), question_text text NOT NULL,
 sequence_no int NOT NULL CHECK(sequence_no>0), UNIQUE(session_id,sequence_no), UNIQUE(id,session_id)
);
CREATE TABLE interview.answers (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), question_id uuid NOT NULL REFERENCES interview.session_questions(id),
 attempt_number int NOT NULL DEFAULT 1 CHECK(attempt_number>0),
 answer_type text NOT NULL DEFAULT 'text' CHECK(answer_type IN ('text','voice')),
 answer_text text NOT NULL CHECK(length(btrim(answer_text))>0), answered_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(question_id,attempt_number)
);
CREATE INDEX ix_answers_question ON interview.answers(question_id);

CREATE TABLE evaluation.jobs (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), answer_id uuid NOT NULL REFERENCES interview.answers(id),
 state text NOT NULL DEFAULT 'pending' CHECK(state IN ('pending','running','completed','failed','needs_review')),
 attempts int NOT NULL DEFAULT 0 CHECK(attempts>=0), max_attempts int NOT NULL DEFAULT 3,
 next_attempt_at timestamptz, last_error_code text, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(answer_id)
);
CREATE INDEX ix_eval_pending ON evaluation.jobs(state,next_attempt_at) WHERE state IN ('pending','failed');
CREATE TABLE evaluation.feedback (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), job_id uuid NOT NULL UNIQUE REFERENCES evaluation.jobs(id),
 answer_id uuid NOT NULL UNIQUE REFERENCES interview.answers(id),
 rubric_version_id uuid NOT NULL REFERENCES content.rubric_versions(id),
 ai_config_version_id uuid NOT NULL REFERENCES content.ai_config_versions(id),
 score numeric(5,2) CHECK(score BETWEEN 0 AND 100),
 dimension_scores jsonb NOT NULL DEFAULT '{}'::jsonb, evidence jsonb NOT NULL DEFAULT '[]'::jsonb,
 comments text, status text NOT NULL CHECK(status IN ('completed','needs_review')),
 created_at timestamptz NOT NULL DEFAULT now(),
 CHECK ((status = 'completed' AND score IS NOT NULL) OR (status = 'needs_review' AND score IS NULL))
);
CREATE TABLE evaluation.appeals (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), feedback_id uuid NOT NULL REFERENCES evaluation.feedback(id),
 user_id uuid NOT NULL REFERENCES identity.users(id), reason text NOT NULL,
 status text NOT NULL DEFAULT 'submitted' CHECK(status IN ('submitted','in_review','resolved','rejected')),
 created_at timestamptz NOT NULL DEFAULT now(), resolved_at timestamptz
);

CREATE TABLE privacy.consent_events (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES identity.users(id),
 purpose_key text NOT NULL CHECK(purpose_key IN ('research_analysis','research_contact','voice_retention','marketing')),
 action text NOT NULL CHECK(action IN ('grant','withdraw')),
 notice_version text NOT NULL, legal_basis text NOT NULL, occurred_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ix_consent_latest ON privacy.consent_events(user_id,purpose_key,occurred_at DESC,id DESC);
CREATE TABLE privacy.processing_notices (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES identity.users(id),
 purpose_key text NOT NULL, notice_version text NOT NULL, legal_basis text NOT NULL,
 acknowledged_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE privacy.data_rights_requests (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES identity.users(id),
 request_type text NOT NULL CHECK(request_type IN ('access','export','delete')),
 status text NOT NULL DEFAULT 'submitted' CHECK(status IN ('submitted','verifying','processing','completed','rejected')),
 requested_at timestamptz NOT NULL DEFAULT now(), completed_at timestamptz
);
CREATE TABLE privacy.contact_details (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES identity.users(id),
 channel text NOT NULL, encrypted_value bytea NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE privacy.audio_objects (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), answer_id uuid NOT NULL REFERENCES interview.answers(id),
 storage_key text NOT NULL UNIQUE, expires_at timestamptz NOT NULL, deleted_at timestamptz,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ix_audio_expiry ON privacy.audio_objects(expires_at) WHERE deleted_at IS NULL;
CREATE TABLE evaluation.speech_metrics (
 answer_id uuid PRIMARY KEY REFERENCES interview.answers(id), pace_wpm numeric(8,2),
 pauses jsonb NOT NULL DEFAULT '[]'::jsonb, filler_words jsonb NOT NULL DEFAULT '[]'::jsonb
);

CREATE TABLE platform.idempotency_keys (
 scope text NOT NULL, actor_id uuid NOT NULL REFERENCES identity.users(id), key text NOT NULL,
 request_hash text NOT NULL, resource_type text, resource_id uuid,
 created_at timestamptz NOT NULL DEFAULT now(), expires_at timestamptz NOT NULL,
 PRIMARY KEY(scope,actor_id,key)
);
CREATE TABLE platform.outbox_events (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), aggregate_type text NOT NULL, aggregate_id uuid NOT NULL,
 event_type text NOT NULL, event_version int NOT NULL DEFAULT 1, payload jsonb NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(), published_at timestamptz, attempts int NOT NULL DEFAULT 0
);
CREATE INDEX ix_outbox_unpublished ON platform.outbox_events(created_at) WHERE published_at IS NULL;
CREATE TABLE platform.inbox_events (
 consumer_name text NOT NULL, event_id uuid NOT NULL, processed_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(consumer_name,event_id)
);
CREATE TABLE platform.audit_log (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), actor_id uuid, action text NOT NULL,
 entity_type text NOT NULL, entity_id uuid, request_id text, redacted_diff jsonb NOT NULL DEFAULT '{}'::jsonb,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ix_audit_created ON platform.audit_log(created_at DESC);

-- PostgreSQL roles: do not grant researcher raw schema access. Enforce RLS on exposed
-- purpose-scoped views/tables after threat modeling; application authorization still mandatory.
-- Append-only tables require separate restricted DB roles and no UPDATE/DELETE grants to app runtime.
