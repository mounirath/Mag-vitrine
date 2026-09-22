import React from 'react';
import { ShoppingCart, Moon, Sun, Store, Package, Truck, LayoutDashboard, Camera } from 'lucide-react';

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
  t
}) {
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
        </div>
      </div>
    </header>
  );
}
