import { createClient } from '@supabase/supabase-js';

const STORAGE_KEYS = {
  URL: 'mag_vitrine_supabase_url',
  KEY: 'mag_vitrine_supabase_key'
};

// Initial environment check using Vite environment variables
const ENV_URL = import.meta.env.VITE_SUPABASE_URL || 'https://fsfuixqartszwmqnywoi.supabase.co';
const ENV_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

/**
 * Retrieve current active Supabase URL and Key
 * Falls back to Vite environment variables VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
 */
export function getStoredSupabaseConfig() {
  const customUrl = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.URL) : null;
  const customKey = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.KEY) : null;

  const url = (customUrl || ENV_URL || '').trim();
  const key = (customKey || ENV_KEY || '').trim();

  return {
    url,
    key,
    isCustom: Boolean(customUrl && customKey),
    isEnvConfigured: Boolean(ENV_URL && ENV_KEY),
    envUrl: ENV_URL,
    hasEnvKey: Boolean(ENV_KEY)
  };
}

export const getSupabaseConfig = getStoredSupabaseConfig;

let supabaseInstance = null;
let currentConfigKey = '';

/**
 * Initialize and get the Supabase Client instance with session persistence
 */
export function getSupabase() {
  const { url, key } = getStoredSupabaseConfig();
  const configKey = `${url}_${key}`;

  if (!url || !key) {
    supabaseInstance = null;
    return null;
  }

  if (supabaseInstance && currentConfigKey === configKey) {
    return supabaseInstance;
  }

  try {
    supabaseInstance = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce'
      }
    });
    currentConfigKey = configKey;
    return supabaseInstance;
  } catch (err) {
    console.error('[Supabase Client Init Error]:', err);
    return null;
  }
}

/**
 * Direct supabase client accessor
 */
export const supabase = getSupabase();

/**
 * Returns true if both URL and Key are configured and valid
 */
export function isSupabaseConfigured() {
  const { url, key } = getStoredSupabaseConfig();
  return Boolean(url && key && url.startsWith('http'));
}

/**
 * Save new Supabase credentials to localStorage and dispatch update event
 */
export function saveSupabaseConfig(url, key) {
  if (!url || !key) {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.URL);
      localStorage.removeItem(STORAGE_KEYS.KEY);
    }
    supabaseInstance = null;
    currentConfigKey = '';
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('supabase-config-changed', { detail: { configured: false } }));
    }
    return;
  }

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.URL, url.trim());
    localStorage.setItem(STORAGE_KEYS.KEY, key.trim());
  }
  supabaseInstance = null;
  currentConfigKey = '';
  getSupabase();
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('supabase-config-changed', { detail: { configured: true, url, key } }));
  }
}

/**
 * Clear stored credentials
 */
export function clearSupabaseConfig() {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.URL);
    localStorage.removeItem(STORAGE_KEYS.KEY);
  }
  supabaseInstance = null;
  currentConfigKey = '';
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('supabase-config-changed', { detail: { configured: false } }));
  }
}

/**
 * Test connectivity against Supabase instance
 */
export async function testSupabaseConnection(testUrl, testKey) {
  const url = (testUrl || '').trim();
  const key = (testKey || '').trim();

  if (!url || !key) {
    return {
      ok: false,
      message: 'URL ou Clé API manquante. Veuillez renseigner votre clé Anon.',
      messageAr: 'الرابط أو مفتاح API مفقود. يرجى إدخال مفتاح Anon الخاص بك.'
    };
  }

  if (!url.startsWith('https://') && !url.startsWith('http://')) {
    return {
      ok: false,
      message: "L'URL doit commencer par https://",
      messageAr: 'يجب أن يبدأ الرابط بـ https://'
    };
  }

  const startTime = performance.now();
  try {
    const testClient = createClient(url, key, {
      auth: { persistSession: false }
    });

    // Try a lightweight query against products table
    const { data, error } = await testClient
      .from('products')
      .select('id')
      .limit(1);

    const elapsed = Math.round(performance.now() - startTime);

    if (error) {
      // If table doesn't exist yet, it's still connected to Supabase
      if (error.code === '42P01') {
        return {
          ok: true,
          latency: elapsed,
          warning: 'Connecté avec succès au projet Supabase ! Note : Le schéma SQL de tables (products, orders) doit être exécuté dans Supabase SQL Editor.',
          warningAr: 'متصل بنجاح بمشروع Supabase! ملاحظة: يجب تشغيل كود SQL للجداول في محرر Supabase SQL.'
        };
      }
      return {
        ok: false,
        message: error.message || `Code d'erreur ${error.code}`,
        messageAr: `فشل الاتصال: ${error.message || error.code}`
      };
    }

    return {
      ok: true,
      latency: elapsed,
      message: `Connexion établie avec succès (${elapsed} ms) ! Base de données active.`,
      messageAr: `تم الاتصال بنجاح (${elapsed} ميلي ثانية)! قاعدة البيانات نشطة.`
    };
  } catch (err) {
    return {
      ok: false,
      message: err.message || 'Erreur réseau ou URL Supabase invalide',
      messageAr: 'خطأ في الشبكة أو رابط غير صالح'
    };
  }
}
