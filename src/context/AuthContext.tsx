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

    // 3. Unauthenticated State (Clear user & profile)
    setUser(null);
    setProfile(null);
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

  // Student Sign In with Strict Supabase Verification
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const userEmail = email.trim();

    if (!isMockMode) {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password
      });

      if (authError) {
        setLoading(false);
        return { error: authError };
      }

      if (authData?.user) {
        let userProfile: UserProfile = {
          id: authData.user.id,
          name: authData.user.user_metadata?.name || userEmail.split('@')[0],
          role: 'student',
          email: userEmail
        };

        try {
          const { data: profData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single();

          if (profData) {
            userProfile = {
              id: profData.id,
              name: profData.name || userProfile.name,
              role: profData.role || 'student',
              email: userEmail
            };
          }
        } catch (err) {}

        const studentObj = {
          user: authData.user,
          profile: userProfile
        };

        if (typeof window !== 'undefined') {
          localStorage.removeItem('class8th_admin_session');
          localStorage.setItem('class8th_user_session', JSON.stringify(studentObj));
        }

        setUser(studentObj.user);
        setProfile(studentObj.profile);
        setLoading(false);
        return { error: null };
      }
    }

    // Mock Mode fallback validation
    if (password.length < 6) {
      setLoading(false);
      return { error: { message: 'Invalid email or password.' } };
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
      localStorage.removeItem('class8th_admin_session');
      localStorage.setItem('class8th_user_session', JSON.stringify(studentObj));
    }
    setUser(studentObj.user);
    setProfile(studentObj.profile);
    setLoading(false);
    return { error: null };
  };

  // Admin Sign In (Only called from /admin/login)
  const signInAdmin = async (email: string, password: string) => {
    setLoading(true);
    const adminEmail = email.trim() || 'admin@class8th.edu';

    if (password !== 'Class8th#Admin2026!') {
      setLoading(false);
      return { error: { message: 'Invalid admin credentials.' } };
    }

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
      } catch (err) {}
    }

    setLoading(false);
    return { error: null };
  };

  // Student Sign Up with Supabase Auth Registration
  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true);
    const userEmail = email.trim();

    if (!isMockMode) {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userEmail,
        password,
        options: {
          data: { name }
        }
      });

      if (authError) {
        setLoading(false);
        return { error: authError };
      }

      if (authData?.user) {
        // Save user profile row in Supabase 'profiles' table
        try {
          await supabase.from('profiles').upsert({
            id: authData.user.id,
            name,
            role: 'student',
            email: userEmail
          });
        } catch (err) {
          console.warn('Profile save notice:', err);
        }

        const studentObj = {
          user: authData.user,
          profile: {
            id: authData.user.id,
            name: name || userEmail.split('@')[0],
            role: 'student',
            email: userEmail
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
      }
    }

    // Fallback Mock Sign Up
    const studentObj = {
      user: { id: 'student-' + Date.now(), email: userEmail } as User,
      profile: {
        id: 'student-' + Date.now(),
        name,
        role: 'student',
        email: userEmail
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
      localStorage.removeItem('class8th_mock_user');
    }
    if (!isMockMode) {
      try {
        await supabase.auth.signOut();
      } catch (e) {}
    }
    setUser(null);
    setProfile(null);
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
