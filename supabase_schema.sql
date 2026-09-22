-- ==============================================================================
-- SCHEMA SUPABASE (PostgreSQL) - MAG VITRINE ALGÉRIE
-- Plateforme de vitrines virtuelles & commerce local pour les 58 Wilayas
-- Administrateur référent : mounirath@yahoo.fr
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLE UTILISATEURS / PROFILS
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'store', 'admin')),
    full_name TEXT NOT NULL,
    phone TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLE MAGASINS (Vitrines des commerçants en Algérie)
CREATE TABLE IF NOT EXISTS public.stores (
    id TEXT PRIMARY KEY DEFAULT 'store_' || substring(uuid_generate_v4()::text from 1 for 8),
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
    latitude DOUBLE PRECISION DEFAULT 36.7538,
    longitude DOUBLE PRECISION DEFAULT 3.0588,
    opening_hours TEXT DEFAULT 'Sam-Jeu: 09h00 - 19h00',
    delivery_enabled BOOLEAN DEFAULT TRUE,
    free_delivery_minimum NUMERIC(10,2) DEFAULT 5000.0,
    default_delivery_fee NUMERIC(10,2) DEFAULT 300.0,
    estimated_delivery_time TEXT DEFAULT '24h - 48h',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
    views_count INT DEFAULT 0,
    whatsapp_clicks INT DEFAULT 0,
    phone_calls INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABLE CATÉGORIES ET SOUS-CATÉGORIES TRILINGUES (FR, AR, EN)
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name_fr TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    icon_name TEXT NOT NULL DEFAULT 'ShoppingBag',
    image TEXT DEFAULT '',
    parent_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABLE PRODUITS & ANNONCES
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY DEFAULT 'prod_' || substring(uuid_generate_v4()::text from 1 for 8),
    store_id TEXT NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    category_id TEXT NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    subcategory_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    brand TEXT DEFAULT '',
    model TEXT DEFAULT '',
    reference TEXT DEFAULT '',
    price NUMERIC(10,2) NOT NULL,
    old_price NUMERIC(10,2),
    promotion_price NUMERIC(10,2),
    discount_percent INT DEFAULT 0,
    is_promotion BOOLEAN DEFAULT FALSE,
    stock_status TEXT DEFAULT 'IN_STOCK' CHECK (stock_status IN ('IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK')),
    delivery_available BOOLEAN DEFAULT TRUE,
    searchable_text TEXT DEFAULT '',
    keywords TEXT DEFAULT '',
    status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'DELETED')),
    promo_start_date TEXT DEFAULT '',
    promo_end_date TEXT DEFAULT '',
    views_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABLE IMAGES DE PRODUIT (Jusqu'à 3 images par produit)
CREATE TABLE IF NOT EXISTS public.product_images (
    id BIGSERIAL PRIMARY KEY,
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    position INT DEFAULT 0
);

-- 7. TABLE COMMANDES CLIENTS (58 Wilayas & Modes de livraison)
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY DEFAULT 'CMD-' || to_char(NOW(), 'YYYYMMDD') || '-' || substring(uuid_generate_v4()::text from 1 for 4),
    store_id TEXT NOT NULL REFERENCES public.stores(id) ON DELETE RESTRICT,
    store_name TEXT NOT NULL,
    customer_id TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    wilaya TEXT NOT NULL,
    commune TEXT NOT NULL,
    address TEXT NOT NULL,
    delivery_method TEXT DEFAULT 'HOME_DELIVERY' CHECK (delivery_method IN ('HOME_DELIVERY', 'STORE_PICKUP')),
    payment_method TEXT DEFAULT 'CASH_ON_DELIVERY' CHECK (payment_method IN ('CASH_ON_DELIVERY', 'STORE_PICKUP', 'ONLINE_PAYMENT')),
    subtotal NUMERIC(10,2) NOT NULL,
    delivery_fee NUMERIC(10,2) DEFAULT 0.0,
    total NUMERIC(10,2) NOT NULL,
    status TEXT DEFAULT 'NEW' CHECK (status IN ('NEW', 'CONFIRMED', 'PREPARING', 'READY', 'SHIPPING', 'DELIVERED', 'CANCELLED')),
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TABLE ARTICLES DE COMMANDES
CREATE TABLE IF NOT EXISTS public.order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    product_name TEXT NOT NULL,
    product_image TEXT DEFAULT '',
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(10,2) NOT NULL,
    total NUMERIC(10,2) NOT NULL
);

-- 9. TABLE ZONES ET TARIFS DE LIVRAISON PAR COMMERCE
CREATE TABLE IF NOT EXISTS public.delivery_zones (
    id BIGSERIAL PRIMARY KEY,
    store_id TEXT NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    wilaya TEXT NOT NULL,
    commune TEXT DEFAULT 'Toutes les communes',
    delivery_fee NUMERIC(10,2) DEFAULT 400.0,
    free_delivery_minimum NUMERIC(10,2) DEFAULT 5000.0,
    estimated_delivery_time TEXT DEFAULT '24-48h',
    active BOOLEAN DEFAULT TRUE
);

-- ==============================================================================
-- INDEX DE RECHERCHE ET PERFORMANCES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_products_store ON public.products(store_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_search ON public.products USING gin(to_tsvector('french', name || ' ' || description || ' ' || brand || ' ' || keywords));
CREATE INDEX IF NOT EXISTS idx_orders_store ON public.orders(store_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_stores_wilaya ON public.stores(wilaya);

-- ==============================================================================
-- RLS (ROW LEVEL SECURITY) POLICIES
-- ==============================================================================
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_zones ENABLE ROW LEVEL SECURITY;

-- Lecture publique pour les vitrines, catégories et produits
CREATE POLICY "Public stores viewable by everyone" ON public.stores FOR SELECT USING (true);
CREATE POLICY "Public categories viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public products viewable by everyone" ON public.products FOR SELECT USING (status = 'ACTIVE');
CREATE POLICY "Public product images viewable by everyone" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Public delivery zones viewable by everyone" ON public.delivery_zones FOR SELECT USING (active = true);

-- Politique spéciale administrateur : mounirath@yahoo.fr
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (auth.jwt() ->> 'email') = 'mounirath@yahoo.fr';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Accès complet de gestion pour l'administrateur
CREATE POLICY "Admin full access on stores" ON public.stores FOR ALL USING (public.is_admin());
CREATE POLICY "Admin full access on products" ON public.products FOR ALL USING (public.is_admin());
CREATE POLICY "Admin full access on categories" ON public.categories FOR ALL USING (public.is_admin());
CREATE POLICY "Admin full access on orders" ON public.orders FOR ALL USING (public.is_admin());

-- ==============================================================================
-- DONNÉES INITIALES (SEED DATA - MAGASINS & CATÉGORIES)
-- ==============================================================================
INSERT INTO public.categories (id, name_fr, name_ar, name_en, icon_name, sort_order) VALUES
('cat_phones', 'Smartphones & Tablettes', 'الهواتف الذكية والأجهزة اللوحية', 'Phones & Tablets', 'Smartphone', 1),
('cat_it', 'Informatique & Laptops', 'الإعلام الآلي والحواسيب', 'Computers & Laptops', 'Laptop', 2),
('cat_home', 'Électroménager', 'الأجهزة الكهرومنزلية', 'Home Appliances', 'Home', 3),
('cat_fashion', 'Mode & Vêtements', 'الملابس والأزياء', 'Fashion & Clothing', 'Checkroom', 4),
('cat_sports', 'Sports & Loisirs', 'الرياضة والأنشطة', 'Sports & Leisure', 'FitnessCenter', 5)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.stores (id, name, slug, logo, description, manager_name, phone, whatsapp, address, wilaya, commune, latitude, longitude, opening_hours) VALUES
('store_techzone', 'TechZone Alger', 'techzone-alger', 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400', 'Boutique spécialisée High-Tech, PC Gaming et smartphones avec garantie officielle.', 'Mounir Administrateur', '0550123456', '213550123456', '12 Rue Didouche Mourad', '16 - Alger', 'Alger Centre', 36.7681, 3.0538, 'Sam-Jeu: 09h00 - 19h30'),
('store_oran_mode', 'El Bahya Fashion', 'el-bahya-fashion', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400', 'Prêt-à-porter moderne et traditionnel haut de gamme à Oran.', 'Yacine Store', '0770987654', '213770987654', 'Boulevard de la Soummam', '31 - Oran', 'Oran Centre', 35.6987, -0.6349, 'Sam-Ven: 10h00 - 20h00'),
('store_constantine_electro', 'Cirta Électro', 'cirta-electro', 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400', 'Gros et petit électroménager avec livraison rapide dans l''Est algérien.', 'Amine Gérant', '0661234567', '213661234567', 'Avenue Aouati Mostefa', '25 - Constantine', 'Constantine', 36.3650, 6.6147, 'Sam-Jeu: 08h30 - 18h30')
ON CONFLICT (id) DO NOTHING;
