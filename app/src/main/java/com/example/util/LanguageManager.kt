package com.example.util

import com.example.data.model.AppLanguage
import com.example.data.model.CategoryEntity

object LanguageManager {

    val ALGERIA_WILAYAS = listOf(
        "16 - Alger",
        "31 - Oran",
        "25 - Constantine",
        "09 - Blida",
        "19 - Sétif",
        "23 - Annaba",
        "13 - Tlemcen",
        "06 - Béjaïa",
        "05 - Batna",
        "15 - Tizi Ouzou",
        "35 - Boumerdès",
        "42 - Tipaza",
        "10 - Bouira",
        "27 - Mostaganem",
        "22 - Sidi Bel Abbès",
        "30 - Ouargla",
        "07 - Biskra",
        "14 - Tiaret",
        "02 - Chlef",
        "34 - Bordj Bou Arreridj"
    )

    fun getSlogan(lang: AppLanguage): String = when (lang) {
        AppLanguage.FR -> "Votre magasin dans la poche de vos clients."
        AppLanguage.AR -> "متجرك في جيب زبائنك"
        AppLanguage.EN -> "Your store in your customers' pocket."
    }

    fun getCategoryName(category: CategoryEntity, lang: AppLanguage): String = when (lang) {
        AppLanguage.FR -> category.nameFr
        AppLanguage.AR -> category.nameAr
        AppLanguage.EN -> category.nameEn
    }

    fun get(key: String, lang: AppLanguage): String {
        return STRINGS[key]?.get(lang) ?: STRINGS[key]?.get(AppLanguage.FR) ?: key
    }

    private val STRINGS = mapOf(
        "home" to mapOf(
            AppLanguage.FR to "Accueil",
            AppLanguage.AR to "الرئيسية",
            AppLanguage.EN to "Home"
        ),
        "hero_title" to mapOf(
            AppLanguage.FR to "Découvrez\n& Vendez",
            AppLanguage.AR to "اكتشف\nوبع في\nالجزائر",
            AppLanguage.EN to "Discover\n& Sell"
        ),
        "hero_search_hint" to mapOf(
            AppLanguage.FR to "Rechercher un objet, une marque, un magasin...",
            AppLanguage.AR to "ابحث عن أثاث، إلكترونيات، ملابس، سيارات...",
            AppLanguage.EN to "Search furniture, tech, fashion..."
        ),
        "hero_wilaya_hint" to mapOf(
            AppLanguage.FR to "Filtrer par Wilaya (Alger, Oran, Constantine...)",
            AppLanguage.AR to "تصفية حسب الولاية أو المدينة (الجزائر، وهران...)",
            AppLanguage.EN to "Filter by Wilaya or City"
        ),
        "smart_categories" to mapOf(
            AppLanguage.FR to "Smart Categories",
            AppLanguage.AR to "الأقسام الذكية",
            AppLanguage.EN to "Smart Categories"
        ),
        "see_all" to mapOf(
            AppLanguage.FR to "Voir tout",
            AppLanguage.AR to "عرض الكل",
            AppLanguage.EN to "See all"
        ),
        "recent_lines" to mapOf(
            AppLanguage.FR to "Recent lines",
            AppLanguage.AR to "أحدث الإعلانات",
            AppLanguage.EN to "Recent lines"
        ),
        "local_connect" to mapOf(
            AppLanguage.FR to "Recherche",
            AppLanguage.AR to "بحث وموقع",
            AppLanguage.EN to "Search & Map"
        ),
        "vendre_cta" to mapOf(
            AppLanguage.FR to "Vendre (+)",
            AppLanguage.AR to "نشر إعلان (+)",
            AppLanguage.EN to "Sell (+)"
        ),
        "trust_portal" to mapOf(
            AppLanguage.FR to "Confiance",
            AppLanguage.AR to "بوابة الثقة",
            AppLanguage.EN to "Trust Portal"
        ),
        "estimator" to mapOf(
            AppLanguage.FR to "Estimateur",
            AppLanguage.AR to "مقدّر القيمة",
            AppLanguage.EN to "Estimator"
        ),
        "messages_tab" to mapOf(
            AppLanguage.FR to "Messages",
            AppLanguage.AR to "رسائل",
            AppLanguage.EN to "Messages"
        ),
        "profile_tab" to mapOf(
            AppLanguage.FR to "Profil",
            AppLanguage.AR to "حسابي",
            AppLanguage.EN to "Profile"
        ),
        "cat_furniture_label" to mapOf(
            AppLanguage.FR to "Meubles &\nDécor",
            AppLanguage.AR to "أثاث\nوديكور",
            AppLanguage.EN to "Furniture"
        ),
        "cat_electronics_label" to mapOf(
            AppLanguage.FR to "Électronique",
            AppLanguage.AR to "إلكترونيات",
            AppLanguage.EN to "Electronics"
        ),
        "cat_fashion_label" to mapOf(
            AppLanguage.FR to "موضة وأزياء",
            AppLanguage.AR to "موضة\nوأزياء",
            AppLanguage.EN to "Fashion"
        ),
        "cat_parts_label" to mapOf(
            AppLanguage.FR to "Pièces &\nRechanges",
            AppLanguage.AR to "قطع غيار",
            AppLanguage.EN to "Spare parts"
        ),
        "cat_artisanat_label" to mapOf(
            AppLanguage.FR to "Artisanat\nLocal",
            AppLanguage.AR to "صناعة\nتقليدية",
            AppLanguage.EN to "Handmade"
        ),
        "cat_materials_label" to mapOf(
            AppLanguage.FR to "مواد ولوازم",
            AppLanguage.AR to "مواد\nولوازم",
            AppLanguage.EN to "Materials"
        ),
        "map_view" to mapOf(
            AppLanguage.FR to "Carte",
            AppLanguage.AR to "الخريطة",
            AppLanguage.EN to "Map"
        ),
        "tracking" to mapOf(
            AppLanguage.FR to "Suivi",
            AppLanguage.AR to "تتبع",
            AppLanguage.EN to "Tracking"
        ),
        "my_store" to mapOf(
            AppLanguage.FR to "Mon Magasin",
            AppLanguage.AR to "متجري",
            AppLanguage.EN to "My Store"
        ),
        "admin" to mapOf(
            AppLanguage.FR to "Admin",
            AppLanguage.AR to "لوحة الإدارة",
            AppLanguage.EN to "Admin"
        ),
        "search_hint" to mapOf(
            AppLanguage.FR to "Rechercher un produit, magasin, marque...",
            AppLanguage.AR to "ابحث عن منتج، متجر، علامة تجارية...",
            AppLanguage.EN to "Search product, store, brand..."
        ),
        "ai_camera_search" to mapOf(
            AppLanguage.FR to "Recherche avec caméra IA",
            AppLanguage.AR to "البحث بكاميرا الذكاء الاصطناعي",
            AppLanguage.EN to "AI Camera Search"
        ),
        "gallery_search" to mapOf(
            AppLanguage.FR to "Rechercher depuis une photo",
            AppLanguage.AR to "بحث من صورة بالمعرض",
            AppLanguage.EN to "Search from photo"
        ),
        "near_me" to mapOf(
            AppLanguage.FR to "Près de moi",
            AppLanguage.AR to "بالقرب مني",
            AppLanguage.EN to "Near me"
        ),
        "view_on_map" to mapOf(
            AppLanguage.FR to "Voir sur la carte",
            AppLanguage.AR to "عرض على الخريطة",
            AppLanguage.EN to "View on map"
        ),
        "categories" to mapOf(
            AppLanguage.FR to "Catégories",
            AppLanguage.AR to "التصنيفات",
            AppLanguage.EN to "Categories"
        ),
        "promotions" to mapOf(
            AppLanguage.FR to "Promotions",
            AppLanguage.AR to "التخفيضات والعروض",
            AppLanguage.EN to "Promotions"
        ),
        "new_products" to mapOf(
            AppLanguage.FR to "Nouveaux produits",
            AppLanguage.AR to "منتجات جديدة",
            AppLanguage.EN to "New arrivals"
        ),
        "stores" to mapOf(
            AppLanguage.FR to "Magasins & Vitrines",
            AppLanguage.AR to "المتاجر والواجهات",
            AppLanguage.EN to "Stores & Vitrines"
        ),
        "home_delivery" to mapOf(
            AppLanguage.FR to "Livraison à domicile",
            AppLanguage.AR to "التوصيل إلى المنزل",
            AppLanguage.EN to "Home delivery"
        ),
        "delivery_available" to mapOf(
            AppLanguage.FR to "Livraison disponible",
            AppLanguage.AR to "التوصيل متوفر",
            AppLanguage.EN to "Delivery available"
        ),
        "free_delivery_from" to mapOf(
            AppLanguage.FR to "Livraison gratuite dès",
            AppLanguage.AR to "توصيل مجاني ابتداءً من",
            AppLanguage.EN to "Free delivery from"
        ),
        "add_to_cart" to mapOf(
            AppLanguage.FR to "Ajouter au panier",
            AppLanguage.AR to "أضف إلى السلة",
            AppLanguage.EN to "Add to cart"
        ),
        "cart" to mapOf(
            AppLanguage.FR to "Panier",
            AppLanguage.AR to "سلة المشتريات",
            AppLanguage.EN to "Cart"
        ),
        "order" to mapOf(
            AppLanguage.FR to "Commander",
            AppLanguage.AR to "تأكيد الطلب",
            AppLanguage.EN to "Checkout"
        ),
        "track_order" to mapOf(
            AppLanguage.FR to "Suivi de commande",
            AppLanguage.AR to "تتبع الطلبية",
            AppLanguage.EN to "Track order"
        ),
        "call" to mapOf(
            AppLanguage.FR to "Appeler",
            AppLanguage.AR to "اتصال هاتفي",
            AppLanguage.EN to "Call"
        ),
        "whatsapp" to mapOf(
            AppLanguage.FR to "WhatsApp",
            AppLanguage.AR to "واتساب",
            AppLanguage.EN to "WhatsApp"
        ),
        "view_products" to mapOf(
            AppLanguage.FR to "Voir les produits",
            AppLanguage.AR to "عرض المنتجات",
            AppLanguage.EN to "View products"
        ),
        "locate" to mapOf(
            AppLanguage.FR to "Localiser",
            AppLanguage.AR to "تحديد الموقع",
            AppLanguage.EN to "Locate"
        ),
        "share_store" to mapOf(
            AppLanguage.FR to "Partager la vitrine",
            AppLanguage.AR to "مشاركة الواجهة",
            AppLanguage.EN to "Share vitrine"
        ),
        "share_product" to mapOf(
            AppLanguage.FR to "Partager le produit",
            AppLanguage.AR to "مشاركة المنتج",
            AppLanguage.EN to "Share product"
        ),
        "qr_code" to mapOf(
            AppLanguage.FR to "QR Code",
            AppLanguage.AR to "رمز الاستجابة السريعة",
            AppLanguage.EN to "QR Code"
        ),
        "all" to mapOf(
            AppLanguage.FR to "Tous",
            AppLanguage.AR to "الكل",
            AppLanguage.EN to "All"
        ),
        "sort_relevance" to mapOf(
            AppLanguage.FR to "Pertinence",
            AppLanguage.AR to "الأكثر صلة",
            AppLanguage.EN to "Relevance"
        ),
        "sort_price_asc" to mapOf(
            AppLanguage.FR to "Prix croissant",
            AppLanguage.AR to "السعر: من الأقل للأعلى",
            AppLanguage.EN to "Price: Low to High"
        ),
        "sort_price_desc" to mapOf(
            AppLanguage.FR to "Prix décroissant",
            AppLanguage.AR to "السعر: من الأعلى للأقل",
            AppLanguage.EN to "Price: High to Low"
        ),
        "sort_distance_asc" to mapOf(
            AppLanguage.FR to "Distance croissante",
            AppLanguage.AR to "المسافة: الأقرب أولاً",
            AppLanguage.EN to "Distance: Nearest first"
        ),
        "sort_distance_desc" to mapOf(
            AppLanguage.FR to "Distance décroissante",
            AppLanguage.AR to "المسافة: الأبعد أولاً",
            AppLanguage.EN to "Distance: Farthest first"
        ),
        "dashboard" to mapOf(
            AppLanguage.FR to "Tableau de bord",
            AppLanguage.AR to "لوحة التحكم",
            AppLanguage.EN to "Dashboard"
        ),
        "my_products" to mapOf(
            AppLanguage.FR to "Mes produits",
            AppLanguage.AR to "منتجاتي",
            AppLanguage.EN to "My products"
        ),
        "add_product" to mapOf(
            AppLanguage.FR to "+ Ajouter un produit",
            AppLanguage.AR to "+ إضافة منتج جديد",
            AppLanguage.EN to "+ Add a product"
        ),
        "limit_50_reached" to mapOf(
            AppLanguage.FR to "Vous avez atteint la limite de 50 annonces actives. Désactivez ou supprimez une annonce pour en publier une nouvelle.",
            AppLanguage.AR to "لقد بلغت الحد الأقصى المسموح به (50 إعلاناً نشطاً). يرجى تعطيل أو حذف إعلان لنشر إعلان جديد.",
            AppLanguage.EN to "You have reached the limit of 50 active ads. Deactivate or delete an ad to post a new one."
        ),
        "ads_count" to mapOf(
            AppLanguage.FR to "Annonces actives",
            AppLanguage.AR to "الإعلانات النشطة",
            AppLanguage.EN to "Active ads"
        ),
        "subtotal" to mapOf(
            AppLanguage.FR to "Sous-total",
            AppLanguage.AR to "المجموع الفرعي",
            AppLanguage.EN to "Subtotal"
        ),
        "delivery_fee" to mapOf(
            AppLanguage.FR to "Frais de livraison",
            AppLanguage.AR to "تكلفة التوصيل",
            AppLanguage.EN to "Delivery fee"
        ),
        "total" to mapOf(
            AppLanguage.FR to "Total",
            AppLanguage.AR to "المجموع الكلي",
            AppLanguage.EN to "Total"
        ),
        "order_status_new" to mapOf(
            AppLanguage.FR to "Nouvelle",
            AppLanguage.AR to "جديدة",
            AppLanguage.EN to "New"
        ),
        "order_status_confirmed" to mapOf(
            AppLanguage.FR to "Confirmée",
            AppLanguage.AR to "مؤكدة",
            AppLanguage.EN to "Confirmed"
        ),
        "order_status_preparing" to mapOf(
            AppLanguage.FR to "En préparation",
            AppLanguage.AR to "قيد التحضير",
            AppLanguage.EN to "Preparing"
        ),
        "order_status_ready" to mapOf(
            AppLanguage.FR to "Prête",
            AppLanguage.AR to "جاهزة",
            AppLanguage.EN to "Ready"
        ),
        "order_status_shipping" to mapOf(
            AppLanguage.FR to "En livraison",
            AppLanguage.AR to "في طريق التوصيل",
            AppLanguage.EN to "Out for delivery"
        ),
        "order_status_delivered" to mapOf(
            AppLanguage.FR to "Livrée",
            AppLanguage.AR to "تم التسليم بنجاح",
            AppLanguage.EN to "Delivered"
        ),
        "order_status_cancelled" to mapOf(
            AppLanguage.FR to "Annulée",
            AppLanguage.AR to "ملغاة",
            AppLanguage.EN to "Cancelled"
        ),
        "payment_cod" to mapOf(
            AppLanguage.FR to "Paiement à la livraison",
            AppLanguage.AR to "الدفع عند الاستلام",
            AppLanguage.EN to "Cash on delivery"
        ),
        "payment_pickup" to mapOf(
            AppLanguage.FR to "Retrait au magasin",
            AppLanguage.AR to "استلام من المتجر",
            AppLanguage.EN to "Store pickup"
        ),
        "payment_online" to mapOf(
            AppLanguage.FR to "Paiement en ligne",
            AppLanguage.AR to "دفع إلكتروني",
            AppLanguage.EN to "Online payment"
        ),
        "admin_portal" to mapOf(
            AppLanguage.FR to "Espace Administrateur",
            AppLanguage.AR to "بوابة الإدارة",
            AppLanguage.EN to "Admin Portal"
        )
    )
}
