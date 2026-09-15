-- =============================================================================
-- AiSpa Bangladeshi Smart Salon Booking Platform
-- Native Supabase PostgreSQL DDL Schema, Triggers, RPCs & RLS Policies
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean up existing types if present
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('CLIENT', 'STYLIST', 'MANAGER', 'ADMIN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE app_language AS ENUM ('en', 'bn');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE booking_status_type AS ENUM ('PENDING', 'CONFIRMED', 'RESCHEDULED', 'COMPLETED', 'CANCELLED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE omni_channel_type AS ENUM ('WEBSITE', 'WHATSAPP', 'MESSENGER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =============================================================================
-- 1. USERS & IDENTITY TABLES
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(20) UNIQUE,
    email VARCHAR(255) UNIQUE,
    name VARCHAR(255),
    avatar TEXT,
    role VARCHAR(50) NOT NULL DEFAULT 'CLIENT',
    preferred_lang VARCHAR(10) NOT NULL DEFAULT 'en',
    phone_verified BOOLEAN NOT NULL DEFAULT FALSE,
    email_verified TIMESTAMPTZ,
    password_hash TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.otp_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(20) NOT NULL,
    otp_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    attempts_count INT NOT NULL DEFAULT 0,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    ip_address VARCHAR(45),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    provider_account_id VARCHAR(255) NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at BIGINT,
    token_type VARCHAR(50),
    scope TEXT,
    id_token TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_accounts_provider_account UNIQUE (provider, provider_account_id)
);

CREATE TABLE IF NOT EXISTS public.sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_token VARCHAR(255) NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    expires TIMESTAMPTZ NOT NULL,
    user_agent TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 2. SERVICE PACKAGES & TIME SLOTS
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    title_bn VARCHAR(255),
    description TEXT NOT NULL,
    description_bn TEXT,
    bdt_price NUMERIC(10, 2) NOT NULL,
    bdt_promo_price NUMERIC(10, 2),
    duration_mins INT NOT NULL DEFAULT 60,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_promotional BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.package_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    package_id UUID NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    duration INT NOT NULL DEFAULT 30,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.stylist_shifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stylist_name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_blocked BOOLEAN NOT NULL DEFAULT FALSE,
    override_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.emergency_notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    title_bn VARCHAR(255),
    message TEXT NOT NULL,
    message_bn TEXT,
    priority_level VARCHAR(20) NOT NULL DEFAULT 'CRITICAL',
    is_global_active BOOLEAN NOT NULL DEFAULT TRUE,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 3. BOOKINGS & MULTI-SERVICE TRANSACTIONS
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.booking_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    service_title VARCHAR(255) NOT NULL,
    package_id UUID REFERENCES public.packages(id) ON DELETE SET NULL,
    bdt_amount NUMERIC(10, 2) NOT NULL,
    appointment_time TIMESTAMPTZ NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    channel VARCHAR(50) NOT NULL DEFAULT 'WEBSITE',
    notes TEXT,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.booking_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES public.booking_requests(id) ON DELETE CASCADE,
    service_name VARCHAR(255) NOT NULL,
    duration INT NOT NULL DEFAULT 30,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 4. OMNI-CHANNEL COMMUNICATIONS & LOCALIZATION
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.omni_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    channel VARCHAR(50) NOT NULL DEFAULT 'WHATSAPP',
    text TEXT NOT NULL,
    is_from_admin BOOLEAN NOT NULL DEFAULT FALSE,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.localized_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(255) NOT NULL,
    locale VARCHAR(10) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_localized_key_locale UNIQUE (key, locale)
);

-- =============================================================================
-- 5. PERFORMANCE INDICES
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_users_phone ON public.users(phone);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

CREATE INDEX IF NOT EXISTS idx_otp_attempts_phone_status ON public.otp_attempts(phone, is_verified);
CREATE INDEX IF NOT EXISTS idx_otp_attempts_expires ON public.otp_attempts(expires_at);

CREATE INDEX IF NOT EXISTS idx_packages_active_promo ON public.packages(is_active, is_promotional);
CREATE INDEX IF NOT EXISTS idx_package_services_pkg_id ON public.package_services(package_id);

CREATE INDEX IF NOT EXISTS idx_shifts_date_stylist ON public.stylist_shifts(date, stylist_name);
CREATE INDEX IF NOT EXISTS idx_shifts_date_blocked ON public.stylist_shifts(date, is_blocked);

CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.booking_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.booking_requests(status);
CREATE INDEX IF NOT EXISTS idx_bookings_appointment ON public.booking_requests(appointment_time);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_phone ON public.booking_requests(customer_phone);
CREATE INDEX IF NOT EXISTS idx_booking_services_booking_id ON public.booking_services(booking_id);

CREATE INDEX IF NOT EXISTS idx_omni_messages_user_id ON public.omni_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_omni_messages_sender_id ON public.omni_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_omni_messages_channel_read ON public.omni_messages(channel, is_read);

-- =============================================================================
-- 6. AUTOMATIC UPDATED_AT TIMESTAMP TRIGGERS
-- =============================================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_users_updated_at ON public.users;
CREATE TRIGGER set_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_packages_updated_at ON public.packages;
CREATE TRIGGER set_packages_updated_at
    BEFORE UPDATE ON public.packages
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_booking_requests_updated_at ON public.booking_requests;
CREATE TRIGGER set_booking_requests_updated_at
    BEFORE UPDATE ON public.booking_requests
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_localized_translations_updated_at ON public.localized_translations;
CREATE TRIGGER set_localized_translations_updated_at
    BEFORE UPDATE ON public.localized_translations
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================================================
-- 7. REMOTE PROCEDURE CALLS (RPC) / STORED PROCEDURES FOR TRANSACTIONS
-- =============================================================================

-- RPC: Atomic Package Creation with Nested Services
CREATE OR REPLACE FUNCTION public.create_package_with_services(
    p_title VARCHAR(255),
    p_title_bn VARCHAR(255),
    p_description TEXT,
    p_description_bn TEXT,
    p_bdt_price NUMERIC(10, 2),
    p_bdt_promo_price NUMERIC(10, 2),
    p_duration_mins INT,
    p_is_active BOOLEAN,
    p_is_promotional BOOLEAN,
    p_services JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_pkg_id UUID;
    v_service JSONB;
    v_result JSONB;
BEGIN
    -- 1. Insert Package parent record
    INSERT INTO public.packages (
        title,
        title_bn,
        description,
        description_bn,
        bdt_price,
        bdt_promo_price,
        duration_mins,
        is_active,
        is_promotional
    ) VALUES (
        p_title,
        p_title_bn,
        p_description,
        p_description_bn,
        p_bdt_price,
        p_bdt_promo_price,
        COALESCE(p_duration_mins, 60),
        COALESCE(p_is_active, TRUE),
        COALESCE(p_is_promotional, FALSE)
    ) RETURNING id INTO v_pkg_id;

    -- 2. Insert nested services if provided
    IF p_services IS NOT NULL AND jsonb_array_length(p_services) > 0 THEN
        FOR v_service IN SELECT * FROM jsonb_array_elements(p_services)
        LOOP
            INSERT INTO public.package_services (
                package_id,
                name,
                duration
            ) VALUES (
                v_pkg_id,
                COALESCE(v_service->>'name', v_service#>>'{}', 'Service Item'),
                COALESCE((v_service->>'duration')::INT, 30)
            );
        END LOOP;
    END IF;

    -- 3. Return full aggregated package object
    SELECT jsonb_build_object(
        'id', p.id,
        'title', p.title,
        'title_bn', p.title_bn,
        'description', p.description,
        'description_bn', p.description_bn,
        'bdtPrice', p.bdt_price,
        'bdtPromoPrice', p.bdt_promo_price,
        'durationMins', p.duration_mins,
        'isActive', p.is_active,
        'isPromotional', p.is_promotional,
        'createdAt', p.created_at,
        'services', COALESCE(
            (SELECT jsonb_agg(ps.name) FROM public.package_services ps WHERE ps.package_id = p.id),
            '[]'::jsonb
        )
    ) INTO v_result
    FROM public.packages p
    WHERE p.id = v_pkg_id;

    RETURN v_result;
END;
$$;

-- RPC: Atomic Multi-Service Booking Transaction
CREATE OR REPLACE FUNCTION public.create_booking_with_services(
    p_customer_name VARCHAR(255),
    p_customer_phone VARCHAR(20),
    p_service_title VARCHAR(255),
    p_package_id UUID,
    p_bdt_amount NUMERIC(10, 2),
    p_appointment_time TIMESTAMPTZ,
    p_channel VARCHAR(50),
    p_notes TEXT,
    p_user_id UUID,
    p_sub_services JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_booking_id UUID;
    v_sub_service JSONB;
    v_result JSONB;
BEGIN
    -- 1. Insert master Booking record
    INSERT INTO public.booking_requests (
        customer_name,
        customer_phone,
        service_title,
        package_id,
        bdt_amount,
        appointment_time,
        status,
        channel,
        notes,
        user_id
    ) VALUES (
        p_customer_name,
        p_customer_phone,
        p_service_title,
        p_package_id,
        p_bdt_amount,
        p_appointment_time,
        'PENDING',
        COALESCE(p_channel, 'WEBSITE'),
        p_notes,
        p_user_id
    ) RETURNING id INTO v_booking_id;

    -- 2. Insert attached sub-services
    IF p_sub_services IS NOT NULL AND jsonb_array_length(p_sub_services) > 0 THEN
        FOR v_sub_service IN SELECT * FROM jsonb_array_elements(p_sub_services)
        LOOP
            INSERT INTO public.booking_services (
                booking_id,
                service_name,
                duration
            ) VALUES (
                v_booking_id,
                COALESCE(v_sub_service->>'name', v_sub_service#>>'{}', 'Sub Service'),
                COALESCE((v_sub_service->>'duration')::INT, 30)
            );
        END LOOP;
    END IF;

    -- 3. Return full aggregated booking object
    SELECT jsonb_build_object(
        'id', b.id,
        'customerName', b.customer_name,
        'customerPhone', b.customer_phone,
        'serviceTitle', b.service_title,
        'packageId', b.package_id,
        'bdtAmount', b.bdt_amount,
        'appointmentTime', b.appointment_time,
        'status', b.status,
        'channel', b.channel,
        'notes', b.notes,
        'userId', b.user_id,
        'createdAt', b.created_at,
        'services', COALESCE(
            (SELECT jsonb_agg(bs.service_name) FROM public.booking_services bs WHERE bs.booking_id = b.id),
            '[]'::jsonb
        )
    ) INTO v_result
    FROM public.booking_requests b
    WHERE b.id = v_booking_id;

    RETURN v_result;
END;
$$;

-- RPC: Get Salon Admin KPI Overview
CREATE OR REPLACE FUNCTION public.get_salon_kpi_overview()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_total_bdt_revenue NUMERIC(10, 2);
    v_active_packages_count INT;
    v_pending_bookings_count INT;
    v_unread_omni_messages_count INT;
BEGIN
    SELECT COALESCE(SUM(bdt_amount), 0) INTO v_total_bdt_revenue
    FROM public.booking_requests
    WHERE status IN ('CONFIRMED', 'COMPLETED')
      AND created_at >= date_trunc('month', CURRENT_DATE);

    SELECT COUNT(*) INTO v_active_packages_count
    FROM public.packages
    WHERE is_active = TRUE;

    SELECT COUNT(*) INTO v_pending_bookings_count
    FROM public.booking_requests
    WHERE status = 'PENDING';

    SELECT COUNT(*) INTO v_unread_omni_messages_count
    FROM public.omni_messages
    WHERE is_read = FALSE;

    RETURN jsonb_build_object(
        'monthlyRevenueBDT', v_total_bdt_revenue,
        'activePackages', v_active_packages_count,
        'pendingBookings', v_pending_bookings_count,
        'unreadOmniMessages', v_unread_omni_messages_count
    );
END;
$$;

-- =============================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS across all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otp_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stylist_shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.omni_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.localized_translations ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if current caller is an Admin or Manager
CREATE OR REPLACE FUNCTION public.is_admin_or_manager()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        (current_setting('request.jwt.claims', true)::jsonb ->> 'role') IN ('ADMIN', 'MANAGER')
        OR (auth.jwt() ->> 'role') IN ('ADMIN', 'MANAGER')
        OR (auth.role() = 'service_role')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policies for: packages & package_services (Public Read, Admin Write)
CREATE POLICY "Public can view active packages"
    ON public.packages FOR SELECT
    USING (is_active = TRUE OR public.is_admin_or_manager());

CREATE POLICY "Admins have full access to packages"
    ON public.packages FOR ALL
    USING (public.is_admin_or_manager())
    WITH CHECK (public.is_admin_or_manager());

CREATE POLICY "Public can view package services"
    ON public.package_services FOR SELECT
    USING (TRUE);

CREATE POLICY "Admins have full access to package services"
    ON public.package_services FOR ALL
    USING (public.is_admin_or_manager())
    WITH CHECK (public.is_admin_or_manager());

-- Policies for: emergency_notices (Public Read Active, Admin Write)
CREATE POLICY "Public can view active emergency notices"
    ON public.emergency_notices FOR SELECT
    USING (is_global_active = TRUE OR public.is_admin_or_manager());

CREATE POLICY "Admins have full access to emergency notices"
    ON public.emergency_notices FOR ALL
    USING (public.is_admin_or_manager())
    WITH CHECK (public.is_admin_or_manager());

-- Policies for: stylist_shifts (Public Read, Admin Write)
CREATE POLICY "Public can view non-blocked stylist shifts"
    ON public.stylist_shifts FOR SELECT
    USING (is_blocked = FALSE OR public.is_admin_or_manager());

CREATE POLICY "Admins have full access to stylist shifts"
    ON public.stylist_shifts FOR ALL
    USING (public.is_admin_or_manager())
    WITH CHECK (public.is_admin_or_manager());

-- Policies for: booking_requests (Customers view/edit own, Admins view/edit all, Public insert)
CREATE POLICY "Public/Guests can create booking requests"
    ON public.booking_requests FOR INSERT
    WITH CHECK (TRUE);

CREATE POLICY "Customers can view their own bookings"
    ON public.booking_requests FOR SELECT
    USING (
        user_id = auth.uid()
        OR customer_phone = (auth.jwt() ->> 'phone')
        OR public.is_admin_or_manager()
    );

CREATE POLICY "Customers can modify their own pending bookings"
    ON public.booking_requests FOR UPDATE
    USING (
        (user_id = auth.uid() OR customer_phone = (auth.jwt() ->> 'phone'))
        OR public.is_admin_or_manager()
    )
    WITH CHECK (
        (user_id = auth.uid() OR customer_phone = (auth.jwt() ->> 'phone'))
        OR public.is_admin_or_manager()
    );

CREATE POLICY "Admins have full control over bookings"
    ON public.booking_requests FOR ALL
    USING (public.is_admin_or_manager())
    WITH CHECK (public.is_admin_or_manager());

-- Policies for: booking_services
CREATE POLICY "Public can insert booking services"
    ON public.booking_services FOR INSERT
    WITH CHECK (TRUE);

CREATE POLICY "Users can view own booking services"
    ON public.booking_services FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.booking_requests b
            WHERE b.id = booking_services.booking_id
              AND (b.user_id = auth.uid() OR b.customer_phone = (auth.jwt() ->> 'phone') OR public.is_admin_or_manager())
        )
    );

CREATE POLICY "Admins have full control over booking services"
    ON public.booking_services FOR ALL
    USING (public.is_admin_or_manager())
    WITH CHECK (public.is_admin_or_manager());

-- Policies for: omni_messages
CREATE POLICY "Anyone can create omni messages"
    ON public.omni_messages FOR INSERT
    WITH CHECK (TRUE);

CREATE POLICY "Customers can view their own omni messages"
    ON public.omni_messages FOR SELECT
    USING (
        user_id = auth.uid()
        OR sender_id = (auth.jwt() ->> 'phone')
        OR public.is_admin_or_manager()
    );

CREATE POLICY "Admins have full access to omni messages"
    ON public.omni_messages FOR ALL
    USING (public.is_admin_or_manager())
    WITH CHECK (public.is_admin_or_manager());

-- Policies for: localized_translations
CREATE POLICY "Public can read localized translations"
    ON public.localized_translations FOR SELECT
    USING (TRUE);

CREATE POLICY "Admins can manage localized translations"
    ON public.localized_translations FOR ALL
    USING (public.is_admin_or_manager())
    WITH CHECK (public.is_admin_or_manager());

-- Policies for: users
CREATE POLICY "Users can view their own profile"
    ON public.users FOR SELECT
    USING (id = auth.uid() OR public.is_admin_or_manager());

CREATE POLICY "Users can update their own profile"
    ON public.users FOR UPDATE
    USING (id = auth.uid() OR public.is_admin_or_manager())
    WITH CHECK (id = auth.uid() OR public.is_admin_or_manager());

CREATE POLICY "Admins and service role have full access to users"
    ON public.users FOR ALL
    USING (public.is_admin_or_manager())
    WITH CHECK (public.is_admin_or_manager());

-- Policies for: otp_attempts
CREATE POLICY "Service role and Admin can manage otp attempts"
    ON public.otp_attempts FOR ALL
    USING (public.is_admin_or_manager())
    WITH CHECK (public.is_admin_or_manager());

CREATE POLICY "Public can insert OTP attempts"
    ON public.otp_attempts FOR INSERT
    WITH CHECK (TRUE);
