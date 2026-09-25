import React, { useState, useEffect, useMemo } from 'react';
import {
  Package,
  ShoppingCart,
  Search,
  Filter,
  RefreshCw,
  Download,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Truck,
  Eye,
  Trash2,
  Edit2,
  ArrowUpDown,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Database,
  Layers,
  Phone,
  MessageCircle,
  FileSpreadsheet
} from 'lucide-react';
import { productsApi, ordersApi } from '../services/supabaseService';
import { isSupabaseConfigured } from '../lib/supabase';
import { WILAYAS, CATEGORIES } from '../data/initialData';

export function SupabaseDataGrid({
  localProducts = [],
  localOrders = [],
  stores = [],
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrder,
  onDeleteOrder,
  lang = 'fr',
  t
}) {
  const isAr = lang === 'ar';

  // Active grid mode: 'inventory' (products) or 'orders' (order status)
  const [gridMode, setGridMode] = useState('inventory');

  // Direct Supabase states
  const [supabaseProducts, setSupabaseProducts] = useState([]);
  const [supabaseOrders, setSupabaseOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [actionFeedback, setActionFeedback] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [wilayaFilter, setWilayaFilter] = useState('all');

  // Sorting
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Detail Modal Inspection
  const [inspectedItem, setInspectedItem] = useState(null);

  // Load data directly from Supabase
  const fetchData = async () => {
    setIsLoading(true);
    const isConfig = isSupabaseConfigured();
    setIsLiveConnected(isConfig);

    if (isConfig) {
      try {
        const [prodRes, ordRes] = await Promise.all([
          productsApi.getAll(),
          ordersApi.getAll()
        ]);

        if (prodRes?.data && prodRes.data.length > 0) {
          setSupabaseProducts(prodRes.data);
        } else {
          setSupabaseProducts(localProducts);
        }

        if (ordRes?.data && ordRes.data.length > 0) {
          setSupabaseOrders(ordRes.data);
        } else {
          setSupabaseOrders(localOrders);
        }
      } catch (err) {
        console.warn('[SupabaseDataGrid] Fetch error, falling back to local store data:', err);
        setSupabaseProducts(localProducts);
        setSupabaseOrders(localOrders);
      }
    } else {
      setSupabaseProducts(localProducts);
      setSupabaseOrders(localOrders);
    }

    setLastRefreshed(new Date().toLocaleTimeString());
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [localProducts.length, localOrders.length]);

  // Combine and normalize products
  const activeProducts = useMemo(() => {
    const list = supabaseProducts.length > 0 ? supabaseProducts : localProducts;
    return list.map(p => ({
      id: p.id,
      name: p.name,
      nameAr: p.name_ar || p.nameAr || '',
      price: Number(p.price || 0),
      oldPrice: p.old_price || p.oldPrice ? Number(p.old_price || p.oldPrice) : null,
      discountPercent: p.discount_percent || p.discountPercent || 0,
      stockStatus: p.stock_status || p.stockStatus || 'IN_STOCK',
      categoryId: p.category_id || p.categoryId || 'cat_all',
      storeId: p.store_id || p.storeId || '',
      wilaya: p.wilaya || p.location || 'Alger',
      condition: p.condition || 'new',
      imageUrl: p.image_url || p.imageUrl || '',
      created_at: p.created_at || p.createdAt || '2026-09-20'
    }));
  }, [supabaseProducts, localProducts]);

  // Combine and normalize orders
  const activeOrders = useMemo(() => {
    const list = supabaseOrders.length > 0 ? supabaseOrders : localOrders;
    return list.map(o => ({
      id: o.id,
      customerName: o.customer_name || o.customerName || 'Client',
      customerPhone: o.customer_phone || o.customerPhone || '',
      wilaya: o.wilaya || 'Alger',
      commune: o.commune || '',
      storeId: o.store_id || o.storeId || '',
      storeName: o.store_name || o.storeName || 'Magasin Vitrine',
      itemsCount: Array.isArray(o.items) ? o.items.reduce((s, i) => s + (i.quantity || 1), 0) : 1,
      items: Array.isArray(o.items) ? o.items : [],
      total: Number(o.total || 0),
      deliveryMethod: o.delivery_method || o.deliveryMethod || 'HOME_DELIVERY',
      paymentMethod: o.payment_method || o.paymentMethod || 'CASH_ON_DELIVERY',
      status: o.status || 'NEW',
      notes: o.notes || '',
      created_at: o.created_at || o.createdAt || '2026-09-24'
    }));
  }, [supabaseOrders, localOrders]);

  // Filtered & Sorted Inventory
  const filteredProducts = useMemo(() => {
    return activeProducts
      .filter(p => {
        if (categoryFilter !== 'all' && p.categoryId !== categoryFilter) return false;
        if (statusFilter !== 'all' && p.stockStatus !== statusFilter) return false;
        if (wilayaFilter !== 'all' && !p.wilaya.toLowerCase().includes(wilayaFilter.toLowerCase())) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return p.name.toLowerCase().includes(q) || (p.nameAr && p.nameAr.includes(q)) || p.id.toLowerCase().includes(q);
        }
        return true;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [activeProducts, categoryFilter, statusFilter, wilayaFilter, searchQuery, sortField, sortDirection]);

  // Filtered & Sorted Orders
  const filteredOrders = useMemo(() => {
    return activeOrders
      .filter(o => {
        if (statusFilter !== 'all' && o.status !== statusFilter) return false;
        if (wilayaFilter !== 'all' && !o.wilaya.toLowerCase().includes(wilayaFilter.toLowerCase())) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            o.id.toLowerCase().includes(q) ||
            o.customerName.toLowerCase().includes(q) ||
            o.customerPhone.includes(q) ||
            o.storeName.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [activeOrders, statusFilter, wilayaFilter, searchQuery, sortField, sortDirection]);

  // Pagination slice
  const currentList = gridMode === 'inventory' ? filteredProducts : filteredOrders;
  const totalPages = Math.ceil(currentList.length / pageSize) || 1;
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return currentList.slice(start, start + pageSize);
  }, [currentList, currentPage, pageSize]);

  // Handle Sort Toggle
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Stock status toggle
  const handleUpdateStock = async (product, newStatus) => {
    setActionFeedback(isAr ? 'جاري تحديث المخزون...' : 'Mise à jour du stock...');
    try {
      if (isSupabaseConfigured()) {
        await productsApi.update(product.id, { stock_status: newStatus });
      }
      if (onUpdateProduct) {
        onUpdateProduct(product.id, { stockStatus: newStatus });
      }
      setSupabaseProducts(prev => prev.map(p => p.id === product.id ? { ...p, stock_status: newStatus, stockStatus: newStatus } : p));
      setActionFeedback(isAr ? 'تم تحديث المخزون بنجاح' : 'Statut stock mis à jour');
    } catch (e) {
      setActionFeedback(isAr ? 'حدث خطأ' : 'Erreur de mise à jour');
    }
    setTimeout(() => setActionFeedback(null), 2500);
  };

  // Order status update
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setActionFeedback(isAr ? 'جاري تحديث حالة الطلب...' : 'Mise à jour statut commande...');
    try {
      if (isSupabaseConfigured()) {
        await ordersApi.updateStatus(orderId, newStatus);
      }
      if (onUpdateOrder) {
        onUpdateOrder(orderId, { status: newStatus });
      }
      setSupabaseOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      setActionFeedback(isAr ? 'تم تحديث حالة الطلب' : 'Statut commande actualisé');
    } catch (e) {
      setActionFeedback(isAr ? 'حدث خطأ' : 'Erreur de mise à jour');
    }
    setTimeout(() => setActionFeedback(null), 2500);
  };

  // CSV Export
  const handleExportCSV = () => {
    if (gridMode === 'inventory') {
      const headers = ['ID,Nom,Prix (DZD),Statut Stock,Wilaya,Date'];
      const rows = filteredProducts.map(p => `"${p.id}","${p.name.replace(/"/g, '""')}",${p.price},"${p.stockStatus}","${p.wilaya}","${p.created_at}"`);
      const csv = [headers, ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `mag_vitrine_inventaire_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const headers = ['Commande ID,Client,Telephone,Wilaya,Articles,Total (DZD),Statut,Date'];
      const rows = filteredOrders.map(o => `"${o.id}","${o.customerName.replace(/"/g, '""')}","${o.customerPhone}","${o.wilaya}",${o.itemsCount},${o.total},"${o.status}","${o.created_at}"`);
      const csv = [headers, ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `mag_vitrine_commandes_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Helper for status badge colors
  const getStockBadge = (status) => {
    switch (status) {
      case 'IN_STOCK':
        return { label: isAr ? 'متوفر' : 'En Stock', bg: 'rgba(16, 185, 129, 0.15)', color: '#059669', border: 'rgba(16, 185, 129, 0.3)' };
      case 'LOW_STOCK':
        return { label: isAr ? 'كمية محدودة' : 'Stock Faible', bg: 'rgba(245, 158, 11, 0.15)', color: '#d97706', border: 'rgba(245, 158, 11, 0.3)' };
      case 'OUT_OF_STOCK':
      default:
        return { label: isAr ? 'نفذت الكمية' : 'Rupture', bg: 'rgba(239, 68, 68, 0.15)', color: '#dc2626', border: 'rgba(239, 68, 68, 0.3)' };
    }
  };

  const getOrderStatusBadge = (status) => {
    switch (status) {
      case 'NEW':
        return { label: isAr ? 'جديدة' : 'Nouvelle', bg: 'rgba(14, 165, 233, 0.15)', color: '#0284c7', border: 'rgba(14, 165, 233, 0.3)' };
      case 'CONFIRMED':
        return { label: isAr ? 'مؤكدة' : 'Confirmée', bg: 'rgba(99, 102, 241, 0.15)', color: '#6366f1', border: 'rgba(99, 102, 241, 0.3)' };
      case 'SHIPPED':
        return { label: isAr ? 'قيد التوصيل' : 'En livraison', bg: 'rgba(245, 158, 11, 0.15)', color: '#d97706', border: 'rgba(245, 158, 11, 0.3)' };
      case 'DELIVERED':
        return { label: isAr ? 'تم التسليم' : 'Livrée', bg: 'rgba(16, 185, 129, 0.15)', color: '#059669', border: 'rgba(16, 185, 129, 0.3)' };
      case 'CANCELLED':
        return { label: isAr ? 'ملغاة' : 'Annulée', bg: 'rgba(239, 68, 68, 0.15)', color: '#dc2626', border: 'rgba(239, 68, 68, 0.3)' };
      case 'RETURNED':
        return { label: isAr ? 'مرتجع / رفض' : 'Retour / Refusé', bg: 'rgba(168, 85, 247, 0.15)', color: '#9333ea', border: 'rgba(168, 85, 247, 0.3)' };
      default:
        return { label: status, bg: 'var(--surface-alt)', color: 'var(--text-muted)', border: 'var(--border-light)' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
      {/* 1. TOP HEADER & MODE SELECTOR */}
      <div
        style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)',
          padding: '1.25rem',
          borderRadius: '20px',
          color: '#ffffff',
          boxShadow: '0 8px 24px rgba(6, 78, 59, 0.35)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(16, 185, 129, 0.4)'
              }}
            >
              <Database size={20} color="#10b981" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: '900', margin: 0, letterSpacing: '-0.3px' }}>
                {isAr ? 'لوحة البيانات التفاعلية (Data Grid)' : 'Supabase Data Grid Management'}
              </h2>
              <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.75rem', opacity: 0.85 }}>
                {isAr
                  ? 'إدارة فورية لمخزون المنتجات وحالات الطلبات مباشرة من جداول Supabase'
                  : 'Synchronisation et pilotage direct des tables products & orders'}
              </p>
            </div>
          </div>
        </div>

        {/* Live Status indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '9999px',
              background: isLiveConnected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
              border: `1px solid ${isLiveConnected ? '#10b981' : '#f59e0b'}`,
              color: isLiveConnected ? '#10b981' : '#f59e0b',
              fontSize: '0.72rem',
              fontWeight: '800',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: isLiveConnected ? '#10b981' : '#f59e0b',
                boxShadow: isLiveConnected ? '0 0 8px #10b981' : 'none'
              }}
            />
            {isLiveConnected
              ? (isAr ? 'متصل بقاعدة البيانات Supabase' : 'Connecté Supabase Live')
              : (isAr ? 'وضع محلي احتياطي' : 'Mode Cache Local')}
          </div>

          <button
            onClick={fetchData}
            disabled={isLoading}
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              padding: '0.45rem 0.85rem',
              borderRadius: '10px',
              fontSize: '0.78rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s'
            }}
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            <span>{isAr ? 'تحديث' : 'Actualiser'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            style={{
              background: '#10b981',
              border: 'none',
              color: '#064e3b',
              padding: '0.45rem 0.85rem',
              borderRadius: '10px',
              fontSize: '0.78rem',
              fontWeight: '900',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <FileSpreadsheet size={14} />
            <span>{isAr ? 'تصدير CSV' : 'Export CSV'}</span>
          </button>
        </div>
      </div>

      {/* FEEDBACK TOAST */}
      {actionFeedback && (
        <div
          style={{
            background: 'var(--surface)',
            border: '1.5px solid #059669',
            color: '#059669',
            padding: '0.6rem 1rem',
            borderRadius: '12px',
            fontSize: '0.82rem',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: 'var(--shadow-card)'
          }}
        >
          <CheckCircle2 size={16} />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* 2. MODE TABS & COUNTERS */}
      <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--surface)', padding: '0.4rem', borderRadius: '14px', border: '1px solid var(--border-light)' }}>
        <button
          onClick={() => {
            setGridMode('inventory');
            setCurrentPage(1);
            setStatusFilter('all');
            setSortField('created_at');
          }}
          style={{
            flex: 1,
            padding: '0.65rem 1rem',
            borderRadius: '10px',
            border: 'none',
            background: gridMode === 'inventory' ? '#064e3b' : 'transparent',
            color: gridMode === 'inventory' ? '#ffffff' : 'var(--text-main)',
            fontWeight: '800',
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s'
          }}
        >
          <Package size={17} color={gridMode === 'inventory' ? '#10b981' : 'currentColor'} />
          <span>{isAr ? 'مخزون المنتجات' : 'Inventaire Produits'}</span>
          <span
            style={{
              fontSize: '0.72rem',
              padding: '0.1rem 0.45rem',
              borderRadius: '9999px',
              background: gridMode === 'inventory' ? 'rgba(16, 185, 129, 0.3)' : 'var(--surface-alt)',
              color: gridMode === 'inventory' ? '#10b981' : 'var(--text-muted)'
            }}
          >
            {activeProducts.length}
          </span>
        </button>

        <button
          onClick={() => {
            setGridMode('orders');
            setCurrentPage(1);
            setStatusFilter('all');
            setSortField('created_at');
          }}
          style={{
            flex: 1,
            padding: '0.65rem 1rem',
            borderRadius: '10px',
            border: 'none',
            background: gridMode === 'orders' ? '#064e3b' : 'transparent',
            color: gridMode === 'orders' ? '#ffffff' : 'var(--text-main)',
            fontWeight: '800',
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s'
          }}
        >
          <ShoppingCart size={17} color={gridMode === 'orders' ? '#10b981' : 'currentColor'} />
          <span>{isAr ? 'تتبع وحالات الطلبات' : 'Statut & Suivi Commandes'}</span>
          <span
            style={{
              fontSize: '0.72rem',
              padding: '0.1rem 0.45rem',
              borderRadius: '9999px',
              background: gridMode === 'orders' ? 'rgba(16, 185, 129, 0.3)' : 'var(--surface-alt)',
              color: gridMode === 'orders' ? '#10b981' : 'var(--text-muted)'
            }}
          >
            {activeOrders.length}
          </span>
        </button>
      </div>

      {/* 3. FILTERS & SEARCH TOOLBAR */}
      <div
        style={{
          background: 'var(--surface)',
          padding: '0.85rem',
          borderRadius: '16px',
          border: '1px solid var(--border-light)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.6rem',
          alignItems: 'center'
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', [isAr ? 'right' : 'left']: '10px' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={
              gridMode === 'inventory'
                ? (isAr ? 'بحث برقم المنتج، الاسم، الماركة...' : 'Recherche ID, nom article, référence...')
                : (isAr ? 'بحث برقم الطلب، اسم العميل، الهاتف...' : 'Recherche N° commande, client, tél, boutique...')
            }
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              paddingLeft: isAr ? '0.75rem' : '2.1rem',
              paddingRight: isAr ? '2.1rem' : '0.75rem',
              borderRadius: '10px',
              border: '1px solid var(--border-light)',
              background: 'var(--surface-alt)',
              color: 'var(--text-main)',
              fontSize: '0.82rem'
            }}
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
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
          {gridMode === 'inventory' ? (
            <>
              <option value="IN_STOCK">{isAr ? 'متوفر بالمخزن' : 'En stock'}</option>
              <option value="LOW_STOCK">{isAr ? 'كمية محدودة' : 'Stock faible'}</option>
              <option value="OUT_OF_STOCK">{isAr ? 'نفذت الكمية' : 'Rupture de stock'}</option>
            </>
          ) : (
            <>
              <option value="NEW">{isAr ? 'جديدة' : 'Nouvelle'}</option>
              <option value="CONFIRMED">{isAr ? 'مؤكدة' : 'Confirmée'}</option>
              <option value="SHIPPED">{isAr ? 'قيد التوصيل' : 'En livraison'}</option>
              <option value="DELIVERED">{isAr ? 'تم التسليم' : 'Livrée'}</option>
              <option value="CANCELLED">{isAr ? 'ملغاة' : 'Annulée'}</option>
              <option value="RETURNED">{isAr ? 'مرتجع / رفض' : 'Retour / Refusé'}</option>
            </>
          )}
        </select>

        {/* Category filter (only in inventory) */}
        {gridMode === 'inventory' && (
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
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
        )}

        {/* Wilaya Filter */}
        <select
          value={wilayaFilter}
          onChange={(e) => {
            setWilayaFilter(e.target.value);
            setCurrentPage(1);
          }}
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
          <option value="all">{isAr ? '58 ولاية' : 'Toutes les wilayas'}</option>
          {WILAYAS.map(w => (
            <option key={w.code} value={w.nameFr}>{w.code} - {isAr ? w.nameAr : w.nameFr}</option>
          ))}
        </select>

        {/* Page size */}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setCurrentPage(1);
          }}
          style={{
            padding: '0.5rem 0.6rem',
            borderRadius: '10px',
            border: '1px solid var(--border-light)',
            background: 'var(--surface-alt)',
            color: 'var(--text-main)',
            fontSize: '0.82rem'
          }}
        >
          <option value={10}>10 / {isAr ? 'صفحة' : 'page'}</option>
          <option value={25}>25 / {isAr ? 'صفحة' : 'page'}</option>
          <option value={50}>50 / {isAr ? 'صفحة' : 'page'}</option>
        </select>
      </div>

      {/* 4. THE DATA GRID TABLE */}
      <div style={{ background: 'var(--surface)', borderRadius: '18px', border: '1px solid var(--border-light)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isAr ? 'right' : 'left', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ background: 'var(--surface-alt)', borderBottom: '1.5px solid var(--border-light)', color: 'var(--text-muted)' }}>
                {gridMode === 'inventory' ? (
                  <>
                    <th style={{ padding: '0.85rem 1rem' }}>{isAr ? 'المنتج / الصورة' : 'Produit & Visuel'}</th>
                    <th style={{ padding: '0.85rem 0.75rem', cursor: 'pointer' }} onClick={() => handleSort('price')}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <span>{isAr ? 'السعر (دج)' : 'Prix (DZD)'}</span>
                        <ArrowUpDown size={13} />
                      </div>
                    </th>
                    <th style={{ padding: '0.85rem 0.75rem' }}>{isAr ? 'الولاية / الموقع' : 'Wilaya'}</th>
                    <th style={{ padding: '0.85rem 0.75rem', cursor: 'pointer' }} onClick={() => handleSort('stockStatus')}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <span>{isAr ? 'حالة المخزون' : 'Statut Stock'}</span>
                        <ArrowUpDown size={13} />
                      </div>
                    </th>
                    <th style={{ padding: '0.85rem 0.75rem' }}>{isAr ? 'إجراءات سريعة' : 'Actions Stock'}</th>
                  </>
                ) : (
                  <>
                    <th style={{ padding: '0.85rem 1rem', cursor: 'pointer' }} onClick={() => handleSort('id')}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <span>{isAr ? 'رقم الطلب والتاريخ' : 'N° Commande & Date'}</span>
                        <ArrowUpDown size={13} />
                      </div>
                    </th>
                    <th style={{ padding: '0.85rem 0.75rem' }}>{isAr ? 'العميل والهاتف' : 'Client & Téléphone'}</th>
                    <th style={{ padding: '0.85rem 0.75rem' }}>{isAr ? 'المتجر والولاية' : 'Boutique & Wilaya'}</th>
                    <th style={{ padding: '0.85rem 0.75rem', cursor: 'pointer' }} onClick={() => handleSort('total')}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <span>{isAr ? 'المجموع (دج)' : 'Total (DZD)'}</span>
                        <ArrowUpDown size={13} />
                      </div>
                    </th>
                    <th style={{ padding: '0.85rem 0.75rem', cursor: 'pointer' }} onClick={() => handleSort('status')}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <span>{isAr ? 'حالة الطلب' : 'Statut'}</span>
                        <ArrowUpDown size={13} />
                      </div>
                    </th>
                    <th style={{ padding: '0.85rem 0.75rem' }}>{isAr ? 'إجراءات' : 'Actions'}</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {paginatedList.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                    {isAr ? 'لا توجد بيانات مطابقة لخيارات التصفية.' : 'Aucune donnée correspondante.'}
                  </td>
                </tr>
              ) : (
                paginatedList.map((item) => {
                  if (gridMode === 'inventory') {
                    const badge = getStockBadge(item.stockStatus);
                    return (
                      <tr key={item.id} style={{ borderBottom: '1px solid var(--border-light)', transition: 'background 0.15s' }}>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <img
                              src={item.imageUrl || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=120'}
                              alt={item.name}
                              style={{ width: '44px', height: '44px', borderRadius: '10px', objectFit: 'cover', border: '1px solid var(--border-light)' }}
                            />
                            <div>
                              <div style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '0.86rem' }}>
                                {isAr && item.nameAr ? item.nameAr : item.name}
                              </div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', gap: '0.35rem' }}>
                                <code>{item.id}</code>
                                {item.condition === 'new' && <span style={{ color: '#059669', fontWeight: '700' }}>• Neuf</span>}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '0.85rem 0.75rem' }}>
                          <div style={{ fontWeight: '900', color: '#059669', fontSize: '0.9rem' }}>
                            {item.price.toLocaleString()} DZD
                          </div>
                          {item.oldPrice && (
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                              {item.oldPrice.toLocaleString()} DZD
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '0.85rem 0.75rem' }}>
                          <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{item.wilaya}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.created_at?.slice(0, 10)}</div>
                        </td>
                        <td style={{ padding: '0.85rem 0.75rem' }}>
                          <span
                            style={{
                              padding: '0.25rem 0.65rem',
                              borderRadius: '9999px',
                              background: badge.bg,
                              color: badge.color,
                              border: `1px solid ${badge.border}`,
                              fontSize: '0.72rem',
                              fontWeight: '800',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.3rem'
                            }}
                          >
                            {badge.label}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 0.75rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <select
                              value={item.stockStatus}
                              onChange={(e) => handleUpdateStock(item, e.target.value)}
                              style={{
                                padding: '0.35rem 0.5rem',
                                borderRadius: '8px',
                                border: '1px solid var(--border-light)',
                                background: 'var(--surface-alt)',
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                color: 'var(--text-main)'
                              }}
                            >
                              <option value="IN_STOCK">{isAr ? 'متوفر' : 'En stock'}</option>
                              <option value="LOW_STOCK">{isAr ? 'كمية قليلة' : 'Stock faible'}</option>
                              <option value="OUT_OF_STOCK">{isAr ? 'نفذ' : 'Rupture'}</option>
                            </select>

                            <button
                              onClick={() => setInspectedItem({ type: 'product', data: item })}
                              title={isAr ? 'معاينة' : 'Inspecter'}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#059669',
                                cursor: 'pointer',
                                padding: '0.3rem'
                              }}
                            >
                              <Eye size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  } else {
                    const badge = getOrderStatusBadge(item.status);
                    return (
                      <tr key={item.id} style={{ borderBottom: '1px solid var(--border-light)', transition: 'background 0.15s' }}>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <div style={{ fontWeight: '900', color: '#064e3b', fontSize: '0.88rem' }}>
                            {item.id}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {item.created_at?.slice(0, 10)}
                          </div>
                        </td>
                        <td style={{ padding: '0.85rem 0.75rem' }}>
                          <div style={{ fontWeight: '800', color: 'var(--text-main)' }}>{item.customerName}</div>
                          {item.customerPhone && (
                            <a
                              href={`tel:${item.customerPhone}`}
                              style={{ fontSize: '0.74rem', color: '#059669', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.1rem' }}
                            >
                              <Phone size={12} />
                              <span>{item.customerPhone}</span>
                            </a>
                          )}
                        </td>
                        <td style={{ padding: '0.85rem 0.75rem' }}>
                          <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{item.storeName}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.wilaya} {item.commune ? `• ${item.commune}` : ''}</div>
                        </td>
                        <td style={{ padding: '0.85rem 0.75rem' }}>
                          <div style={{ fontWeight: '900', color: '#059669', fontSize: '0.9rem' }}>
                            {item.total.toLocaleString()} DZD
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {item.itemsCount} {isAr ? 'عنصر' : 'article(s)'}
                          </div>
                        </td>
                        <td style={{ padding: '0.85rem 0.75rem' }}>
                          <span
                            style={{
                              padding: '0.25rem 0.65rem',
                              borderRadius: '9999px',
                              background: badge.bg,
                              color: badge.color,
                              border: `1px solid ${badge.border}`,
                              fontSize: '0.72rem',
                              fontWeight: '800'
                            }}
                          >
                            {badge.label}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 0.75rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <select
                              value={item.status}
                              onChange={(e) => handleUpdateOrderStatus(item.id, e.target.value)}
                              style={{
                                padding: '0.35rem 0.5rem',
                                borderRadius: '8px',
                                border: '1px solid var(--border-light)',
                                background: 'var(--surface-alt)',
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                color: 'var(--text-main)'
                              }}
                            >
                              <option value="NEW">{isAr ? 'جديدة' : 'Nouvelle'}</option>
                              <option value="CONFIRMED">{isAr ? 'مؤكدة' : 'Confirmée'}</option>
                              <option value="SHIPPED">{isAr ? 'قيد التوصيل' : 'En livraison'}</option>
                              <option value="DELIVERED">{isAr ? 'تم التسليم' : 'Livrée'}</option>
                              <option value="CANCELLED">{isAr ? 'ملغاة' : 'Annulée'}</option>
                              <option value="RETURNED">{isAr ? 'رفض / مرتجع' : 'Retour'}</option>
                            </select>

                            <button
                              onClick={() => setInspectedItem({ type: 'order', data: item })}
                              title={isAr ? 'تفاصيل الطلب' : 'Détails commande'}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#059669',
                                cursor: 'pointer',
                                padding: '0.3rem'
                              }}
                            >
                              <Eye size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 5. PAGINATION CONTROLS */}
        <div
          style={{
            padding: '0.75rem 1rem',
            background: 'var(--surface-alt)',
            borderTop: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.8rem'
          }}
        >
          <div style={{ color: 'var(--text-muted)' }}>
            {isAr
              ? `عرض ${(currentPage - 1) * pageSize + 1} - ${Math.min(currentPage * pageSize, currentList.length)} من إجمالي ${currentList.length}`
              : `Affichage ${(currentPage - 1) * pageSize + 1} à ${Math.min(currentPage * pageSize, currentList.length)} sur ${currentList.length}`}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border-light)',
                borderRadius: '8px',
                padding: '0.3rem 0.5rem',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                opacity: currentPage === 1 ? 0.4 : 1,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <ChevronLeft size={16} />
            </button>

            <span style={{ fontWeight: '800', color: 'var(--text-main)', padding: '0 0.5rem' }}>
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border-light)',
                borderRadius: '8px',
                padding: '0.3rem 0.5rem',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                opacity: currentPage === totalPages ? 0.4 : 1,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* INSPECTION MODAL DRAWER */}
      {inspectedItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
          onClick={() => setInspectedItem(null)}
        >
          <div
            style={{
              background: 'var(--surface)',
              borderRadius: '24px',
              maxWidth: '520px',
              width: '100%',
              padding: '1.5rem',
              boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
              border: '1px solid var(--border-light)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ background: '#064e3b', color: '#10b981', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: '900' }}>
                  {inspectedItem.type === 'product' ? 'PRODUIT SUPABASE' : 'COMMANDE SUPABASE'}
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-muted)' }}>
                  {inspectedItem.data.id}
                </span>
              </div>
              <button
                onClick={() => setInspectedItem(null)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                ✕
              </button>
            </div>

            {inspectedItem.type === 'product' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <img
                  src={inspectedItem.data.imageUrl}
                  alt={inspectedItem.data.name}
                  style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '16px' }}
                />
                <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--text-main)', margin: 0 }}>
                  {inspectedItem.data.name}
                </h3>
                <div style={{ fontSize: '1.3rem', fontWeight: '900', color: '#059669' }}>
                  {inspectedItem.data.price?.toLocaleString()} DZD
                </div>
                <div style={{ background: 'var(--surface-alt)', padding: '0.85rem', borderRadius: '14px', fontSize: '0.85rem' }}>
                  <p><strong>Wilaya:</strong> {inspectedItem.data.wilaya}</p>
                  <p><strong>Condition:</strong> {inspectedItem.data.condition}</p>
                  <p><strong>Statut Stock:</strong> {inspectedItem.data.stockStatus}</p>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  <div style={{ fontSize: '0.8rem', color: '#059669', fontWeight: '700' }}>Montant Total</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#064e3b' }}>
                    {inspectedItem.data.total?.toLocaleString()} DZD
                  </div>
                </div>
                <div style={{ background: 'var(--surface-alt)', padding: '0.85rem', borderRadius: '14px', fontSize: '0.85rem' }}>
                  <p><strong>Client:</strong> {inspectedItem.data.customerName}</p>
                  <p><strong>Téléphone:</strong> {inspectedItem.data.customerPhone}</p>
                  <p><strong>Wilaya & Commune:</strong> {inspectedItem.data.wilaya} {inspectedItem.data.commune ? `- ${inspectedItem.data.commune}` : ''}</p>
                  <p><strong>Mode de paiement:</strong> {inspectedItem.data.paymentMethod}</p>
                  <p><strong>Statut:</strong> {inspectedItem.data.status}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
