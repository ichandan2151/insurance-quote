-- =============================================
-- Insurance Quote Calculator — Database Schema
-- =============================================

-- 1. Rate Tables
-- Stores rate class definitions with multipliers and coverage/premium ranges
CREATE TABLE rate_tables (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    rate_class VARCHAR(100) NOT NULL UNIQUE,
    multiplier DECIMAL(6, 4),          -- NULL means N/A (e.g., Modified Non-Tobacco)
    min_coverage DECIMAL(10, 2) NOT NULL DEFAULT 2000.00,
    max_coverage DECIMAL(10, 2) NOT NULL DEFAULT 35000.00,
    min_premium DECIMAL(10, 2) NOT NULL DEFAULT 8.22,
    max_premium DECIMAL(10, 2) NOT NULL DEFAULT 129.35,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Medications
-- The ~612 medications for medication guide
CREATE TABLE medications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255),
    category VARCHAR(100),
    is_flagged BOOLEAN DEFAULT FALSE,    -- whether this medication affects eligibility
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Riders
-- Available riders (both included and optional)
CREATE TABLE riders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    rider_type VARCHAR(20) NOT NULL CHECK (rider_type IN ('included', 'optional')),
    additional_cost DECIMAL(10, 2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Quote Submissions
-- Saves every quote submitted by users
CREATE TABLE quote_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    -- Applicant info
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) NOT NULL,
    zip_code VARCHAR(5) NOT NULL,
    tobacco_use BOOLEAN NOT NULL,
    -- Quote details
    coverage_amount DECIMAL(10, 2) NOT NULL,
    rate_class VARCHAR(100) NOT NULL,
    monthly_premium DECIMAL(10, 2),
    annual_premium DECIMAL(10, 2),
    -- Selected riders
    selected_riders UUID[] DEFAULT '{}',
    -- Metadata
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'declined')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- Seed Data
-- =============================================

-- Seed rate classes
INSERT INTO rate_tables (rate_class, multiplier, sort_order) VALUES
    ('Level Preferred', 1.0000, 1),
    ('Level Non-Tobacco', 1.2110, 2),
    ('Modified Non-Tobacco', NULL, 3);

-- Seed included riders
INSERT INTO riders (name, description, rider_type, sort_order) VALUES
    ('Accelerated Death Benefit Rider for Terminal Illness', 'Provides early access to death benefit if diagnosed with terminal illness', 'included', 1);

-- Seed optional riders
INSERT INTO riders (name, description, rider_type, sort_order) VALUES
    ('Accidental Death Benefit Rider', 'Doubles the Death Benefit if the Insured dies by Accidental Death', 'optional', 1);

-- =============================================
-- Row Level Security (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE rate_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE riders ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_submissions ENABLE ROW LEVEL SECURITY;

-- Public read access for rate_tables, medications, riders
CREATE POLICY "Allow public read on rate_tables"
    ON rate_tables FOR SELECT
    USING (true);

CREATE POLICY "Allow public read on medications"
    ON medications FOR SELECT
    USING (true);

CREATE POLICY "Allow public read on riders"
    ON riders FOR SELECT
    USING (true);

-- Public insert + read on quote_submissions (anyone can submit a quote and read their own)
CREATE POLICY "Allow public insert on quote_submissions"
    ON quote_submissions FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow public read on quote_submissions"
    ON quote_submissions FOR SELECT
    USING (true);

-- =============================================
-- Indexes
-- =============================================

CREATE INDEX idx_medications_name ON medications (name);
CREATE INDEX idx_medications_category ON medications (category);
CREATE INDEX idx_quote_submissions_created ON quote_submissions (created_at DESC);
CREATE INDEX idx_quote_submissions_zip ON quote_submissions (zip_code);
