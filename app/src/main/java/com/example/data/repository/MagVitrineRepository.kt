package com.example.data.repository

import com.example.data.local.MagVitrineDao
import com.example.data.model.CartItemEntity
import com.example.data.model.CartItemWithDetails
import com.example.data.model.CategoryEntity
import com.example.data.model.DeliveryZoneEntity
import com.example.data.model.OrderEntity
import com.example.data.model.OrderItemEntity
import com.example.data.model.OrderWithItems
import com.example.data.model.ProductEntity
import com.example.data.model.ProductImageEntity
import com.example.data.model.ProductWithDetails
import com.example.data.model.StoreEntity
import com.example.data.model.UserEntity
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.firstOrNull
import java.util.UUID

class MagVitrineRepository(private val dao: MagVitrineDao) {

    // --- Users ---
    suspend fun getUserByEmail(email: String): UserEntity? = dao.getUserByEmail(email)
    suspend fun insertUser(user: UserEntity) = dao.insertUser(user)

    // --- Stores ---
    fun getAllStores(): Flow<List<StoreEntity>> = dao.getAllStoresFlow()
    fun getActiveStores(): Flow<List<StoreEntity>> = dao.getActiveStoresFlow()
    suspend fun getStoreById(id: String): StoreEntity? = dao.getStoreById(id)
    fun getStoreByIdFlow(id: String): Flow<StoreEntity?> = dao.getStoreByIdFlow(id)
    suspend fun getStoreBySlug(slug: String): StoreEntity? = dao.getStoreBySlug(slug)
    suspend fun getStoreByUserId(userId: String): StoreEntity? = dao.getStoreByUserId(userId)
    suspend fun insertStore(store: StoreEntity) = dao.insertStore(store)
    suspend fun updateStore(store: StoreEntity) = dao.updateStore(store)
    suspend fun deleteStore(storeId: String) = dao.deleteStoreById(storeId)
    suspend fun updateStoreStatus(storeId: String, status: String) = dao.updateStoreStatus(storeId, status)
    suspend fun recordStoreContact(storeId: String, type: String) {
        when (type) {
            "view" -> dao.incrementStoreViews(storeId)
            "whatsapp" -> dao.incrementStoreWhatsApp(storeId)
            "call" -> dao.incrementStorePhoneCalls(storeId)
        }
    }

    // --- Categories ---
    fun getAllCategories(): Flow<List<CategoryEntity>> = dao.getAllCategoriesFlow()
    fun getRootCategories(): Flow<List<CategoryEntity>> = dao.getRootCategoriesFlow()
    fun getSubcategories(parentId: String): Flow<List<CategoryEntity>> = dao.getSubcategoriesFlow(parentId)
    suspend fun getCategoryById(id: String): CategoryEntity? = dao.getCategoryById(id)
    suspend fun insertCategory(category: CategoryEntity) = dao.insertCategory(category)
    suspend fun updateCategory(category: CategoryEntity) = dao.updateCategory(category)
    suspend fun deleteCategory(id: String) = dao.deleteCategory(id)

    // --- Products With Full Details ---
    fun getActiveProductsWithDetails(): Flow<List<ProductWithDetails>> {
        return combine(
            dao.getActiveProductsFlow(),
            dao.getAllStoresFlow(),
            dao.getAllImagesFlow(),
            dao.getAllCategoriesFlow()
        ) { products, stores, images, categories ->
            val storeMap = stores.associateBy { it.id }
            val imagesMap = images.groupBy { it.productId }
            val catMap = categories.associateBy { it.id }

            products.map { prod ->
                ProductWithDetails(
                    product = prod,
                    store = storeMap[prod.storeId],
                    images = imagesMap[prod.id]?.sortedBy { it.position } ?: emptyList(),
                    category = catMap[prod.categoryId],
                    subcategory = prod.subcategoryId?.let { catMap[it] }
                )
            }
        }
    }

    fun getAllProductsWithDetails(): Flow<List<ProductWithDetails>> {
        return combine(
            dao.getAllProductsFlow(),
            dao.getAllStoresFlow(),
            dao.getAllImagesFlow(),
            dao.getAllCategoriesFlow()
        ) { products, stores, images, categories ->
            val storeMap = stores.associateBy { it.id }
            val imagesMap = images.groupBy { it.productId }
            val catMap = categories.associateBy { it.id }

            products.map { prod ->
                ProductWithDetails(
                    product = prod,
                    store = storeMap[prod.storeId],
                    images = imagesMap[prod.id]?.sortedBy { it.position } ?: emptyList(),
                    category = catMap[prod.categoryId],
                    subcategory = prod.subcategoryId?.let { catMap[it] }
                )
            }
        }
    }

    fun getProductsByStoreWithDetails(storeId: String): Flow<List<ProductWithDetails>> {
        return combine(
            dao.getProductsByStoreFlow(storeId),
            dao.getStoreByIdFlow(storeId),
            dao.getAllImagesFlow(),
            dao.getAllCategoriesFlow()
        ) { products, store, images, categories ->
            val imagesMap = images.groupBy { it.productId }
            val catMap = categories.associateBy { it.id }

            products.map { prod ->
                ProductWithDetails(
                    product = prod,
                    store = store,
                    images = imagesMap[prod.id]?.sortedBy { it.position } ?: emptyList(),
                    category = catMap[prod.categoryId],
                    subcategory = prod.subcategoryId?.let { catMap[it] }
                )
            }
        }
    }

    suspend fun getProductWithDetailsById(productId: String): ProductWithDetails? {
        val prod = dao.getProductById(productId) ?: return null
        val store = dao.getStoreById(prod.storeId)
        val images = dao.getImagesForProduct(productId)
        val cat = dao.getCategoryById(prod.categoryId)
        val subcat = prod.subcategoryId?.let { dao.getCategoryById(it) }

        return ProductWithDetails(
            product = prod,
            store = store,
            images = images,
            category = cat,
            subcategory = subcat
        )
    }

    suspend fun getActiveProductCountForStore(storeId: String): Int {
        return dao.getActiveProductCountForStore(storeId)
    }

    // --- Product Management with 50 Ads Limit & Max 3 Photos ---
    suspend fun createProduct(
        product: ProductEntity,
        images: List<String> // Max 3 image URLs
    ): Result<String> {
        val activeCount = dao.getActiveProductCountForStore(product.storeId)
        if (activeCount >= 50 && product.status == "ACTIVE") {
            return Result.failure(
                IllegalStateException("Vous avez atteint la limite de 50 annonces actives. Désactivez ou supprimez une annonce pour en publier une nouvelle.")
            )
        }

        dao.insertProduct(product)
        dao.deleteImagesForProduct(product.id)

        val imageEntities = images.take(3).mapIndexed { index, url ->
            ProductImageEntity(
                productId = product.id,
                imageUrl = url,
                position = index
            )
        }
        dao.insertProductImages(imageEntities)

        return Result.success(product.id)
    }

    suspend fun updateProduct(
        product: ProductEntity,
        images: List<String>? = null
    ): Result<Unit> {
        dao.updateProduct(product)
        if (images != null) {
            dao.deleteImagesForProduct(product.id)
            val imageEntities = images.take(3).mapIndexed { index, url ->
                ProductImageEntity(
                    productId = product.id,
                    imageUrl = url,
                    position = index
                )
            }
            dao.insertProductImages(imageEntities)
        }
        return Result.success(Unit)
    }

    suspend fun updateProductStatus(productId: String, status: String) {
        dao.updateProductStatus(productId, status)
    }

    suspend fun deleteProduct(productId: String) {
        dao.deleteImagesForProduct(productId)
        dao.deleteProduct(productId)
    }

    suspend fun duplicateProduct(productId: String, storeId: String): Result<String> {
        val activeCount = dao.getActiveProductCountForStore(storeId)
        if (activeCount >= 50) {
            return Result.failure(
                IllegalStateException("Vous avez atteint la limite de 50 annonces actives.")
            )
        }
        val orig = dao.getProductById(productId) ?: return Result.failure(IllegalArgumentException("Produit non trouvé"))
        val origImages = dao.getImagesForProduct(productId)

        val newId = "prod_" + UUID.randomUUID().toString().take(8)
        val duplicated = orig.copy(
            id = newId,
            name = "${orig.name} (Copie)",
            createdAt = System.currentTimeMillis()
        )
        dao.insertProduct(duplicated)
        val newImages = origImages.map {
            it.copy(id = 0, productId = newId)
        }
        dao.insertProductImages(newImages)
        return Result.success(newId)
    }

    // --- Delivery Zones ---
    fun getDeliveryZonesForStore(storeId: String): Flow<List<DeliveryZoneEntity>> =
        dao.getDeliveryZonesForStoreFlow(storeId)

    suspend fun insertDeliveryZone(zone: DeliveryZoneEntity) = dao.insertDeliveryZone(zone)
    suspend fun deleteDeliveryZone(id: Long) = dao.deleteDeliveryZone(id)

    // --- Cart ---
    fun getCartWithDetails(): Flow<List<CartItemWithDetails>> {
        return combine(
            dao.getCartItemsFlow(),
            dao.getAllProductsFlow(),
            dao.getAllStoresFlow(),
            dao.getAllImagesFlow()
        ) { cartItems, products, stores, images ->
            val productMap = products.associateBy { it.id }
            val storeMap = stores.associateBy { it.id }
            val imageMap = images.groupBy { it.productId }

            cartItems.mapNotNull { item ->
                val prod = productMap[item.productId] ?: return@mapNotNull null
                val store = storeMap[item.storeId] ?: return@mapNotNull null
                val firstImage = imageMap[prod.id]?.sortedBy { it.position }?.firstOrNull()?.imageUrl ?: ""

                CartItemWithDetails(
                    cartItem = item,
                    product = prod,
                    store = store,
                    primaryImage = firstImage
                )
            }
        }
    }

    suspend fun addToCart(productId: String, storeId: String, quantity: Int = 1) {
        val existing = dao.getCartItemByProductId(productId)
        if (existing != null) {
            dao.updateCartQuantity(productId, existing.quantity + quantity)
        } else {
            dao.insertCartItem(CartItemEntity(productId = productId, storeId = storeId, quantity = quantity))
        }
    }

    suspend fun updateCartQuantity(productId: String, quantity: Int) {
        if (quantity <= 0) {
            dao.deleteCartItem(productId)
        } else {
            dao.updateCartQuantity(productId, quantity)
        }
    }

    suspend fun removeFromCart(productId: String) = dao.deleteCartItem(productId)
    suspend fun clearCart() = dao.clearCart()

    // --- Orders ---
    fun getAllOrdersWithItems(): Flow<List<OrderWithItems>> {
        return combine(
            dao.getAllOrdersFlow(),
            dao.getAllOrderItemsFlow()
        ) { orders, items ->
            val itemsByOrder = items.groupBy { it.orderId }
            orders.map { order ->
                OrderWithItems(
                    order = order,
                    items = itemsByOrder[order.id] ?: emptyList()
                )
            }
        }
    }

    fun getOrdersByStoreWithItems(storeId: String): Flow<List<OrderWithItems>> {
        return combine(
            dao.getOrdersByStoreFlow(storeId),
            dao.getAllOrderItemsFlow()
        ) { orders, items ->
            val itemsByOrder = items.groupBy { it.orderId }
            orders.map { order ->
                OrderWithItems(
                    order = order,
                    items = itemsByOrder[order.id] ?: emptyList()
                )
            }
        }
    }

    fun getOrdersByCustomerWithItems(customerId: String): Flow<List<OrderWithItems>> {
        return combine(
            dao.getOrdersByCustomerFlow(customerId),
            dao.getAllOrderItemsFlow()
        ) { orders, items ->
            val itemsByOrder = items.groupBy { it.orderId }
            orders.map { order ->
                OrderWithItems(
                    order = order,
                    items = itemsByOrder[order.id] ?: emptyList()
                )
            }
        }
    }

    suspend fun placeOrder(
        storeId: String,
        storeName: String,
        customerId: String,
        customerName: String,
        customerPhone: String,
        wilaya: String,
        commune: String,
        address: String,
        deliveryMethod: String,
        paymentMethod: String,
        items: List<CartItemWithDetails>,
        notes: String
    ): Result<String> {
        if (items.isEmpty()) {
            return Result.failure(IllegalArgumentException("Le panier est vide."))
        }

        val subtotal = items.sumOf { it.itemTotal }
        val store = dao.getStoreById(storeId)
        val deliveryFee = if (deliveryMethod == "STORE_PICKUP") {
            0.0
        } else {
            val freeMin = store?.freeDeliveryMinimum ?: 5000.0
            if (subtotal >= freeMin) 0.0 else (store?.defaultDeliveryFee ?: 300.0)
        }
        val total = subtotal + deliveryFee
        val orderId = "ORD-" + (1000..9999).random().toString()

        val order = OrderEntity(
            id = orderId,
            storeId = storeId,
            storeName = storeName,
            customerId = customerId,
            customerName = customerName,
            customerPhone = customerPhone,
            wilaya = wilaya,
            commune = commune,
            address = address,
            deliveryMethod = deliveryMethod,
            paymentMethod = paymentMethod,
            subtotal = subtotal,
            deliveryFee = deliveryFee,
            total = total,
            status = "NEW",
            notes = notes
        )
        dao.insertOrder(order)

        val orderItems = items.map { cartItem ->
            OrderItemEntity(
                orderId = orderId,
                productId = cartItem.product.id,
                productName = cartItem.product.name,
                productImage = cartItem.primaryImage,
                quantity = cartItem.cartItem.quantity,
                unitPrice = if (cartItem.product.isPromotion && cartItem.product.promotionPrice != null) cartItem.product.promotionPrice else cartItem.product.price,
                total = cartItem.itemTotal
            )
        }
        dao.insertOrderItems(orderItems)

        // Remove these items from cart
        items.forEach { dao.deleteCartItem(it.product.id) }

        return Result.success(orderId)
    }

    suspend fun updateOrderStatus(orderId: String, status: String) {
        dao.updateOrderStatus(orderId, status)
    }
}
