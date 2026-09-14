import { User } from '@supabase/supabase-js';
import { getSupabaseClient, isSupabaseConfigured } from './supabase';

export interface AuthSession {
  user: {
    email: string;
    id: string;
  } | null;
  isAuthenticated: boolean;
  isSupabaseAuth: boolean;
}

const LOCAL_ADMIN_KEY = 'portfolio_admin_local_session';

export const getCurrentAuthSession = async (): Promise<AuthSession> => {
  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured()) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        return {
          user: {
            email: session.user.email || 'admin@portfolio.local',
            id: session.user.id
          },
          isAuthenticated: true,
          isSupabaseAuth: true
        };
      }
    } catch (err) {
      console.warn('Supabase auth session check failed:', err);
    }
  }

  // Check local preview session
  if (typeof window !== 'undefined') {
    const localSession = localStorage.getItem(LOCAL_ADMIN_KEY);
    if (localSession) {
      try {
        const parsed = JSON.parse(localSession);
        return {
          user: parsed,
          isAuthenticated: true,
          isSupabaseAuth: false
        };
      } catch {
        localStorage.removeItem(LOCAL_ADMIN_KEY);
      }
    }
  }

  return {
    user: null,
    isAuthenticated: false,
    isSupabaseAuth: isSupabaseConfigured()
  };
};

export const loginAdmin = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
  const supabase = getSupabaseClient();
  
  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) {
        return { success: false, error: error.message };
      }
      if (data.session) {
        return { success: true };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'Gagal terhubung ke Supabase Auth' };
    }
  }

  // When Supabase is not connected in the current environment:
  // Allow login for testing the admin UI, requiring non-empty email and password
  if (!email || !password) {
    return { success: false, error: 'Email dan kata sandi wajib diisi' };
  }

  // Store local session for the session duration
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify({
      email,
      id: 'local-admin-' + Date.now()
    }));
  }

  return { success: true };
};

export const loginDemoAdmin = async (): Promise<void> => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify({
      email: 'admin@portfolio.demo',
      id: 'demo-admin-' + Date.now()
    }));
  }
};

export const logoutAdmin = async (): Promise<void> => {
  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured()) {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Supabase logout failed:', err);
    }
  }

  if (typeof window !== 'undefined') {
    localStorage.removeItem(LOCAL_ADMIN_KEY);
  }
};
