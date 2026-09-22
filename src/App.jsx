import React, { useState, useMemo } from 'react';
import { useAppStore } from './data/store';
import { WILAYAS } from './data/initialData';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CategoryBar } from './components/CategoryBar';
import { StoreCard } from './components/StoreCard';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { CameraAiSearchModal } from './components/CameraAiSearchModal';
import { StoreDashboardModal } from './components/StoreDashboardModal';
import { Footer } from './components/Footer';
import { Search, Store, Package, Sparkles, Filter, Camera } from 'lucide-react';

export default function App() {
  const {
    lang,
    setLang,
    theme,
    setTheme,
    stores,
    products,
    cart,
    orders,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    addProduct,
    deleteProduct,
    createOrder,
    t
  } = useAppStore();

  const [activeTab, setActiveTab] = useState('home');
  const [selectedWilaya, setSelectedWilaya] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isAiSearchOpen, setIsAiSearchOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter(prod => {
      const matchCat = selectedCategory === 'all' || prod.categoryId === selectedCategory;
      const matchWilaya = selectedWilaya === 'all' || prod.wilaya.toLowerCase() === selectedWilaya.toLowerCase();
      const matchSearch =
        !searchTerm.trim() ||
        prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (prod.nameAr && prod.nameAr.includes(searchTerm)) ||
        (prod.description && prod.description.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchCat && matchWilaya && matchSearch;
    });
  }, [products, selectedCategory, selectedWilaya, searchTerm]);

  // Filtered Stores
  const filteredStores = useMemo(() => {
    return stores.filter(st => {
      const matchWilaya = selectedWilaya === 'all' || st.wilaya.toLowerCase() === selectedWilaya.toLowerCase();
      const matchSearch =
        !searchTerm.trim() ||
        st.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        st.description.toLowerCase().includes(searchTerm.toLowerCase());

      return matchWilaya && matchSearch;
    });
  }, [stores, selectedWilaya, searchTerm]);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="app-container">
      {/* Navbar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        lang={lang}
        setLang={setLang}
        theme={theme}
        setTheme={setTheme}
        onOpenAiSearch={() => setIsAiSearchOpen(true)}
        t={t}
      />

      {/* Main Content Area */}
      <main>
        {/* Search & Wilayas Bar */}
        <div className="search-container" style={{ marginTop: '1.5rem' }}>
          <div className="search-bar">
            <Search size={19} color="var(--text-muted)" />
            <input
              type="text"
              className="search-input"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="wilaya-select"
              value={selectedWilaya}
              onChange={(e) => setSelectedWilaya(e.target.value)}
            >
              <option value="all">📍 {t.filterAllWilayas}</option>
              {WILAYAS.map(w => (
                <option key={w.code} value={w.name}>
                  {w.code} - {w.name} ({w.nameAr})
                </option>
              ))}
            </select>
            <button
              className="ai-search-btn"
              onClick={() => setIsAiSearchOpen(true)}
              title={t.cameraSearchTitle}
            >
              <Camera size={15} />
              <span>IA Photo</span>
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="section-wrap" style={{ marginBottom: '1.5rem' }}>
          <CategoryBar
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            lang={lang}
          />
        </div>

        {/* Home Tab */}
        {activeTab === 'home' && (
          <>
            <HeroBanner
              lang={lang}
              onExploreStores={() => setActiveTab('stores')}
              onExploreCatalog={() => setActiveTab('catalog')}
              t={t}
            />

            {/* Featured Stores */}
            <section className="section-wrap">
              <div className="section-head">
                <h2 className="section-title">
                  <Store size={22} color="var(--primary)" />
                  <span>{t.navStores}</span>
                </h2>
                <button
                  className="nav-item"
                  onClick={() => setActiveTab('stores')}
                  style={{ color: 'var(--primary)', fontWeight: '700' }}
                >
                  Voir tout ({stores.length}) →
                </button>
              </div>
              <div className="stores-grid">
                {filteredStores.slice(0, 3).map(store => (
                  <StoreCard
                    key={store.id}
                    store={store}
                    onSelectStore={(id) => {
                      setSearchTerm(store.name);
                      setActiveTab('catalog');
                    }}
                    t={t}
                  />
                ))}
              </div>
            </section>

            {/* Featured Products */}
            <section className="section-wrap">
              <div className="section-head">
                <h2 className="section-title">
                  <Sparkles size={22} color="var(--accent)" />
                  <span>Nouveautés & Offres Populaires</span>
                </h2>
                <button
                  className="nav-item"
                  onClick={() => setActiveTab('catalog')}
                  style={{ color: 'var(--primary)', fontWeight: '700' }}
                >
                  Tout afficher ({products.length}) →
                </button>
              </div>
              <div className="products-grid">
                {filteredProducts.slice(0, 6).map(prod => {
                  const store = stores.find(s => s.id === prod.storeId);
                  return (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      store={store}
                      onSelectProduct={setSelectedProduct}
                      onAddToCart={addToCart}
                      lang={lang}
                      t={t}
                    />
                  );
                })}
              </div>
            </section>
          </>
        )}

        {/* Stores Tab */}
        {activeTab === 'stores' && (
          <section className="section-wrap">
            <div className="section-head">
              <h2 className="section-title">
                <Store size={22} color="var(--primary)" />
                <span>{t.navStores} ({filteredStores.length})</span>
              </h2>
            </div>
            <div className="stores-grid">
              {filteredStores.map(store => (
                <StoreCard
                  key={store.id}
                  store={store}
                  onSelectStore={() => {
                    setSearchTerm(store.name);
                    setActiveTab('catalog');
                  }}
                  t={t}
                />
              ))}
            </div>
          </section>
        )}

        {/* Catalog Tab */}
        {activeTab === 'catalog' && (
          <section className="section-wrap">
            <div className="section-head">
              <h2 className="section-title">
                <Package size={22} color="var(--primary)" />
                <span>{t.navCatalog} ({filteredProducts.length})</span>
              </h2>
            </div>
            {filteredProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                <p>Aucun produit ne correspond à votre recherche.</p>
              </div>
            ) : (
              <div className="products-grid">
                {filteredProducts.map(prod => {
                  const store = stores.find(s => s.id === prod.storeId);
                  return (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      store={store}
                      onSelectProduct={setSelectedProduct}
                      onAddToCart={addToCart}
                      lang={lang}
                      t={t}
                    />
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* Tracking Tab */}
        {activeTab === 'tracking' && (
          <section className="section-wrap" style={{ maxWidth: '640px' }}>
            <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
              <OrderTrackingModal
                isOpen={true}
                onClose={() => setActiveTab('home')}
                orders={orders}
                lang={lang}
                t={t}
              />
            </div>
          </section>
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <section className="section-wrap" style={{ maxWidth: '720px' }}>
            <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
              <StoreDashboardModal
                isOpen={true}
                onClose={() => setActiveTab('home')}
                store={stores[0]}
                products={products}
                onAddProduct={addProduct}
                onDeleteProduct={deleteProduct}
                lang={lang}
                t={t}
              />
            </div>
          </section>
        )}
      </main>

      {/* Modals */}
      <ProductModal
        product={selectedProduct}
        store={stores.find(s => s.id === selectedProduct?.storeId)}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={addToCart}
        lang={lang}
        t={t}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={updateQuantity}
        onRemoveItem={removeFromCart}
        onClearCart={clearCart}
        onCreateOrder={createOrder}
        t={t}
      />

      <CameraAiSearchModal
        isOpen={isAiSearchOpen}
        onClose={() => setIsAiSearchOpen(false)}
        onSelectCategory={setSelectedCategory}
        setSearchTerm={setSearchTerm}
        lang={lang}
        t={t}
      />

      {/* Footer */}
      <Footer lang={lang} t={t} />
    </div>
  );
}
