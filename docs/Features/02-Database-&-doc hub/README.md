# Feature 02: Database Schema & Supabase Setup

**Epic**: EPIC 1 - Foundation & Infrastructure
**Feature ID**: F02
**Status**: 📋 Not Started

---

## Overview

Design and implement Supabase database schema for APR Dashboard V4. Create tables for reports, share links, access logs with Row-Level Security (RLS) policies. Set up storage buckets for images and PDF exports.

---

## Business Value

- **Data sovereignty**: Secure, scalable PostgreSQL database
- **Real-time sync**: Supabase real-time subscriptions
- **Row-level security**: Per-user data isolation
- **Cloud storage**: Images/PDFs in Supabase Storage with CDN

---

## Deliverables

- [ ] `reports` table (JSONB + columns hybrid strategy)
- [ ] `report_shares` table (secure token-based sharing)
- [ ] `access_logs` table (view tracking & analytics)
- [ ] Row-Level Security (RLS) policies
- [ ] Storage buckets: `report-images`, `report-pdfs`, `report-exports`
- [ ] Database indexes for performance
- [ ] TypeScript types generated from schema

---

## Technical Scope

### Database Tables

**reports table**:
```sql
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id),

  -- Report data (JSONB for flexibility)
  data JSONB NOT NULL,

  -- Metadata
  status VARCHAR(20) DEFAULT 'draft',
  completion_percentage INTEGER DEFAULT 0,
  validation_errors JSONB,

  -- Calculations
  calculation_mode VARCHAR(20) DEFAULT 'internal',
  calculator_match_percentage DECIMAL(5,2),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  finalized_at TIMESTAMPTZ,

  -- Search/indexing
  property_address TEXT,
  client_name TEXT,
  final_value DECIMAL(15,2)
);
```

**report_shares table**:
```sql
CREATE TABLE report_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
  token VARCHAR(64) UNIQUE NOT NULL,

  -- Access control
  password_hash VARCHAR(255),
  expires_at TIMESTAMPTZ,
  is_revoked BOOLEAN DEFAULT FALSE,
  allow_download BOOLEAN DEFAULT TRUE,
  notify_on_view BOOLEAN DEFAULT FALSE,

  -- Tracking
  view_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);
```

**access_logs table**:
```sql
CREATE TABLE access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  share_id UUID REFERENCES report_shares(id) ON DELETE CASCADE,

  -- Request details
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,

  -- Action
  action VARCHAR(20) NOT NULL,

  accessed_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Storage Buckets
- `report-images` - Property photos, maps, comparables
- `report-pdfs` - Exported PDF files
- `report-exports` - Excel/JSON backups

### Indexes
```sql
CREATE INDEX idx_reports_job_id ON reports(job_id);
CREATE INDEX idx_reports_user_id ON reports(user_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);

CREATE INDEX idx_report_shares_token ON report_shares(token);
CREATE INDEX idx_report_shares_expires_at ON report_shares(expires_at);

CREATE INDEX idx_access_logs_accessed_at ON access_logs(accessed_at DESC);
```

---

## Architecture Reference

- **Main Doc**: [APR-V4-ARCHITECTURE.md](../../Architecture/APR-V4-ARCHITECTURE.md) Section 11.2 (lines 1268-1391)
- **Data Flow**: Section 4.1 (lines 244-294)

---

## Dependencies

**Requires**:
- Feature 01 (Foundation) - project setup complete

**Blocks**:
- Feature 03-05 (Data Entry) - needs database to store fields
- Feature 14-16 (Client Delivery) - needs share_links table

---

## Acceptance Criteria

- [ ] All tables created in Supabase dashboard
- [ ] RLS policies enforce user isolation
- [ ] TypeScript types auto-generated: `npx supabase gen types typescript`
- [ ] Storage buckets public-read, authenticated-write
- [ ] Database migrations in `supabase/migrations/` folder
- [ ] Can insert/update/delete reports via Supabase client
- [ ] Share token generation works (32-byte secure tokens)

---

## Implementation Notes

### Hybrid JSONB + Columns Strategy
**Why JSONB?**
- 944+ fields → flexible schema
- Narratives (long text) → better in JSONB
- Field additions don't require migrations

**Why Columns?**
- Queryable fields (property_address, client_name) → fast indexes
- Status, timestamps → proper data types
- Foreign keys → referential integrity

### RLS Policies
```sql
-- Users can only see own reports
CREATE POLICY "Users can view own reports" ON reports
  FOR SELECT USING (auth.uid() = user_id);

-- Anyone with valid token can view shared report
CREATE POLICY "Anyone can view valid share links" ON report_shares
  FOR SELECT USING (
    is_revoked = FALSE AND
    (expires_at IS NULL OR expires_at > NOW())
  );
```

---

## Testing Requirements

- [ ] Unit tests: TypeScript types match schema
- [ ] Integration tests: CRUD operations work
- [ ] Security tests: RLS prevents unauthorized access
- [ ] Performance tests: Queries <100ms with 1000 reports

---

## Documentation

- [ ] Database schema diagram (ERD)
- [ ] TypeScript type definitions exported
- [ ] Migration guide for future schema changes

---

## Progress Log

_Cursor updates this section after each work session_

---

**Created**: 2026-01-10
**Last Updated**: 2026-01-10
**Owner**: Claude Code (Documentation Orchestrator)
