import { supabase } from '@/lib/supabaseClient';

export interface QuizResult {
  id: string;
  userId: string;
  quizId: string;
  quizTitle: string;
  score: number;
  totalPoints: number;
  percentage: number;
  completedAt: string;
  subject?: string;
}

const isMockMode =
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

/**
 * Saves a student's quiz attempt result to Supabase and/or localStorage.
 */
export async function saveQuizResult(
  resultInput: Omit<QuizResult, 'id' | 'completedAt'>
): Promise<QuizResult> {
  const result: QuizResult = {
    id: `qr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    completedAt: new Date().toISOString(),
    ...resultInput
  };

  // Always persist to localStorage for instant client availability
  try {
    const existing = JSON.parse(localStorage.getItem('class8th_quiz_results') || '[]');
    const updated = [result, ...existing];
    localStorage.setItem('class8th_quiz_results', JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save quiz result to localStorage:', e);
  }

  // Persist to Supabase database if live connection is configured
  if (!isMockMode) {
    try {
      await supabase.from('quiz_results').insert({
        id: result.id,
        user_id: result.userId,
        quiz_id: result.quizId,
        quiz_title: result.quizTitle,
        score: result.score,
        total_points: result.totalPoints,
        percentage: result.percentage,
        completed_at: result.completedAt,
        subject: result.subject ?? 'General'
      });
    } catch (e) {
      console.warn('Supabase quiz_results insert notice:', e);
    }
  }

  return result;
}

/**
 * Fetches all completed quiz attempts for a specific student.
 */
export async function getUserQuizResults(userId?: string): Promise<QuizResult[]> {
  let localResults: QuizResult[] = [];
  try {
    const raw = localStorage.getItem('class8th_quiz_results');
    if (raw) {
      localResults = JSON.parse(raw);
      if (userId) {
        localResults = localResults.filter((r) => r.userId === userId);
      }
    }
  } catch (e) {}

  if (isMockMode || !userId) {
    return localResults;
  }

  try {
    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false });

    if (data && !error && data.length > 0) {
      const dbResults: QuizResult[] = data.map((row) => ({
        id: row.id,
        userId: row.user_id,
        quizId: row.quiz_id,
        quizTitle: row.quiz_title,
        score: row.score,
        totalPoints: row.total_points,
        percentage: row.percentage,
        completedAt: row.completed_at,
        subject: row.subject
      }));
      return dbResults;
    }
  } catch (e) {
    console.warn('Error fetching Supabase quiz results:', e);
  }

  return localResults;
}
