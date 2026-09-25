import { getSupabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * ============================================================================
 * ROBUST AUTHENTICATION SERVICE FOR MAG VITRINE
 * Powered by Supabase Auth (Email/Password, Google OAuth, Profiles Sync)
 * with graceful fallback to offline session cache when unconfigured.
 * ============================================================================
 */

export const authService = {
  /**
   * Sign up with Email and Password
   * Automatically creates user record in auth.users and profile in public.profiles.
   */
  async signUpWithEmail(email, password, {
    fullName = '',
    phone = '',
    wilaya = 'Alger',
    commune = '',
    role = 'customer',
    storeName = '',
    address = ''
  } = {}) {
    const supabase = getSupabase();

    if (!supabase || !isSupabaseConfigured()) {
      // Local fallback for smooth testing without active Supabase
      const mockUser = {
        id: `user_${Date.now()}`,
        email: email.trim().toLowerCase(),
        role: role,
        name: fullName || (role === 'store' ? storeName : email.split('@')[0]),
        phone: phone || '',
        wilaya: wilaya || 'Alger',
        commune: commune || '',
        address: address || '',
        storeId: role === 'store' ? `store_${Date.now()}` : null,
        created_at: new Date().toISOString()
      };
      return { data: { user: mockUser, session: { user: mockUser } }, error: null, isOfflineFallback: true };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: password,
        options: {
          data: {
            full_name: fullName || (role === 'store' ? storeName : email.split('@')[0]),
            phone: phone,
            wilaya: wilaya,
            commune: commune,
            role: role,
            store_name: storeName,
            address: address
          }
        }
      });

      if (error) {
        return { data: null, error };
      }

      // If user was created, ensure profile exists in public.profiles table
      if (data?.user) {
        try {
          const profileData = {
            id: data.user.id,
            email: data.user.email,
            full_name: fullName || storeName || data.user.email.split('@')[0],
            phone: phone || '',
            wilaya: wilaya || 'Alger',
            commune: commune || '',
            role: role || 'customer',
            updated_at: new Date().toISOString()
          };

          await supabase.from('profiles').upsert([profileData], { onConflict: 'id' });
        } catch (profileErr) {
          console.warn('[authService] Profile sync error:', profileErr);
        }
      }

      return { data, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  /**
   * Sign in with Email and Password
   */
  async signInWithEmail(email, password) {
    const supabase = getSupabase();

    if (!supabase || !isSupabaseConfigured()) {
      // Offline fallback
      const mockUser = {
        id: `user_${Date.now()}`,
        email: email.trim().toLowerCase(),
        role: email.includes('admin') ? 'admin' : (email.includes('store') ? 'store' : 'customer'),
        name: email.split('@')[0],
        phone: '0550000000',
        wilaya: 'Alger',
        address: ''
      };
      return { data: { user: mockUser, session: { user: mockUser } }, error: null, isOfflineFallback: true };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password
      });

      if (error) {
        return { data: null, error };
      }

      // Fetch profile from public.profiles to enrich session
      let userProfile = null;
      if (data?.user?.id) {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
          userProfile = profile;
        } catch (e) {
          // ignore
        }
      }

      const enrichedUser = {
        id: data.user.id,
        email: data.user.email,
        name: userProfile?.full_name || data.user.user_metadata?.full_name || data.user.email.split('@')[0],
        role: userProfile?.role || data.user.user_metadata?.role || 'customer',
        phone: userProfile?.phone || data.user.user_metadata?.phone || '',
        wilaya: userProfile?.wilaya || data.user.user_metadata?.wilaya || 'Alger',
        commune: userProfile?.commune || data.user.user_metadata?.commune || '',
        storeId: userProfile?.store_id || data.user.user_metadata?.store_id || null
      };

      return { data: { ...data, enrichedUser }, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  /**
   * Social Authentication with Google
   * Redirects user to Google OAuth consent screen managed by Supabase.
   */
  async signInWithGoogle(redirectTo) {
    const supabase = getSupabase();

    if (!supabase || !isSupabaseConfigured()) {
      return {
        data: null,
        error: new Error('Supabase n\'est pas encore configuré avec les clés d\'environnement. Renseignez votre Anon Key pour activer Google Sign-In.')
      };
    }

    try {
      const redirectUri = redirectTo || (typeof window !== 'undefined' ? window.location.origin : '');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUri,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });

      return { data, error };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  /**
   * Sign out current user
   */
  async signOut() {
    const supabase = getSupabase();
    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Sign out error:', e);
      }
    }
    return { success: true };
  },

  /**
   * Retrieve active session
   */
  async getSession() {
    const supabase = getSupabase();
    if (!supabase || !isSupabaseConfigured()) return { data: { session: null }, error: null };

    try {
      return await supabase.auth.getSession();
    } catch (err) {
      return { data: { session: null }, error: err };
    }
  },

  /**
   * Retrieve current authenticated user
   */
  async getCurrentUser() {
    const supabase = getSupabase();
    if (!supabase || !isSupabaseConfigured()) return null;

    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return null;
      return user;
    } catch (err) {
      return null;
    }
  },

  /**
   * Listen to auth state changes (SIGNED_IN, SIGNED_OUT, etc.)
   */
  onAuthStateChange(callback) {
    const supabase = getSupabase();
    if (!supabase || !isSupabaseConfigured()) {
      return { data: { subscription: { unsubscribe: () => {} } } };
    }

    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  },

  /**
   * Reset password email
   */
  async resetPasswordForEmail(email) {
    const supabase = getSupabase();
    if (!supabase || !isSupabaseConfigured()) {
      return { error: new Error('Supabase non configuré') };
    }

    return await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/#reset-password`
    });
  }
};
