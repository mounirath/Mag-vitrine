-- ==============================================================================
-- SCHEMA SUPABASE POSTGRESQL - MAG VITRINE ALGÉRIE (DZ)
-- Plateforme E-Commerce, Vitrines Virtuelles & Commerce Local pour les 58 Wilayas
-- Administrateur référent : mounirath@yahoo.fr
-- ==============================================================================

-- 1. EXTENSIONS REQUISES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. TABLE PROFILS UTILISATEURS (auth.users extension)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'store', 'admin')),
    full_name TEXT NOT NULL,
    phone TEXT DEFAULT '',
    wilaya TEXT DEFAULT '',
    commune TEXT DEFAULT '',
    avatar_url TEXT DEFAULT '',
    store_id TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. TABLE MAGASINS & VITRINES (Stores & Vitrines Commerçants)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.stores (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo TEXT NOT NULL,
    banner TEXT DEFAULT '',
    description TEXT NOT NULL,
    manager_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    address TEXT NOT NULL,
    wilaya TEXT NOT NULL,
    commune TEXT NOT NULL,
    category TEXT DEFAULT 'all',
    latitude DOUBLE PRECISION DEFAULT 36.7538,
    longitude DOUBLE PRECISION DEFAULT 3.0588,
    opening_hours TEXT DEFAULT 'Sam-Jeu: 09h00 - 19h30',
    delivery_enabled BOOLEAN DEFAULT TRUE,
    free_delivery_minimum NUMERIC(10,2) DEFAULT 10000.0,
    default_delivery_fee NUMERIC(10,2) DEFAULT 400.0,
    estimated_delivery_time TEXT DEFAULT '24h - 48h',
    badge TEXT DEFAULT 'Vérifié',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
    views_count INT DEFAULT 0,
    whatsapp_clicks INT DEFAULT 0,
    phone_calls INT DEFAULT 0,
    rating NUMERIC(3,2) DEFAULT 5.0,
    reviews_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 4. TABLE CATÉGORIES (Trilingue FR / AR / EN)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name_fr TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    icon_name TEXT NOT NULL DEFAULT 'ShoppingBag',
    image TEXT DEFAULT '',
    active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 5. TABLE PRODUITS & ANNONCES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    store_id TEXT NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    category_id TEXT NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    name_ar TEXT DEFAULT '',
    description TEXT NOT NULL,
    brand TEXT DEFAULT '',
    model TEXT DEFAULT '',
    price NUMERIC(12,2) NOT NULL,
    old_price NUMERIC(12,2) DEFAULT NULL,
    discount_percent INT DEFAULT 0,
    is_promotion BOOLEAN DEFAULT FALSE,
    condition TEXT DEFAULT 'new' CHECK (condition IN ('new', 'used', 'refurbished')),
    stock_status TEXT DEFAULT 'IN_STOCK' CHECK (stock_status IN ('IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK')),
    delivery_available BOOLEAN DEFAULT TRUE,
    image_url TEXT NOT NULL,
    images JSONB DEFAULT '[]'::jsonb,
    video_url TEXT DEFAULT '',
    location TEXT DEFAULT '',
    wilaya TEXT DEFAULT '',
    views_count INT DEFAULT 0,
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'ARCHIVED')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 6. TABLE COMMANDES CLIENTS (Orders 58 Wilayas)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    store_id TEXT NOT NULL REFERENCES public.stores(id) ON DELETE RESTRICT,
    store_name TEXT NOT NULL,
    customer_id TEXT DEFAULT 'guest',
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    wilaya TEXT NOT NULL,
    commune TEXT NOT NULL,
    address TEXT NOT NULL,
    delivery_method TEXT DEFAULT 'HOME_DELIVERY' CHECK (delivery_method IN ('HOME_DELIVERY', 'STORE_PICKUP')),
    payment_method TEXT DEFAULT 'CASH_ON_DELIVERY' CHECK (payment_method IN ('CASH_ON_DELIVERY', 'STORE_PICKUP', 'ONLINE_EDAHABIA')),
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC(12,2) NOT NULL,
    delivery_fee NUMERIC(12,2) DEFAULT 0.0,
    total NUMERIC(12,2) NOT NULL,
    status TEXT DEFAULT 'NEW' CHECK (status IN ('NEW', 'CONFIRMED', 'PREPARING', 'SHIPPED', 'DELIVERED', 'RETURNED', 'CANCELLED')),
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 7. TABLE AVIS & ÉVALUATIONS MAGASINS (Store Reviews)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.store_reviews (
    id TEXT PRIMARY KEY,
    store_id TEXT NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    criteria JSONB DEFAULT '{"deliverySpeed": 5, "conformity": 5, "communication": 5}'::jsonb,
    comment TEXT NOT NULL,
    comment_fr TEXT DEFAULT '',
    verified_order BOOLEAN DEFAULT TRUE,
    order_id TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 8. TABLE SÉRIEUX CLIENTS & ANTI-RETOUR (Customer Seriousness Ratings)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.customer_ratings (
    id TEXT PRIMARY KEY,
    customer_phone TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    store_id TEXT NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    store_name TEXT NOT NULL,
    parcel_received BOOLEAN NOT NULL DEFAULT TRUE,
    stars INT NOT NULL CHECK (stars BETWEEN 1 AND 5),
    reason TEXT NOT NULL,
    reason_fr TEXT DEFAULT '',
    order_id TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 9. INDEX POUR PERFORMANCES & RECHERCHE FULL-TEXT
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_products_store_id ON public.products(store_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_wilaya ON public.products(wilaya);
CREATE INDEX IF NOT EXISTS idx_orders_store_id ON public.orders(store_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON public.orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_store_reviews_store_id ON public.store_reviews(store_id);
CREATE INDEX IF NOT EXISTS idx_customer_ratings_phone ON public.customer_ratings(customer_phone);

-- ==============================================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_ratings ENABLE ROW LEVEL SECURITY;

-- Accès public en lecture (Vitrines, Catalogues, Catégories, Avis)
CREATE POLICY "Public read for profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public read for stores" ON public.stores FOR SELECT USING (true);
CREATE POLICY "Public read for categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public read for products" ON public.products FOR SELECT USING (status = 'ACTIVE');
CREATE POLICY "Public read for store_reviews" ON public.store_reviews FOR SELECT USING (true);
CREATE POLICY "Public read for customer_ratings" ON public.customer_ratings FOR SELECT USING (true);

-- Insertion & Gestion
CREATE POLICY "Public or authenticated create order" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public or authenticated view own order" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Stores and admin update orders" ON public.orders FOR UPDATE USING (true);

CREATE POLICY "Public insert store_reviews" ON public.store_reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Stores insert customer_ratings" ON public.customer_ratings FOR INSERT WITH CHECK (true);

CREATE POLICY "Stores manage products" ON public.products FOR ALL USING (true);
CREATE POLICY "Stores manage stores" ON public.stores FOR ALL USING (true);
CREATE POLICY "Profiles update own profile" ON public.profiles FOR ALL USING (true);

-- ==============================================================================
-- 11. BUCKETS DE STOCKAGE SUPABASE (Storage Buckets)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES 
    ('products', 'products', true),
    ('stores', 'stores', true),
    ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public access to product images" ON storage.objects FOR SELECT USING (bucket_id IN ('products', 'stores'));
CREATE POLICY "Authenticated users upload images" ON storage.objects FOR INSERT WITH CHECK (bucket_id IN ('products', 'stores'));

-- ==============================================================================
-- 12. FONCTION AUTO PROFILE TRIGGER (Nouvel inscrit -> Profil automatique)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role, phone)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        COALESCE(new.raw_user_meta_data->>'role', 'customer'),
        COALESCE(new.raw_user_meta_data->>'phone', '')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==============================================================================
-- 13. DONNÉES INITIALES (SEED DATA TRILINGUE ET 58 WILAYAS)
-- ==============================================================================
INSERT INTO public.categories (id, name_fr, name_ar, name_en, icon_name, sort_order) VALUES
('all', 'Tout le catalogue', 'كل المعروضات', 'All Catalog', 'Grid', 0),
('cat_phones', 'Smartphones & Tablettes', 'الهواتف الذكية والأجهزة اللوحية', 'Phones & Tablets', 'Smartphone', 1),
('cat_it', 'Informatique & Laptops', 'الإعلام الآلي والحواسيب', 'Computers & Laptops', 'Laptop', 2),
('cat_home', 'Électroménager & Maison', 'الأجهزة الكهرومنزلية', 'Home Appliances', 'Home', 3),
('cat_furniture', 'Meubles & Décoration', 'الأثاث والديكور المنزلي', 'Furniture & Decor', 'Armchair', 4),
('cat_fashion', 'Mode & Habillement', 'الملابس والأزياء', 'Fashion & Clothing', 'Shirt', 5),
('cat_auto', 'Pièces & Accessoires Auto', 'قطع غيار ولواحق السيارات', 'Auto Parts & Accessories', 'Car', 6)
ON CONFLICT (id) DO UPDATE SET
    name_fr = EXCLUDED.name_fr,
    name_ar = EXCLUDED.name_ar;

INSERT INTO public.stores (id, name, slug, logo, banner, description, manager_name, phone, whatsapp, address, wilaya, commune, rating, reviews_count) VALUES
('store_techzone', 'Tech Zone Alger', 'tech-zone-alger', 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200', 'فترينة متخصصة في أحدث الهواتف الذكية الحواسيب وإكسسوارات الألعاب مع كفالة رسمية وفحص بالفيديو قبل الشحن.', 'Karim Tech', '0555123456', '213555123456', '14 شارع ديدوش مراد، البريد المركزي', '16 - Alger', 'Alger Centre', 4.9, 28),
('store_maison', 'Maison & Mobilier Confort', 'maison-mobilier-confort', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200', 'أرقى أطقم الصالونات والمفروشات العصرية وغرف النوم بتصاميم تركية ومحلية متقنة مع خدمة التوصيل والتركيب لـ 58 ولاية.', 'Yacine Meuble', '0770987654', '213770987654', 'حي السلام، طريق الكرمة', '31 - Oran', 'Es Senia', 4.8, 19),
('store_auto', 'El Hidhab Auto Pièces', 'el-hidhab-auto-pieces', 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400', 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=1200', 'قطع غيار سيارات أصلية، بطاريات، زيوت وفلاتر لجميع الماركات الأوروبية والآسيوية مع إمكانية الفحص والتوصيل السريع.', 'Rachid Auto', '0661223344', '213661223344', 'المنطقة الصناعية، مخرج الطريق السيار', '19 - Sétif', 'Sétif', 4.9, 34)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description;

INSERT INTO public.products (id, store_id, category_id, name, name_ar, description, price, old_price, is_promotion, discount_percent, condition, stock_status, image_url, location, wilaya) VALUES
('p_phone_1', 'store_techzone', 'cat_phones', 'Samsung Galaxy S24 Ultra 256GB Titanium', 'سامسونغ جالاكسي S24 ألترا 256 جيغا تيتانيوم أصلي', 'الهاتف الرائد الجديد بقلم S-Pen وكاميرا 200 ميغابكسل مع معالج Snapdragon 8 Gen 3 وكفالة 12 شهراً.', 189000, 215000, true, 12, 'new', 'IN_STOCK', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800', 'Alger Centre, Alger', '16 - Alger'),
('p_laptop_1', 'store_techzone', 'cat_it', 'MacBook Air M2 13.6" 8GB 256GB Midnight', 'ماك بوك إير M2 شاشة ريتنا 13.6 إنش باللون الليلي', 'لابتوب أبل فائق النحافة وبطارية تدوم حتى 18 ساعة مع شاحن MagSafe وكيبورد عربي أصلي.', 158000, 169000, false, 0, 'new', 'IN_STOCK', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800', 'Alger Centre, Alger', '16 - Alger'),
('p_furn_1', 'store_maison', 'cat_furniture', 'Salon Moderne 7 Places Velours Royal Bleu', 'طقم صالون عصري 7 مقاعد قماش مخملي ملكي فاخر', 'هيكل من الخشب الزان المتين، إسفنج D30 عالي الكثافة مع وسائد مريحة وطاولة قهوة هدية.', 135000, 155000, true, 13, 'new', 'IN_STOCK', 'Es Senia, Oran', '31 - Oran'),
('p_auto_1', 'store_auto', 'cat_auto', 'Kit Distribution Renault DCI 1.5 Original', 'طقم حزام التوزيع رونو أصلي محرك 1.5 DCI', 'طقم التوزيع الأصلي مع مضخة الماء والرولمان لسيارات كليو وميغان وداسيا ستيبواي.', 14500, 16800, true, 14, 'new', 'IN_STOCK', 'Zone Industrielle, Sétif', '19 - Sétif')
ON CONFLICT (id) DO NOTHING;
