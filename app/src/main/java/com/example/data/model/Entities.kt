package com.example.data.model

import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.Index
import androidx.room.PrimaryKey

enum class AppLanguage(val code: String, val displayName: String, val isRtl: Boolean) {
    FR("fr", "FR", false),
    AR("ar", "العربية", true),
    EN("en", "EN", false)
}

enum class UserRole {
    CUSTOMER,
    STORE,
    ADMIN
}

enum class StockStatus {
    IN_STOCK,
    LOW_STOCK,
    OUT_OF_STOCK
}

enum class AdStatus {
    ACTIVE,
    INACTIVE,
    DELETED
}

enum class OrderStatus {
    NEW,
    CONFIRMED,
    PREPARING,
    READY,
    SHIPPING,
    DELIVERED,
    CANCELLED
}

enum class DeliveryMethod {
    HOME_DELIVERY,
    STORE_PICKUP
}

enum class PaymentMethod {
    CASH_ON_DELIVERY,
    STORE_PICKUP,
    ONLINE_PAYMENT
}

enum class SortOption {
    RELEVANCE,
    PRICE_ASC,
    PRICE_DESC,
    DISTANCE_ASC,
    DISTANCE_DESC,
    PROMOTIONS
}

@Entity(tableName = "users")
data class UserEntity(
    @PrimaryKey val id: String,
    val email: String,
    val role: String, // "customer", "store", "admin"
    val name: String,
    val phone: String = "",
    val createdAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "stores")
data class StoreEntity(
    @PrimaryKey val id: String,
    val userId: String,
    val name: String,
    val slug: String,
    val logo: String,
    val banner: String = "",
    val description: String,
    val managerName: String,
    val phone: String,
    val whatsapp: String,
    val address: String,
    val wilaya: String,
    val commune: String,
    val latitude: Double,
    val longitude: Double,
    val openingHours: String,
    val deliveryEnabled: Boolean = true,
    val freeDeliveryMinimum: Double = 5000.0,
    val defaultDeliveryFee: Double = 300.0,
    val estimatedDeliveryTime: String = "24h - 48h",
    val status: String = "active", // "active", "suspended"
    val viewsCount: Int = 142,
    val whatsappClicks: Int = 38,
    val phoneCalls: Int = 19,
    val createdAt: Long = System.currentTimeMillis()
)

@Entity(tableName = "categories")
data class CategoryEntity(
    @PrimaryKey val id: String,
    val nameFr: String,
    val nameAr: String,
    val nameEn: String,
    val iconName: String, // Material icon identifier
    val image: String = "",
    val parentId: String? = null, // null for root categories, category ID for subcategories
    val active: Boolean = true,
    val sortOrder: Int = 0
)

@Entity(
    tableName = "products",
    indices = [Index("storeId"), Index("categoryId"), Index("subcategoryId")]
)
data class ProductEntity(
    @PrimaryKey val id: String,
    val storeId: String,
    val categoryId: String,
    val subcategoryId: String? = null,
    val name: String,
    val description: String,
    val brand: String = "",
    val model: String = "",
    val reference: String = "",
    val price: Double,
    val oldPrice: Double? = null,
    val promotionPrice: Double? = null,
    val discountPercent: Int = 0,
    val isPromotion: Boolean = false,
    val stockStatus: String = "IN_STOCK",
    val deliveryAvailable: Boolean = true,
    val searchableText: String = "",
    val keywords: String = "",
    val status: String = "ACTIVE", // "ACTIVE", "INACTIVE", "DELETED"
    val promoStartDate: String = "",
    val promoEndDate: String = "",
    val viewsCount: Int = 0,
    val createdAt: Long = System.currentTimeMillis()
)

@Entity(
    tableName = "product_images",
    indices = [Index("productId")]
)
data class ProductImageEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val productId: String,
    val imageUrl: String,
    val position: Int = 0 // 0 = primary photo, up to position 2 (max 3 photos)
)

@Entity(
    tableName = "orders",
    indices = [Index("storeId"), Index("customerId")]
)
data class OrderEntity(
    @PrimaryKey val id: String,
    val storeId: String,
    val storeName: String,
    val customerId: String,
    val customerName: String,
    val customerPhone: String,
    val wilaya: String,
    val commune: String,
    val address: String,
    val deliveryMethod: String = "HOME_DELIVERY",
    val paymentMethod: String = "CASH_ON_DELIVERY",
    val subtotal: Double,
    val deliveryFee: Double,
    val total: Double,
    val status: String = "NEW", // NEW, CONFIRMED, PREPARING, READY, SHIPPING, DELIVERED, CANCELLED
    val notes: String = "",
    val createdAt: Long = System.currentTimeMillis()
)

@Entity(
    tableName = "order_items",
    indices = [Index("orderId")]
)
data class OrderItemEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val orderId: String,
    val productId: String,
    val productName: String,
    val productImage: String = "",
    val quantity: Int,
    val unitPrice: Double,
    val total: Double
)

@Entity(
    tableName = "delivery_zones",
    indices = [Index("storeId")]
)
data class DeliveryZoneEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val storeId: String,
    val wilaya: String,
    val commune: String = "Toutes les communes",
    val deliveryFee: Double = 400.0,
    val freeDeliveryMinimum: Double = 5000.0,
    val estimatedDeliveryTime: String = "24-48h",
    val active: Boolean = true
)

@Entity(tableName = "cart_items")
data class CartItemEntity(
    @PrimaryKey val productId: String,
    val storeId: String,
    val quantity: Int = 1,
    val addedAt: Long = System.currentTimeMillis()
)
