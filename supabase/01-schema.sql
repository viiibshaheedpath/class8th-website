-- Class8th Platform Database Schema (Step 9)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
  avatar_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Simulations Table
CREATE TABLE IF NOT EXISTS public.simulations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  subject TEXT NOT NULL,
  thumbnail_url TEXT,
  difficulty TEXT NOT NULL DEFAULT 'Medium' CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  embed_url TEXT,
  file_path TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Digital Library Documents Table
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  subject TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL DEFAULT 'pdf',
  thumbnail_url TEXT,
  allow_view BOOLEAN NOT NULL DEFAULT true,
  allow_download BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- 4. Quizzes Table
CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  subject TEXT NOT NULL,
  time_limit_minutes INTEGER NOT NULL DEFAULT 15,
  passing_score INTEGER NOT NULL DEFAULT 70,
  shuffle_questions BOOLEAN NOT NULL DEFAULT true,
  show_explanations BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Quiz Questions Table
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'mcq' CHECK (question_type IN ('mcq', 'true_false', 'short_answer', 'multi_select')),
  options JSONB DEFAULT '[]'::jsonb,
  correct_answer JSONB NOT NULL,
  explanation TEXT,
  points INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Quiz Attempts Table
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Reading RSS Sources Table
CREATE TABLE IF NOT EXISTS public.reading_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_name TEXT NOT NULL,
  website_url TEXT,
  feed_url TEXT NOT NULL,
  api_type TEXT DEFAULT 'rss',
  category TEXT NOT NULL DEFAULT 'General',
  sync_frequency TEXT DEFAULT 'daily',
  active_status BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. User Habits & Study Schedule Table
CREATE TABLE IF NOT EXISTS public.user_habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  streak_days INTEGER NOT NULL DEFAULT 0,
  last_study_date DATE,
  schedule JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
