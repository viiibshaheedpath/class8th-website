import { supabase } from '@/lib/supabaseClient';

export interface UserProfile {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  role: 'student' | 'admin';
  created_at: string;
}

const isMockMode =
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co';

/**
 * Fetches the profile row for a given Supabase auth user ID.
 * Falls back to a default student profile in mock mode.
 */
export async function getUserProfile(userId: string): Promise<UserProfile> {
  if (isMockMode) {
    return {
      id: userId,
      full_name: 'Mock Student',
      username: 'mock_student',
      avatar_url: null,
      role: 'student',
      created_at: new Date().toISOString()
    };
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) {
    throw new Error(`Failed to fetch profile for user ${userId}: ${error?.message}`);
  }

  return {
    id: data.id,
    full_name: data.full_name ?? data.name ?? null,
    username: data.username ?? null,
    avatar_url: data.avatar_url ?? null,
    role: (data.role as 'student' | 'admin') ?? 'student',
    created_at: data.created_at
  };
}
