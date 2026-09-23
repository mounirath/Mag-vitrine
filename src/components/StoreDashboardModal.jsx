import React, { useState } from 'react';
import {
  X,
  PlusCircle,
  Trash2,
  LayoutDashboard,
  Store,
  AlertCircle,
  CheckCircle2,
  Package,
  Star,
  UserCheck,
  XCircle,
  Truck,
  Phone,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';
import { CATEGORIES, WILAYAS } from '../data/initialData';

export function StoreDashboardModal({
  isOpen,
  onClose,
  store,
  products,
  orders = [],
  onAddProduct,
  onDeleteProduct,
  onOpenRateCustomer,
  onOpenCustomerSeriousness,
  onOpenStoreReviews,
  getCustomerReliability,
  storeReviews = [],
  lang,
  t
}) {
  const isAr = lang === 'ar';
  const [activeSubTab, setActiveSubTab] = useState('orders'); // 'orders', 'products', 'reviews'

  // Product form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('cat_electronics');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const currentStore = store || {
    id: 'store_techzone',
    name: 'Tech Zone Alger',
    wilaya: 'Alger',
    rating: 4.8,
    reviewsCount: 142,
    quotaUsed: products.filter(p => p.storeId === 'store_techzone').length,
    quotaMax: 50
  };

  const storeProducts = products.filter(p => p.storeId === (store ? store.id : 'store_techzone'));
  const quotaPercent = Math.min(100, Math.round((storeProducts.length / 50) * 100));

  // Filter orders related to this store or all orders in demo
  const storeOrders = orders.filter(o => !o.storeId || o.storeId === currentStore.id || o.storeName === currentStore.name);
  const reviewsForThisStore = storeReviews.filter(r => r.storeId === currentStore.id);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name || !price) return;

    const newProd = {
      id: `prod_${Date.now()}`,
      storeId: store ? store.id : 'store_techzone',
      categoryId,
      name,
      nameAr: nameAr || name,
      price: parseFloat(price),
      oldPrice: null,
      discountPercent: 0,
      image: image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
      description: description || 'Produit de qualité supérieure disponible en magasin.',
      stock: 10,
      wilaya: store ? store.wilaya : 'Alger',
      rating: 5.0,
      salesCount: 0
    };

    onAddProduct(newProd);
    setName('');
    setNameAr('');
    setPrice('');
    setImage('');
    setDescription('');
    setShowAddForm(false);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '720px', borderRadius: '24px', maxHeight: '90vh', overflowY: 'auto' }}
        dir={isAr ? 'rtl' : 'ltr'}
      >
        <button className="close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Dashboard Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--badge-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LayoutDashboard size={24} color="var(--primary)" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0 }}>{t.navDashboard}</h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{currentStore.name} ({currentStore.wilaya})</span>
            </div>
          </div>

          {/* Store Rating Badge (Clickable to view reviews) */}
          <button
            onClick={() => onOpenStoreReviews && onOpenStoreReviews(currentStore)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#fef3c7',
              border: '1px solid #fde68a',
              color: '#92400e',
              padding: '0.4rem 0.8rem',
              borderRadius: '12px',
              fontWeight: '800',
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            <Star size={16} color="#f59e0b" fill="#f59e0b" />
            <span>{currentStore.rating || 4.8} / 5</span>
            <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>({currentStore.reviewsCount || reviewsForThisStore.length || 42} تقييم)</span>
          </button>
        </div>

        {/* Sub-Navigation Tabs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.3fr 1fr 1fr',
            gap: '0.4rem',
            background: 'var(--surface-alt)',
            padding: '0.35rem',
            borderRadius: '14px',
            marginBottom: '1.25rem'
          }}
        >
          <button
            onClick={() => setActiveSubTab('orders')}
            style={{
              padding: '0.65rem',
              borderRadius: '10px',
              border: 'none',
              background: activeSubTab === 'orders' ? 'var(--surface)' : 'transparent',
              color: activeSubTab === 'orders' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: activeSubTab === 'orders' ? '800' : '600',
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              boxShadow: activeSubTab === 'orders' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            <Package size={16} />
            <span>{isAr ? `الطلبات وجدية الزبائن (${storeOrders.length})` : `Commandes & Clients (${storeOrders.length})`}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('products')}
            style={{
              padding: '0.65rem',
              borderRadius: '10px',
              border: 'none',
              background: activeSubTab === 'products' ? 'var(--surface)' : 'transparent',
              color: activeSubTab === 'products' ? 'var(--primary)' : 'var(--text-muted)',
              fontWeight: activeSubTab === 'products' ? '800' : '600',
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              boxShadow: activeSubTab === 'products' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            <Store size={16} />
            <span>{isAr ? `المخزون (${storeProducts.length}/50)` : `Articles (${storeProducts.length}/50)`}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('reviews')}
            style={{
              padding: '0.65rem',
              borderRadius: '10px',
              border: 'none',
              background: activeSubTab === 'reviews' ? 'var(--surface)' : 'transparent',
              color: activeSubTab === 'reviews' ? '#d97706' : 'var(--text-muted)',
              fontWeight: activeSubTab === 'reviews' ? '800' : '600',
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              boxShadow: activeSubTab === 'reviews' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            <Star size={16} />
            <span>{isAr ? 'تقييمات المتجر' : 'Avis Reçus'}</span>
          </button>
        </div>

        {/* TAB 1: ORDERS & CUSTOMER SERIOUSNESS RATINGS */}
        {activeSubTab === 'orders' && (
          <div>
            {/* Anti-retour guide notice */}
            <div
              style={{
                background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
                border: '1px solid #bbf7d0',
                borderRadius: '16px',
                padding: '0.9rem 1rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem'
              }}
            >
              <ShieldCheck size={22} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ margin: 0, fontSize: '0.88rem', fontWeight: '800', color: '#166534' }}>
                  {isAr ? 'نظام حماية التجار: تقييم جدية الزبون في استلام الطرود' : 'Système Anti-Retour : Vérification & Évaluation du Sérieux Client'}
                </h4>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.78rem', color: '#15803d', lineHeight: 1.4 }}>
                  {isAr
                    ? 'اطلع على مؤشر جدية كل زبون قبل الشحن (نسبة الاستلام وسوابق الرفض). بعد التسليم، اضغط على «تقييم جدية الزبون» لتأكيد استلام الطرد أو الإبلاغ عن رفضه لحماية باقي التجار.'
                    : 'Vérifiez la fiabilité du client avant d\'expédier le colis. Évaluez le client à la livraison pour certifier la réception ou signaler les retours non réclamés.'}
                </p>
              </div>
            </div>

            {/* Orders list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {storeOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
                  <Package size={36} style={{ margin: '0 auto 0.5rem', opacity: 0.4 }} />
                  <p>{isAr ? 'لا توجد طلبات جديدة حالياً.' : 'Aucune commande enregistrée.'}</p>
                </div>
              ) : (
                storeOrders.map((order) => {
                  const reliability = getCustomerReliability
                    ? getCustomerReliability(order.phone, order.customerName)
                    : { scorePercent: 100, receivedCount: 3, refusedCount: 0, badge: { labelAr: 'زبون موثوق 🌟', color: '#15803d', bg: '#dcfce7' } };

                  return (
                    <div
                      key={order.id}
                      style={{
                        background: 'var(--surface-alt)',
                        borderRadius: '16px',
                        border: '1px solid var(--border-light)',
                        padding: '1rem',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                      }}
                    >
                      {/* Order top line */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontWeight: '800', fontSize: '0.95rem', color: 'var(--primary)' }}>
                            #{order.id}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>• {order.date}</span>
                        </div>

                        {/* Customer Seriousness Badge (clickable) */}
                        <button
                          type="button"
                          onClick={() => onOpenCustomerSeriousness && onOpenCustomerSeriousness(order, reliability)}
                          style={{
                            background: reliability.badge.bg,
                            color: reliability.badge.color,
                            border: 'none',
                            padding: '0.25rem 0.65rem',
                            borderRadius: '9999px',
                            fontWeight: '800',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem'
                          }}
                          title={isAr ? 'اضغط لعرض السجل الكامل لجدية الزبون' : 'Voir le dossier de fiabilité'}
                        >
                          <UserCheck size={13} />
                          <span>{isAr ? `جدية الزبون: ${reliability.scorePercent}%` : `Fiabilité: ${reliability.scorePercent}%`}</span>
                        </button>
                      </div>

                      {/* Customer info & product summary */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem', fontSize: '0.82rem', marginBottom: '0.75rem' }}>
                        <div>
                          <div style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                            👤 {order.customerName}
                          </div>
                          <div style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                            <Phone size={13} />
                            <span>{order.phone}</span>
                            <span>• {order.wilaya}</span>
                          </div>
                        </div>

                        <div style={{ textAlign: isAr ? 'left' : 'right' }}>
                          <div style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '0.95rem' }}>
                            {order.totalAmount?.toLocaleString()} DZD
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {order.items?.map(i => `${i.qty}x ${i.name}`).join(', ') || 'Articles de la commande'}
                          </div>
                        </div>
                      </div>

                      {/* Parcel Reception & Seriousness Rating Status */}
                      <div
                        style={{
                          background: 'var(--surface)',
                          padding: '0.75rem 0.85rem',
                          borderRadius: '12px',
                          border: '1px solid var(--border)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '0.6rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem' }}>
                          <span style={{ fontWeight: '700' }}>{isAr ? 'استقبال الطرد:' : 'Réception du colis :'}</span>
                          {order.parcelReceived === true ? (
                            <span style={{ color: '#15803d', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <CheckCircle2 size={15} />
                              <span>{isAr ? 'تم الاستلام بنجاح والدفع' : 'Colis récupéré et payé'}</span>
                            </span>
                          ) : order.parcelReceived === false ? (
                            <span style={{ color: '#b91c1c', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <XCircle size={15} />
                              <span>{isAr ? 'رفض الاستلام / طرد راجع (Retour)' : 'Colis refusé / Non réclamé'}</span>
                            </span>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                              {isAr ? 'في انتظار وصول الطرد والتسليم' : 'En cours de livraison'}
                            </span>
                          )}
                        </div>

                        {/* Button to rate or edit customer rating */}
                        <button
                          onClick={() => onOpenRateCustomer && onOpenRateCustomer(order)}
                          style={{
                            padding: '0.45rem 0.85rem',
                            background: order.customerRated ? 'var(--surface-alt)' : 'linear-gradient(135deg, #16a34a, #15803d)',
                            color: order.customerRated ? 'var(--text-main)' : '#ffffff',
                            border: order.customerRated ? '1px solid var(--border)' : 'none',
                            borderRadius: '10px',
                            fontWeight: '800',
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem'
                          }}
                        >
                          <Star size={14} color={order.customerRated ? '#f59e0b' : '#ffffff'} fill={order.customerRated ? '#f59e0b' : 'none'} />
                          <span>
                            {order.customerRated
                              ? (isAr ? `تعديل تقييم الزبون (${order.customerStars || 5}⭐)` : `Modifier avis client (${order.customerStars || 5}⭐)`)
                              : (isAr ? 'تقييم جدية الزبون في استلام الطرد' : 'Évaluer le sérieux du client')}
                          </span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS & 50-LISTINGS QUOTA */}
        {activeSubTab === 'products' && (
          <div>
            {/* Quota Gauge */}
            <div className="quota-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: '700' }}>
                <span>{t.vendorQuotaTitle}</span>
                <span style={{ color: quotaPercent >= 90 ? '#ef4444' : 'var(--primary)' }}>
                  {storeProducts.length} / 50 annonces ({quotaPercent}%)
                </span>
              </div>
              <div className="quota-gauge">
                <div className="quota-fill" style={{ width: `${quotaPercent}%` }} />
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                {isAr
                  ? 'عرض التجار المعتمدين في الجزائر: 50 إعلاناً نشطاً مجاناً مع توثيق الفيديو وضمان المحل.'
                  : 'Offre standard Commerçant : 50 articles actifs gratuits simultanément avec fiche vitrine complète.'}
              </div>
            </div>

            {/* Action Button */}
            {!showAddForm ? (
              <button
                className="btn-add-cart"
                style={{ width: '100%', marginBottom: '1.25rem', padding: '0.75rem' }}
                onClick={() => setShowAddForm(true)}
                disabled={storeProducts.length >= 50}
              >
                <PlusCircle size={18} />
                <span>{t.addListingBtn}</span>
              </button>
            ) : (
              <form onSubmit={handleCreate} style={{ background: 'var(--surface-alt)', padding: '1.25rem', borderRadius: '14px', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1rem' }}>
                  {isAr ? 'إضافة سلعة جديدة للمتجر' : 'Ajouter un article à votre vitrine'}
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <input
                    type="text"
                    placeholder="Nom du produit (FR)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{ padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)' }}
                  />
                  <input
                    type="text"
                    placeholder="اسم المنتج بالعربية"
                    value={nameAr}
                    onChange={(e) => setNameAr(e.target.value)}
                    style={{ padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <input
                    type="number"
                    placeholder="Prix en DZD (د.ج)"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    style={{ padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)' }}
                  />
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    style={{ padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)' }}
                  >
                    {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nameFr} ({cat.nameAr})</option>
                    ))}
                  </select>
                </div>

                <input
                  type="url"
                  placeholder="URL de l image (https://...)"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', marginBottom: '0.75rem' }}
                />

                <textarea
                  placeholder="Description détaillée du produit..."
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', marginBottom: '1rem', resize: 'vertical' }}
                />

                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className="btn-store-call"
                    style={{ padding: '0.5rem 1rem' }}
                    onClick={() => setShowAddForm(false)}
                  >
                    {isAr ? 'إلغاء' : 'Annuler'}
                  </button>
                  <button
                    type="submit"
                    className="btn-add-cart"
                    style={{ width: 'auto', padding: '0.5rem 1.25rem' }}
                  >
                    {isAr ? 'حفظ السلعة' : 'Enregistrer'}
                  </button>
                </div>
              </form>
            )}

            {/* Existing Products List */}
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '800', marginBottom: '0.75rem' }}>
                {isAr ? `السلع المعروضة حالياً (${storeProducts.length})` : `Articles dans votre vitrine (${storeProducts.length})`}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '280px', overflowY: 'auto' }}>
                {storeProducts.map(prod => (
                  <div
                    key={prod.id}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.85rem', background: 'var(--surface-alt)', borderRadius: '10px', border: '1px solid var(--border)' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img src={prod.image} alt={prod.name} style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: '700' }}>{isAr && prod.nameAr ? prod.nameAr : prod.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '700' }}>{prod.price.toLocaleString()} DZD</div>
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteProduct(prod.id)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.4rem' }}
                      title="Supprimer l article"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: STORE REVIEWS & FEEDBACK */}
        {activeSubTab === 'reviews' && (
          <div>
            <div
              style={{
                background: 'var(--surface-alt)',
                borderRadius: '16px',
                padding: '1rem',
                border: '1px solid var(--border-light)',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {isAr ? 'تقييم تجربة المتجر العام من الزبائن:' : 'Note moyenne de votre vitrine :'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                  <span style={{ fontSize: '1.8rem', fontWeight: '900', color: '#f59e0b' }}>
                    {currentStore.rating || 4.8}
                  </span>
                  <div style={{ display: 'flex' }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={16} color="#f59e0b" fill="#f59e0b" />
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.82rem', textAlign: isAr ? 'left' : 'right', color: 'var(--text-muted)' }}>
                <div><strong>{reviewsForThisStore.length || currentStore.reviewsCount || 42}</strong> {isAr ? 'زبون قيّموا متجرك' : 'avis clients'}</div>
                <div style={{ color: '#16a34a', fontWeight: '700', marginTop: '0.2rem' }}>
                  {isAr ? '98% نسبة الرضا' : '98% de satisfaction'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '320px', overflowY: 'auto' }}>
              {reviewsForThisStore.length > 0 ? (
                reviewsForThisStore.map((rev) => (
                  <div
                    key={rev.id}
                    style={{
                      background: 'var(--surface-alt)',
                      borderRadius: '12px',
                      padding: '0.85rem',
                      border: '1px solid var(--border-light)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                      <span style={{ fontWeight: '800', fontSize: '0.88rem' }}>{rev.customerName}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{rev.date}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.35rem' }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={13} color={s <= rev.rating ? '#f59e0b' : '#cbd5e1'} fill={s <= rev.rating ? '#f59e0b' : 'none'} />
                      ))}
                      <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#f59e0b' }}>{rev.rating}/5</span>
                    </div>

                    <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                      "{isAr ? rev.comment : (rev.commentFr || rev.comment)}"
                    </p>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
                  <Star size={30} color="#f59e0b" style={{ margin: '0 auto 0.5rem', opacity: 0.4 }} />
                  <p>{isAr ? 'لا توجد تقييمات مسجلة بعد لهذا المتجر.' : 'Aucun avis enregistré pour le moment.'}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
