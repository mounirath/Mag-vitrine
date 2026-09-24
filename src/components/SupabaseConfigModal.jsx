import React, { useState, useEffect } from 'react';
import { 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  RefreshCw, 
  X, 
  ExternalLink, 
  Key, 
  Globe, 
  UploadCloud,
  Terminal,
  ShieldCheck,
  Server
} from 'lucide-react';
import { 
  getStoredSupabaseConfig, 
  saveSupabaseConfig, 
  clearSupabaseConfig, 
  testSupabaseConnection, 
  isSupabaseConfigured 
} from '../lib/supabase';
import { syncLocalDataToSupabase } from '../services/supabaseService';

export function SupabaseConfigModal({ 
  isOpen, 
  onClose, 
  stores = [], 
  products = [], 
  storeReviews = [], 
  customerRatings = [],
  lang = 'ar', 
  t 
}) {
  const isAr = lang === 'ar';
  const [config, setConfig] = useState({ url: '', key: '' });
  const [isConfigured, setIsConfigured] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [activeTab, setActiveTab] = useState('settings'); // 'settings' | 'sql' | 'guide'

  useEffect(() => {
    if (isOpen) {
      const stored = getStoredSupabaseConfig();
      setConfig({ url: stored.url, key: stored.key });
      setIsConfigured(isSupabaseConfigured());
      setTestResult(null);
      setSyncResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await testSupabaseConnection(config.url, config.key);
      setTestResult(res);
      if (res.ok) {
        setIsConfigured(true);
      }
    } catch (err) {
      setTestResult({ ok: false, message: err.message });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    saveSupabaseConfig(config.url, config.key);
    setIsConfigured(Boolean(config.url && config.key));
    setTestResult({ ok: true, message: isAr ? 'تم حفظ إعدادات Supabase بنجاح!' : 'Configuration Supabase enregistrée !' });
  };

  const handleReset = () => {
    clearSupabaseConfig();
    setConfig({ url: '', key: '' });
    setIsConfigured(false);
    setTestResult(null);
  };

  const handleSyncToSupabase = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await syncLocalDataToSupabase({
        stores,
        products,
        storeReviews,
        customerRatings
      });
      setSyncResult({
        ok: true,
        message: isAr 
          ? `تمت المزامنة بنجاح! (${res.stores} متجر، ${res.products} منتج، ${res.storeReviews} تقييم)` 
          : `Synchronisation réussie ! (${res.stores} boutiques, ${res.products} produits, ${res.storeReviews} avis)`
      });
    } catch (err) {
      setSyncResult({ ok: false, message: err.message });
    } finally {
      setSyncing(false);
    }
  };

  const sqlSchemaCode = `-- ==============================================================================
-- SCHEMA SUPABASE POSTGRESQL - MAG VITRINE ALGÉRIE (DZ)
-- ==============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'store', 'admin')),
    full_name TEXT NOT NULL,
    phone TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table Stores
CREATE TABLE IF NOT EXISTS public.stores (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo TEXT NOT NULL,
    banner TEXT DEFAULT '',
    description TEXT NOT NULL,
    manager_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    address TEXT NOT NULL,
    wilaya TEXT NOT NULL,
    commune TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table Categories
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name_fr TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    icon_name TEXT NOT NULL DEFAULT 'ShoppingBag'
);

-- Table Products
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    store_id TEXT NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    category_id TEXT NOT NULL,
    name TEXT NOT NULL,
    name_ar TEXT DEFAULT '',
    description TEXT NOT NULL,
    price NUMERIC(12,2) NOT NULL,
    old_price NUMERIC(12,2),
    is_promotion BOOLEAN DEFAULT FALSE,
    discount_percent INT DEFAULT 0,
    condition TEXT DEFAULT 'new',
    stock_status TEXT DEFAULT 'IN_STOCK',
    image_url TEXT NOT NULL,
    images JSONB DEFAULT '[]'::jsonb,
    location TEXT DEFAULT '',
    wilaya TEXT DEFAULT '',
    status TEXT DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table Orders
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    store_id TEXT NOT NULL,
    store_name TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    wilaya TEXT NOT NULL,
    commune TEXT NOT NULL,
    address TEXT NOT NULL,
    delivery_method TEXT DEFAULT 'HOME_DELIVERY',
    payment_method TEXT DEFAULT 'CASH_ON_DELIVERY',
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC(12,2) NOT NULL,
    delivery_fee NUMERIC(12,2) DEFAULT 0.0,
    total NUMERIC(12,2) NOT NULL,
    status TEXT DEFAULT 'NEW',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table Store Reviews
CREATE TABLE IF NOT EXISTS public.store_reviews (
    id TEXT PRIMARY KEY,
    store_id TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    rating INT NOT NULL,
    criteria JSONB DEFAULT '{}'::jsonb,
    comment TEXT NOT NULL,
    comment_fr TEXT DEFAULT '',
    verified_order BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table Customer Ratings
CREATE TABLE IF NOT EXISTS public.customer_ratings (
    id TEXT PRIMARY KEY,
    customer_phone TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    store_id TEXT NOT NULL,
    store_name TEXT NOT NULL,
    parcel_received BOOLEAN NOT NULL DEFAULT TRUE,
    stars INT NOT NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Public Read Access
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read stores" ON public.stores FOR SELECT USING (true);
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public read orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read reviews" ON public.store_reviews FOR SELECT USING (true);
CREATE POLICY "Public insert reviews" ON public.store_reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read ratings" ON public.customer_ratings FOR SELECT USING (true);
CREATE POLICY "Stores insert ratings" ON public.customer_ratings FOR INSERT WITH CHECK (true);
CREATE POLICY "Manage products" ON public.products FOR ALL USING (true);
CREATE POLICY "Manage stores" ON public.stores FOR ALL USING (true);
`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlSchemaCode);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }}>
      <div 
        className="modal-content" 
        style={{ 
          maxWidth: '750px', 
          width: '94%', 
          maxHeight: '90vh', 
          display: 'flex', 
          flexDirection: 'column',
          borderRadius: '16px',
          overflow: 'hidden',
          padding: 0
        }}
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ 
              background: 'rgba(255,255,255,0.2)', 
              borderRadius: '10px', 
              padding: '0.5rem',
              display: 'flex'
            }}>
              <Database size={24} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800' }}>
                  {isAr ? 'إعداد خادم Supabase السحابي' : 'Configuration Backend Supabase'}
                </h3>
                <span style={{
                  background: isConfigured ? '#34d399' : '#fbbf24',
                  color: '#064e3b',
                  fontSize: '0.7rem',
                  fontWeight: '800',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '12px'
                }}>
                  {isConfigured 
                    ? (isAr ? 'مربوط ومفعل' : 'Connecté') 
                    : (isAr ? 'نمط محلي (مؤقت)' : 'Mode Local')}
                </span>
              </div>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', opacity: 0.9 }}>
                {isAr 
                  ? 'قاعدة بيانات PostgreSQL + مصادقة سريعة + تخزين الصور لـ Mag Vitrine' 
                  : 'Base PostgreSQL, authentification & stockage cloud en direct'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ 
              background: 'rgba(255,255,255,0.2)', 
              border: 'none', 
              borderRadius: '50%', 
              width: '36px', 
              height: '36px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              cursor: 'pointer',
              color: 'white'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div style={{ 
          display: 'flex', 
          background: 'var(--bg-secondary, #f8fafc)', 
          borderBottom: '1px solid var(--border)',
          padding: '0 1rem'
        }}>
          <button
            onClick={() => setActiveTab('settings')}
            style={{
              padding: '0.85rem 1.25rem',
              border: 'none',
              background: 'none',
              fontWeight: activeTab === 'settings' ? '800' : '600',
              color: activeTab === 'settings' ? '#059669' : 'var(--text-muted)',
              borderBottom: activeTab === 'settings' ? '3px solid #059669' : '3px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem'
            }}
          >
            <Server size={18} />
            {isAr ? 'مفاتيح الربط' : 'Connexion & Clés'}
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            style={{
              padding: '0.85rem 1.25rem',
              border: 'none',
              background: 'none',
              fontWeight: activeTab === 'sql' ? '800' : '600',
              color: activeTab === 'sql' ? '#059669' : 'var(--text-muted)',
              borderBottom: activeTab === 'sql' ? '3px solid #059669' : '3px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem'
            }}
          >
            <Terminal size={18} />
            {isAr ? 'مخطط SQL الجاهز' : 'Schéma SQL Supabase'}
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            style={{
              padding: '0.85rem 1.25rem',
              border: 'none',
              background: 'none',
              fontWeight: activeTab === 'guide' ? '800' : '600',
              color: activeTab === 'guide' ? '#059669' : 'var(--text-muted)',
              borderBottom: activeTab === 'guide' ? '3px solid #059669' : '3px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem'
            }}
          >
            <ShieldCheck size={18} />
            {isAr ? 'دليل الإعداد خطوة بخطوة' : 'Guide d\'installation'}
          </button>
        </div>

        {/* Tab Body */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
          
          {/* TAB 1: SETTINGS & KEYS */}
          {activeTab === 'settings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{
                background: 'var(--bg-secondary, #f8fafc)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '1rem',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)'
              }}>
                {isAr ? (
                  <p style={{ margin: 0, lineHeight: 1.6 }}>
                    يمكنك ربط تطبيق <strong>Mag Vitrine</strong> بمشروعك في <strong>Supabase</strong> مباشرة. يتم تخزين البيانات بشكل دائم وسحابي فوري. إن لم تكن المفاتيح متوفرة، سيعمل التطبيق بالنمط المحلي التلقائي دون أي توقف.
                  </p>
                ) : (
                  <p style={{ margin: 0, lineHeight: 1.6 }}>
                    Connectez <strong>Mag Vitrine</strong> directement à votre backend <strong>Supabase</strong>. Les données seront synchronisées en temps réel sur PostgreSQL. En l'absence de clés, l'application continue de fonctionner en stockage local sécurisé.
                  </p>
                )}
              </div>

              {/* URL input */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '700', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                  <Globe size={16} color="#059669" />
                  {isAr ? 'رابط المشروع (Supabase Project URL)' : 'URL du Projet Supabase'}
                </label>
                <input
                  type="text"
                  placeholder="https://xyzabcdefghijklm.supabase.co"
                  value={config.url}
                  onChange={(e) => setConfig(prev => ({ ...prev, url: e.target.value }))}
                  dir="ltr"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--input-bg, #ffffff)',
                    color: 'var(--text)',
                    fontSize: '0.9rem',
                    fontFamily: 'monospace'
                  }}
                />
              </div>

              {/* Anon Key input */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '700', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                  <Key size={16} color="#059669" />
                  {isAr ? 'المفتاح العام المجهول (anon public key)' : 'Clé API publique (anon public key)'}
                </label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={config.key}
                  onChange={(e) => setConfig(prev => ({ ...prev, key: e.target.value }))}
                  dir="ltr"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--input-bg, #ffffff)',
                    color: 'var(--text)',
                    fontSize: '0.9rem',
                    fontFamily: 'monospace'
                  }}
                />
              </div>

              {/* Test / Status Feedback */}
              {testResult && (
                <div style={{
                  padding: '0.85rem 1rem',
                  borderRadius: '10px',
                  background: testResult.ok ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  border: `1px solid ${testResult.ok ? '#10b981' : '#ef4444'}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  fontSize: '0.85rem',
                  color: testResult.ok ? '#065f46' : '#991b1b'
                }}>
                  {testResult.ok ? <CheckCircle2 size={18} color="#10b981" /> : <AlertCircle size={18} color="#ef4444" />}
                  <div>
                    <div style={{ fontWeight: '700' }}>{testResult.message}</div>
                    {testResult.warning && (
                      <div style={{ fontSize: '0.78rem', marginTop: '0.2rem', color: '#b45309' }}>
                        ⚠️ {testResult.warning}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testing || !config.url || !config.key}
                  style={{
                    padding: '0.75rem 1.25rem',
                    borderRadius: '8px',
                    border: '1px solid #10b981',
                    background: 'transparent',
                    color: '#059669',
                    fontWeight: '800',
                    cursor: testing || !config.url || !config.key ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.85rem',
                    opacity: testing || !config.url || !config.key ? 0.6 : 1
                  }}
                >
                  <RefreshCw size={16} className={testing ? 'spin-anim' : ''} />
                  {testing 
                    ? (isAr ? 'جاري الفحص...' : 'Test en cours...') 
                    : (isAr ? 'اختبار الاتصال' : 'Tester la connexion')}
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!config.url || !config.key}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#059669',
                    color: 'white',
                    fontWeight: '800',
                    cursor: !config.url || !config.key ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.85rem',
                    opacity: !config.url || !config.key ? 0.6 : 1
                  }}
                >
                  <Check size={16} />
                  {isAr ? 'حفظ وتفعيل Supabase' : 'Enregistrer & Activer'}
                </button>

                {isConfigured && (
                  <button
                    type="button"
                    onClick={handleReset}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      background: 'none',
                      color: 'var(--text-muted)',
                      fontWeight: '700',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    {isAr ? 'إلغاء الربط' : 'Déconnecter'}
                  </button>
                )}
              </div>

              {/* Data Sync Section */}
              <div style={{
                marginTop: '1rem',
                borderTop: '1px dashed var(--border)',
                paddingTop: '1.25rem'
              }}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <UploadCloud size={18} color="#0284c7" />
                  {isAr ? 'مزامنة البيانات المحلية إلى Supabase' : 'Synchroniser les données locales vers Supabase'}
                </h4>
                <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  {isAr 
                    ? 'رفع كافة المتاجر، المنتجات، والتقييمات الحالية مباشرة إلى قاعدة بيانات Supabase بنقرة واحدة.' 
                    : 'Transférez instantanément toutes les boutiques, annonces et avis actuels vers vos tables Supabase.'}
                </p>

                {syncResult && (
                  <div style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    background: syncResult.ok ? 'rgba(2, 132, 199, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    border: `1px solid ${syncResult.ok ? '#0284c7' : '#ef4444'}`,
                    fontSize: '0.82rem',
                    color: syncResult.ok ? '#0369a1' : '#b91c1c',
                    marginBottom: '0.75rem'
                  }}>
                    {syncResult.message}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleSyncToSupabase}
                  disabled={syncing || !isConfigured}
                  style={{
                    padding: '0.75rem 1.25rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#0284c7',
                    color: 'white',
                    fontWeight: '800',
                    cursor: syncing || !isConfigured ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.85rem',
                    opacity: syncing || !isConfigured ? 0.6 : 1
                  }}
                >
                  <UploadCloud size={16} className={syncing ? 'spin-anim' : ''} />
                  {syncing 
                    ? (isAr ? 'جاري رفع البيانات...' : 'Synchronisation en cours...') 
                    : (isAr ? 'مزامنة فورية (1-Click Sync)' : 'Synchroniser maintenant')}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: SQL SCHEMA */}
          {activeTab === 'sql' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {isAr 
                    ? 'انسخ هذا الكود والصقه في نافذة SQL Editor داخل لوحة تحكم Supabase واضغط على Run:' 
                    : 'Copiez ce script et collez-le dans le SQL Editor de Supabase puis cliquez sur Run :'}
                </p>
                <button
                  type="button"
                  onClick={copySql}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid #10b981',
                    background: copiedSql ? '#10b981' : 'transparent',
                    color: copiedSql ? 'white' : '#059669',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.8rem'
                  }}
                >
                  {copiedSql ? <Check size={16} /> : <Copy size={16} />}
                  {copiedSql 
                    ? (isAr ? 'تم النسخ!' : 'Copié !') 
                    : (isAr ? 'نسخ الكود بالكامل' : 'Copier le script SQL')}
                </button>
              </div>

              <pre 
                dir="ltr"
                style={{
                  background: '#0f172a',
                  color: '#38bdf8',
                  padding: '1.25rem',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  overflowX: 'auto',
                  maxHeight: '360px',
                  lineHeight: '1.5',
                  border: '1px solid #334155'
                }}
              >
                <code>{sqlSchemaCode}</code>
              </pre>
            </div>
          )}

          {/* TAB 3: STEP-BY-STEP GUIDE */}
          {activeTab === 'guide' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.88rem' }}>
              <div style={{
                background: 'var(--bg-secondary, #f8fafc)',
                padding: '1.25rem',
                borderRadius: '12px',
                border: '1px solid var(--border)'
              }}>
                <h4 style={{ margin: '0 0 0.75rem 0', color: '#059669', fontSize: '1rem' }}>
                  {isAr ? 'خطوات إنشاء وربط خادم Supabase مجاناً' : 'Comment créer votre backend Supabase gratuitement'}
                </h4>
                
                <ol style={{ margin: 0, paddingLeft: isAr ? 0 : '1.5rem', paddingRight: isAr ? '1.5rem' : 0, lineHeight: 1.8 }}>
                  <li>
                    <strong>{isAr ? 'إنشاء حساب ومروع جديد:' : 'Créer un projet :'}</strong>{' '}
                    {isAr ? 'توجه إلى ' : 'Rendez-vous sur '}{' '}
                    <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" style={{ color: '#059669', textDecoration: 'underline' }}>
                      supabase.com
                    </a>{' '}
                    {isAr ? 'وقم بإنشاء مشروع جديد مجاني باسم Mag Vitrine DZ.' : 'et créez un nouveau projet gratuit.'}
                  </li>
                  <li>
                    <strong>{isAr ? 'تشغيل مخطط الجداول:' : 'Exécuter le script SQL :'}</strong>{' '}
                    {isAr ? 'افتح قسم SQL Editor من القائمة الجانبية، انسخ المخطط من تبويب "مخطط SQL الجاهز" أعلاه، والصقه ثم اضغط Run.' : 'Ouvrez SQL Editor, collez le schéma de l\'onglet précédent et cliquez sur "Run".'}
                  </li>
                  <li>
                    <strong>{isAr ? 'نسخ مفاتيح الربط:' : 'Récupérer les clés :'}</strong>{' '}
                    {isAr ? 'اذهب إلى Project Settings ثم Data API (أو API Keys) وانسخ Project URL و anon public key.' : 'Allez dans Project Settings > API pour copier l\'URL du projet et la clé publique anon.'}
                  </li>
                  <li>
                    <strong>{isAr ? 'التفعيل الفوري:' : 'Activer l\'application :'}</strong>{' '}
                    {isAr ? 'الصق المفاتيح في تبويب "مفاتيح الربط" واضغط "حفظ وتفعيل Supabase". ستتم المزامنة تلقائياً.' : 'Collez les clés dans l\'onglet Connexion et cliquez sur "Enregistrer & Activer".'}
                  </li>
                </ol>
              </div>

              <div style={{
                background: 'rgba(16, 185, 129, 0.08)',
                padding: '1rem',
                borderRadius: '10px',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem'
              }}>
                <ExternalLink size={20} color="#059669" />
                <span>
                  {isAr 
                    ? 'لوحة تحكم المشرف العام مربوطة بالبريد المعتمد: mounirath@yahoo.fr' 
                    : 'Compte administrateur référent configuré : mounirath@yahoo.fr'}
                </span>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div style={{
          padding: '0.85rem 1.5rem',
          background: 'var(--bg-secondary, #f8fafc)',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {isConfigured ? '🟢 Supabase Online' : '🟠 Local Storage Active'}
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--card-bg, #ffffff)',
              color: 'var(--text)',
              fontWeight: '700',
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            {isAr ? 'إغلاق' : 'Fermer'}
          </button>
        </div>

      </div>
    </div>
  );
}
