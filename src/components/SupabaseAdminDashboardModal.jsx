import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  LayoutDashboard,
  Store,
  Package,
  ShoppingCart,
  ShieldCheck,
  Star,
  Users,
  Database,
  Search,
  Filter,
  RefreshCw,
  Download,
  UploadCloud,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Phone,
  MessageSquare,
  Award,
  ChevronRight,
  TrendingUp,
  Tag,
  Clock,
  MapPin,
  Trash2,
  Eye,
  Check,
  Copy,
  Zap,
  Sliders,
  DollarSign,
  Plus
} from 'lucide-react';
import { WILAYAS, CATEGORIES } from '../data/initialData';
import { isSupabaseConfigured, getSupabaseConfig } from '../lib/supabase';
import { adminApi, syncLocalDataToSupabase } from '../services/supabaseService';

export function SupabaseAdminDashboardModal({
  isOpen,
  onClose,
  stores = [],
  products = [],
  orders = [],
  storeReviews = [],
  customerRatings = [],
  users = [],
  currentUser,
  onUpdateStore,
  onDeleteStore,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrder,
  onDeleteOrder,
  onDeleteStoreReview,
  onDeleteCustomerRating,
  onRefreshFromSupabase,
  onOpenSupabaseConfig,
  lang = 'fr',
  t
}) {
  const isAr = lang === 'ar';

  // Sub-tabs: 'kpis', 'stores', 'products', 'orders', 'anti_retour', 'users', 'console'
  const [activeTab, setActiveTab] = useState('kpis');

  // Search & Filter states
  const [storeSearch, setStoreSearch] = useState('');
  const [storeStatusFilter, setStoreStatusFilter] = useState('all');
  const [storeWilayaFilter, setStoreWilayaFilter] = useState('all');

  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [productStoreFilter, setProductStoreFilter] = useState('all');

  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderWilayaFilter, setOrderWilayaFilter] = useState('all');

  const [reviewSearch, setReviewSearch] = useState('');
  const [antiRetourSearch, setAntiRetourSearch] = useState('');

  // UI status feedback
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [sqlCopied, setSqlCopied] = useState(false);

  // Selected Order for detail view modal
  const [inspectedOrder, setInspectedOrder] = useState(null);

  // Quick store edit modal state
  const [editingStore, setEditingStore] = useState(null);

  // Supabase live table stats
  const [remoteStats, setRemoteStats] = useState(null);
  const [remoteError, setRemoteError] = useState(null);

  const supabaseConfig = getSupabaseConfig();
  const configured = isSupabaseConfigured();

  // Show temporary toast message
  const triggerFeedback = (msg, type = 'success') => {
    setFeedbackMessage({ msg, type });
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  // Fetch live stats from Supabase if connected
  const fetchLiveRemoteStats = async () => {
    if (!configured) return;
    try {
      const res = await adminApi.getTableStats();
      if (res?.data) {
        setRemoteStats(res.data);
        setRemoteError(null);
      } else if (res?.error) {
        setRemoteError(res.error.message || 'Erreur requête Supabase');
      }
    } catch (e) {
      setRemoteError(e.message);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLiveRemoteStats();
    }
  }, [isOpen, configured]);

  if (!isOpen) return null;

  // 1. CALCULATE REAL-TIME KPIS
  const totalRevenue = orders.reduce((sum, o) => {
    const val = Number(o.total || 0);
    return isNaN(val) ? sum : sum + val;
  }, 0);

  const activeStoresCount = stores.filter(s => s.status !== 'suspended').length;
  const suspendedStoresCount = stores.filter(s => s.status === 'suspended').length;

  const deliveredOrdersCount = orders.filter(o => o.status === 'DELIVERED').length;
  const returnedOrdersCount = orders.filter(o => o.status === 'RETURNED').length;
  const pendingOrdersCount = orders.filter(o => o.status === 'NEW' || o.status === 'CONFIRMED' || o.status === 'PREPARING').length;
  const inDeliveryOrdersCount = orders.filter(o => o.status === 'SHIPPED').length;

  const totalDeliveredOrReturned = deliveredOrdersCount + returnedOrdersCount;
  const deliverySuccessRate = totalDeliveredOrReturned > 0 
    ? Math.round((deliveredOrdersCount / totalDeliveredOrReturned) * 100) 
    : 94;

  // Distribution of Stores & Orders by Wilaya
  const wilayaDistribution = useMemo(() => {
    const map = {};
    stores.forEach(s => {
      const w = s.wilaya || 'Alger';
      map[w] = (map[w] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [stores]);

  // 2. FILTERED LISTS
  const filteredStores = useMemo(() => {
    return stores.filter(s => {
      const matchSearch = !storeSearch || 
        s.name.toLowerCase().includes(storeSearch.toLowerCase()) ||
        (s.managerName && s.managerName.toLowerCase().includes(storeSearch.toLowerCase())) ||
        (s.phone && s.phone.includes(storeSearch)) ||
        (s.wilaya && s.wilaya.toLowerCase().includes(storeSearch.toLowerCase()));
      const matchStatus = storeStatusFilter === 'all' || (s.status || 'active') === storeStatusFilter;
      const matchWilaya = storeWilayaFilter === 'all' || s.wilaya === storeWilayaFilter;
      return matchSearch && matchStatus && matchWilaya;
    });
  }, [stores, storeSearch, storeStatusFilter, storeWilayaFilter]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = !productSearch ||
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        (p.brand && p.brand.toLowerCase().includes(productSearch.toLowerCase())) ||
        (p.description && p.description.toLowerCase().includes(productSearch.toLowerCase()));
      const matchCat = productCategoryFilter === 'all' || p.categoryId === productCategoryFilter;
      const matchStore = productStoreFilter === 'all' || p.storeId === productStoreFilter;
      return matchSearch && matchCat && matchStore;
    });
  }, [products, productSearch, productCategoryFilter, productStoreFilter]);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchSearch = !orderSearch ||
        (o.id && o.id.toLowerCase().includes(orderSearch.toLowerCase())) ||
        (o.customerName && o.customerName.toLowerCase().includes(orderSearch.toLowerCase())) ||
        (o.customerPhone && o.customerPhone.includes(orderSearch)) ||
        (o.storeName && o.storeName.toLowerCase().includes(orderSearch.toLowerCase()));
      const matchStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
      const matchWilaya = orderWilayaFilter === 'all' || o.wilaya === orderWilayaFilter;
      return matchSearch && matchStatus && matchWilaya;
    });
  }, [orders, orderSearch, orderStatusFilter, orderWilayaFilter]);

  const filteredReviews = useMemo(() => {
    return storeReviews.filter(r => {
      if (!reviewSearch) return true;
      const s = reviewSearch.toLowerCase();
      return (r.customerName && r.customerName.toLowerCase().includes(s)) ||
             (r.comment && r.comment.toLowerCase().includes(s)) ||
             (r.storeId && r.storeId.toLowerCase().includes(s));
    });
  }, [storeReviews, reviewSearch]);

  const filteredRatings = useMemo(() => {
    return customerRatings.filter(c => {
      if (!antiRetourSearch) return true;
      const s = antiRetourSearch.toLowerCase();
      return (c.customerName && c.customerName.toLowerCase().includes(s)) ||
             (c.customerPhone && c.customerPhone.includes(s)) ||
             (c.storeName && c.storeName.toLowerCase().includes(s)) ||
             (c.reason && c.reason.toLowerCase().includes(s));
    });
  }, [customerRatings, antiRetourSearch]);

  // REFRESH ACTION
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (onRefreshFromSupabase) {
        const res = await onRefreshFromSupabase();
        if (res?.success) {
          triggerFeedback(
            isAr
              ? `تم تحديث البيانات بنجاح من خادم Supabase (${res.counts?.products || 0} منتج، ${res.counts?.stores || 0} متجر، ${res.counts?.orders || 0} طلب)`
              : `Données rafraîchies depuis Supabase (${res.counts?.products || 0} prod, ${res.counts?.stores || 0} magasins, ${res.counts?.orders || 0} commandes)`
          );
        } else {
          triggerFeedback(res?.message || 'Synchronisation locale active', 'info');
        }
      }
      await fetchLiveRemoteStats();
    } catch (err) {
      triggerFeedback(err.message, 'error');
    } finally {
      setIsRefreshing(false);
    }
  };

  // SYNC ACTION
  const handleBulkSync = async () => {
    if (!configured) {
      triggerFeedback(
        isAr ? 'يرجى ربط مفاتيح Supabase أولاً عبر زر الإعدادات' : 'Configurez d\'abord vos clés Supabase dans les paramètres',
        'error'
      );
      return;
    }
    setIsSyncing(true);
    try {
      const res = await syncLocalDataToSupabase({
        stores,
        products,
        storeReviews,
        customerRatings
      });
      triggerFeedback(
        isAr
          ? `تم رفع ومزامنة ${res.stores} متجر، ${res.products} منتج، ${res.storeReviews} تقييم إلى Supabase Cloud بنجاح!`
          : `Synchronisation réussie : ${res.stores} vitrines, ${res.products} produits et ${res.storeReviews} avis injectés dans Supabase !`
      );
      await fetchLiveRemoteStats();
    } catch (err) {
      triggerFeedback(err.message, 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  // EXPORT JSON DATA
  const handleExportData = () => {
    const backupData = {
      exportTimestamp: new Date().toISOString(),
      platform: 'MAG VITRINE ALGERIE',
      environment: configured ? 'supabase_cloud' : 'local_storage',
      stats: {
        storesCount: stores.length,
        productsCount: products.length,
        ordersCount: orders.length,
        totalRevenueDzd: totalRevenue
      },
      stores,
      products,
      orders,
      storeReviews,
      customerRatings
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `mag_vitrine_admin_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    triggerFeedback(
      isAr ? 'تم تصدير ملف النسخة الاحتياطية JSON بنجاح' : 'Exportation complète JSON téléchargée'
    );
  };

  // QUICK UPDATE STORE STATUS
  const handleToggleStoreStatus = (storeId, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    onUpdateStore(storeId, { status: nextStatus });
    triggerFeedback(
      isAr 
        ? `تم ${nextStatus === 'active' ? 'تفعيل' : 'تجميد'} المتجر بنجاح` 
        : `Statut de la boutique modifié : ${nextStatus.toUpperCase()}`
    );
  };

  // ASSIGN BADGE TO STORE
  const handleSetStoreBadge = (storeId, badge) => {
    onUpdateStore(storeId, { badge });
    triggerFeedback(isAr ? `تم تحديث وسام المتجر إلى: ${badge}` : `Badge mis à jour : ${badge}`);
  };

  // QUICK UPDATE ORDER STATUS
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    onUpdateOrder(orderId, { status: newStatus });
    triggerFeedback(
      isAr ? `تم تغيير حالة الطلبية إلى: ${newStatus}` : `Statut commande mis à jour : ${newStatus}`
    );
  };

  // COPY SQL
  const handleCopySql = () => {
    const sqlText = `-- MAG VITRINE ALGÉRIE - QUICK REPAIR SCRIPT FOR SUPABASE
CREATE TABLE IF NOT EXISTS public.stores (id TEXT PRIMARY KEY, name TEXT, phone TEXT, wilaya TEXT, status TEXT DEFAULT 'active');
CREATE TABLE IF NOT EXISTS public.products (id TEXT PRIMARY KEY, store_id TEXT, name TEXT, price NUMERIC, status TEXT DEFAULT 'ACTIVE');
CREATE TABLE IF NOT EXISTS public.orders (id TEXT PRIMARY KEY, store_name TEXT, customer_name TEXT, total NUMERIC, status TEXT DEFAULT 'NEW');
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read stores" ON public.stores FOR SELECT USING (true);
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public orders" ON public.orders FOR ALL USING (true);`;
    navigator.clipboard.writeText(sqlText);
    setSqlCopied(true);
    setTimeout(() => setSqlCopied(false), 3000);
    triggerFeedback(isAr ? 'تم نسخ استعلام SQL السريع للحافظة' : 'Requête SQL copiée dans le presse-papiers');
  };

  const getOrderStatusBadge = (status) => {
    switch (status) {
      case 'DELIVERED':
        return { label: isAr ? 'تم التسليم بنجاح 🟢' : 'Livrée 🟢', bg: '#dcfce7', color: '#166534' };
      case 'SHIPPED':
        return { label: isAr ? 'مع شركة التوصيل 🚚' : 'Expédiée 🚚', bg: '#e0e7ff', color: '#3730a3' };
      case 'PREPARING':
        return { label: isAr ? 'قيد التجهيز 🟣' : 'En préparation 🟣', bg: '#f3e8ff', color: '#6b21a8' };
      case 'CONFIRMED':
        return { label: isAr ? 'مؤكدة هاتفياً 🔵' : 'Confirmée 🔵', bg: '#dbeafe', color: '#1e40af' };
      case 'RETURNED':
        return { label: isAr ? 'مرتجع طرد 🔴' : 'Colis Retourné 🔴', bg: '#fee2e2', color: '#991b1b' };
      case 'CANCELLED':
        return { label: isAr ? 'ملغاة ⚪' : 'Annulée ⚪', bg: '#f1f5f9', color: '#475569' };
      case 'NEW':
      default:
        return { label: isAr ? 'جديدة (بانتظار المعالجة) 🟡' : 'Nouvelle 🟡', bg: '#fef3c7', color: '#92400e' };
    }
  };

  return (
    <div className="modal-backdrop" style={{ padding: '0.5rem', zIndex: 3500 }}>
      <div
        className="modal-content"
        style={{
          maxWidth: '1100px',
          width: '98%',
          height: '94vh',
          maxHeight: '94vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          borderRadius: '24px',
          overflow: 'hidden',
          border: '1.5px solid rgba(16, 185, 129, 0.4)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.45)',
          background: 'var(--surface)'
        }}
      >
        {/* ============================================================== */}
        {/* 1. TOP ADMIN HEADER WITH SUPABASE STATUS & QUICK ACTIONS      */}
        {/* ============================================================== */}
        <div
          style={{
            background: 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)',
            color: '#ffffff',
            padding: '1.1rem 1.4rem',
            borderBottom: '1px solid rgba(16, 185, 129, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1.5px solid rgba(52, 211, 153, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ShieldCheck size={26} color="#34d399" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '900', letterSpacing: '-0.3px', color: '#ffffff' }}>
                  {isAr ? 'لوحة تحكم المشرف الأعلى (Super-Admin Supabase)' : 'Console Super-Admin Supabase'}
                </h2>
                <span
                  style={{
                    background: '#10b981',
                    color: '#064e3b',
                    fontSize: '0.65rem',
                    fontWeight: '900',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '9999px',
                    textTransform: 'uppercase'
                  }}
                >
                  LIVE DZ 58
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#a7f3d0', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.15rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Database size={13} color="#34d399" />
                  <span>
                    {configured
                      ? `Supabase Cloud Connecté (${supabaseConfig.url.slice(8, 28)}...)`
                      : (isAr ? 'نمط هجين محلي (جاهز للربط مع Supabase)' : 'Mode Hybride Local (Prêt pour Supabase)')}
                  </span>
                </span>
                <span>•</span>
                <span>{currentUser ? `${currentUser.name} (${currentUser.role || 'admin'})` : 'Admin Root'}</span>
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {/* Refresh */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              style={{
                background: 'rgba(255,255,255,0.12)',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: '10px',
                padding: '0.45rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
              title={isAr ? 'تحديث البيانات من Supabase' : 'Actualiser depuis Supabase'}
            >
              <RefreshCw size={14} className={isRefreshing ? 'spin-anim' : ''} />
              <span>{isAr ? 'تحديث' : 'Rafraîchir'}</span>
            </button>

            {/* Sync Bulk */}
            <button
              onClick={handleBulkSync}
              disabled={isSyncing}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '0.45rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
              }}
              title={isAr ? 'مزامنة ورفع جميع البيانات لـ Supabase' : 'Pousser les données locales vers Supabase'}
            >
              <UploadCloud size={14} className={isSyncing ? 'spin-anim' : ''} />
              <span>{isAr ? 'مزامنة سحابية' : 'Sync Supabase'}</span>
            </button>

            {/* Export JSON */}
            <button
              onClick={handleExportData}
              style={{
                background: 'rgba(255,255,255,0.12)',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: '10px',
                padding: '0.45rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
              title={isAr ? 'تصدير نسخة احتياطية' : 'Exporter les données (JSON)'}
            >
              <Download size={14} />
              <span>{isAr ? 'تصدير' : 'Export'}</span>
            </button>

            {/* Config Clés */}
            {onOpenSupabaseConfig && (
              <button
                onClick={onOpenSupabaseConfig}
                style={{
                  background: 'rgba(52, 211, 153, 0.2)',
                  color: '#a7f3d0',
                  border: '1px solid rgba(52, 211, 153, 0.4)',
                  borderRadius: '10px',
                  padding: '0.45rem 0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <Sliders size={14} />
                <span>{isAr ? 'مفاتيح API' : 'Clés Supabase'}</span>
              </button>
            )}

            {/* Close */}
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                color: '#ffffff',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                marginLeft: '0.25rem'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* FEEDBACK TOAST BANNER */}
        {feedbackMessage && (
          <div
            style={{
              padding: '0.65rem 1.25rem',
              background: feedbackMessage.type === 'error' ? '#fee2e2' : '#dcfce7',
              color: feedbackMessage.type === 'error' ? '#991b1b' : '#166534',
              fontSize: '0.82rem',
              fontWeight: '800',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(0,0,0,0.05)',
              animation: 'slideDown 0.2s ease-out'
            }}
          >
            <span>{feedbackMessage.msg}</span>
            <button
              onClick={() => setFeedbackMessage(null)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: '900' }}
            >
              ×
            </button>
          </div>
        )}

        {/* ============================================================== */}
        {/* 2. SUB-NAVIGATION TABS                                          */}
        {/* ============================================================== */}
        <div
          style={{
            display: 'flex',
            background: 'var(--surface-alt)',
            borderBottom: '1px solid var(--border-light)',
            overflowX: 'auto',
            padding: '0 0.75rem',
            gap: '0.25rem',
            flexShrink: 0
          }}
        >
          {[
            { id: 'kpis', labelAr: 'الإحصائيات والأرقام', labelFr: 'Vue d\'Ensemble', icon: TrendingUp },
            { id: 'stores', labelAr: `المتاجر (${stores.length})`, labelFr: `Vitrines (${stores.length})`, icon: Store },
            { id: 'products', labelAr: `المنتجات (${products.length})`, labelFr: `Articles (${products.length})`, icon: Package },
            { id: 'orders', labelAr: `الطلبيات (${orders.length})`, labelFr: `Commandes (${orders.length})`, icon: ShoppingCart },
            { id: 'anti_retour', labelAr: `مؤشر الجدية ومكافحة الرفض (${customerRatings.length})`, labelFr: `Anti-Retour DZ (${customerRatings.length})`, icon: Award },
            { id: 'reviews', labelAr: `تقييمات المتاجر (${storeReviews.length})`, labelFr: `Avis Magasins (${storeReviews.length})`, icon: Star },
            { id: 'users', labelAr: `المستخدمين (${users.length})`, labelFr: `Profils (${users.length})`, icon: Users },
            { id: 'console', labelAr: 'مخطط وقواعد Supabase SQL', labelFr: 'Console Supabase SQL', icon: Database }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.85rem 1rem',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: isActive ? '3px solid #059669' : '3px solid transparent',
                  color: isActive ? '#059669' : 'var(--text-muted)',
                  fontWeight: isActive ? '900' : '700',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={16} color={isActive ? '#059669' : 'currentColor'} />
                <span>{isAr ? tab.labelAr : tab.labelFr}</span>
              </button>
            );
          })}
        </div>

        {/* ============================================================== */}
        {/* 3. TAB CONTENTS (SCROLLABLE BODY)                              */}
        {/* ============================================================== */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', background: 'var(--bg-app)' }}>
          {/* ------------------------------------------------------------ */}
          {/* TAB 1: KPIS & OVERVIEW                                       */}
          {/* ------------------------------------------------------------ */}
          {activeTab === 'kpis' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* TOP METRIC CARDS */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '0.85rem'
                }}
              >
                {/* 1. Chiffre d'Affaires */}
                <div style={{ background: 'var(--surface)', padding: '1.1rem', borderRadius: '18px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-card)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)' }}>
                      {isAr ? 'إجمالي المعاملات' : 'Chiffre d\'Affaires Total'}
                    </span>
                    <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <TrendingUp size={16} color="#059669" />
                    </div>
                  </div>
                  <div style={{ fontSize: '1.45rem', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
                    {totalRevenue.toLocaleString()} <span style={{ fontSize: '0.85rem', color: 'var(--orange-action)' }}>{isAr ? 'دج' : 'DZD'}</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: '700', marginTop: '0.25rem' }}>
                    {isAr ? `من ${orders.length} طلبية مسجلة في 58 ولاية` : `Sur ${orders.length} commandes enregistrées`}
                  </div>
                </div>

                {/* 2. Magasins */}
                <div style={{ background: 'var(--surface)', padding: '1.1rem', borderRadius: '18px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-card)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)' }}>
                      {isAr ? 'المتاجر والفترينات' : 'Vitrines Commerçants'}
                    </span>
                    <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(249, 115, 22, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Store size={16} color="var(--orange-action)" />
                    </div>
                  </div>
                  <div style={{ fontSize: '1.45rem', fontWeight: '900', color: 'var(--text-main)' }}>
                    {stores.length}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700', marginTop: '0.25rem' }}>
                    <span style={{ color: '#059669' }}>{activeStoresCount} {isAr ? 'نشط' : 'actives'}</span> • <span style={{ color: '#dc2626' }}>{suspendedStoresCount} {isAr ? 'مجمد' : 'suspendues'}</span>
                  </div>
                </div>

                {/* 3. Produits */}
                <div style={{ background: 'var(--surface)', padding: '1.1rem', borderRadius: '18px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-card)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)' }}>
                      {isAr ? 'السلع والإعلانات' : 'Catalogue Produits'}
                    </span>
                    <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Package size={16} color="#2563eb" />
                    </div>
                  </div>
                  <div style={{ fontSize: '1.45rem', fontWeight: '900', color: 'var(--text-main)' }}>
                    {products.length}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: '700', marginTop: '0.25rem' }}>
                    {products.filter(p => p.isPromotion).length} {isAr ? 'عروض ترويجية وتخفيضات' : 'en promotion spéciale'}
                  </div>
                </div>

                {/* 4. Taux de Livraison & Anti-retour */}
                <div style={{ background: 'var(--surface)', padding: '1.1rem', borderRadius: '18px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-card)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)' }}>
                      {isAr ? 'معدل نجاح التوصيل' : 'Taux de Livraison (DZ)'}
                    </span>
                    <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ShieldCheck size={16} color="#059669" />
                    </div>
                  </div>
                  <div style={{ fontSize: '1.45rem', fontWeight: '900', color: '#059669' }}>
                    {deliverySuccessRate}%
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '700', marginTop: '0.25rem' }}>
                    {deliveredOrdersCount} {isAr ? 'طرد مستلم' : 'livrés'} • {returnedOrdersCount} {isAr ? 'مرتجع' : 'retours'}
                  </div>
                </div>
              </div>

              {/* SECOND ROW: SUPABASE REALTIME HEALTH & TOP WILAYAS */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
                {/* Supabase Status Card */}
                <div style={{ background: 'var(--surface)', padding: '1.25rem', borderRadius: '20px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-card)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Database size={18} color="#059669" />
                      <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '800' }}>
                        {isAr ? 'حالة قاعدة بيانات Supabase (PostgreSQL)' : 'Statut Supabase PostgreSQL'}
                      </h3>
                    </div>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: '800',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '9999px',
                        background: configured ? '#dcfce7' : '#fef3c7',
                        color: configured ? '#166534' : '#92400e'
                      }}
                    >
                      {configured ? (isAr ? 'متصل سحابياً' : 'Connecté Cloud') : (isAr ? 'وضع محلي' : 'Local Hybrid')}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 0.85rem' }}>
                    {configured
                      ? (isAr ? 'النظام متزامن في الوقت الحقيقي مع مشروعك في Supabase.' : 'Votre application est branchée directement sur votre instance Supabase.')
                      : (isAr ? 'يمكنك ربط مفاتيح Supabase الخاصة بك عبر زر "مفاتيح API" لتفعيل التزامن السحابي الحقيقي.' : 'Connectez vos clés Supabase API pour synchroniser la base cloud en direct.')}
                  </p>

                  {/* Remote counts summary */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', background: 'var(--surface-alt)', padding: '0.75rem', borderRadius: '12px' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: '900', color: 'var(--text-main)' }}>
                        {remoteStats ? remoteStats.stores : stores.length}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>stores</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: '900', color: 'var(--text-main)' }}>
                        {remoteStats ? remoteStats.products : products.length}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>products</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: '900', color: 'var(--text-main)' }}>
                        {remoteStats ? remoteStats.orders : orders.length}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>orders</div>
                    </div>
                  </div>

                  {remoteError && (
                    <div style={{ marginTop: '0.75rem', padding: '0.5rem', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', fontSize: '0.72rem' }}>
                      {remoteError}
                    </div>
                  )}
                </div>

                {/* Wilaya Distribution Card */}
                <div style={{ background: 'var(--surface)', padding: '1.25rem', borderRadius: '20px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-card)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MapPin size={18} color="var(--orange-action)" />
                      <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '800' }}>
                        {isAr ? 'أعلى الولايات نشاطاً للمتاجر' : 'Top Wilayas Magasins (DZ)'}
                      </h3>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>58 Wilayas</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {wilayaDistribution.map(([wilayaName, count]) => {
                      const percent = Math.min(100, Math.round((count / stores.length) * 100));
                      return (
                        <div key={wilayaName}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: '700', marginBottom: '0.2rem' }}>
                            <span>{wilayaName}</span>
                            <span>{count} {isAr ? 'متاجر' : 'magasins'} ({percent}%)</span>
                          </div>
                          <div style={{ width: '100%', height: '8px', background: 'var(--surface-alt)', borderRadius: '9999px', overflow: 'hidden' }}>
                            <div style={{ width: `${percent}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #059669)', borderRadius: '9999px' }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* RECENT ORDERS TABLE SNIPPET */}
              <div style={{ background: 'var(--surface)', padding: '1.25rem', borderRadius: '20px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-card)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                  <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <ShoppingCart size={17} color="var(--orange-action)" />
                    <span>{isAr ? 'آخر الطلبيات الواردة (مباشر)' : 'Dernières Commandes Récentes'}</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    style={{ background: 'transparent', border: 'none', color: '#059669', fontSize: '0.78rem', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    <span>{isAr ? 'عرض الكل' : 'Voir tout'}</span>
                    <ChevronRight size={14} />
                  </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isAr ? 'right' : 'left', fontSize: '0.8rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1.5px solid var(--border-light)', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '0.5rem' }}>ID</th>
                        <th style={{ padding: '0.5rem' }}>{isAr ? 'الزبون' : 'Client'}</th>
                        <th style={{ padding: '0.5rem' }}>{isAr ? 'الولاية' : 'Wilaya'}</th>
                        <th style={{ padding: '0.5rem' }}>{isAr ? 'المتجر' : 'Boutique'}</th>
                        <th style={{ padding: '0.5rem' }}>{isAr ? 'المبلغ' : 'Montant'}</th>
                        <th style={{ padding: '0.5rem' }}>{isAr ? 'الحالة' : 'Statut'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map(o => {
                        const stBadge = getOrderStatusBadge(o.status);
                        return (
                          <tr key={o.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                            <td style={{ padding: '0.55rem', fontWeight: '800', color: 'var(--text-main)' }}>{o.id}</td>
                            <td style={{ padding: '0.55rem' }}>{o.customerName}</td>
                            <td style={{ padding: '0.55rem' }}>{o.wilaya}</td>
                            <td style={{ padding: '0.55rem', color: 'var(--text-muted)' }}>{o.storeName}</td>
                            <td style={{ padding: '0.55rem', fontWeight: '800', color: 'var(--orange-action)' }}>{Number(o.total || 0).toLocaleString()} DZD</td>
                            <td style={{ padding: '0.55rem' }}>
                              <span style={{ background: stBadge.bg, color: stBadge.color, padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '800' }}>
                                {stBadge.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* TAB 2: STORES MANAGEMENT (`stores`)                          */}
          {/* ------------------------------------------------------------ */}
          {activeTab === 'stores' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* FILTERS BAR */}
              <div
                style={{
                  background: 'var(--surface)',
                  padding: '0.85rem',
                  borderRadius: '16px',
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  gap: '0.65rem',
                  flexWrap: 'wrap',
                  alignItems: 'center'
                }}
              >
                <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                  <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', [isAr ? 'right' : 'left']: '10px' }} />
                  <input
                    type="text"
                    value={storeSearch}
                    onChange={(e) => setStoreSearch(e.target.value)}
                    placeholder={isAr ? 'بحث بالاسم، المدير، الهاتف، الولاية...' : 'Recherche nom, gérant, téléphone, wilaya...'}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      paddingLeft: isAr ? '0.75rem' : '2rem',
                      paddingRight: isAr ? '2rem' : '0.75rem',
                      borderRadius: '10px',
                      border: '1px solid var(--border-light)',
                      background: 'var(--surface-alt)',
                      color: 'var(--text-main)',
                      fontSize: '0.82rem'
                    }}
                  />
                </div>

                <select
                  value={storeStatusFilter}
                  onChange={(e) => setStoreStatusFilter(e.target.value)}
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: '10px',
                    border: '1px solid var(--border-light)',
                    background: 'var(--surface-alt)',
                    color: 'var(--text-main)',
                    fontSize: '0.82rem',
                    fontWeight: '700'
                  }}
                >
                  <option value="all">{isAr ? 'كافة الحالات' : 'Tous les statuts'}</option>
                  <option value="active">{isAr ? 'نشط فقط' : 'Actives'}</option>
                  <option value="suspended">{isAr ? 'مجمد / معلق' : 'Suspendues'}</option>
                </select>

                <select
                  value={storeWilayaFilter}
                  onChange={(e) => setStoreWilayaFilter(e.target.value)}
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: '10px',
                    border: '1px solid var(--border-light)',
                    background: 'var(--surface-alt)',
                    color: 'var(--text-main)',
                    fontSize: '0.82rem',
                    fontWeight: '700'
                  }}
                >
                  <option value="all">{isAr ? 'كافة الولايات' : 'Toutes les Wilayas'}</option>
                  {WILAYAS.map(w => (
                    <option key={w.code} value={w.name}>{w.code} - {w.name}</option>
                  ))}
                </select>
              </div>

              {/* STORES TABLE */}
              <div style={{ background: 'var(--surface)', borderRadius: '18px', border: '1px solid var(--border-light)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isAr ? 'right' : 'left', fontSize: '0.82rem' }}>
                    <thead>
                      <tr style={{ background: 'var(--surface-alt)', borderBottom: '1.5px solid var(--border-light)', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '0.75rem 1rem' }}>{isAr ? 'المتجر واللوغو' : 'Boutique & Logo'}</th>
                        <th style={{ padding: '0.75rem 1rem' }}>{isAr ? 'المدير والتواصل' : 'Gérant & Contact'}</th>
                        <th style={{ padding: '0.75rem 1rem' }}>{isAr ? 'الموقع' : 'Localisation'}</th>
                        <th style={{ padding: '0.75rem 1rem' }}>{isAr ? 'الوسام' : 'Badge'}</th>
                        <th style={{ padding: '0.75rem 1rem' }}>{isAr ? 'الحالة' : 'Statut'}</th>
                        <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>{isAr ? 'إجراءات المشرف' : 'Actions Admin'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStores.map(s => {
                        const isSuspended = s.status === 'suspended';
                        return (
                          <tr key={s.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                            <td style={{ padding: '0.75rem 1rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                <img
                                  src={s.logo || 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=100'}
                                  alt={s.name}
                                  style={{ width: '38px', height: '38px', borderRadius: '10px', objectFit: 'cover', border: '1px solid var(--border-light)' }}
                                />
                                <div>
                                  <div style={{ fontWeight: '800', color: 'var(--text-main)' }}>{s.name}</div>
                                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ID: {s.id}</div>
                                </div>
                              </div>
                            </td>

                            <td style={{ padding: '0.75rem 1rem' }}>
                              <div style={{ fontWeight: '700' }}>{s.managerName || 'Gérant'}</div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Phone size={12} />
                                <span>{s.phone}</span>
                              </div>
                            </td>

                            <td style={{ padding: '0.75rem 1rem' }}>
                              <span style={{ fontWeight: '700' }}>{s.wilaya}</span>
                              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{s.commune || s.address}</div>
                            </td>

                            <td style={{ padding: '0.75rem 1rem' }}>
                              <select
                                value={s.badge || 'Vérifié'}
                                onChange={(e) => handleSetStoreBadge(s.id, e.target.value)}
                                style={{
                                  background: 'var(--surface-alt)',
                                  border: '1px solid var(--border-light)',
                                  color: 'var(--text-main)',
                                  borderRadius: '6px',
                                  padding: '0.2rem 0.4rem',
                                  fontSize: '0.72rem',
                                  fontWeight: '800'
                                }}
                              >
                                <option value="Vérifié">Vérifié ✓</option>
                                <option value="Boutique Officielle">Boutique Officielle ⭐</option>
                                <option value="Top Vendeur DZ">Top Vendeur DZ 🔥</option>
                                <option value="Partenaire Certifié">Partenaire Certifié 🛡️</option>
                              </select>
                            </td>

                            <td style={{ padding: '0.75rem 1rem' }}>
                              <span
                                style={{
                                  background: isSuspended ? '#fee2e2' : '#dcfce7',
                                  color: isSuspended ? '#991b1b' : '#166534',
                                  padding: '0.2rem 0.55rem',
                                  borderRadius: '9999px',
                                  fontSize: '0.72rem',
                                  fontWeight: '800'
                                }}
                              >
                                {isSuspended ? (isAr ? 'مجمد ❌' : 'Suspendue') : (isAr ? 'نشط ✓' : 'Active')}
                              </span>
                            </td>

                            <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                                {/* Toggle Active/Suspended */}
                                <button
                                  onClick={() => handleToggleStoreStatus(s.id, s.status || 'active')}
                                  style={{
                                    background: isSuspended ? '#dcfce7' : '#fee2e2',
                                    color: isSuspended ? '#166534' : '#991b1b',
                                    border: 'none',
                                    padding: '0.35rem 0.6rem',
                                    borderRadius: '8px',
                                    fontSize: '0.72rem',
                                    fontWeight: '800',
                                    cursor: 'pointer'
                                  }}
                                  title={isSuspended ? 'Réactiver la boutique' : 'Suspendre la boutique'}
                                >
                                  {isSuspended ? (isAr ? 'تنشيط' : 'Activer') : (isAr ? 'تجميد' : 'Suspendre')}
                                </button>

                                {/* WhatsApp direct */}
                                {s.whatsapp && (
                                  <a
                                    href={`https://wa.me/213${s.whatsapp.replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                      background: '#25D366',
                                      color: '#ffffff',
                                      padding: '0.35rem',
                                      borderRadius: '8px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      textDecoration: 'none'
                                    }}
                                    title="WhatsApp Gérant"
                                  >
                                    <MessageSquare size={14} />
                                  </a>
                                )}

                                {/* Delete Store */}
                                <button
                                  onClick={() => {
                                    if (window.confirm(isAr ? `هل أنت متأكد من حذف المتجر "${s.name}" نهائياً من Supabase؟` : `Supprimer définitivement la boutique "${s.name}" ?`)) {
                                      onDeleteStore(s.id);
                                      triggerFeedback(isAr ? 'تم حذف المتجر' : 'Boutique supprimée');
                                    }
                                  }}
                                  style={{
                                    background: 'transparent',
                                    color: '#dc2626',
                                    border: '1px solid #fca5a5',
                                    padding: '0.35rem',
                                    borderRadius: '8px',
                                    cursor: 'pointer'
                                  }}
                                  title="Supprimer"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* TAB 3: PRODUCTS CATALOG (`products`)                         */}
          {/* ------------------------------------------------------------ */}
          {activeTab === 'products' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* FILTERS */}
              <div
                style={{
                  background: 'var(--surface)',
                  padding: '0.85rem',
                  borderRadius: '16px',
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  gap: '0.65rem',
                  flexWrap: 'wrap',
                  alignItems: 'center'
                }}
              >
                <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                  <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', [isAr ? 'right' : 'left']: '10px' }} />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder={isAr ? 'بحث في المنتجات، الماركة، الوصف...' : 'Recherche article, marque, caractéristiques...'}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      paddingLeft: isAr ? '0.75rem' : '2rem',
                      paddingRight: isAr ? '2rem' : '0.75rem',
                      borderRadius: '10px',
                      border: '1px solid var(--border-light)',
                      background: 'var(--surface-alt)',
                      color: 'var(--text-main)',
                      fontSize: '0.82rem'
                    }}
                  />
                </div>

                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: '10px',
                    border: '1px solid var(--border-light)',
                    background: 'var(--surface-alt)',
                    color: 'var(--text-main)',
                    fontSize: '0.82rem',
                    fontWeight: '700'
                  }}
                >
                  <option value="all">{isAr ? 'كافة الأقسام' : 'Toutes les catégories'}</option>
                  {CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>{isAr ? c.nameAr : c.nameFr}</option>
                  ))}
                </select>

                <select
                  value={productStoreFilter}
                  onChange={(e) => setProductStoreFilter(e.target.value)}
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: '10px',
                    border: '1px solid var(--border-light)',
                    background: 'var(--surface-alt)',
                    color: 'var(--text-main)',
                    fontSize: '0.82rem',
                    fontWeight: '700'
                  }}
                >
                  <option value="all">{isAr ? 'كافة المتاجر' : 'Toutes les boutiques'}</option>
                  {stores.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              {/* PRODUCTS LIST */}
              <div style={{ background: 'var(--surface)', borderRadius: '18px', border: '1px solid var(--border-light)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isAr ? 'right' : 'left', fontSize: '0.82rem' }}>
                    <thead>
                      <tr style={{ background: 'var(--surface-alt)', borderBottom: '1.5px solid var(--border-light)', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '0.75rem 1rem' }}>{isAr ? 'السلعة والصورة' : 'Produit'}</th>
                        <th style={{ padding: '0.75rem 1rem' }}>{isAr ? 'المتجر' : 'Boutique'}</th>
                        <th style={{ padding: '0.75rem 1rem' }}>{isAr ? 'السعر' : 'Prix (DZD)'}</th>
                        <th style={{ padding: '0.75rem 1rem' }}>{isAr ? 'المخزون' : 'Stock'}</th>
                        <th style={{ padding: '0.75rem 1rem' }}>{isAr ? 'الترويج VIP' : 'Promotion'}</th>
                        <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>{isAr ? 'إجراءات' : 'Actions'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map(p => {
                        const ownerStore = stores.find(s => s.id === p.storeId);
                        return (
                          <tr key={p.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                            <td style={{ padding: '0.75rem 1rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                <img
                                  src={p.imageUrl || p.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                                  alt={p.name}
                                  style={{ width: '42px', height: '42px', borderRadius: '10px', objectFit: 'cover', border: '1px solid var(--border-light)' }}
                                />
                                <div>
                                  <div style={{ fontWeight: '800', color: 'var(--text-main)' }}>{p.name}</div>
                                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ID: {p.id}</div>
                                </div>
                              </div>
                            </td>

                            <td style={{ padding: '0.75rem 1rem' }}>
                              <span style={{ fontWeight: '700' }}>{ownerStore ? ownerStore.name : p.storeId}</span>
                              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{p.wilaya || (ownerStore && ownerStore.wilaya)}</div>
                            </td>

                            <td style={{ padding: '0.75rem 1rem', fontWeight: '900', color: 'var(--orange-action)' }}>
                              {Number(p.price || 0).toLocaleString()} DZD
                            </td>

                            <td style={{ padding: '0.75rem 1rem' }}>
                              <span style={{ background: '#dcfce7', color: '#166534', padding: '0.15rem 0.45rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '800' }}>
                                {p.stockStatus || 'IN_STOCK'}
                              </span>
                            </td>

                            <td style={{ padding: '0.75rem 1rem' }}>
                              <button
                                onClick={() => {
                                  const nextPromo = !p.isPromotion;
                                  onUpdateProduct(p.id, { isPromotion: nextPromo });
                                  triggerFeedback(isAr ? `تم تحديث حالة الترويج للمنتج` : `Promotion modifiée pour l'article`);
                                }}
                                style={{
                                  background: p.isPromotion ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'var(--surface-alt)',
                                  color: p.isPromotion ? '#ffffff' : 'var(--text-muted)',
                                  border: '1px solid var(--border-light)',
                                  padding: '0.25rem 0.5rem',
                                  borderRadius: '8px',
                                  fontSize: '0.72rem',
                                  fontWeight: '800',
                                  cursor: 'pointer'
                                }}
                              >
                                {p.isPromotion ? (isAr ? 'عرض مميز 🔥' : 'En Promo VIP') : (isAr ? 'عادي' : 'Standard')}
                              </button>
                            </td>

                            <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                              <button
                                onClick={() => {
                                  if (window.confirm(isAr ? `حذف الإعلان "${p.name}"؟` : `Supprimer l'article "${p.name}" ?`)) {
                                    onDeleteProduct(p.id);
                                    triggerFeedback(isAr ? 'تم حذف الإعلان' : 'Article supprimé');
                                  }
                                }}
                                style={{
                                  background: 'transparent',
                                  color: '#dc2626',
                                  border: '1px solid #fca5a5',
                                  padding: '0.35rem',
                                  borderRadius: '8px',
                                  cursor: 'pointer'
                                }}
                                title="Supprimer"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* TAB 4: ORDERS SUPERVISION 58 WILAYAS (`orders`)              */}
          {/* ------------------------------------------------------------ */}
          {activeTab === 'orders' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* FILTERS */}
              <div
                style={{
                  background: 'var(--surface)',
                  padding: '0.85rem',
                  borderRadius: '16px',
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  gap: '0.65rem',
                  flexWrap: 'wrap',
                  alignItems: 'center'
                }}
              >
                <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                  <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', [isAr ? 'right' : 'left']: '10px' }} />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder={isAr ? 'بحث برقم الطلبية، اسم الزبون، الهاتف، المتجر...' : 'Recherche réf DZ, nom client, tél, boutique...'}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem',
                      paddingLeft: isAr ? '0.75rem' : '2rem',
                      paddingRight: isAr ? '2rem' : '0.75rem',
                      borderRadius: '10px',
                      border: '1px solid var(--border-light)',
                      background: 'var(--surface-alt)',
                      color: 'var(--text-main)',
                      fontSize: '0.82rem'
                    }}
                  />
                </div>

                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: '10px',
                    border: '1px solid var(--border-light)',
                    background: 'var(--surface-alt)',
                    color: 'var(--text-main)',
                    fontSize: '0.82rem',
                    fontWeight: '700'
                  }}
                >
                  <option value="all">{isAr ? 'كافة حالات الطلب' : 'Tous les statuts'}</option>
                  <option value="NEW">{isAr ? 'جديدة (Nouvelle)' : 'Nouvelle'}</option>
                  <option value="CONFIRMED">{isAr ? 'مؤكدة هاتفياً' : 'Confirmée'}</option>
                  <option value="PREPARING">{isAr ? 'قيد التجهيز' : 'En préparation'}</option>
                  <option value="SHIPPED">{isAr ? 'مع شركة التوصيل' : 'Expédiée'}</option>
                  <option value="DELIVERED">{isAr ? 'تم التسليم' : 'Livrée'}</option>
                  <option value="RETURNED">{isAr ? 'طرد مرتجع' : 'Retour'}</option>
                  <option value="CANCELLED">{isAr ? 'ملغاة' : 'Annulée'}</option>
                </select>

                <select
                  value={orderWilayaFilter}
                  onChange={(e) => setOrderWilayaFilter(e.target.value)}
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: '10px',
                    border: '1px solid var(--border-light)',
                    background: 'var(--surface-alt)',
                    color: 'var(--text-main)',
                    fontSize: '0.82rem',
                    fontWeight: '700'
                  }}
                >
                  <option value="all">{isAr ? 'كافة الولايات' : 'Toutes les Wilayas'}</option>
                  {WILAYAS.map(w => (
                    <option key={w.code} value={w.name}>{w.code} - {w.name}</option>
                  ))}
                </select>
              </div>

              {/* ORDERS LIST */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '0.85rem' }}>
                {filteredOrders.map(o => {
                  const stBadge = getOrderStatusBadge(o.status);
                  return (
                    <div
                      key={o.id}
                      style={{
                        background: 'var(--surface)',
                        borderRadius: '18px',
                        padding: '1.15rem',
                        border: '1px solid var(--border-light)',
                        boxShadow: 'var(--shadow-card)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '0.75rem'
                      }}
                    >
                      <div>
                        {/* Header card */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                          <span style={{ fontWeight: '900', color: 'var(--navy-header)', fontSize: '0.95rem' }}>
                            {o.id}
                          </span>
                          <span style={{ background: stBadge.bg, color: stBadge.color, padding: '0.2rem 0.55rem', borderRadius: '8px', fontSize: '0.72rem', fontWeight: '800' }}>
                            {stBadge.label}
                          </span>
                        </div>

                        {/* Store & Date */}
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
                          {isAr ? 'المتجر:' : 'Boutique:'} <strong style={{ color: 'var(--text-main)' }}>{o.storeName}</strong> • {o.date || '2026-09-24'}
                        </div>

                        {/* Customer Info */}
                        <div style={{ background: 'var(--surface-alt)', padding: '0.65rem', borderRadius: '12px', fontSize: '0.78rem', marginBottom: '0.65rem' }}>
                          <div style={{ fontWeight: '800', color: 'var(--text-main)' }}>{o.customerName}</div>
                          <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}>
                            <MapPin size={13} />
                            <span>{o.wilaya} - {o.commune || o.address}</span>
                          </div>
                          <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}>
                            <Phone size={13} />
                            <span>{o.customerPhone}</span>
                          </div>
                        </div>

                        {/* Amount */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
                          <span style={{ color: 'var(--text-muted)' }}>{isAr ? 'المبلغ الإجمالي:' : 'Montant Total:'}</span>
                          <span style={{ fontWeight: '900', color: 'var(--orange-action)', fontSize: '1.05rem' }}>
                            {Number(o.total || 0).toLocaleString()} DZD
                          </span>
                        </div>
                      </div>

                      {/* Actions & Status Changer */}
                      <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                        <select
                          value={o.status || 'NEW'}
                          onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                          style={{
                            flex: 1,
                            padding: '0.35rem 0.5rem',
                            borderRadius: '8px',
                            border: '1px solid var(--border-light)',
                            background: 'var(--surface-alt)',
                            color: 'var(--text-main)',
                            fontSize: '0.72rem',
                            fontWeight: '800'
                          }}
                        >
                          <option value="NEW">Nouvelle 🟡</option>
                          <option value="CONFIRMED">Confirmée 🔵</option>
                          <option value="PREPARING">En préparation 🟣</option>
                          <option value="SHIPPED">Expédiée 🚚</option>
                          <option value="DELIVERED">Livrée 🟢</option>
                          <option value="RETURNED">Retour 🔴</option>
                          <option value="CANCELLED">Annulée ⚪</option>
                        </select>

                        {/* Contact Client WhatsApp / Call */}
                        {o.customerPhone && (
                          <a
                            href={`https://wa.me/213${o.customerPhone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              background: '#25D366',
                              color: '#fff',
                              padding: '0.35rem 0.5rem',
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              textDecoration: 'none'
                            }}
                            title="WhatsApp Client"
                          >
                            <MessageSquare size={13} />
                          </a>
                        )}

                        <button
                          onClick={() => {
                            if (window.confirm(isAr ? `حذف الطلبية "${o.id}"؟` : `Supprimer la commande "${o.id}" ?`)) {
                              onDeleteOrder(o.id);
                              triggerFeedback(isAr ? 'تم حذف الطلبية' : 'Commande supprimée');
                            }
                          }}
                          style={{
                            background: 'transparent',
                            color: '#dc2626',
                            border: '1px solid #fca5a5',
                            padding: '0.35rem',
                            borderRadius: '8px',
                            cursor: 'pointer'
                          }}
                          title="Supprimer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* TAB 5: ANTI-RETOUR DZ & CUSTOMER RELIABILITY                */}
          {/* ------------------------------------------------------------ */}
          {activeTab === 'anti_retour' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(220, 38, 38, 0.02) 100%)', padding: '1.25rem', borderRadius: '18px', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
                  <Award size={22} color="#dc2626" />
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '900', color: '#991b1b' }}>
                    {isAr ? 'الملف الوطني لمكافحة رفض الطرود وحماية التجار (Anti-Retour DZ)' : 'Fichier National Anti-Retour DZ (Protection Commerçants)'}
                  </h3>
                </div>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#7f1d1d' }}>
                  {isAr
                    ? 'قاعدة بيانات مركزية تشاركها المتاجر في الجزائر لرصد الزبائن الذين يرفضون استلام الطرود دون مبرر قانوني بعد تكبد التاجر تكلفة الشحن ذهاباً وإياباً.'
                    : 'Registre de notation partagé entre magasins pour détecter les acheteurs coutumiers de refus abusifs de colis après expédition.'}
                </p>
              </div>

              {/* SEARCH BAR */}
              <div style={{ position: 'relative' }}>
                <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', [isAr ? 'right' : 'left']: '12px' }} />
                <input
                  type="text"
                  value={antiRetourSearch}
                  onChange={(e) => setAntiRetourSearch(e.target.value)}
                  placeholder={isAr ? 'بحث برقم هاتف الزبون، الاسم، سبب التقييم...' : 'Recherche téléphone client, nom, boutique déclarante...'}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    paddingLeft: isAr ? '0.85rem' : '2.2rem',
                    paddingRight: isAr ? '2.2rem' : '0.85rem',
                    borderRadius: '12px',
                    border: '1px solid var(--border-light)',
                    background: 'var(--surface)',
                    color: 'var(--text-main)',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              {/* TABLE RATINGS */}
              <div style={{ background: 'var(--surface)', borderRadius: '18px', border: '1px solid var(--border-light)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isAr ? 'right' : 'left', fontSize: '0.82rem' }}>
                    <thead>
                      <tr style={{ background: 'var(--surface-alt)', borderBottom: '1.5px solid var(--border-light)', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '0.75rem 1rem' }}>{isAr ? 'الزبون والهاتف' : 'Client & Téléphone'}</th>
                        <th style={{ padding: '0.75rem 1rem' }}>{isAr ? 'استلام الطرد' : 'Réception Colis'}</th>
                        <th style={{ padding: '0.75rem 1rem' }}>{isAr ? 'التقييم' : 'Note'}</th>
                        <th style={{ padding: '0.75rem 1rem' }}>{isAr ? 'المتجر المبلغ والسبب' : 'Boutique & Motif'}</th>
                        <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>{isAr ? 'إجراء' : 'Action'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRatings.map(c => (
                        <tr key={c.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <div style={{ fontWeight: '800' }}>{c.customerName}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{c.customerPhone}</div>
                          </td>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <span style={{ background: c.parcelReceived ? '#dcfce7' : '#fee2e2', color: c.parcelReceived ? '#166534' : '#991b1b', padding: '0.15rem 0.5rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '800' }}>
                              {c.parcelReceived ? (isAr ? 'تم الاستلام ✓' : 'Colis Reçu') : (isAr ? 'رفض الاستلام ❌' : 'Colis Refusé')}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem 1rem', fontWeight: '800', color: '#f59e0b' }}>
                            {'★'.repeat(c.stars)}{'☆'.repeat(5 - c.stars)}
                          </td>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            <div style={{ fontWeight: '700' }}>{c.storeName}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.reason}</div>
                          </td>
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                            <button
                              onClick={() => {
                                if (window.confirm(isAr ? 'حذف هذا التسجيل من ملف الجدية؟' : 'Supprimer cet enregistrement ?')) {
                                  onDeleteCustomerRating(c.id);
                                  triggerFeedback(isAr ? 'تم الحذف' : 'Enregistrement supprimé');
                                }
                              }}
                              style={{
                                background: 'transparent',
                                color: '#dc2626',
                                border: '1px solid #fca5a5',
                                padding: '0.35rem',
                                borderRadius: '8px',
                                cursor: 'pointer'
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* TAB 6: STORE REVIEWS MODERATION                             */}
          {/* ------------------------------------------------------------ */}
          {activeTab === 'reviews' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: 'var(--surface)', padding: '0.85rem', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
                <input
                  type="text"
                  value={reviewSearch}
                  onChange={(e) => setReviewSearch(e.target.value)}
                  placeholder={isAr ? 'بحث في التقييمات، اسم الزبون، النص...' : 'Rechercher un avis...'}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '10px',
                    border: '1px solid var(--border-light)',
                    background: 'var(--surface-alt)',
                    color: 'var(--text-main)',
                    fontSize: '0.82rem'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '0.85rem' }}>
                {filteredReviews.map(r => (
                  <div key={r.id} style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '16px', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <span style={{ fontWeight: '800' }}>{r.customerName}</span>
                        <span style={{ color: '#f59e0b', fontWeight: '800', fontSize: '0.85rem' }}>{'★'.repeat(r.rating)}</span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.45rem' }}>
                        {isAr ? 'المتجر:' : 'Boutique:'} <strong>{r.storeId}</strong> • {r.date}
                      </div>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-main)', fontStyle: 'italic' }}>
                        "{r.comment}"
                      </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-light)', paddingTop: '0.5rem' }}>
                      <button
                        onClick={() => {
                          if (window.confirm(isAr ? 'حذف هذا التقييم نهائياً؟' : 'Supprimer cet avis ?')) {
                            onDeleteStoreReview(r.id);
                            triggerFeedback(isAr ? 'تم حذف التقييم' : 'Avis supprimé');
                          }
                        }}
                        style={{
                          background: 'transparent',
                          color: '#dc2626',
                          border: '1px solid #fca5a5',
                          padding: '0.35rem 0.6rem',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '0.75rem',
                          fontWeight: '700'
                        }}
                      >
                        {isAr ? 'حذف التقييم' : 'Supprimer'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* TAB 7: USERS & PROFILES (`profiles`)                        */}
          {/* ------------------------------------------------------------ */}
          {activeTab === 'users' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: 'var(--surface)', padding: '1.25rem', borderRadius: '18px', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '800' }}>
                    {isAr ? 'إدارة المستخدمين والأدوار (Customer, Store, Admin)' : 'Gestion des Rôles & Profils Supabase'}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{users.length} comptes</span>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isAr ? 'right' : 'left', fontSize: '0.82rem' }}>
                    <thead>
                      <tr style={{ background: 'var(--surface-alt)', borderBottom: '1.5px solid var(--border-light)', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '0.65rem 0.85rem' }}>ID & Email</th>
                        <th style={{ padding: '0.65rem 0.85rem' }}>{isAr ? 'الاسم' : 'Nom'}</th>
                        <th style={{ padding: '0.65rem 0.85rem' }}>{isAr ? 'الولاية' : 'Wilaya'}</th>
                        <th style={{ padding: '0.65rem 0.85rem' }}>{isAr ? 'الدور الحالي' : 'Rôle'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                          <td style={{ padding: '0.65rem 0.85rem' }}>
                            <div style={{ fontWeight: '800' }}>{u.email}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{u.id}</div>
                          </td>
                          <td style={{ padding: '0.65rem 0.85rem', fontWeight: '700' }}>{u.name}</td>
                          <td style={{ padding: '0.65rem 0.85rem' }}>{u.wilaya || 'Alger'}</td>
                          <td style={{ padding: '0.65rem 0.85rem' }}>
                            <span
                              style={{
                                background: u.role === 'admin' ? '#f3e8ff' : u.role === 'store' ? '#fef3c7' : '#e0e7ff',
                                color: u.role === 'admin' ? '#6b21a8' : u.role === 'store' ? '#92400e' : '#3730a3',
                                padding: '0.2rem 0.5rem',
                                borderRadius: '6px',
                                fontSize: '0.72rem',
                                fontWeight: '800'
                              }}
                            >
                              {u.role ? u.role.toUpperCase() : 'CUSTOMER'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------ */}
          {/* TAB 8: CONSOLE SQL & DATABASE SCHEMA                         */}
          {/* ------------------------------------------------------------ */}
          {activeTab === 'console' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: 'var(--surface)', padding: '1.25rem', borderRadius: '18px', border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Database size={20} color="#059669" />
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '900' }}>
                      {isAr ? 'مخطط واستعلامات Supabase SQL' : 'Schéma Supabase SQL & RLS'}
                    </h3>
                  </div>
                  <button
                    onClick={handleCopySql}
                    style={{
                      background: sqlCopied ? '#059669' : 'rgba(16, 185, 129, 0.15)',
                      color: sqlCopied ? '#fff' : '#059669',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      padding: '0.45rem 0.85rem',
                      borderRadius: '10px',
                      fontSize: '0.75rem',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    {sqlCopied ? <Check size={14} /> : <Copy size={14} />}
                    <span>{sqlCopied ? (isAr ? 'تم النسخ!' : 'Copié !') : (isAr ? 'نسخ استعلام SQL' : 'Copier SQL')}</span>
                  </button>
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 1rem' }}>
                  {isAr
                    ? 'يمكنك لصق هذا المخطط مباشرة في SQL Editor على لوحة تحكم Supabase لتنشيط الجداول، الصلاحيات (Row Level Security)، وقواعد الأمان لجميع الـ 58 ولاية.'
                    : 'Collez ce script dans le SQL Editor de Supabase (app.supabase.com) pour créer ou vérifier toutes vos tables PostgreSQL, index et politiques RLS.'}
                </p>

                <div
                  style={{
                    background: '#0f172a',
                    color: '#e2e8f0',
                    fontFamily: 'monospace',
                    fontSize: '0.78rem',
                    padding: '1rem',
                    borderRadius: '14px',
                    maxHeight: '340px',
                    overflowY: 'auto',
                    lineHeight: '1.4'
                  }}
                >
                  <pre style={{ margin: 0 }}>
{`-- ==========================================================
-- SUPABASE POSTGRESQL TABLES FOR MAG VITRINE DZ
-- ==========================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. STORES TABLE
CREATE TABLE IF NOT EXISTS public.stores (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo TEXT NOT NULL,
    description TEXT,
    manager_name TEXT,
    phone TEXT NOT NULL,
    whatsapp TEXT,
    address TEXT NOT NULL,
    wilaya TEXT NOT NULL,
    commune TEXT,
    badge TEXT DEFAULT 'Vérifié',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    store_id TEXT NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    category_id TEXT NOT NULL,
    name TEXT NOT NULL,
    name_ar TEXT DEFAULT '',
    description TEXT,
    price NUMERIC(12,2) NOT NULL,
    is_promotion BOOLEAN DEFAULT FALSE,
    stock_status TEXT DEFAULT 'IN_STOCK',
    image_url TEXT NOT NULL,
    wilaya TEXT,
    status TEXT DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    store_id TEXT,
    store_name TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    wilaya TEXT NOT NULL,
    commune TEXT,
    address TEXT,
    total NUMERIC(12,2) NOT NULL,
    status TEXT DEFAULT 'NEW',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read stores" ON public.stores FOR SELECT USING (true);
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin & stores manage orders" ON public.orders FOR ALL USING (true);`}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
