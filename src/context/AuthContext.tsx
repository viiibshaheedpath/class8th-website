'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

export interface UserProfile {
  id: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
  avatarUrl?: string;
  avatar_url?: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInAdmin: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  setProfile?: (profile: UserProfile | null) => void;
  setUser?: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const isMockMode =
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

  useEffect(() => {
    // 1. Check for Active Admin Session
    const adminSession = typeof window !== 'undefined' ? localStorage.getItem('class8th_admin_session') : null;
    if (adminSession) {
      try {
        const parsed = JSON.parse(adminSession);
        setUser(parsed.user);
        setProfile({ ...parsed.profile, role: 'admin' });
        setLoading(false);
        return;
      } catch (e) {}
    }

    // 2. Check for Active Student User Session
    const studentSession = typeof window !== 'undefined' ? localStorage.getItem('class8th_user_session') : null;
    if (studentSession) {
      try {
        const parsed = JSON.parse(studentSession);
        setUser(parsed.user);
        setProfile({ ...parsed.profile, role: 'student' });
        setLoading(false);
        return;
      } catch (e) {}
    }

    // 3. Default to Student Role (Least Privilege Principle)
    const defaultStudent = {
      user: { id: 'student-guest', email: 'student@class8th.edu' } as any,
      profile: { id: 'student-guest', name: 'Student', role: 'student', email: 'student@class8th.edu' } as UserProfile
    };
    setUser(defaultStudent.user);
    setProfile(defaultStudent.profile);
    setLoading(false);

    // 4. Supabase Auth listener if configured
    if (!isMockMode) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session.user);
          fetchProfile(session.user.id, session.user.email);
        }
      });

      const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id, session.user.email);
        }
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, [isMockMode]);

  const fetchProfile = async (userId: string, userEmail?: string) => {
    // Check if logged in via Admin portal
    const adminSession = typeof window !== 'undefined' ? localStorage.getItem('class8th_admin_session') : null;
    if (adminSession) {
      try {
        const parsed = JSON.parse(adminSession);
        setProfile({ ...parsed.profile, role: 'admin' });
        return;
      } catch (e) {}
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data && !error && data.role === 'admin') {
        setProfile({
          id: data.id,
          name: data.name || userEmail?.split('@')[0] || 'Admin',
          role: 'admin',
          avatarUrl: data.avatar_url,
          email: userEmail
        });
      } else {
        // Default regular profile to Student
        setProfile({
          id: userId,
          name: data?.name || userEmail?.split('@')[0] || 'Student',
          role: 'student',
          email: userEmail
        });
      }
    } catch (err) {
      setProfile({
        id: userId,
        name: userEmail?.split('@')[0] || 'Student',
        role: 'student',
        email: userEmail
      });
    }
  };

  // Student Sign In
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const userEmail = email.trim() || 'student@class8th.edu';

    if (typeof window !== 'undefined') {
      localStorage.removeItem('class8th_admin_session');
    }

    const studentObj = {
      user: { id: `student-${Date.now()}`, email: userEmail } as User,
      profile: {
        id: `student-${Date.now()}`,
        name: userEmail.split('@')[0] || 'Student',
        role: 'student',
        email: userEmail
      } as UserProfile
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('class8th_user_session', JSON.stringify(studentObj));
    }
    setUser(studentObj.user);
    setProfile(studentObj.profile);

    if (!isMockMode) {
      try {
        await supabase.auth.signInWithPassword({ email: userEmail, password });
      } catch (err) {
        console.warn('Supabase signIn notice:', err);
      }
    }

    setLoading(false);
    return { error: null };
  };

  // Admin Sign In (Only called from /admin/login)
  const signInAdmin = async (email: string, password: string) => {
    setLoading(true);
    const adminEmail = email.trim() || 'admin@class8th.edu';

    if (typeof window !== 'undefined') {
      localStorage.removeItem('class8th_user_session');
    }

    const adminObj = {
      user: { id: `admin-${Date.now()}`, email: adminEmail } as User,
      profile: {
        id: `admin-${Date.now()}`,
        name: adminEmail.split('@')[0] || 'System Admin',
        role: 'admin',
        email: adminEmail
      } as UserProfile
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('class8th_admin_session', JSON.stringify(adminObj));
    }
    setUser(adminObj.user);
    setProfile(adminObj.profile);

    if (!isMockMode) {
      try {
        await supabase.auth.signInWithPassword({ email: adminEmail, password });
      } catch (err) {
        console.warn('Supabase admin signIn notice:', err);
      }
    }

    setLoading(false);
    return { error: null };
  };

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true);
    const studentObj = {
      user: { id: 'student-' + Date.now(), email } as User,
      profile: {
        id: 'student-' + Date.now(),
        name,
        role: 'student',
        email
      } as UserProfile
    };
    if (typeof window !== 'undefined') {
      localStorage.removeItem('class8th_admin_session');
      localStorage.setItem('class8th_user_session', JSON.stringify(studentObj));
    }
    setUser(studentObj.user);
    setProfile(studentObj.profile);
    setLoading(false);
    return { error: null };
  };

  const signOut = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('class8th_admin_session');
      localStorage.removeItem('class8th_user_session');
    }
    if (!isMockMode) {
      try {
        await supabase.auth.signOut();
      } catch (e) {}
    }
    const guestStudent = {
      user: { id: 'student-guest', email: 'student@class8th.edu' } as any,
      profile: { id: 'student-guest', name: 'Student', role: 'student', email: 'student@class8th.edu' } as UserProfile
    };
    setUser(guestStudent.user);
    setProfile(guestStudent.profile);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signIn,
        signInAdmin,
        signUp,
        signOut,
        setProfile,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
