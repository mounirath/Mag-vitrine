import React, { useState } from 'react';
import { ShoppingCart, Moon, Sun, Store, Package, Truck, LayoutDashboard, Camera, User, LogIn, LogOut, ChevronDown } from 'lucide-react';

export function Header({
  activeTab,
  setActiveTab,
  cartCount,
  onOpenCart,
  lang,
  setLang,
  theme,
  setTheme,
  onOpenAiSearch,
  currentUser,
  onOpenAuth,
  onLogout,
  t
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="navbar">
      <div className="nav-inner">
        {/* Brand */}
        <div className="brand-wrap" onClick={() => setActiveTab('home')}>
          <img
            src="/assets/ic_mag_vitrine_icon.jpg"
            alt="MAG VITRINE"
            className="brand-logo"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=100'; }}
          />
          <div>
            <h1 className="brand-title">{t.appTitle}</h1>
            <span className="brand-sub">{t.appSubtitle}</span>
          </div>
        </div>

        {/* Navigation Tabs (Desktop) */}
        <nav className="nav-links">
          <button
            className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            {t.navHome}
          </button>
          <button
            className={`nav-item ${activeTab === 'stores' ? 'active' : ''}`}
            onClick={() => setActiveTab('stores')}
          >
            <Store size={16} />
            {t.navStores}
          </button>
          <button
            className={`nav-item ${activeTab === 'catalog' ? 'active' : ''}`}
            onClick={() => setActiveTab('catalog')}
          >
            <Package size={16} />
            {t.navCatalog}
          </button>
          <button
            className={`nav-item ${activeTab === 'tracking' ? 'active' : ''}`}
            onClick={() => setActiveTab('tracking')}
          >
            <Truck size={16} />
            {t.navTracking}
          </button>
          <button
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={16} />
            {t.navDashboard}
          </button>
        </nav>

        {/* Controls */}
        <div className="nav-controls">
          {/* AI Camera Search */}
          <button
            className="icon-btn"
            title={t.cameraSearchTitle}
            onClick={onOpenAiSearch}
            aria-label="AI Camera Search"
          >
            <Camera size={19} color="#8b5cf6" />
          </button>

          {/* Theme Toggle */}
          <button
            className="icon-btn"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Language Selector */}
          <select
            className="lang-select"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            aria-label="Select Language"
          >
            <option value="fr">FR</option>
            <option value="ar">عربي</option>
            <option value="en">EN</option>
          </select>

          {/* Shopping Cart Button */}
          <button
            className="icon-btn"
            onClick={onOpenCart}
            title={t.cartTitle}
            aria-label="Shopping Cart"
          >
            <ShoppingCart size={19} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          {/* User Account / Login Button */}
          {currentUser ? (
            <div style={{ position: 'relative' }}>
              <button
                className="nav-item"
                style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: '9999px', padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                {currentUser.role === 'store' ? <Store size={16} color="var(--primary)" /> : <User size={16} color="var(--primary)" />}
                <span style={{ fontWeight: '700', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentUser.name}
                </span>
                <ChevronDown size={14} />
              </button>

              {showUserMenu && (
                <div
                  style={{ position: 'absolute', top: '110%', right: 0, width: '220px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: 'var(--shadow-lg)', padding: '0.5rem', zIndex: 1100 }}
                  onClick={() => setShowUserMenu(false)}
                >
                  <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border)', marginBottom: '0.3rem' }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: '800' }}>{currentUser.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{currentUser.email}</div>
                    <span style={{ fontSize: '0.72rem', fontWeight: '700', padding: '0.15rem 0.4rem', borderRadius: '4px', background: currentUser.role === 'store' ? 'rgba(4, 120, 87, 0.15)' : 'var(--surface-alt)', color: currentUser.role === 'store' ? 'var(--primary)' : 'inherit' }}>
                      {currentUser.role === 'store' ? t.authStoreBadge : t.authClientBadge}
                    </span>
                  </div>

                  {currentUser.role === 'store' && (
                    <button
                      className="nav-item"
                      style={{ width: '100%', justifyContent: 'flex-start', padding: '0.45rem 0.75rem' }}
                      onClick={() => setActiveTab('dashboard')}
                    >
                      <LayoutDashboard size={15} />
                      <span>{t.navDashboard}</span>
                    </button>
                  )}

                  <button
                    className="nav-item"
                    style={{ width: '100%', justifyContent: 'flex-start', padding: '0.45rem 0.75rem' }}
                    onClick={() => setActiveTab('tracking')}
                  >
                    <Truck size={15} />
                    <span>{t.navTracking}</span>
                  </button>

                  <button
                    className="nav-item"
                    style={{ width: '100%', justifyContent: 'flex-start', padding: '0.45rem 0.75rem', color: '#ef4444' }}
                    onClick={onLogout}
                  >
                    <LogOut size={15} />
                    <span>{t.authLogout}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="btn-add-cart"
              style={{ width: 'auto', padding: '0.45rem 0.9rem', fontSize: '0.85rem', borderRadius: '9999px' }}
              onClick={() => onOpenAuth('login')}
            >
              <LogIn size={15} />
              <span>{t.authLogin}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
