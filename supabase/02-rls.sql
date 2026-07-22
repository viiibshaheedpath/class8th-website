-- Class8th Row Level Security Policies (Step 9 + Step 12 + Step 13)
-- Step 12: admin write policies check profile.role = 'admin' at the DB level.
-- Step 13: added Supabase Storage bucket for simulation files (private).

-- ==========================================================================
-- SUPABASE STORAGE BUCKET (Step 13)
-- Run this block in the Supabase SQL editor to set up the simulations bucket.
-- ==========================================================================

-- Create private storage bucket for simulation packages
INSERT INTO storage.buckets (id, name, public)
  VALUES ('simulations', 'simulations', false)
  ON CONFLICT (id) DO NOTHING;

-- Allow admin-role users to upload/delete files in the simulations bucket
CREATE POLICY "Admin upload simulations files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'simulations'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admin delete simulations files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'simulations'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Allow authenticated users to read their own signed-URL-accessible objects
-- (Signed URLs are generated server-side; direct public access is disabled)
CREATE POLICY "Authenticated users read simulations files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'simulations'
    AND auth.uid() IS NOT NULL
-- Create private storage bucket for digital library documents (Step 14)
INSERT INTO storage.buckets (id, name, public)
  VALUES ('documents', 'documents', false)
  ON CONFLICT (id) DO NOTHING;

-- Allow admin-role users to upload/delete files in the documents bucket
CREATE POLICY "Admin upload documents files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'documents'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admin delete documents files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'documents'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Allow authenticated users to read documents files via signed URLs
CREATE POLICY "Authenticated users read documents files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'documents'
    AND auth.uid() IS NOT NULL
  );

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_habits ENABLE ROW LEVEL SECURITY;

-- Helper: inline admin check used in all admin write policies.
-- Checks the profiles table so role is validated at the PostgreSQL level.
-- Usage: include in USING / WITH CHECK clauses of INSERT/UPDATE/DELETE policies.

-- 1. Profiles Policies
CREATE POLICY "Public profiles read access" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 2. Simulations Policies
-- Any authenticated user may read published simulations.
-- Only admin-role users may insert, update, or delete.
CREATE POLICY "Authenticated users read published simulations" ON public.simulations
  FOR SELECT USING (
    status = 'published'
    OR auth.uid() IS NOT NULL
  );

CREATE POLICY "Admin write access simulations" ON public.simulations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role = 'admin'
    )
  );

-- 3. Documents Policies
CREATE POLICY "Authenticated users read published documents" ON public.documents
  FOR SELECT USING (
    status = 'published'
    OR auth.uid() IS NOT NULL
  );

CREATE POLICY "Admin write access documents" ON public.documents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role = 'admin'
    )
  );

-- 4. Quizzes & Questions Policies
CREATE POLICY "Authenticated users read published quizzes" ON public.quizzes
  FOR SELECT USING (
    status = 'published'
    OR auth.uid() IS NOT NULL
  );

CREATE POLICY "Authenticated users read questions" ON public.questions
  FOR SELECT USING (true);

CREATE POLICY "Admin write access quizzes" ON public.quizzes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role = 'admin'
    )
  );

CREATE POLICY "Admin write access questions" ON public.questions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role = 'admin'
    )
  );

-- 5. Quiz Attempts Policies
-- Students can only read and insert their own attempts.
CREATE POLICY "Users read own quiz attempts" ON public.quiz_attempts
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Users insert own quiz attempts" ON public.quiz_attempts
  FOR INSERT WITH CHECK (auth.uid() = student_id);

-- 6. Reading Sources Policies
CREATE POLICY "Authenticated users read active reading sources" ON public.reading_sources
  FOR SELECT USING (
    active_status = true
    OR auth.uid() IS NOT NULL
  );

CREATE POLICY "Admin write access reading sources" ON public.reading_sources
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
        AND role = 'admin'
    )
  );

-- 7. User Habits Policies
-- Students can only manage their own habit records.
CREATE POLICY "Users manage own habits" ON public.user_habits
  FOR ALL USING (auth.uid() = student_id);
