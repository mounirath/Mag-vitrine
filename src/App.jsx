import React, { useState, useMemo } from 'react';
import { useAppStore } from './data/store';
import { WILAYAS, CATEGORIES } from './data/initialData';
import { Header } from './components/Header';
import { CategoryBar } from './components/CategoryBar';
import { ProductCard } from './components/ProductCard';
import { CollectionsBanner } from './components/CollectionsBanner';
import { BottomNavBar } from './components/BottomNavBar';
import { ListingInsightModal } from './components/ListingInsightModal';
import { TrustSafetyPortal } from './components/TrustSafetyPortal';
import { LocalConnectView } from './components/LocalConnectView';
import { ValueEstimatorModal } from './components/ValueEstimatorModal';
import { AdvancedFilterModal } from './components/AdvancedFilterModal';
import { NegotiationChatModal } from './components/NegotiationChatModal';
import { PublishModal } from './components/PublishModal';
import { UserProfileTab } from './components/UserProfileTab';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { CameraAiSearchModal } from './components/CameraAiSearchModal';
import { TermsAndConditionsModal } from './components/TermsAndConditionsModal';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';
import { SupabaseAdminDashboardModal } from './components/SupabaseAdminDashboardModal';
import { isSupabaseConfigured } from './lib/supabase';
import { StoreDashboardModal } from './components/StoreDashboardModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { RateStoreModal } from './components/RateStoreModal';
import { RateCustomerModal } from './components/RateCustomerModal';
import { CustomerSeriousnessModal } from './components/CustomerSeriousnessModal';
import { StoreReviewsModal } from './components/StoreReviewsModal';
import { Plus, SlidersHorizontal, MapPin } from 'lucide-react';

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
    storeReviews,
    customerRatings,
    users,
    rateStore,
    rateCustomer,
    getCustomerReliability,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    addProduct,
    updateProduct,
    deleteProduct,
    updateStore,
    deleteStore,
    createOrder,
    updateOrder,
    deleteOrder,
    deleteStoreReview,
    deleteCustomerRating,
    refreshFromSupabase,
    currentUser,
    registerCustomer,
    registerStore,
    login,
    logout,
    t
  } = useAppStore();

  // Navigation tab: 'home', 'local_connect', 'publish', 'messages', 'profile'
  const [activeTab, setActiveTab] = useState('home');

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [wilayaFilter, setWilayaFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [advancedFilters, setAdvancedFilters] = useState(null);

  // Favorites state (initialized with Sofa Design favorited as in screenshot)
  const [favorites, setFavorites] = useState(new Set(['prod_sofa']));

  // Modal Views
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isTrustPortalOpen, setIsTrustPortalOpen] = useState(false);
  const [isEstimatorOpen, setIsEstimatorOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAiSearchOpen, setIsAiSearchOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [negotiationProduct, setNegotiationProduct] = useState(null);

  // Merchant rating and customer reliability modals state
  const [rateStoreConfig, setRateStoreConfig] = useState({ isOpen: false, store: null, order: null });
  const [rateCustomerConfig, setRateCustomerConfig] = useState({ isOpen: false, order: null });
  const [customerSeriousnessConfig, setCustomerSeriousnessConfig] = useState({ isOpen: false, customer: null, reliability: null });
  const [storeReviewsConfig, setStoreReviewsConfig] = useState({ isOpen: false, store: null });

  // Auth modal
  const [authModalConfig, setAuthModalConfig] = useState({ isOpen: false, initialMode: 'login' });

  // Terms and conditions modal (شروط وأحكام استخدام التطبيق)
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  // Supabase Backend Settings & Migration modal
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  // Check if current browser URL corresponds to /admin
  const checkIsAdminRoute = () => {
    if (typeof window === 'undefined') return false;
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = new URLSearchParams(window.location.search).get('view');
    return path === '/admin' || path.startsWith('/admin/') || hash === '#admin' || search === 'admin';
  };

  // Supabase Super-Admin Dashboard modal state initialized from URL
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(checkIsAdminRoute);

  // Sync URL changes (Back / Forward button, direct hash or route)
  React.useEffect(() => {
    const handleUrlChange = () => {
      if (checkIsAdminRoute()) {
        setIsAdminDashboardOpen(true);
      }
    };
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const handleOpenAdminDashboard = () => {
    setIsAdminDashboardOpen(true);
    try {
      if (window.location.pathname !== '/admin') {
        window.history.pushState({ view: 'admin' }, '', '/admin');
      }
    } catch (e) {
      window.location.hash = '#admin';
    }
  };

  const handleCloseAdminDashboard = () => {
    setIsAdminDashboardOpen(false);
    try {
      if (window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin')) {
        window.history.pushState(null, '', '/');
      } else if (window.location.hash === '#admin') {
        window.history.pushState(null, '', window.location.pathname);
      }
    } catch (e) {
      // ignore
    }
  };

  // Toggle favorite
  const handleToggleFavorite = (productId) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  };

  // Filtered Products Logic
  const filteredProducts = useMemo(() => {
    return products.filter(prod => {
      // Category match
      if (selectedCategory !== 'all' && prod.categoryId !== selectedCategory) {
        return false;
      }
      // Wilaya match
      if (wilayaFilter.trim()) {
        const wLow = wilayaFilter.toLowerCase();
        const matchW = prod.wilaya?.toLowerCase().includes(wLow) || prod.location?.toLowerCase().includes(wLow);
        if (!matchW) return false;
      }
      // Search term
      if (searchTerm.trim()) {
        const sLow = searchTerm.toLowerCase();
        const matchName = prod.name?.toLowerCase().includes(sLow) || (prod.nameAr && prod.nameAr.includes(sLow));
        const matchDesc = prod.description?.toLowerCase().includes(sLow);
        const matchLoc = prod.location?.toLowerCase().includes(sLow);
        if (!matchName && !matchDesc && !matchLoc) return false;
      }
      // Advanced Filters
      if (advancedFilters) {
        if (advancedFilters.condition && advancedFilters.condition !== 'all') {
          if (prod.condition !== advancedFilters.condition) return false;
        }
        if (advancedFilters.material && advancedFilters.material !== 'all') {
          if (!prod.material || !prod.material.toLowerCase().includes(advancedFilters.material.toLowerCase())) {
            return false;
          }
        }
        if (advancedFilters.isElectronicsOnly && prod.categoryId !== 'cat_electronics') {
          return false;
        }
        if (advancedFilters.hasGuarantee && !prod.verifiedSeller) {
          return false;
        }
        if (advancedFilters.searchQuery && !prod.name.toLowerCase().includes(advancedFilters.searchQuery.toLowerCase())) {
          return false;
        }
      }
      return true;
    });
  }, [products, selectedCategory, wilayaFilter, searchTerm, advancedFilters]);

  // Total cart count
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Selected store for current selected product
  const currentStore = useMemo(() => {
    if (!selectedProduct) return stores[0];
    return stores.find(s => s.id === selectedProduct.storeId) || stores[0];
  }, [selectedProduct, stores]);

  // Is current logged in user a merchant / store
  const isStoreUser = Boolean(
    currentUser && (currentUser.role === 'store' || currentUser.storeId)
  );

  return (
    <div className="app-viewport" data-theme={theme} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="main-scroll-content">
        {/* Top Header matching screenshot */}
        <Header
          lang={lang}
          setLang={setLang}
          theme={theme}
          setTheme={setTheme}
          cartCount={totalCartCount}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenAiSearch={() => setIsAiSearchOpen(true)}
          onOpenPublish={() => setIsPublishModalOpen(true)}
          onOpenLocalConnect={() => setActiveTab('local_connect')}
          onOpenTrustPortal={() => setIsTrustPortalOpen(true)}
          onOpenEstimator={() => setIsEstimatorOpen(true)}
          onOpenFilter={() => setIsFilterOpen(true)}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          wilayaFilter={wilayaFilter}
          setWilayaFilter={setWilayaFilter}
          currentUser={currentUser}
          onOpenAuth={(mode) => setAuthModalConfig({ isOpen: true, initialMode: mode || 'login' })}
          onLogout={logout}
          onOpenSupabaseConfig={() => setIsSupabaseModalOpen(true)}
          onOpenAdminDashboard={handleOpenAdminDashboard}
          isSupabaseConfigured={isSupabaseConfigured()}
          t={t}
        />

        {/* View Switching based on bottom tab */}
        {activeTab === 'home' && (
          <main>
            {/* 1. Categories Row matching screenshot */}
            <CategoryBar
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              lang={lang}
              t={t}
            />

            {/* 2. Recent lines / Product Grid matching screenshot */}
            <section className="recent-lines-section">
              <div className="section-label-row">
                <div>
                  <h2 className="section-label" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <span>{lang === 'ar' ? 'إعلانات المحلات والمتاجر المعتمدة' : 'Annonces Exclusives Magasins'}</span>
                  </h2>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.15rem 0 0 0' }}>
                    {lang === 'ar' ? 'جميع العروض مدرجة من طرف محلات ومتاجر تجارية حقيقية بضمانات' : '100% articles vendus et garantis par des boutiques physiques agréées'}
                  </p>
                </div>
                <span
                  className="section-link"
                  onClick={() => setIsFilterOpen(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                >
                  <SlidersHorizontal size={14} />
                  <span>{lang === 'ar' ? 'تصفية' : 'Filtres'}</span>
                </span>
              </div>

              {filteredProducts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem 1rem', background: 'var(--surface)', borderRadius: '18px', border: '1px dashed var(--border-light)' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.8rem' }}>
                    {lang === 'ar' ? 'لا توجد إعلانات مطابقة لبحثك في المحلات حالياً.' : 'Aucun objet ne correspond à votre recherche.'}
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setWilayaFilter('');
                      setSelectedCategory('all');
                      setAdvancedFilters(null);
                    }}
                    style={{ background: 'var(--orange-action)', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}
                  >
                    {lang === 'ar' ? 'إعادة ضبط التصفية' : 'Réinitialiser les filtres'}
                  </button>
                </div>
              ) : (
                <div className="recent-lines-grid">
                  {filteredProducts.map((prod) => {
                    const prodStore = stores.find(s => s.id === prod.storeId) || stores[0];
                    return (
                      <ProductCard
                        key={prod.id}
                        product={prod}
                        store={prodStore}
                        onSelect={(p) => setSelectedProduct(p)}
                        isFavorite={favorites.has(prod.id)}
                        onToggleFavorite={handleToggleFavorite}
                        lang={lang}
                        t={t}
                      />
                    );
                  })}
                </div>
              )}
            </section>

            {/* 3. Collections du Moment matching screenshot */}
            <CollectionsBanner
              onSelectCollection={(colId) => {
                if (colId === 'col_artisanat') setSelectedCategory('cat_artisanat');
                else if (colId === 'col_eco') setSelectedCategory('cat_furniture');
                else setSelectedCategory('all');
              }}
              lang={lang}
              t={t}
            />
          </main>
        )}

        {/* Local-Connect Map View */}
        {activeTab === 'local_connect' && (
          <LocalConnectView
            products={products}
            stores={stores}
            isOpen={true}
            onClose={() => setActiveTab('home')}
            onSelectProduct={(p) => setSelectedProduct(p)}
            lang={lang}
            t={t}
          />
        )}

        {/* Messages / Negotiation tab */}
        {activeTab === 'messages' && (
          <NegotiationChatModal
            product={selectedProduct || products[0]}
            store={currentStore}
            isOpen={true}
            onClose={() => setActiveTab('home')}
            currentUser={currentUser}
            lang={lang}
            t={t}
          />
        )}

        {/* User Profile tab */}
        {activeTab === 'profile' && (
          <UserProfileTab
            currentUser={currentUser}
            onOpenAuth={(mode) => setAuthModalConfig({ isOpen: true, initialMode: mode })}
            onLogout={logout}
            onOpenDashboard={() => setIsDashboardOpen(true)}
            onOpenTracking={() => setIsTrackingOpen(true)}
            onOpenTrustPortal={() => setIsTrustPortalOpen(true)}
            onOpenPublish={() => setIsPublishModalOpen(true)}
            onOpenRateStore={(targetStore, targetOrder) => setRateStoreConfig({ isOpen: true, store: targetStore, order: targetOrder })}
            onOpenStoreReviews={(targetStore) => setStoreReviewsConfig({ isOpen: true, store: targetStore })}
            onOpenCustomerSeriousness={(targetCustomer, rel) => setCustomerSeriousnessConfig({ isOpen: true, customer: targetCustomer, reliability: rel })}
            getCustomerReliability={getCustomerReliability}
            onOpenTerms={() => setIsTermsOpen(true)}
            onOpenSupabaseConfig={() => setIsSupabaseModalOpen(true)}
            onOpenAdminDashboard={handleOpenAdminDashboard}
            stores={stores}
            orders={orders}
            lang={lang}
            t={t}
          />
        )}
      </div>

      {/* Floating "Vendre (+)" Orange Button matching Screenshot 2 */}
      <button
        className="btn-vendre-floating"
        onClick={() => {
          if (currentUser) {
            setIsPublishModalOpen(true);
          } else {
            setAuthModalConfig({ isOpen: true, initialMode: 'login' });
          }
        }}
        aria-label="Vendre ou publier une annonce"
        title={lang === 'ar' ? 'نشر إعلان جديد (+)' : 'Vendre (+)'}
      >
        <Plus size={20} />
        <span>{lang === 'ar' ? 'نشر إعلان (+)' : 'Vendre (+)'}</span>
      </button>

      {/* Bottom Navigation Bar matching screenshot */}
      <BottomNavBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadMessages={1}
        isStoreUser={isStoreUser}
        onOpenPublish={() => {
          if (currentUser) {
            setIsPublishModalOpen(true);
          } else {
            setAuthModalConfig({ isOpen: true, initialMode: 'login' });
          }
        }}
        lang={lang}
        t={t}
      />

      {/* MODALS */}

      {/* 1. Listing Insight Modal */}
      <ListingInsightModal
        product={selectedProduct}
        store={currentStore}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        isFavorite={selectedProduct ? favorites.has(selectedProduct.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onAddToCart={(prod) => {
          addToCart(prod, 1);
          setIsCartOpen(true);
        }}
        onOpenNegotiation={(prod) => {
          setNegotiationProduct(prod);
        }}
        onOpenTrustPortal={() => setIsTrustPortalOpen(true)}
        onOpenStoreReviews={(targetStore) => setStoreReviewsConfig({ isOpen: true, store: targetStore })}
        lang={lang}
        t={t}
      />

      {/* 2. Trust & Safety Portal Modal */}
      <TrustSafetyPortal
        isOpen={isTrustPortalOpen}
        onClose={() => setIsTrustPortalOpen(false)}
        store={currentStore}
        lang={lang}
        t={t}
      />

      {/* 3. Value Estimator Modal */}
      <ValueEstimatorModal
        isOpen={isEstimatorOpen}
        onClose={() => setIsEstimatorOpen(false)}
        initialItem={selectedProduct || products[1]} // TV LED 50" default as in screenshot
        lang={lang}
        t={t}
      />

      {/* 4. Advanced Filter Modal */}
      <AdvancedFilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        currentFilters={advancedFilters}
        onApplyFilters={(filters) => setAdvancedFilters(filters)}
        lang={lang}
        t={t}
      />

      {/* 5. Negotiation Chat Modal for a specific item */}
      {negotiationProduct && (
        <NegotiationChatModal
          product={negotiationProduct}
          store={currentStore}
          isOpen={true}
          onClose={() => setNegotiationProduct(null)}
          currentUser={currentUser}
          lang={lang}
          t={t}
        />
      )}

      {/* 6. Publish / Vendre (+) Modal */}
      <PublishModal
        isOpen={isPublishModalOpen || activeTab === 'publish'}
        onClose={() => {
          setIsPublishModalOpen(false);
          if (activeTab === 'publish') setActiveTab('home');
        }}
        onPublishSuccess={(newProd) => {
          addProduct(newProd);
        }}
        currentUser={currentUser}
        stores={stores}
        onOpenAuth={(mode) => setAuthModalConfig({ isOpen: true, initialMode: mode })}
        lang={lang}
        t={t}
      />

      {/* 7. Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onClearCart={clearCart}
        onCreateOrder={createOrder}
        currentUser={currentUser}
        t={t}
      />

      {/* 8. Auth Modal (Store Registration & User Account) */}
      <AuthModal
        isOpen={authModalConfig.isOpen}
        initialTab={authModalConfig.initialMode}
        onClose={() => setAuthModalConfig({ isOpen: false, initialMode: 'login' })}
        onLogin={login}
        onRegisterCustomer={registerCustomer}
        onRegisterStore={registerStore}
        onOpenTerms={() => setIsTermsOpen(true)}
        lang={lang}
        t={t}
      />

      {/* 9. AI Camera & Semantic Search Modal */}
      <CameraAiSearchModal
        isOpen={isAiSearchOpen}
        onClose={() => setIsAiSearchOpen(false)}
        products={products}
        stores={stores}
        onProductFound={(prod) => {
          setSelectedProduct(prod);
          setIsAiSearchOpen(false);
        }}
        onSelectCategory={setSelectedCategory}
        setSearchTerm={setSearchTerm}
        setWilayaFilter={setWilayaFilter}
        lang={lang}
        t={t}
      />

      {/* 10. Store Dashboard Modal */}
      <StoreDashboardModal
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        store={stores[0]}
        products={products}
        orders={orders}
        onAddProduct={addProduct}
        onDeleteProduct={deleteProduct}
        onOpenRateCustomer={(order) => setRateCustomerConfig({ isOpen: true, order })}
        onOpenCustomerSeriousness={(customer, rel) => setCustomerSeriousnessConfig({ isOpen: true, customer, reliability: rel })}
        onOpenStoreReviews={(targetStore) => setStoreReviewsConfig({ isOpen: true, store: targetStore })}
        getCustomerReliability={getCustomerReliability}
        storeReviews={storeReviews}
        lang={lang}
        t={t}
      />

      {/* 11. Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        orders={orders}
        stores={stores}
        onOpenRateStore={(targetStore, targetOrder) => setRateStoreConfig({ isOpen: true, store: targetStore, order: targetOrder })}
        lang={lang}
        t={t}
      />

      {/* 12. Rate Merchant Experience Modal (1 to 5 Stars + Criteria) */}
      <RateStoreModal
        isOpen={rateStoreConfig.isOpen}
        onClose={() => setRateStoreConfig({ isOpen: false, store: null, order: null })}
        store={rateStoreConfig.store || stores[0]}
        order={rateStoreConfig.order}
        onSubmitReview={(reviewData) => {
          rateStore(reviewData);
        }}
        lang={lang}
        t={t}
      />

      {/* 13. Rate Customer Seriousness & Parcel Reception Modal (Colis reçu vs refusé + 1 to 5 Stars) */}
      <RateCustomerModal
        isOpen={rateCustomerConfig.isOpen}
        onClose={() => setRateCustomerConfig({ isOpen: false, order: null })}
        order={rateCustomerConfig.order}
        onSubmitRating={(ratingData) => {
          rateCustomer(ratingData);
        }}
        lang={lang}
        t={t}
      />

      {/* 14. Customer Seriousness & Anti-Retour Dossier Modal */}
      <CustomerSeriousnessModal
        isOpen={customerSeriousnessConfig.isOpen}
        onClose={() => setCustomerSeriousnessConfig({ isOpen: false, customer: null, reliability: null })}
        customer={customerSeriousnessConfig.customer}
        reliability={customerSeriousnessConfig.reliability}
        lang={lang}
        t={t}
      />

      {/* 15. Store Reviews & Certified Feedback Modal */}
      <StoreReviewsModal
        isOpen={storeReviewsConfig.isOpen}
        onClose={() => setStoreReviewsConfig({ isOpen: false, store: null })}
        store={storeReviewsConfig.store || stores[0]}
        reviews={storeReviews}
        onOpenRateStore={(targetStore) => {
          setStoreReviewsConfig({ isOpen: false, store: null });
          setRateStoreConfig({ isOpen: true, store: targetStore, order: null });
        }}
        lang={lang}
        t={t}
      />

      {/* 16. Terms and Conditions of Use Modal (شروط وأحكام استخدام التطبيق) */}
      <TermsAndConditionsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
        lang={lang}
        t={t}
      />

      {/* 17. Supabase Cloud Backend & Database Modal */}
      <SupabaseConfigModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        stores={stores}
        products={products}
        storeReviews={storeReviews}
        customerRatings={customerRatings}
        lang={lang}
        t={t}
      />

      {/* 18. Supabase Super-Admin Dashboard Modal */}
      <SupabaseAdminDashboardModal
        isOpen={isAdminDashboardOpen}
        onClose={handleCloseAdminDashboard}
        stores={stores}
        products={products}
        orders={orders}
        storeReviews={storeReviews}
        customerRatings={customerRatings}
        users={users}
        currentUser={currentUser}
        onUpdateStore={updateStore}
        onDeleteStore={deleteStore}
        onUpdateProduct={updateProduct}
        onDeleteProduct={deleteProduct}
        onUpdateOrder={updateOrder}
        onDeleteOrder={deleteOrder}
        onDeleteStoreReview={deleteStoreReview}
        onDeleteCustomerRating={deleteCustomerRating}
        onRefreshFromSupabase={refreshFromSupabase}
        onOpenSupabaseConfig={() => setIsSupabaseModalOpen(true)}
        lang={lang}
        t={t}
      />
    </div>
  );
}
