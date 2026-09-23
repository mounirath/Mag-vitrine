import React, { useState, useRef, useEffect } from 'react';
import { ShoppingCart, Moon, Sun, Camera, Search, Wifi, BatteryMedium, Signal, Sparkles, Plus, MapPin, ShieldCheck, Calculator, SlidersHorizontal, User, Store, LogIn, UserPlus, ChevronDown, Check, LogOut } from 'lucide-react';

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
  t
}) {
  const isAr = lang === 'ar';
  const [isAuthDropdownOpen, setIsAuthDropdownOpen] = useState(false);
  const authContainerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (authContainerRef.current && !authContainerRef.current.contains(event.target)) {
        setIsAuthDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOpenAuth = (mode) => {
    setIsAuthDropdownOpen(false);
    if (onOpenAuth) {
      onOpenAuth(mode);
    }
  };

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

        {/* Quick Filter Pills + Interactive Auth Entry Box */}
        <div className="quick-pills-row" style={{ position: 'relative' }}>
          {/* خانة الدخول والتسجيل الرئيسية - Auth Container with Dropdown inside it */}
          <div ref={authContainerRef} style={{ position: 'relative', display: 'inline-flex', flexShrink: 0 }}>
            <button
              className={`quick-pill-btn ${currentUser ? 'user-active' : 'auth-main-btn'}`}
              onClick={() => setIsAuthDropdownOpen(prev => !prev)}
              style={{
                background: currentUser
                  ? (currentUser.role === 'store' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #0284c7, #0369a1)')
                  : 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#ffffff',
                border: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.45rem 0.85rem'
              }}
              title={isAr ? 'تسجيل الدخول / إنشاء حساب' : 'Connexion / Inscription'}
            >
              {currentUser ? (
                currentUser.role === 'store' ? <Store size={15} /> : <User size={15} />
              ) : (
                <LogIn size={15} />
              )}
              <span>
                {currentUser
                  ? (currentUser.name ? currentUser.name.split(' ')[0] : (isAr ? 'حسابي' : 'Mon compte'))
                  : (isAr ? 'دخول / حساب' : 'Connexion')}
              </span>
              <ChevronDown size={14} style={{ opacity: 0.85, transform: isAuthDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>

            {/* Auth Popup Menu: Rendered INSIDE authContainerRef so clicks don't close it prematurely */}
            {isAuthDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  marginTop: '0.5rem',
                  zIndex: 9999,
                  background: 'var(--surface)',
                  borderRadius: '20px',
                  border: '1px solid var(--border-light)',
                  boxShadow: '0 16px 36px rgba(0, 0, 0, 0.28)',
                  padding: '1rem',
                  width: '360px',
                  maxWidth: 'calc(100vw - 2.5rem)',
                  color: 'var(--text-main)',
                  left: isAr ? 'auto' : '0',
                  right: isAr ? '0' : 'auto',
                  animation: 'fadeInSlide 0.2s ease-out'
                }}
              >
                {currentUser ? (
                  /* Already logged in view */
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', paddingBottom: '0.8rem', borderBottom: '1px solid var(--border-light)', marginBottom: '0.8rem' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: currentUser.role === 'store' ? '#ecfdf5' : '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {currentUser.role === 'store' ? <Store size={20} color="#059669" /> : <User size={20} color="#0284c7" />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '800', fontSize: '0.95rem' }}>{currentUser.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{currentUser.email}</div>
                      </div>
                      <span style={{ fontSize: '0.7rem', fontWeight: '800', padding: '0.15rem 0.5rem', borderRadius: '6px', background: currentUser.role === 'store' ? '#d1fae5' : '#e0f2fe', color: currentUser.role === 'store' ? '#047857' : '#0369a1' }}>
                        {currentUser.role === 'store' ? (isAr ? 'تاجر معتمد' : 'Vendeur') : (isAr ? 'زبون' : 'Client')}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setIsAuthDropdownOpen(false);
                        if (onLogout) onLogout();
                      }}
                      style={{ width: '100%', padding: '0.65rem', background: '#fee2e2', color: '#b91c1c', border: 'none', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem' }}
                    >
                      <LogOut size={16} />
                      <span>{isAr ? 'تسجيل الخروج' : 'Se déconnecter'}</span>
                    </button>
                  </div>
                ) : (
                  /* Two columns/sections: User section + Merchant section */
                  <div>
                    <div style={{ textAlign: 'center', marginBottom: '0.85rem' }}>
                      <div style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-main)' }}>
                        {isAr ? 'مرحباً بك في MAG VITRINE' : 'Bienvenue sur MAG VITRINE'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {isAr ? 'اختر نوع الحساب للمتابعة' : 'Choisissez votre espace pour continuer'}
                      </div>
                    </div>

                    {/* Grid 2 Columns: User vs Merchant */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      {/* Column 1: Client / المستخدم */}
                      <div
                        style={{
                          background: 'var(--surface-alt)',
                          border: '1.5px solid #bae6fd',
                          borderRadius: '16px',
                          padding: '0.85rem 0.75rem',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          textAlign: 'center'
                        }}
                      >
                        <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.4rem' }}>
                          <User size={20} color="#0284c7" />
                        </div>
                        <div style={{ fontWeight: '800', fontSize: '0.85rem', color: '#0369a1', marginBottom: '0.2rem' }}>
                          {isAr ? 'المستخدم / الزبون' : 'Espace Client'}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '0.6rem', lineHeight: '1.2' }}>
                          {isAr ? 'شراء، طلب وتتبع' : 'Acheter & commander'}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleOpenAuth('login_customer')}
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            background: '#0284c7',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '0.75rem',
                            fontWeight: '800',
                            cursor: 'pointer',
                            marginBottom: '0.4rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.25rem'
                          }}
                        >
                          <LogIn size={13} />
                          <span>{isAr ? 'دخول الزبون' : 'Connexion'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenAuth('register_client')}
                          style={{
                            width: '100%',
                            padding: '0.45rem',
                            background: '#ffffff',
                            color: '#0284c7',
                            border: '1.5px solid #0284c7',
                            borderRadius: '10px',
                            fontSize: '0.74rem',
                            fontWeight: '800',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.25rem'
                          }}
                        >
                          <UserPlus size={13} />
                          <span>{isAr ? 'إنشاء حساب زبون' : 'Inscription'}</span>
                        </button>
                      </div>

                      {/* Column 2: Merchant / التاجر */}
                      <div
                        style={{
                          background: 'linear-gradient(180deg, #fef3c7 0%, #fffbeb 100%)',
                          border: '1.5px solid #fde68a',
                          borderRadius: '16px',
                          padding: '0.85rem 0.75rem',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          textAlign: 'center'
                        }}
                      >
                        <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.4rem', boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}>
                          <Store size={20} color="#d97706" />
                        </div>
                        <div style={{ fontWeight: '800', fontSize: '0.85rem', color: '#92400e', marginBottom: '0.2rem' }}>
                          {isAr ? 'التاجر / المتجر' : 'Espace Vendeur'}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#b45309', marginBottom: '0.6rem', lineHeight: '1.2' }}>
                          {isAr ? '50 إعلان مجاني' : '50 annonces gratuites'}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleOpenAuth('login_store')}
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            background: '#d97706',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '0.75rem',
                            fontWeight: '800',
                            cursor: 'pointer',
                            marginBottom: '0.4rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.25rem'
                          }}
                        >
                          <LogIn size={13} />
                          <span>{isAr ? 'دخول تاجر' : 'Connexion'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenAuth('register_store')}
                          style={{
                            width: '100%',
                            padding: '0.45rem',
                            background: '#ffffff',
                            color: '#b45309',
                            border: '1.5px solid #d97706',
                            borderRadius: '10px',
                            fontSize: '0.74rem',
                            fontWeight: '800',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.25rem'
                          }}
                        >
                          <Store size={13} />
                          <span>{isAr ? 'فتح فترينة متجر' : 'Ouvrir Vitrine'}</span>
                        </button>
                      </div>
                    </div>

                    <div style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {isAr ? '🔒 موثق ومؤمن بالكامل عبر الشبكة الوطنية الجزائرية' : '🔒 Connexion 100% sécurisée pour les 58 Wilayas'}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Direct 1-Click Create Account Button when not logged in */}
          {!currentUser && (
            <button
              className="quick-pill-btn"
              onClick={() => handleOpenAuth('register_client')}
              style={{
                background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                color: '#ffffff',
                border: 'none',
                boxShadow: '0 2px 8px rgba(2, 132, 199, 0.35)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.45rem 0.85rem'
              }}
              title={isAr ? 'إنشاء حساب جديد فوراً' : 'Créer un compte client'}
            >
              <UserPlus size={15} />
              <span>{isAr ? 'إنشاء حساب' : 'Inscription'}</span>
            </button>
          )}

          {/* Quick pills */}
          <button
            className={`quick-pill-btn ${selectedCategory === 'cat_furniture' ? 'active' : ''}`}
            onClick={() => onSelectCategory(selectedCategory === 'cat_furniture' ? 'all' : 'cat_furniture')}
          >
            <span>🛋️ Furniture</span>
          </button>

          <button
            className="quick-pill-btn action"
            onClick={onOpenPublish}
          >
            <Plus size={15} />
            <span>Publier</span>
          </button>

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

