import { useState, useEffect } from 'react';
import { STORES, PRODUCTS, WILAYAS, CATEGORIES } from './initialData';
import { 
  productsApi, 
  storesApi, 
  ordersApi, 
  storeReviewsApi, 
  customerRatingsApi 
} from '../services/supabaseService';
import { isSupabaseConfigured } from '../lib/supabase';

const STORAGE_KEYS = {
  STORES: 'mag_vitrine_stores',
  PRODUCTS: 'mag_vitrine_products',
  CART: 'mag_vitrine_cart',
  ORDERS: 'mag_vitrine_orders',
  LANG: 'mag_vitrine_lang',
  THEME: 'mag_vitrine_theme',
  USERS: 'mag_vitrine_users',
  CURRENT_USER: 'mag_vitrine_current_user',
  STORE_REVIEWS: 'mag_vitrine_store_reviews',
  CUSTOMER_RATINGS: 'mag_vitrine_customer_ratings'
};

const INITIAL_STORE_REVIEWS = [
  {
    id: 's_rev_1',
    storeId: 'store_techzone',
    customerName: 'Karim Larbi',
    customerPhone: '0555443322',
    rating: 5,
    criteria: { deliverySpeed: 5, conformity: 5, communication: 5 },
    comment: 'تجربة تسوق ممتازة جداً! الهاتف أصلي 100% ومطابق تماماً لفيديو الفحص. التوصيل لباب المنزل في باب الزوار كان سريعاً ومحترفاً.',
    commentFr: 'Excellente expérience ! Produit 100% conforme à la vidéo. Vendeur très réactif et livraison express.',
    date: '2026-09-22',
    verifiedOrder: true,
    orderId: 'DZ-8921'
  },
  {
    id: 's_rev_2',
    storeId: 'store_techzone',
    customerName: 'Sofiane Mebarki',
    customerPhone: '0661998877',
    rating: 5,
    criteria: { deliverySpeed: 5, conformity: 5, communication: 4 },
    comment: 'متجر موثوق في الجزائر العاصمة، تغليف محكم للسلعة وضمان حقيقي، أنصح بالتعامل معهم.',
    commentFr: 'Boutique fiable, emballage soigné et vraie garantie.',
    date: '2026-09-18',
    verifiedOrder: true
  },
  {
    id: 's_rev_3',
    storeId: 'store_maison',
    customerName: 'Amina K.',
    customerPhone: '0770112233',
    rating: 5,
    criteria: { deliverySpeed: 4, conformity: 5, communication: 5 },
    comment: 'الأريكة فائقة الجودة والقماش فاخر ومطابق للصور والفيديو، شكراً للأخ ياسين على حسن الاستقبال.',
    commentFr: 'Canapé magnifique, tissu de haute qualité et super accueil.',
    date: '2026-09-15',
    verifiedOrder: true
  },
  {
    id: 's_rev_4',
    storeId: 'store_elegance',
    customerName: 'Leila Dahmani',
    customerPhone: '0552445566',
    rating: 4,
    criteria: { deliverySpeed: 4, conformity: 5, communication: 4 },
    comment: 'المعطف رائع والمقاس مضبوط، توصيل في 48 ساعة إلى وهران.',
    commentFr: 'Très beau manteau, taille parfaite et livraison en 48h à Oran.',
    date: '2026-09-12',
    verifiedOrder: true
  }
];

const INITIAL_CUSTOMER_RATINGS = [
  {
    id: 'c_rat_1',
    customerPhone: '0555443322',
    customerName: 'Karim Larbi',
    storeId: 'store_techzone',
    storeName: 'Tech Zone Alger',
    parcelReceived: true, // تم استلام الطرد بنجاح والدفع
    stars: 5,
    reason: 'استلم الطرد فوراً وكان في الموعد ومحترماً جداً',
    reasonFr: 'A récupéré le colis sans délai, très courtois et sérieux.',
    date: '2026-09-22',
    orderId: 'DZ-8921'
  },
  {
    id: 'c_rat_2',
    customerPhone: '0555443322',
    customerName: 'Karim Larbi',
    storeId: 'store_maison',
    storeName: 'Maison & Mobilier Confort',
    parcelReceived: true,
    stars: 5,
    reason: 'تواصل ممتاز ودفع كاش عند الاستلام دون أي تماطل',
    reasonFr: 'Excellente communication, paiement cash à la livraison.',
    date: '2026-09-05',
    orderId: 'DZ-7412'
  },
  {
    id: 'c_rat_3',
    customerPhone: '0551223344',
    customerName: 'Samir Bouzid',
    storeId: 'store_auto',
    storeName: 'Auto & Rechanges Express',
    parcelReceived: true,
    stars: 5,
    reason: 'زبون جاد، استلم قطعة الغيار في وهران خلال ساعتين من وصول الموزع',
    reasonFr: 'Client sérieux, colis récupéré dès l arrivée du livreur.',
    date: '2026-09-14',
    orderId: 'DZ-6109'
  },
  {
    id: 'c_rat_4',
    customerPhone: '0663112233',
    customerName: 'Farid Mechri',
    storeId: 'store_techzone',
    storeName: 'Tech Zone Alger',
    parcelReceived: false, // عدم استلام / رفض الطرد
    stars: 1,
    reason: 'الهاتف مغلق طيلة يومين ورفض الرد على موزع ياليدين بعد وصول الطرد إلى سطيف',
    reasonFr: 'Téléphone éteint pendant 2 jours et refus de répondre au livreur.',
    date: '2026-09-10',
    orderId: 'DZ-5210'
  }
];

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
        storeId: 'store_techzone',
        items: [{ name: 'Samsung Galaxy S24 Ultra 256GB', qty: 1, price: 185000 }],
        totalAmount: 185000,
        statusStep: 7, // Livrée & Encaissée
        parcelReceived: true, // استلم الطرد بنجاح
        customerRated: true, // التاجر قيّم جدية الزبون
        isStoreRated: true, // الزبون قيّم المتجر
        date: '2026-09-22'
      },
      {
        id: 'DZ-9140',
        customerName: 'Samir Bouzid',
        phone: '0551223344',
        wilaya: 'Oran',
        commune: 'Es Sénia',
        storeName: 'Tech Zone Alger',
        storeId: 'store_techzone',
        items: [{ name: 'Casque Audio Sans Fil Pro ANC', qty: 1, price: 14500 }],
        totalAmount: 14500,
        statusStep: 7,
        parcelReceived: true,
        customerRated: false, // في انتظار تقييم التاجر لجدية الزبون
        isStoreRated: false,
        date: '2026-09-23'
      },
      {
        id: 'DZ-8430',
        customerName: 'Amel Touati',
        phone: '0772334455',
        wilaya: 'Constantine',
        commune: 'Ali Mendjeli',
        storeName: 'Tech Zone Alger',
        storeId: 'store_techzone',
        items: [{ name: 'Montre Connectée Fitness Watch 5', qty: 1, price: 9200 }],
        totalAmount: 9200,
        statusStep: 5, // En cours d acheminement
        parcelReceived: null,
        customerRated: false,
        isStoreRated: false,
        date: '2026-09-23'
      },
      {
        id: 'DZ-5210',
        customerName: 'Farid Mechri',
        phone: '0663112233',
        wilaya: 'Sétif',
        commune: 'El Eulma',
        storeName: 'Tech Zone Alger',
        storeId: 'store_techzone',
        items: [{ name: 'Tablette Graphique Ultra-Fine', qty: 1, price: 21000 }],
        totalAmount: 21000,
        statusStep: 7,
        parcelReceived: false, // عدم استلام / رفض الطرد
        customerRated: true,
        isStoreRated: false,
        date: '2026-09-10'
      }
    ];
  });
  const [storeReviews, setStoreReviews] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STORE_REVIEWS);
    return saved ? JSON.parse(saved) : INITIAL_STORE_REVIEWS;
  });
  const [customerRatings, setCustomerRatings] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMER_RATINGS);
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMER_RATINGS;
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
    localStorage.setItem(STORAGE_KEYS.STORE_REVIEWS, JSON.stringify(storeReviews));
  }, [storeReviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOMER_RATINGS, JSON.stringify(customerRatings));
  }, [customerRatings]);

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

  // Load and sync data from Supabase if configured
  const loadSupabaseData = async () => {
    if (!isSupabaseConfigured()) return { success: false, message: 'Supabase non configuré' };
    try {
      const [prodRes, storeRes, orderRes, revRes, ratRes] = await Promise.allSettled([
        productsApi.getAll(),
        storesApi.getAll(),
        ordersApi.getAll(),
        storeReviewsApi.getAll(),
        customerRatingsApi.getAll()
      ]);

      let loadedCounts = { products: 0, stores: 0, orders: 0, reviews: 0, ratings: 0 };

      if (prodRes.status === 'fulfilled' && prodRes.value?.data?.length > 0) {
        const normalizedProds = prodRes.value.data.map(p => ({
          id: p.id,
          storeId: p.store_id || p.storeId,
          categoryId: p.category_id || p.categoryId,
          name: p.name,
          nameAr: p.name_ar || p.nameAr,
          description: p.description,
          price: Number(p.price),
          oldPrice: p.old_price ? Number(p.old_price) : p.oldPrice,
          isPromotion: p.is_promotion !== undefined ? p.is_promotion : p.isPromotion,
          discountPercent: p.discount_percent || p.discountPercent || 0,
          condition: p.condition || 'new',
          stockStatus: p.stock_status || p.stockStatus || 'IN_STOCK',
          deliveryAvailable: p.delivery_available !== undefined ? p.delivery_available : true,
          imageUrl: p.image_url || p.imageUrl,
          images: p.images || [],
          location: p.location || '',
          wilaya: p.wilaya || '',
          status: p.status || 'ACTIVE'
        }));
        setProducts(normalizedProds);
        loadedCounts.products = normalizedProds.length;
      }

      if (storeRes.status === 'fulfilled' && storeRes.value?.data?.length > 0) {
        const normalizedStores = storeRes.value.data.map(s => ({
          id: s.id,
          name: s.name,
          slug: s.slug,
          logo: s.logo,
          banner: s.banner,
          description: s.description,
          managerName: s.manager_name || s.managerName,
          phone: s.phone,
          whatsapp: s.whatsapp,
          address: s.address,
          wilaya: s.wilaya,
          commune: s.commune,
          rating: s.rating || 5.0,
          reviewsCount: s.reviews_count || 1,
          badge: s.badge || 'Vérifié',
          status: s.status || 'active',
          quotaMax: s.quota_max || s.quotaMax || 50
        }));
        setStores(normalizedStores);
        loadedCounts.stores = normalizedStores.length;
      }

      if (orderRes.status === 'fulfilled' && orderRes.value?.data?.length > 0) {
        setOrders(orderRes.value.data);
        loadedCounts.orders = orderRes.value.data.length;
      }

      if (revRes.status === 'fulfilled' && revRes.value?.data?.length > 0) {
        setStoreReviews(revRes.value.data);
        loadedCounts.reviews = revRes.value.data.length;
      }

      if (ratRes.status === 'fulfilled' && ratRes.value?.data?.length > 0) {
        setCustomerRatings(ratRes.value.data);
        loadedCounts.ratings = ratRes.value.data.length;
      }

      return { success: true, counts: loadedCounts };
    } catch (err) {
      console.warn('[Supabase Auto-Sync]: Falling back to local data', err);
      return { success: false, error: err };
    }
  };

  useEffect(() => {
    loadSupabaseData();

    const handleConfigChange = () => {
      loadSupabaseData();
    };
    window.addEventListener('supabase-config-changed', handleConfigChange);
    return () => window.removeEventListener('supabase-config-changed', handleConfigChange);
  }, []);

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
    if (isSupabaseConfigured()) {
      productsApi.create(newProd).catch(e => console.warn('Supabase product create failed:', e));
    }
  };

  const updateProduct = (prodId, updates) => {
    setProducts(prev => prev.map(p => p.id === prodId ? { ...p, ...updates } : p));
    if (isSupabaseConfigured()) {
      productsApi.update(prodId, updates).catch(e => console.warn('Supabase product update failed:', e));
    }
  };

  const deleteProduct = (prodId) => {
    setProducts(prev => prev.filter(p => p.id !== prodId));
    if (isSupabaseConfigured()) {
      productsApi.delete(prodId).catch(e => console.warn('Supabase product delete failed:', e));
    }
  };

  const updateStore = (storeId, updates) => {
    setStores(prev => prev.map(s => s.id === storeId ? { ...s, ...updates } : s));
    if (isSupabaseConfigured()) {
      storesApi.update(storeId, updates).catch(e => console.warn('Supabase store update failed:', e));
    }
  };

  const deleteStore = (storeId) => {
    setStores(prev => prev.filter(s => s.id !== storeId));
    setProducts(prev => prev.filter(p => p.storeId !== storeId));
    if (isSupabaseConfigured()) {
      storesApi.delete(storeId).catch(e => console.warn('Supabase store delete failed:', e));
    }
  };

  const updateOrder = (orderId, updates) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...updates } : o));
    if (isSupabaseConfigured()) {
      ordersApi.update(orderId, updates).catch(e => console.warn('Supabase order update failed:', e));
    }
  };

  const deleteOrder = (orderId) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    if (isSupabaseConfigured()) {
      ordersApi.delete(orderId).catch(e => console.warn('Supabase order delete failed:', e));
    }
  };

  const deleteStoreReview = (reviewId) => {
    setStoreReviews(prev => prev.filter(r => r.id !== reviewId));
    if (isSupabaseConfigured()) {
      storeReviewsApi.delete(reviewId).catch(e => console.warn('Supabase review delete failed:', e));
    }
  };

  const deleteCustomerRating = (ratingId) => {
    setCustomerRatings(prev => prev.filter(r => r.id !== ratingId));
    if (isSupabaseConfigured()) {
      customerRatingsApi.delete(ratingId).catch(e => console.warn('Supabase rating delete failed:', e));
    }
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
    if (isSupabaseConfigured()) {
      ordersApi.create(newOrder).catch(e => console.warn('Supabase order create failed:', e));
    }
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
    if (isSupabaseConfigured()) {
      storesApi.create(newStore).catch(e => console.warn('Supabase store create failed:', e));
    }
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

  // 1. Rate Merchant / Store Experience (1 to 5 Stars + Criteria)
  const rateStore = ({ storeId, rating, comment, criteria, customerName, customerPhone, orderId }) => {
    const numRating = Math.max(1, Math.min(5, Number(rating) || 5));
    const newReview = {
      id: `s_rev_${Date.now()}`,
      storeId,
      customerName: customerName || currentUser?.name || 'Client MAG VITRINE',
      customerPhone: customerPhone || currentUser?.phone || '',
      rating: numRating,
      criteria: criteria || {
        deliverySpeed: numRating,
        conformity: numRating,
        communication: numRating
      },
      comment: comment || '',
      date: new Date().toISOString().split('T')[0],
      verifiedOrder: Boolean(orderId),
      orderId: orderId || null
    };

    setStoreReviews(prev => [newReview, ...prev]);

    // Recalculate and update store average rating
    setStores(prevStores => {
      return prevStores.map(s => {
        if (s.id === storeId) {
          const currentStoreReviews = storeReviews.filter(r => r.storeId === storeId);
          const totalCount = currentStoreReviews.length + 1;
          const sumRatings = currentStoreReviews.reduce((sum, r) => sum + r.rating, 0) + numRating;
          const newAvg = parseFloat((sumRatings / totalCount).toFixed(1));
          return {
            ...s,
            rating: newAvg,
            reviewsCount: totalCount
          };
        }
        return s;
      });
    });

    if (orderId) {
      setOrders(prevOrders => prevOrders.map(o => (o.id === orderId ? { ...o, isStoreRated: true } : o)));
    }

    if (isSupabaseConfigured()) {
      storeReviewsApi.create(newReview).catch(e => console.warn('Supabase review create failed:', e));
    }

    return newReview;
  };

  // 2. Rate Customer Seriousness & Parcel Reception (Colis Reçu vs Colis Refusé + 1 to 5 Stars)
  const rateCustomer = ({ orderId, customerPhone, customerName, storeId, storeName, parcelReceived, stars, reason, note }) => {
    const isReceived = Boolean(parcelReceived);
    const starCount = Number(stars) || (isReceived ? 5 : 1);

    const newRating = {
      id: `c_rat_${Date.now()}`,
      orderId: orderId || `DZ-${Date.now().toString().slice(-4)}`,
      customerPhone: customerPhone || '',
      customerName: customerName || 'Client',
      storeId: storeId || currentUser?.storeId || 'store_techzone',
      storeName: storeName || 'Magasin MAG VITRINE',
      parcelReceived: isReceived,
      stars: starCount,
      reason: reason || (isReceived ? 'تم استلام الطرد بنجاح والدفع' : 'عدم استلام / رفض الطرد'),
      note: note || '',
      date: new Date().toISOString().split('T')[0]
    };

    setCustomerRatings(prev => [newRating, ...prev]);

    // Update order status if orderId matches
    if (orderId) {
      setOrders(prevOrders => prevOrders.map(o => {
        if (o.id === orderId) {
          return {
            ...o,
            parcelReceived: isReceived,
            customerRated: true,
            customerStars: starCount,
            customerRatingReason: reason,
            // If refused, order step is set to 7 with refusal noted
            statusStep: 7
          };
        }
        return o;
      }));
    }

    if (isSupabaseConfigured()) {
      customerRatingsApi.create(newRating).catch(e => console.warn('Supabase customer rating create failed:', e));
    }

    return newRating;
  };

  // Helper: Get customer reliability metrics and history
  const getCustomerReliability = (phone, name) => {
    const cleanP = phone ? phone.replace(/\D/g, '') : '';
    const last8 = cleanP.slice(-8);

    const relevantRatings = customerRatings.filter(r => {
      const rPhone = r.customerPhone ? r.customerPhone.replace(/\D/g, '') : '';
      if (last8 && rPhone && rPhone.endsWith(last8)) return true;
      if (name && r.customerName && r.customerName.toLowerCase().trim() === name.toLowerCase().trim()) return true;
      return false;
    });

    const matchingOrders = orders.filter(o => {
      const oPhone = o.phone ? o.phone.replace(/\D/g, '') : '';
      if (last8 && oPhone && oPhone.endsWith(last8)) return true;
      if (name && o.customerName && o.customerName.toLowerCase().trim() === name.toLowerCase().trim()) return true;
      return false;
    });

    let receivedCount = relevantRatings.filter(r => r.parcelReceived === true).length;
    let refusedCount = relevantRatings.filter(r => r.parcelReceived === false).length;

    // Check completed orders without explicit ratings
    matchingOrders.forEach(o => {
      const alreadyHasRating = relevantRatings.some(r => r.orderId === o.id);
      if (!alreadyHasRating) {
        if (o.parcelReceived === true) receivedCount += 1;
        else if (o.parcelReceived === false) refusedCount += 1;
      }
    });

    const totalEvaluated = receivedCount + refusedCount;
    // Default 100% for fresh customer with no negative history
    const scorePercent = totalEvaluated === 0 ? 100 : Math.round((receivedCount / totalEvaluated) * 100);

    let badge = {
      status: 'excellent',
      labelAr: 'زبون جاد وموثوق 🌟 (استلام مضمون)',
      labelFr: 'Client Sérieux & Fiable (100% Réception)',
      color: '#15803d',
      bg: '#dcfce7',
      borderColor: '#86efac'
    };

    if (totalEvaluated > 0 && scorePercent < 70) {
      badge = {
        status: 'warning',
        labelAr: 'تحذير: نسبة رفض طرود مرتفعة ⚠️',
        labelFr: 'Attention : Taux de refus élevé',
        color: '#b91c1c',
        bg: '#fee2e2',
        borderColor: '#fca5a5'
      };
    } else if (totalEvaluated > 0 && scorePercent < 90) {
      badge = {
        status: 'medium',
        labelAr: 'زبون متوسط الجدية 📦',
        labelFr: 'Client Moyen (Quelques retours)',
        color: '#b45309',
        bg: '#fef3c7',
        borderColor: '#fde68a'
      };
    }

    return {
      totalEvaluated,
      receivedCount,
      refusedCount,
      scorePercent,
      badge,
      ratings: relevantRatings
    };
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
    storeReviews,
    customerRatings,
    rateStore,
    rateCustomer,
    getCustomerReliability,
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
    updateProduct,
    deleteProduct,
    updateStore,
    deleteStore,
    createOrder,
    updateOrder,
    deleteOrder,
    deleteStoreReview,
    deleteCustomerRating,
    refreshFromSupabase: loadSupabaseData,
    t
  };
}
