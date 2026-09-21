package com.example.data.local

import com.example.data.model.CategoryEntity
import com.example.data.model.DeliveryZoneEntity
import com.example.data.model.OrderEntity
import com.example.data.model.OrderItemEntity
import com.example.data.model.ProductEntity
import com.example.data.model.ProductImageEntity
import com.example.data.model.StoreEntity
import com.example.data.model.UserEntity

object DatabaseInitializer {

    suspend fun populateInitialData(dao: MagVitrineDao) {
        // Users
        val admin = UserEntity(
            id = "user_admin",
            email = "admin@magvitrine.dz",
            role = "admin",
            name = "Administrateur MAG VITRINE",
            phone = "+213 550 12 34 56"
        )
        val storeUser1 = UserEntity(
            id = "user_store_1",
            email = "contact@techzone.dz",
            role = "store",
            name = "Mohamed Benali",
            phone = "+213 661 22 33 44"
        )
        val storeUser2 = UserEntity(
            id = "user_store_2",
            email = "contact@elegance.dz",
            role = "store",
            name = "Amina Khelil",
            phone = "+213 770 99 88 77"
        )
        val customerUser = UserEntity(
            id = "user_customer_1",
            email = "client@gmail.com",
            role = "customer",
            name = "Karim Larbi",
            phone = "+213 555 44 33 22"
        )

        dao.insertUser(admin)
        dao.insertUser(storeUser1)
        dao.insertUser(storeUser2)
        dao.insertUser(customerUser)

        // Stores
        val store1 = StoreEntity(
            id = "store_techzone",
            userId = "user_store_1",
            name = "Tech Zone Alger",
            slug = "tech-zone-alger",
            logo = "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=300",
            banner = "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=900",
            description = "Spécialiste high-tech en Algérie : smartphones neufs et garantis, PC portables, téléviseurs et accessoires premium.",
            managerName = "Mohamed Benali",
            phone = "+213 661 22 33 44",
            whatsapp = "+213661223344",
            address = "42 Rue Didouche Mourad",
            wilaya = "Alger",
            commune = "Alger Centre",
            latitude = 36.7680,
            longitude = 3.0550,
            openingHours = "Samedi - Jeudi: 09h00 - 20h00",
            deliveryEnabled = true,
            freeDeliveryMinimum = 10000.0,
            defaultDeliveryFee = 400.0,
            estimatedDeliveryTime = "24h - 48h",
            viewsCount = 380,
            whatsappClicks = 45,
            phoneCalls = 22
        )

        val store2 = StoreEntity(
            id = "store_elegance",
            userId = "user_store_2",
            name = "Élégance Boutique",
            slug = "elegance-boutique",
            logo = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300",
            banner = "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=900",
            description = "Prêt-à-porter moderne pour homme et femme, chaussures de marque et maroquinerie chic.",
            managerName = "Amina Khelil",
            phone = "+213 770 99 88 77",
            whatsapp = "+213770998877",
            address = "15 Rue Sidi Yahia",
            wilaya = "Alger",
            commune = "Hydra",
            latitude = 36.7350,
            longitude = 3.0290,
            openingHours = "Tous les jours: 10h00 - 21h00",
            deliveryEnabled = true,
            freeDeliveryMinimum = 6000.0,
            defaultDeliveryFee = 300.0,
            estimatedDeliveryTime = "24h",
            viewsCount = 290,
            whatsappClicks = 32,
            phoneCalls = 14
        )

        val store3 = StoreEntity(
            id = "store_maison",
            userId = "user_store_3",
            name = "Maison & Confort",
            slug = "maison-et-confort",
            logo = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300",
            banner = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=900",
            description = "Mobilier contemporain, décoration d'intérieur, luminaires et ustensiles de cuisine haut de gamme.",
            managerName = "Yassine Mansour",
            phone = "+213 550 88 77 66",
            whatsapp = "+213550887766",
            address = "Cité Saïd Hamdine",
            wilaya = "Alger",
            commune = "Bir Mourad Raïs",
            latitude = 36.7280,
            longitude = 3.0450,
            openingHours = "Samedi - Jeudi: 09h30 - 19h30",
            deliveryEnabled = true,
            freeDeliveryMinimum = 15000.0,
            defaultDeliveryFee = 600.0,
            estimatedDeliveryTime = "48h - 72h",
            viewsCount = 195,
            whatsappClicks = 18,
            phoneCalls = 9
        )

        val store4 = StoreEntity(
            id = "store_jasmine",
            userId = "user_store_4",
            name = "Parfumerie Jasmine",
            slug = "parfumerie-jasmine",
            logo = "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=300",
            banner = "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=900",
            description = "Parfums originaux 100% authentiques, cosmétiques certifiés, soins visage et cheveux.",
            managerName = "Nadia Bouzid",
            phone = "+213 658 11 22 33",
            whatsapp = "+213658112233",
            address = "Boulevard de l'ALN",
            wilaya = "Oran",
            commune = "Oran",
            latitude = 35.6980,
            longitude = -0.6340,
            openingHours = "Samedi - Vendredi: 10h00 - 20h00",
            deliveryEnabled = true,
            freeDeliveryMinimum = 5000.0,
            defaultDeliveryFee = 350.0,
            estimatedDeliveryTime = "24h - 48h",
            viewsCount = 210,
            whatsappClicks = 27,
            phoneCalls = 11
        )

        val store5 = StoreEntity(
            id = "store_auto",
            userId = "user_store_5",
            name = "Auto Express DZ",
            slug = "auto-express-dz",
            logo = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=300",
            banner = "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=900",
            description = "Pièces détachées d'origine, pneus toutes saisons, filtres, huiles moteur et accessoires auto.",
            managerName = "Redha Belkacem",
            phone = "+213 540 33 22 11",
            whatsapp = "+213540332211",
            address = "Zone Commerciale Bab Ezzouar",
            wilaya = "Alger",
            commune = "Bab Ezzouar",
            latitude = 36.7160,
            longitude = 3.1830,
            openingHours = "Samedi - Jeudi: 08h30 - 18h30",
            deliveryEnabled = true,
            freeDeliveryMinimum = 8000.0,
            defaultDeliveryFee = 500.0,
            estimatedDeliveryTime = "24h",
            viewsCount = 160,
            whatsappClicks = 19,
            phoneCalls = 15
        )

        dao.insertStore(store1)
        dao.insertStore(store2)
        dao.insertStore(store3)
        dao.insertStore(store4)
        dao.insertStore(store5)

        // Categories & Subcategories
        val categories = listOf(
            // Mode
            CategoryEntity("cat_fashion", "Mode", "أزياء وموضة", "Fashion", "Checkroom", "", null, true, 1),
            CategoryEntity("sub_homme", "Homme", "رجالي", "Men", "Man", "", "cat_fashion", true, 1),
            CategoryEntity("sub_femme", "Femme", "نسائي", "Women", "Woman", "", "cat_fashion", true, 2),
            CategoryEntity("sub_enfant", "Enfant", "أطفال", "Kids", "ChildCare", "", "cat_fashion", true, 3),
            CategoryEntity("sub_chaussures", "Chaussures", "أحذية", "Shoes", "Hiking", "", "cat_fashion", true, 4),
            CategoryEntity("sub_accessoires_mode", "Accessoires", "إكسسوارات", "Accessories", "Watch", "", "cat_fashion", true, 5),

            // Électronique
            CategoryEntity("cat_electronics", "Électronique", "إلكترونيات", "Electronics", "Devices", "", null, true, 2),
            CategoryEntity("sub_telephones", "Téléphones", "هواتف نقالة", "Phones", "Smartphone", "", "cat_electronics", true, 1),
            CategoryEntity("sub_ordinateurs", "Ordinateurs", "حواسيب", "Computers", "Laptop", "", "cat_electronics", true, 2),
            CategoryEntity("sub_televiseurs", "Téléviseurs", "تلفزيونات", "TVs", "Tv", "", "cat_electronics", true, 3),
            CategoryEntity("sub_accessoires_tech", "Accessoires", "ملحقات تقنية", "Accessories", "Headphones", "", "cat_electronics", true, 4),

            // Maison
            CategoryEntity("cat_home", "Maison", "المنزل والديكور", "Home", "Home", "", null, true, 3),
            CategoryEntity("sub_meubles", "Meubles", "أثاث", "Furniture", "Chair", "", "cat_home", true, 1),
            CategoryEntity("sub_decoration", "Décoration", "ديكور", "Decor", "Palette", "", "cat_home", true, 2),
            CategoryEntity("sub_cuisine", "Cuisine", "مطبخ", "Kitchen", "SoupKitchen", "", "cat_home", true, 3),
            CategoryEntity("sub_salle_de_bain", "Salle de bain", "حمام", "Bathroom", "Bathtub", "", "cat_home", true, 4),
            CategoryEntity("sub_literie", "Literie", "أفرشة", "Bedding", "Bed", "", "cat_home", true, 5),

            // Beauté
            CategoryEntity("cat_beauty", "Beauté", "عناية وجمال", "Beauty", "Spa", "", null, true, 4),
            CategoryEntity("sub_parfums", "Parfums", "عطور", "Perfumes", "AutoFixHigh", "", "cat_beauty", true, 1),
            CategoryEntity("sub_cosmetiques", "Cosmétiques", "مستحضرات تجميل", "Cosmetics", "Face", "", "cat_beauty", true, 2),
            CategoryEntity("sub_soins", "Soins", "عناية بالبشرة", "Skincare", "Healing", "", "cat_beauty", true, 3),
            CategoryEntity("sub_hygiene", "Hygiène", "نظافة شخصية", "Hygiene", "CleanHands", "", "cat_beauty", true, 4),

            // Alimentation
            CategoryEntity("cat_food", "Alimentation", "تغذية ومأكولات", "Food", "Restaurant", "", null, true, 5),
            CategoryEntity("sub_epicerie", "Épicerie", "مواد غذائية", "Grocery", "ShoppingBasket", "", "cat_food", true, 1),
            CategoryEntity("sub_boissons", "Boissons", "مشروبات", "Beverages", "LocalDrink", "", "cat_food", true, 2),
            CategoryEntity("sub_frais", "Produits frais", "منتجات طازجة", "Fresh Products", "LocalFlorist", "", "cat_food", true, 3),

            // Automobile
            CategoryEntity("cat_auto", "Automobile", "سيارات ومحركات", "Automotive", "DirectionsCar", "", null, true, 6),
            CategoryEntity("sub_pieces", "Pièces", "قطع غيار", "Auto Parts", "Build", "", "cat_auto", true, 1),
            CategoryEntity("sub_pneus", "Pneus", "عجلات وإطارات", "Tyres", "Album", "", "cat_auto", true, 2),
            CategoryEntity("sub_accessoires_auto", "Accessoires", "إكسسوارات سيارات", "Car Accessories", "Tune", "", "cat_auto", true, 3),
            CategoryEntity("sub_entretien", "Entretien automobile", "صيانة السيارات", "Maintenance", "Engineering", "", "cat_auto", true, 4)
        )

        categories.forEach { dao.insertCategory(it) }

        // Products
        val products = listOf(
            ProductEntity(
                id = "prod_1",
                storeId = "store_techzone",
                categoryId = "cat_electronics",
                subcategoryId = "sub_telephones",
                name = "Samsung Galaxy S24 Ultra 256GB",
                description = "Smartphone haut de gamme avec écran Dynamic AMOLED 2X 120Hz, processeur Snapdragon 8 Gen 3, S-Pen intégré et quadruple capteur photo 200 MP.",
                brand = "Samsung",
                model = "Galaxy S24 Ultra",
                reference = "SM-S928B-256",
                price = 185000.0,
                oldPrice = 205000.0,
                promotionPrice = 185000.0,
                discountPercent = 10,
                isPromotion = true,
                stockStatus = "IN_STOCK",
                deliveryAvailable = true,
                searchableText = "samsung galaxy s24 ultra smartphone 256gb telephone alger techzone android",
                keywords = "samsung, galaxy, s24, ultra, smartphone, alger, promo",
                status = "ACTIVE"
            ),
            ProductEntity(
                id = "prod_2",
                storeId = "store_elegance",
                categoryId = "cat_fashion",
                subcategoryId = "sub_chaussures",
                name = "Chaussures Cuir Homme Oxford",
                description = "Chaussures richelieu élégantes en cuir véritable italien, semelle cousue goodyear, confort exceptionnel pour cérémonie et travail.",
                brand = "Boccaccio",
                model = "Oxford Classic",
                reference = "OXF-2024-BR",
                price = 4500.0,
                oldPrice = 6000.0,
                promotionPrice = 4500.0,
                discountPercent = 25,
                isPromotion = true,
                stockStatus = "IN_STOCK",
                deliveryAvailable = true,
                searchableText = "chaussures homme cuir oxford classique habille noir marron elegance",
                keywords = "chaussures, homme, cuir, oxford, promo, elegance",
                status = "ACTIVE"
            ),
            ProductEntity(
                id = "prod_3",
                storeId = "store_techzone",
                categoryId = "cat_electronics",
                subcategoryId = "sub_ordinateurs",
                name = "MacBook Air 13\" M3 16GB / 512GB",
                description = "Puce Apple M3, 16 Go de mémoire unifiée, 512 Go SSD, écran Liquid Retina avec True Tone, autonomie jusqu'à 18 heures.",
                brand = "Apple",
                model = "MacBook Air M3",
                reference = "MBA-M3-16-512",
                price = 245000.0,
                oldPrice = null,
                promotionPrice = null,
                discountPercent = 0,
                isPromotion = false,
                stockStatus = "IN_STOCK",
                deliveryAvailable = true,
                searchableText = "apple macbook air m3 ordinateur portable laptop pc gris spatial techzone",
                keywords = "apple, macbook, air, m3, laptop, alger",
                status = "ACTIVE"
            ),
            ProductEntity(
                id = "prod_4",
                storeId = "store_jasmine",
                categoryId = "cat_beauty",
                subcategoryId = "sub_parfums",
                name = "Sauvage Eau de Parfum 100ml",
                description = "Parfum boisé et frais aux notes de bergamote de Calabre et d'absolu vanille de Papouasie. Sillage puissant et noble.",
                brand = "Dior",
                model = "Sauvage EDP",
                reference = "DIO-SAUV-100",
                price = 22000.0,
                oldPrice = 27500.0,
                promotionPrice = 22000.0,
                discountPercent = 20,
                isPromotion = true,
                stockStatus = "IN_STOCK",
                deliveryAvailable = true,
                searchableText = "dior sauvage parfum eau de parfum homme 100ml jasmine oran beaute",
                keywords = "dior, sauvage, parfum, homme, jasmine, promo",
                status = "ACTIVE"
            ),
            ProductEntity(
                id = "prod_5",
                storeId = "store_maison",
                categoryId = "cat_home",
                subcategoryId = "sub_meubles",
                name = "Canapé D'Angle Moderne Velours Gris",
                description = "Canapé d'angle 5 places réversible en velours antitache de haute qualité avec coffre de rangement et fonction lit convertible.",
                brand = "Nordic Home",
                model = "Oslo Comfort",
                reference = "CAN-OSL-GRIS",
                price = 78000.0,
                oldPrice = 92000.0,
                promotionPrice = 78000.0,
                discountPercent = 15,
                isPromotion = true,
                stockStatus = "IN_STOCK",
                deliveryAvailable = true,
                searchableText = "canape d'angle velours salon meuble gris maison confort bir mourad rais",
                keywords = "canape, meuble, maison, salon, promo",
                status = "ACTIVE"
            ),
            ProductEntity(
                id = "prod_6",
                storeId = "store_auto",
                categoryId = "cat_auto",
                subcategoryId = "sub_pneus",
                name = "Pneu Michelin Primacy 4 (205/55 R16)",
                description = "Excellente sécurité sur route mouillée, longévité remarquable, consommation de carburant optimisée.",
                brand = "Michelin",
                model = "Primacy 4",
                reference = "MICH-205-55-16",
                price = 14500.0,
                oldPrice = null,
                promotionPrice = null,
                discountPercent = 0,
                isPromotion = false,
                stockStatus = "IN_STOCK",
                deliveryAvailable = true,
                searchableText = "pneu michelin primacy 4 205 55 r16 auto express bab ezzouar",
                keywords = "pneu, michelin, voiture, roue, auto",
                status = "ACTIVE"
            ),
            ProductEntity(
                id = "prod_7",
                storeId = "store_elegance",
                categoryId = "cat_fashion",
                subcategoryId = "sub_femme",
                name = "Robe Longue Élégante Soirée",
                description = "Sublime robe de soirée en crêpe georgette avec broderies dorées délicates faites main, coupe fluide et gracieuse.",
                brand = "Algiers Couture",
                model = "Royal Emerald",
                reference = "ROB-RYL-EMR",
                price = 18500.0,
                oldPrice = 24000.0,
                promotionPrice = 18500.0,
                discountPercent = 23,
                isPromotion = true,
                stockStatus = "IN_STOCK",
                deliveryAvailable = true,
                searchableText = "robe longue soiree broderie femme elegance hydra sidi yahia",
                keywords = "robe, femme, soiree, mode, promo",
                status = "ACTIVE"
            ),
            ProductEntity(
                id = "prod_8",
                storeId = "store_techzone",
                categoryId = "cat_electronics",
                subcategoryId = "sub_accessoires_tech",
                name = "Casque Sans Fil Sony WH-1000XM5",
                description = "Réduction de bruit active exceptionnelle, audio haute résolution LDAC, jusqu'à 30 heures d'autonomie et appels ultra-clairs.",
                brand = "Sony",
                model = "WH-1000XM5",
                reference = "SNY-XM5-BLK",
                price = 56000.0,
                oldPrice = 65000.0,
                promotionPrice = 56000.0,
                discountPercent = 14,
                isPromotion = true,
                stockStatus = "IN_STOCK",
                deliveryAvailable = true,
                searchableText = "casque audio sans fil bluetooth sony xm5 anc reduction bruit techzone",
                keywords = "sony, casque, bluetooth, audio, techzone",
                status = "ACTIVE"
            )
        )

        products.forEach { dao.insertProduct(it) }

        // Product Images (Max 3 per product)
        val images = listOf(
            ProductImageEntity(0, "prod_1", "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600", 0),
            ProductImageEntity(0, "prod_1", "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600", 1),
            ProductImageEntity(0, "prod_1", "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600", 2),

            ProductImageEntity(0, "prod_2", "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600", 0),
            ProductImageEntity(0, "prod_2", "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600", 1),

            ProductImageEntity(0, "prod_3", "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600", 0),
            ProductImageEntity(0, "prod_3", "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600", 1),

            ProductImageEntity(0, "prod_4", "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600", 0),
            ProductImageEntity(0, "prod_4", "https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600", 1),

            ProductImageEntity(0, "prod_5", "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600", 0),
            ProductImageEntity(0, "prod_5", "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600", 1),

            ProductImageEntity(0, "prod_6", "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=600", 0),

            ProductImageEntity(0, "prod_7", "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600", 0),

            ProductImageEntity(0, "prod_8", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600", 0),
            ProductImageEntity(0, "prod_8", "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600", 1)
        )

        dao.insertProductImages(images)

        // Delivery Zones for Store 1 & 2
        val zones = listOf(
            DeliveryZoneEntity(0, "store_techzone", "Alger", "Alger Centre, Hydra, Bab El Oued", 300.0, 10000.0, "24h", true),
            DeliveryZoneEntity(0, "store_techzone", "Blida", "Toutes les communes", 500.0, 15000.0, "48h", true),
            DeliveryZoneEntity(0, "store_techzone", "Oran", "Oran, Bir El Djir, Es-Senia", 600.0, 20000.0, "48h", true),
            DeliveryZoneEntity(0, "store_elegance", "Alger", "Hydra, Ben Aknoun, El Biar", 300.0, 6000.0, "24h", true)
        )
        zones.forEach { dao.insertDeliveryZone(it) }

        // Sample Order for tracking demonstration
        val sampleOrder = OrderEntity(
            id = "ORD-2026-0891",
            storeId = "store_elegance",
            storeName = "Élégance Boutique",
            customerId = "user_customer_1",
            customerName = "Karim Larbi",
            customerPhone = "0555 44 33 22",
            wilaya = "Alger",
            commune = "Hydra",
            address = "Cité des Pins, Bâtiment B, Apt 14",
            deliveryMethod = "HOME_DELIVERY",
            paymentMethod = "CASH_ON_DELIVERY",
            subtotal = 4500.0,
            deliveryFee = 300.0,
            total = 4800.0,
            status = "PREPARING",
            notes = "Appeler avant la livraison svp"
        )
        dao.insertOrder(sampleOrder)

        val sampleOrderItem = OrderItemEntity(
            id = 0,
            orderId = "ORD-2026-0891",
            productId = "prod_2",
            productName = "Chaussures Cuir Homme Oxford",
            productImage = "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600",
            quantity = 1,
            unitPrice = 4500.0,
            total = 4500.0
        )
        dao.insertOrderItem(sampleOrderItem)
    }
}
