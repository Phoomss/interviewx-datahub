-- R3 independent service-owned databases. Run in separate databases, NOT Core database.
-- Billing database
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE SCHEMA IF NOT EXISTS billing;
CREATE TABLE billing.packages (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), tier text NOT NULL, version int NOT NULL,
 price_minor bigint NOT NULL CHECK(price_minor>=0), currency char(3) NOT NULL,
 duration_days int NOT NULL CHECK(duration_days>0), state text NOT NULL CHECK(state IN ('draft','published','archived')),
 UNIQUE(tier,version)
);
CREATE TABLE billing.package_entitlements (
 package_id uuid NOT NULL REFERENCES billing.packages(id), feature_key text NOT NULL,
 quota_limit bigint CHECK(quota_limit>=0), unit text NOT NULL, PRIMARY KEY(package_id,feature_key)
);
CREATE TABLE billing.subscriptions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL, package_id uuid NOT NULL REFERENCES billing.packages(id),
 status text NOT NULL CHECK(status IN ('pending','active','cancelled','expired')),
 starts_at timestamptz NOT NULL, ends_at timestamptz NOT NULL, auto_renew boolean NOT NULL DEFAULT false,
 CHECK(ends_at>starts_at)
);
CREATE INDEX ix_subscription_user ON billing.subscriptions(user_id,ends_at DESC);
CREATE TABLE billing.usage_ledger (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL, feature_key text NOT NULL,
 amount int NOT NULL CHECK(amount>0), period_key text NOT NULL, request_key text NOT NULL UNIQUE,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ix_usage_quota ON billing.usage_ledger(user_id,feature_key,period_key);
CREATE TABLE billing.transactions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), subscription_id uuid NOT NULL REFERENCES billing.subscriptions(id),
 gateway_ref text UNIQUE, amount_minor bigint NOT NULL CHECK(amount_minor>=0), currency char(3) NOT NULL,
 status text NOT NULL CHECK(status IN ('initiated','pending','confirmed','failed','refunded')),
 paid_at timestamptz
);
CREATE TABLE billing.payment_events (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), provider text NOT NULL, external_event_id text NOT NULL,
 payload_hash text NOT NULL, status text NOT NULL, received_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(provider,external_event_id)
);
CREATE TABLE billing.refund_requests (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), transaction_id uuid NOT NULL REFERENCES billing.transactions(id),
 user_id uuid NOT NULL, policy_version text, status text NOT NULL CHECK(status IN ('requested','approved','rejected','processing','refunded','failed')),
 requested_at timestamptz NOT NULL DEFAULT now(), decided_by uuid
);
CREATE TABLE billing.outbox_events (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), event_type text NOT NULL, payload jsonb NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(), published_at timestamptz
);
-- Research service database (run in another DB; no foreign keys to identity/billing)
CREATE SCHEMA IF NOT EXISTS research;
CREATE TABLE research.datasets (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), purpose_key text NOT NULL,
 approved_by uuid NOT NULL, schema_version text NOT NULL,
 state text NOT NULL CHECK(state IN ('draft','approved','released','revoked')),
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE research.aggregate_rows (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), dataset_id uuid NOT NULL REFERENCES research.datasets(id),
 dimensions jsonb NOT NULL, measures jsonb NOT NULL, distinct_users int NOT NULL CHECK(distinct_users>=10),
 suppressed boolean NOT NULL DEFAULT false
);
CREATE TABLE research.access_log (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), researcher_id uuid NOT NULL, dataset_id uuid REFERENCES research.datasets(id),
 action text NOT NULL, decision text NOT NULL CHECK(decision IN ('allow','deny')),
 query_hash text, records_returned int NOT NULL DEFAULT 0, accessed_at timestamptz NOT NULL DEFAULT now()
);
-- Put billing and research schemas in distinct DATABASES with different credentials in deployment.
