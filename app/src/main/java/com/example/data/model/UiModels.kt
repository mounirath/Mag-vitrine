package com.example.data.model

data class ProductWithDetails(
    val product: ProductEntity,
    val store: StoreEntity?,
    val images: List<ProductImageEntity>,
    val category: CategoryEntity?,
    val subcategory: CategoryEntity?,
    val distanceMeters: Double? = null
) {
    val primaryImageUrl: String
        get() = images.sortedBy { it.position }.firstOrNull()?.imageUrl ?: ""
    
    val effectivePrice: Double
        get() = if (product.isPromotion && product.promotionPrice != null && product.promotionPrice > 0) {
            product.promotionPrice
        } else {
            product.price
        }
}

data class CartItemWithDetails(
    val cartItem: CartItemEntity,
    val product: ProductEntity,
    val store: StoreEntity,
    val primaryImage: String
) {
    val itemTotal: Double
        get() {
            val price = if (product.isPromotion && product.promotionPrice != null && product.promotionPrice > 0) {
                product.promotionPrice
            } else {
                product.price
            }
            return price * cartItem.quantity
        }
}

data class OrderWithItems(
    val order: OrderEntity,
    val items: List<OrderItemEntity>
)

data class AiVisionAnalysisResult(
    val detectedCategory: String = "",
    val detectedSubcategory: String = "",
    val productType: String = "",
    val brand: String = "",
    val model: String = "",
    val color: String = "",
    val ocrText: String = "",
    val visualFeatures: List<String> = emptyList(),
    val confidence: String = "Haute",
    val searchKeywords: String = ""
)
