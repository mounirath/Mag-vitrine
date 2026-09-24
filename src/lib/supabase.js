import { createClient } from '@supabase/supabase-js';

const STORAGE_KEYS = {
  URL: 'mag_vitrine_supabase_url',
  KEY: 'mag_vitrine_supabase_key'
};

// Initial environment check
const ENV_URL = import.meta.env.VITE_SUPABASE_URL || 'https://fsfuixqartszwmqnywoi.supabase.co';
const ENV_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export function getStoredSupabaseConfig() {
  const customUrl = localStorage.getItem(STORAGE_KEYS.URL);
  const customKey = localStorage.getItem(STORAGE_KEYS.KEY);

  const url = customUrl || ENV_URL || '';
  const key = customKey || ENV_KEY || '';

  return { url: url.trim(), key: key.trim(), isCustom: Boolean(customUrl && customKey) };
}

export const getSupabaseConfig = getStoredSupabaseConfig;

let supabaseInstance = null;
let currentConfigKey = '';

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
        detectSessionInUrl: true
      }
    });
    currentConfigKey = configKey;
    return supabaseInstance;
  } catch (err) {
    console.error('[Supabase Client Init Error]:', err);
    return null;
  }
}

export function isSupabaseConfigured() {
  const { url, key } = getStoredSupabaseConfig();
  return Boolean(url && key && url.startsWith('http'));
}

export function saveSupabaseConfig(url, key) {
  if (!url || !key) {
    localStorage.removeItem(STORAGE_KEYS.URL);
    localStorage.removeItem(STORAGE_KEYS.KEY);
    supabaseInstance = null;
    window.dispatchEvent(new CustomEvent('supabase-config-changed', { detail: { configured: false } }));
    return;
  }

  localStorage.setItem(STORAGE_KEYS.URL, url.trim());
  localStorage.setItem(STORAGE_KEYS.KEY, key.trim());
  supabaseInstance = null;
  getSupabase();
  window.dispatchEvent(new CustomEvent('supabase-config-changed', { detail: { configured: true, url, key } }));
}

export function clearSupabaseConfig() {
  localStorage.removeItem(STORAGE_KEYS.URL);
  localStorage.removeItem(STORAGE_KEYS.KEY);
  supabaseInstance = null;
  window.dispatchEvent(new CustomEvent('supabase-config-changed', { detail: { configured: false } }));
}

/**
 * Test connectivity against Supabase instance
 */
export async function testSupabaseConnection(testUrl, testKey) {
  const url = (testUrl || '').trim();
  const key = (testKey || '').trim();

  if (!url || !key) {
    return { ok: false, message: 'URL ou Clé API manquante' };
  }

  if (!url.startsWith('https://') && !url.startsWith('http://')) {
    return { ok: false, message: "L'URL doit commencer par https://" };
  }

  const startTime = performance.now();
  try {
    const testClient = createClient(url, key, {
      auth: { persistSession: false }
    });

    // Try a lightweight query
    const { error, status } = await testClient
      .from('categories')
      .select('id')
      .limit(1);

    const elapsed = Math.round(performance.now() - startTime);

    if (error) {
      // If table doesn't exist yet, it's still connected to Supabase
      if (error.code === '42P01') {
        return {
          ok: true,
          latency: elapsed,
          warning: 'Connecté, mais le schéma SQL Mag Vitrine n\'a pas encore été exécuté. Exécutez le script SQL.'
        };
      }
      return { ok: false, message: error.message || `Code d'erreur ${error.code}` };
    }

    return {
      ok: true,
      latency: elapsed,
      message: `Connexion réussie avec succès (${elapsed} ms)`
    };
  } catch (err) {
    return {
      ok: false,
      message: err.message || 'Erreur réseau ou URL invalide'
    };
  }
}
