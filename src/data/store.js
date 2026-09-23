import { useState, useEffect } from 'react';
import { STORES, PRODUCTS, WILAYAS, CATEGORIES } from './initialData';

const STORAGE_KEYS = {
  STORES: 'mag_vitrine_stores',
  PRODUCTS: 'mag_vitrine_products',
  CART: 'mag_vitrine_cart',
  ORDERS: 'mag_vitrine_orders',
  LANG: 'mag_vitrine_lang',
  THEME: 'mag_vitrine_theme',
  USERS: 'mag_vitrine_users',
  CURRENT_USER: 'mag_vitrine_current_user'
};

const INITIAL_USERS = [
  {
    id: 'user_customer_1',
    email: 'client@gmail.com',
    role: 'customer',
    name: 'Karim Larbi',
    phone: '0555443322',
    wilaya: 'Alger',
    address: 'Bab Ezzouar, Alger'
  },
  {
    id: 'user_store_1',
    email: 'contact@techzone.dz',
    role: 'store',
    name: 'Mohamed Benali',
    phone: '+213 661 22 33 44',
    storeId: 'store_techzone'
  },
  {
    id: 'user_store_2',
    email: 'contact@elegance.dz',
    role: 'store',
    name: 'Amina Khelil',
    phone: '+213 770 99 88 77',
    storeId: 'store_elegance'
  }
];

export const TRANSLATIONS = {
  fr: {
    appTitle: 'MAG VITRINE',
    appSubtitle: 'Vitrines & E-Commerce Algérie',
    navHome: 'Accueil',
    navStores: 'Vitrines & Boutiques',
    navCatalog: 'Catalogue Produits',
    navTracking: 'Suivi de Commande',
    navDashboard: 'Espace Commerçant',
    searchPlaceholder: 'Rechercher un produit, une boutique ou une wilaya...',
    filterAllWilayas: 'Toutes les 58 Wilayas',
    cartTitle: 'Mon Panier',
    emptyCart: 'Votre panier est vide pour le moment',
    checkout: 'Commander (Paiement à la livraison)',
    total: 'Total',
    subtotal: 'Sous-total',
    deliveryFee: 'Frais de livraison',
    freeDeliveryBadge: 'Livraison Gratuite',
    addToCart: 'Ajouter au Panier',
    addedToCart: 'Ajouté au panier !',
    viewDetails: 'Détails',
    callMerchant: 'Appeler',
    whatsappDirect: 'WhatsApp Direct',
    orderOnWhatsApp: 'Confirmer la commande via WhatsApp',
    orderNow: 'Passer la commande',
    trackingTitle: 'Suivi de Commande en Direct',
    enterOrderNumber: 'Numéro de commande (ex: DZ-8921) ou téléphone',
    trackBtn: 'Rechercher',
    vendorQuotaTitle: 'Quota d annonces magasin',
    addListingBtn: 'Publier une nouvelle annonce (Max 50)',
    stockStatus: 'En stock',
    outOfStock: 'Rupture de stock',
    currency: 'DZD',
    cameraSearchTitle: 'Recherche Caméra par IA',
    cameraSearchSubtitle: 'Téléchargez la photo d un article : l IA identifie le produit et trouve les boutiques correspondantes',
    dropPhoto: 'Prenez une photo ou importez une image',
    analyzingImage: 'Analyse de l image par l IA...',
    aiResultsFound: 'Produits correspondants détectés',
    authLogin: 'Se Connecter',
    authRegisterClient: 'Créer un Compte Client',
    authRegisterStore: 'Créer une Vitrine Magasin',
    authLogout: 'Déconnexion',
    authMyAccount: 'Mon Compte',
    authClientBadge: 'Client',
    authStoreBadge: 'Boutique',
    authOpenStoreCta: 'Vous êtes commerçant ? Créez votre vitrine gratuitement'
  },
  ar: {
    appTitle: 'ماغ فيترين',
    appSubtitle: 'فترينات وتسوق ذكي في الجزائر',
    navHome: 'الرئيسية',
    navStores: 'المتاجر والفترينات',
    navCatalog: 'كتالوج المنتجات',
    navTracking: 'تتبع الطلبية',
    navDashboard: 'فضاء التاجر',
    searchPlaceholder: 'ابحث عن منتج، متجر، أو ولاية جزائرية...',
    filterAllWilayas: 'جميع الـ 58 ولاية',
    cartTitle: 'سلة المشتريات',
    emptyCart: 'سلة التسوق فارغة حالياً',
    checkout: 'تأكيد الطلب (الدفع عند الاستلام)',
    total: 'المجموع الإجمالي',
    subtotal: 'المجموع الفرعي',
    deliveryFee: 'تكلفة التوصيل',
    freeDeliveryBadge: 'توصيل مجاني',
    addToCart: 'إضافة إلى السلة',
    addedToCart: 'تمت الإضافة بنجاح !',
    viewDetails: 'عرض التفاصيل',
    callMerchant: 'اتصال مباشر',
    whatsappDirect: 'مراسلة واتساب',
    orderOnWhatsApp: 'تأكيد الطلب السريع عبر واتساب',
    orderNow: 'إتمام الطلب',
    trackingTitle: 'تتبع مسار الطلبية في 7 مراحل',
    enterOrderNumber: 'رقم الطلب (مثال: DZ-8921) أو رقم الهاتف',
    trackBtn: 'تتبع الآن',
    vendorQuotaTitle: 'حصة الإعلانات المخصصة لمتجرك',
    addListingBtn: 'إضافة إعلان جديد (الحد الأقصى 50)',
    stockStatus: 'متوفر في المخزون',
    outOfStock: 'غير متوفر حالياً',
    currency: 'د.ج',
    cameraSearchTitle: 'البحث الذكي بالكاميرا عبر الذكاء الاصطناعي',
    cameraSearchSubtitle: 'التقط صورة لمنتج أو ملابس : يقوم الذكاء الاصطناعي بالتعرف عليه وإيجاد المتاجر الموفرة له',
    dropPhoto: 'التقط صورة أو اختر صورة من جهازك',
    analyzingImage: 'جاري تحليل الصورة بالذكاء الاصطناعي...',
    aiResultsFound: 'المنتجات المطابقة المكتشفة',
    authLogin: 'تسجيل الدخول',
    authRegisterClient: 'إنشاء حساب زبون',
    authRegisterStore: 'إنشاء حساب متجر وفترينة',
    authLogout: 'تسجيل الخروج',
    authMyAccount: 'حسابي',
    authClientBadge: 'زبون',
    authStoreBadge: 'متجر معتمد',
    authOpenStoreCta: 'هل أنت تاجر؟ افتح فترينتك التجارية مجاناً الآن'
  },
  en: {
    appTitle: 'MAG VITRINE',
    appSubtitle: 'Virtual Showcases & Algerian E-Commerce',
    navHome: 'Home',
    navStores: 'Stores & Vitrines',
    navCatalog: 'Products Catalog',
    navTracking: 'Order Tracking',
    navDashboard: 'Merchant Portal',
    searchPlaceholder: 'Search product, shop or wilaya...',
    filterAllWilayas: 'All 58 Wilayas',
    cartTitle: 'Shopping Cart',
    emptyCart: 'Your cart is empty right now',
    checkout: 'Checkout (Cash on Delivery)',
    total: 'Total',
    subtotal: 'Subtotal',
    deliveryFee: 'Delivery Fee',
    freeDeliveryBadge: 'Free Delivery',
    addToCart: 'Add to Cart',
    addedToCart: 'Added to cart!',
    viewDetails: 'Details',
    callMerchant: 'Call Store',
    whatsappDirect: 'Direct WhatsApp',
    orderOnWhatsApp: 'Confirm Order via WhatsApp',
    orderNow: 'Place Order',
    trackingTitle: 'Real-Time Order Tracking',
    enterOrderNumber: 'Order ID (e.g. DZ-8921) or phone',
    trackBtn: 'Track Now',
    vendorQuotaTitle: 'Store Listings Quota',
    addListingBtn: 'Post New Product (Max 50)',
    stockStatus: 'In stock',
    outOfStock: 'Out of stock',
    currency: 'DZD',
    cameraSearchTitle: 'AI Camera Visual Search',
    cameraSearchSubtitle: 'Upload a product photo: AI identifies the item and matches local Algerian stores',
    dropPhoto: 'Take a photo or upload an image',
    analyzingImage: 'Analyzing photo with AI...',
    aiResultsFound: 'Matching products found',
    authLogin: 'Log In',
    authRegisterClient: 'Create Customer Account',
    authRegisterStore: 'Open Store Showcase',
    authLogout: 'Log Out',
    authMyAccount: 'My Account',
    authClientBadge: 'Customer',
    authStoreBadge: 'Store',
    authOpenStoreCta: 'Are you a merchant? Open your vitrine for free'
  }
};

export function useAppStore() {
  const [lang, setLang] = useState(() => localStorage.getItem(STORAGE_KEYS.LANG) || 'fr');
  const [theme, setTheme] = useState(() => localStorage.getItem(STORAGE_KEYS.THEME) || 'light');
  const [stores, setStores] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STORES);
    return saved ? JSON.parse(saved) : STORES;
  });
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return saved ? JSON.parse(saved) : PRODUCTS;
  });
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CART);
    return saved ? JSON.parse(saved) : [];
  });
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : [
      {
        id: 'DZ-8921',
        customerName: 'Karim Larbi',
        phone: '0555443322',
        wilaya: 'Alger',
        commune: 'Bab Ezzouar',
        storeName: 'Tech Zone Alger',
        items: [{ name: 'Samsung Galaxy S24 Ultra 256GB', qty: 1, price: 185000 }],
        totalAmount: 185000,
        statusStep: 4, // 1 to 7
        date: '2026-09-22'
      }
    ];
  });
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANG, lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STORES, JSON.stringify(stores));
  }, [stores]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => setCart([]);

  const addProduct = (newProd) => {
    setProducts(prev => [newProd, ...prev]);
  };

  const deleteProduct = (prodId) => {
    setProducts(prev => prev.filter(p => p.id !== prodId));
  };

  const createOrder = (orderData) => {
    const orderId = `DZ-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: orderId,
      ...orderData,
      statusStep: 1,
      date: new Date().toISOString().split('T')[0]
    };
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  // Auth Functions
  const registerCustomer = (data) => {
    const newUser = {
      id: `user_customer_${Date.now()}`,
      email: data.email,
      role: 'customer',
      name: data.name,
      phone: data.phone,
      wilaya: data.wilaya || 'Alger',
      address: data.address || ''
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return newUser;
  };

  const registerStore = (data) => {
    const storeId = `store_${Date.now()}`;
    const newStore = {
      id: storeId,
      name: data.storeName,
      slug: data.storeName.toLowerCase().replace(/\s+/g, '-'),
      logo: data.logo || 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=300',
      banner: data.banner || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900',
      description: data.description || 'Vitrine commerciale vérifiée en Algérie.',
      managerName: data.managerName,
      phone: data.phone,
      whatsapp: data.whatsapp ? data.whatsapp.replace(/\D/g, '') : data.phone.replace(/\D/g, ''),
      address: data.address,
      wilaya: data.wilaya,
      commune: data.commune || data.wilaya,
      rating: 5.0,
      reviewsCount: 1,
      openingHours: data.openingHours || 'Sam - Jeu : 09h00 - 19h00',
      deliveryEnabled: true,
      freeDeliveryMinimum: parseFloat(data.freeDeliveryMinimum) || 8000,
      defaultDeliveryFee: parseFloat(data.defaultDeliveryFee) || 400,
      estimatedDeliveryTime: '24h - 48h',
      quotaUsed: 0,
      quotaMax: 50
    };

    const newUser = {
      id: `user_store_${Date.now()}`,
      email: data.email,
      role: 'store',
      name: data.managerName,
      phone: data.phone,
      storeId: storeId
    };

    setStores(prev => [newStore, ...prev]);
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return { user: newUser, store: newStore };
  };

  const login = (email) => {
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      return { success: true, user: found };
    }
    // Create quick session if not found
    const quickUser = {
      id: `user_${Date.now()}`,
      email: email,
      role: 'customer',
      name: email.split('@')[0],
      phone: '0550000000',
      wilaya: 'Alger',
      address: ''
    };
    setUsers(prev => [...prev, quickUser]);
    setCurrentUser(quickUser);
    return { success: true, user: quickUser };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const t = TRANSLATIONS[lang] || TRANSLATIONS.fr;

  return {
    lang,
    setLang,
    theme,
    setTheme,
    stores,
    products,
    cart,
    orders,
    users,
    currentUser,
    registerCustomer,
    registerStore,
    login,
    logout,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    addProduct,
    deleteProduct,
    createOrder,
    t
  };
}
