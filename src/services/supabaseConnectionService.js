import { getSupabase, getStoredSupabaseConfig, saveSupabaseConfig, clearSupabaseConfig, isSupabaseConfigured, testSupabaseConnection } from '../lib/supabase';
import { createClient } from '@supabase/supabase-js';

/**
 * ============================================================================
 * SUPABASE CONNECTION SERVICE
 * Provides unified client management, connection diagnostics, and credentials storage.
 * ============================================================================
 */

export const DEFAULT_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://fsfuixqartszwmqnywoi.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabaseConnectionService = {
  /**
   * Get active config (localStorage takes precedence over .env)
   */
  getConfig() {
    return getStoredSupabaseConfig();
  },

  /**
   * Check if configured
   */
  isConfigured() {
    return isSupabaseConfigured();
  },

  /**
   * Save custom configuration to localStorage and re-initialize client
   */
  saveConfig(url, key) {
    saveSupabaseConfig(url, key);
    return getSupabase();
  },

  /**
   * Reset to default environment configuration
   */
  resetConfig() {
    clearSupabaseConfig();
    return getSupabase();
  },

  /**
   * Run detailed diagnostics to answer "Pourquoi ça ne connecte pas"
   */
  async runDiagnostic(customUrl, customKey) {
    const config = getStoredSupabaseConfig();
    const url = (customUrl !== undefined ? customUrl : config.url || DEFAULT_SUPABASE_URL).trim();
    const key = (customKey !== undefined ? customKey : config.key || DEFAULT_SUPABASE_ANON_KEY).trim();

    const diagnostic = {
      timestamp: new Date().toISOString(),
      url: url || '(non configurée)',
      hasUrl: Boolean(url),
      hasKey: Boolean(key),
      isDefaultUrl: url.includes('fsfuixqartszwmqnywoi'),
      validUrlFormat: url.startsWith('https://') || url.startsWith('http://'),
      isConnected: false,
      latency: 0,
      code: '',
      message: '',
      messageAr: '',
      explanation: '',
      explanationAr: '',
      suggestedAction: '',
      suggestedActionAr: '',
      tables: {
        products: false,
        stores: false,
        orders: false,
        profiles: false
      }
    };

    if (!diagnostic.hasUrl) {
      diagnostic.code = 'ERR_NO_URL';
      diagnostic.message = "L'URL Supabase est manquante.";
      diagnostic.messageAr = 'رابط مشروع Supabase مفقود.';
      diagnostic.explanation = "L'application ne sait pas à quel serveur de base de données se connecter.";
      diagnostic.explanationAr = 'التطبيق لا يملك عنوان خادم قاعدة البيانات للاتصال به.';
      diagnostic.suggestedAction = "Renseignez l'URL de votre projet Supabase (ex: https://fsfuixqartszwmqnywoi.supabase.co).";
      diagnostic.suggestedActionAr = 'يرجى إدخال رابط مشروعك من Supabase.';
      return diagnostic;
    }

    if (!diagnostic.validUrlFormat) {
      diagnostic.code = 'ERR_INVALID_URL';
      diagnostic.message = "L'URL n'est pas au format valide (doit débuter par https://).";
      diagnostic.messageAr = 'صيغة الرابط غير صحيحة، يجب أن يبدأ بـ https://';
      diagnostic.explanation = "Une URL HTTPS valide de Supabase est requise.";
      diagnostic.explanationAr = 'مطلوب رابط مشفر صالح HTTPS.';
      diagnostic.suggestedAction = 'Corrigez le préfixe avec https://';
      diagnostic.suggestedActionAr = 'قم بتصحيح الرابط بإضافة https:// في البداية';
      return diagnostic;
    }

    if (!diagnostic.hasKey) {
      diagnostic.code = 'ERR_NO_ANON_KEY';
      diagnostic.message = "La clé API publique (anon key) est manquante dans .env ou la configuration.";
      diagnostic.messageAr = 'المفتاح العمومي (Anon Key) مفقود في متغيرات البيئة أو الإعدادات.';
      diagnostic.explanation = "Supabase protège l'accès à la base de données. Sans clé API anon, les requêtes sont rejetées immédiatement.";
      diagnostic.explanationAr = 'سوبابيز يتطلب مفتاح API عمومي (anon key) للسماح للتطبيق بالاتصال وقراءة الجداول.';
      diagnostic.suggestedAction = "Rendez-vous dans Supabase > Project Settings > API > Project API keys, copiez la clé 'anon public' et collez-la dans la boîte de configuration.";
      diagnostic.suggestedActionAr = 'انتقل إلى لوحة تحكم Supabase > Project Settings > API وانسخ المفتاح anon public والصقه هنا.';
      return diagnostic;
    }

    // Try live ping
    const startTime = performance.now();
    try {
      const client = createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false }
      });

      // 1. Test ping table
      const { data: pingData, error: pingError } = await client
        .from('products')
        .select('id')
        .limit(1);

      diagnostic.latency = Math.round(performance.now() - startTime);

      if (pingError) {
        // Table doesn't exist yet (42P01: undefined_table) -> Connected to project, but schema needs to be run!
        if (pingError.code === '42P01') {
          diagnostic.isConnected = true;
          diagnostic.code = 'CONNECTED_SCHEMA_MISSING';
          diagnostic.message = "Connexion réussie au projet Supabase, mais la table 'products' n'a pas encore été créée.";
          diagnostic.messageAr = "تم الاتصال بنجاح بمشروع Supabase، ولكن جدول المنتجات لم يتم إنشاؤه بعد.";
          diagnostic.explanation = "Le schéma SQL de MAG VITRINE n'a pas encore été exécuté dans le SQL Editor de Supabase.";
          diagnostic.explanationAr = "يرجى نسخ ملف SQL المرفق وتشغيله في SQL Editor داخل لوحة تحكم Supabase.";
          diagnostic.suggestedAction = "Ouvrez l'onglet 'Script SQL' dans l'administration, copiez le code et exécutez-le dans Supabase SQL Editor.";
          diagnostic.suggestedActionAr = "انسخ كود SQL من تبويب السكربت وقم بتشغيله في SQL Editor.";
          return diagnostic;
        }

        // Invalid API Key (JWT invalid)
        if (pingError.message?.toLowerCase().includes('jwt') || pingError.code === 'PGRST301' || pingError.message?.toLowerCase().includes('invalid api key')) {
          diagnostic.code = 'ERR_INVALID_KEY';
          diagnostic.message = "Clé API anon invalide ou expirée.";
          diagnostic.messageAr = "مفتاح API غير صالح أو منتهي الصلاحية.";
          diagnostic.explanation = "Supabase a rejeté la clé API fournie. Vérifiez que vous avez bien copié la clé 'anon public' et non la clé 'service_role'.";
          diagnostic.explanationAr = "تأكد من نسخ المفتاح الصحيح anon public من إعدادات المشروع.";
          diagnostic.suggestedAction = "Recopiez la clé 'anon public' depuis votre tableau de bord Supabase.";
          diagnostic.suggestedActionAr = "أعد نسخ المفتاح anon public من لوحة تحكم Supabase.";
          return diagnostic;
        }

        diagnostic.code = pingError.code || 'ERR_QUERY_FAILED';
        diagnostic.message = pingError.message || "Erreur lors de la requête de test.";
        diagnostic.messageAr = "حدث خطأ أثناء فحص الجداول.";
        return diagnostic;
      }

      // Success! Check tables availability
      diagnostic.isConnected = true;
      diagnostic.code = 'CONNECTED_SUCCESS';
      diagnostic.message = `Connexion active et opérationnelle (${diagnostic.latency} ms) !`;
      diagnostic.messageAr = `الاتصال نشط ويعمل بنجاح (${diagnostic.latency} ميلي ثانية)!`;
      diagnostic.tables.products = true;

      // Check others in parallel
      try {
        const [storesRes, ordersRes, profilesRes] = await Promise.all([
          client.from('stores').select('id').limit(1),
          client.from('orders').select('id').limit(1),
          client.from('profiles').select('id').limit(1)
        ]);
        diagnostic.tables.stores = !storesRes.error;
        diagnostic.tables.orders = !ordersRes.error;
        diagnostic.tables.profiles = !profilesRes.error;
      } catch (err) {
        // Non-blocking
      }

      return diagnostic;
    } catch (err) {
      diagnostic.latency = Math.round(performance.now() - startTime);
      diagnostic.code = 'ERR_NETWORK';
      diagnostic.message = err.message || "Impossible de joindre le serveur Supabase.";
      diagnostic.messageAr = "تعذر الوصول إلى خادم Supabase، يرجى التحقق من اتصال الإنترنت.";
      diagnostic.explanation = "Une erreur réseau s'est produite lors de la tentative de connexion.";
      diagnostic.explanationAr = "حدث خطأ في الشبكة أثناء محاولة الاتصال.";
      return diagnostic;
    }
  }
};
