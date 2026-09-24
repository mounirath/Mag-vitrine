import React from 'react';
import { ShoppingCart, Moon, Sun, Camera, Search, Wifi, BatteryMedium, Signal, Sparkles, Plus, MapPin, ShieldCheck, Calculator, SlidersHorizontal, User, Store, Database } from 'lucide-react';

export function Header({
  lang,
  setLang,
  theme,
  setTheme,
  cartCount,
  onOpenCart,
  onOpenAiSearch,
  onOpenPublish,
  onOpenLocalConnect,
  onOpenTrustPortal,
  onOpenEstimator,
  onOpenFilter,
  selectedCategory,
  onSelectCategory,
  searchTerm,
  setSearchTerm,
  wilayaFilter,
  setWilayaFilter,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenSupabaseConfig,
  isSupabaseConfigured = false,
  t
}) {
  const isAr = lang === 'ar';
  const isStoreUser = Boolean(currentUser && (currentUser.role === 'store' || currentUser.storeId));

  return (
    <div>
      {/* Phone Status Bar (Native App Aesthetic) */}
      <div className="phone-status-bar">
        <span>9:41</span>
        <div className="status-bar-icons">
          <Signal size={14} />
          <Wifi size={14} />
          <BatteryMedium size={16} />
        </div>
      </div>

      {/* Navy Top Header matching screenshot */}
      <header className="navy-top-header">
        {/* Top Row: Title + Quick Tool Buttons */}
        <div className="navy-top-row">
          <div>
            <h1 className="header-app-title">
              {isAr ? 'اكتشف وبع في الجزائر' : 'Découvrez & Vendez'}
            </h1>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: '700' }}>
              MAG VITRINE • 58 Wilayas
            </span>
          </div>

          <div className="header-actions-group">
            {/* AI Camera Search */}
            <button
              className="header-icon-pill"
              onClick={onOpenAiSearch}
              title="Recherche Photo IA"
              aria-label="AI Camera"
            >
              <Camera size={18} color="#38bdf8" />
            </button>

            {/* Language Switch */}
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '9999px', padding: '0.25rem 0.5rem', fontSize: '0.75rem', fontWeight: '700', outline: 'none', cursor: 'pointer' }}
              aria-label="Langue"
            >
              <option value="fr" style={{ color: '#000' }}>FR</option>
              <option value="ar" style={{ color: '#000' }}>عربي</option>
              <option value="en" style={{ color: '#000' }}>EN</option>
            </select>

            {/* Theme toggle */}
            <button
              className="header-icon-pill"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              title="Toggle theme"
              aria-label="Theme"
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>

            {/* Supabase Cloud Backend Config */}
            {onOpenSupabaseConfig && (
              <button
                className="header-icon-pill"
                onClick={onOpenSupabaseConfig}
                title={isAr ? 'خادم وقاعدة بيانات Supabase' : 'Backend Supabase'}
                aria-label="Supabase Config"
                style={{ position: 'relative' }}
              >
                <Database size={16} color="#34d399" />
                <span
                  style={{
                    position: 'absolute',
                    bottom: '1px',
                    right: '1px',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: isSupabaseConfigured ? '#10b981' : '#f59e0b'
                  }}
                />
              </button>
            )}

            {/* Shopping Cart */}
            <button
              className="header-icon-pill"
              style={{ position: 'relative' }}
              onClick={onOpenCart}
              title="Panier"
              aria-label="Panier"
            >
              <ShoppingCart size={17} />
              {cartCount > 0 && (
                <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: 'var(--orange-action)', color: '#fff', fontSize: '0.65rem', fontWeight: '800', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #0f172a' }}>
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Primary Search Bar matching screenshot */}
        <div className="navy-search-box">
          <Search size={19} color="#64748b" />
          <input
            type="text"
            className="navy-search-input"
            placeholder={isAr ? 'ابحث عن أثاث، إلكترونيات، ملابس، سيارات...' : 'Rechercher un objet, une marque, un magasin...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={onOpenFilter}
            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            title="Filtres avancés"
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>

        {/* Quick Filter Pills */}
        <div className="quick-pills-row">

          {/* Quick pills */}
          <button
            className={`quick-pill-btn ${selectedCategory === 'cat_furniture' ? 'active' : ''}`}
            onClick={() => onSelectCategory(selectedCategory === 'cat_furniture' ? 'all' : 'cat_furniture')}
          >
            <span>🛋️ Furniture</span>
          </button>

          {/* Quick pill: Publier (Visible ONLY for Store / Merchant) */}
          {isStoreUser && (
            <button
              className="quick-pill-btn action"
              onClick={onOpenPublish}
              style={{
                background: 'linear-gradient(135deg, #d97706, #b45309)',
                color: '#ffffff',
                border: 'none',
                boxShadow: '0 2px 6px rgba(217, 119, 6, 0.3)'
              }}
              title={isAr ? 'نشر إعلان جديد للمتجر' : 'Publier une annonce magasin'}
            >
              <Plus size={15} />
              <span>{isAr ? 'نشر إعلان' : 'Publier'}</span>
            </button>
          )}

          <button
            className="quick-pill-btn action"
            onClick={onOpenLocalConnect}
          >
            <MapPin size={15} color="#38bdf8" />
            <span>Local-Connect</span>
          </button>

          <button
            className="quick-pill-btn action"
            onClick={onOpenTrustPortal}
          >
            <ShieldCheck size={15} color="#a855f7" />
            <span>Confiance</span>
          </button>

          <button
            className="quick-pill-btn action"
            onClick={onOpenEstimator}
          >
            <Calculator size={15} color="#f59e0b" />
            <span>Estimateur</span>
          </button>
        </div>

        {/* Secondary Search / Wilaya bar */}
        <div className="sub-search-box">
          <Search size={16} color="rgba(255, 255, 255, 0.7)" />
          <input
            type="text"
            placeholder={isAr ? 'تصفية حسب الولاية أو المدينة (الجزائر، وهران...)' : 'Filtrer par Wilaya (Alger, Oran, Constantine...)'}
            value={wilayaFilter}
            onChange={(e) => setWilayaFilter(e.target.value)}
          />
          {wilayaFilter && (
            <button
              onClick={() => setWilayaFilter('')}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '0.8rem' }}
            >
              ✕
            </button>
          )}
        </div>
      </header>
    </div>
  );
}

