package com.example.data.local

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Transaction
import androidx.room.Update
import com.example.data.model.CartItemEntity
import com.example.data.model.CategoryEntity
import com.example.data.model.DeliveryZoneEntity
import com.example.data.model.OrderEntity
import com.example.data.model.OrderItemEntity
import com.example.data.model.ProductEntity
import com.example.data.model.ProductImageEntity
import com.example.data.model.StoreEntity
import com.example.data.model.UserEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface MagVitrineDao {

    // --- Users ---
    @Query("SELECT * FROM users WHERE email = :email LIMIT 1")
    suspend fun getUserByEmail(email: String): UserEntity?

    @Query("SELECT * FROM users WHERE id = :id LIMIT 1")
    suspend fun getUserById(id: String): UserEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertUser(user: UserEntity)

    // --- Stores ---
    @Query("SELECT * FROM stores ORDER BY createdAt DESC")
    fun getAllStoresFlow(): Flow<List<StoreEntity>>

    @Query("SELECT * FROM stores WHERE status = 'active' ORDER BY createdAt DESC")
    fun getActiveStoresFlow(): Flow<List<StoreEntity>>

    @Query("SELECT * FROM stores WHERE id = :id LIMIT 1")
    suspend fun getStoreById(id: String): StoreEntity?

    @Query("SELECT * FROM stores WHERE id = :id LIMIT 1")
    fun getStoreByIdFlow(id: String): Flow<StoreEntity?>

    @Query("SELECT * FROM stores WHERE slug = :slug LIMIT 1")
    suspend fun getStoreBySlug(slug: String): StoreEntity?

    @Query("SELECT * FROM stores WHERE userId = :userId LIMIT 1")
    suspend fun getStoreByUserId(userId: String): StoreEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertStore(store: StoreEntity)

    @Update
    suspend fun updateStore(store: StoreEntity)

    @Query("DELETE FROM stores WHERE id = :storeId")
    suspend fun deleteStoreById(storeId: String)

    @Query("UPDATE stores SET status = :status WHERE id = :storeId")
    suspend fun updateStoreStatus(storeId: String, status: String)

    @Query("UPDATE stores SET viewsCount = viewsCount + 1 WHERE id = :storeId")
    suspend fun incrementStoreViews(storeId: String)

    @Query("UPDATE stores SET whatsappClicks = whatsappClicks + 1 WHERE id = :storeId")
    suspend fun incrementStoreWhatsApp(storeId: String)

    @Query("UPDATE stores SET phoneCalls = phoneCalls + 1 WHERE id = :storeId")
    suspend fun incrementStorePhoneCalls(storeId: String)

    // --- Categories ---
    @Query("SELECT * FROM categories ORDER BY sortOrder ASC")
    fun getAllCategoriesFlow(): Flow<List<CategoryEntity>>

    @Query("SELECT * FROM categories WHERE parentId IS NULL AND active = 1 ORDER BY sortOrder ASC")
    fun getRootCategoriesFlow(): Flow<List<CategoryEntity>>

    @Query("SELECT * FROM categories WHERE parentId = :parentId AND active = 1 ORDER BY sortOrder ASC")
    fun getSubcategoriesFlow(parentId: String): Flow<List<CategoryEntity>>

    @Query("SELECT * FROM categories WHERE id = :id LIMIT 1")
    suspend fun getCategoryById(id: String): CategoryEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertCategory(category: CategoryEntity)

    @Update
    suspend fun updateCategory(category: CategoryEntity)

    @Query("DELETE FROM categories WHERE id = :id")
    suspend fun deleteCategory(id: String)

    // --- Products ---
    @Query("SELECT * FROM products WHERE status != 'DELETED' ORDER BY createdAt DESC")
    fun getAllProductsFlow(): Flow<List<ProductEntity>>

    @Query("SELECT * FROM products WHERE status = 'ACTIVE' ORDER BY createdAt DESC")
    fun getActiveProductsFlow(): Flow<List<ProductEntity>>

    @Query("SELECT * FROM products WHERE storeId = :storeId AND status != 'DELETED' ORDER BY createdAt DESC")
    fun getProductsByStoreFlow(storeId: String): Flow<List<ProductEntity>>

    @Query("SELECT COUNT(*) FROM products WHERE storeId = :storeId AND status = 'ACTIVE'")
    suspend fun getActiveProductCountForStore(storeId: String): Int

    @Query("SELECT * FROM products WHERE id = :id LIMIT 1")
    suspend fun getProductById(id: String): ProductEntity?

    @Query("SELECT * FROM products WHERE id = :id LIMIT 1")
    fun getProductByIdFlow(id: String): Flow<ProductEntity?>

    @Query("SELECT * FROM products WHERE isPromotion = 1 AND status = 'ACTIVE' ORDER BY createdAt DESC")
    fun getPromotionalProductsFlow(): Flow<List<ProductEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertProduct(product: ProductEntity)

    @Update
    suspend fun updateProduct(product: ProductEntity)

    @Query("UPDATE products SET status = :status WHERE id = :productId")
    suspend fun updateProductStatus(productId: String, status: String)

    @Query("DELETE FROM products WHERE id = :productId")
    suspend fun deleteProduct(productId: String)

    // --- Product Images ---
    @Query("SELECT * FROM product_images WHERE productId = :productId ORDER BY position ASC")
    fun getImagesForProductFlow(productId: String): Flow<List<ProductImageEntity>>

    @Query("SELECT * FROM product_images WHERE productId = :productId ORDER BY position ASC")
    suspend fun getImagesForProduct(productId: String): List<ProductImageEntity>

    @Query("SELECT * FROM product_images")
    fun getAllImagesFlow(): Flow<List<ProductImageEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertProductImage(image: ProductImageEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertProductImages(images: List<ProductImageEntity>)

    @Query("DELETE FROM product_images WHERE productId = :productId")
    suspend fun deleteImagesForProduct(productId: String)

    @Query("DELETE FROM product_images WHERE id = :imageId")
    suspend fun deleteImageById(imageId: Long)

    // --- Orders ---
    @Query("SELECT * FROM orders ORDER BY createdAt DESC")
    fun getAllOrdersFlow(): Flow<List<OrderEntity>>

    @Query("SELECT * FROM orders WHERE storeId = :storeId ORDER BY createdAt DESC")
    fun getOrdersByStoreFlow(storeId: String): Flow<List<OrderEntity>>

    @Query("SELECT * FROM orders WHERE customerId = :customerId ORDER BY createdAt DESC")
    fun getOrdersByCustomerFlow(customerId: String): Flow<List<OrderEntity>>

    @Query("SELECT * FROM orders WHERE id = :id LIMIT 1")
    suspend fun getOrderById(id: String): OrderEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrder(order: OrderEntity)

    @Query("UPDATE orders SET status = :status WHERE id = :orderId")
    suspend fun updateOrderStatus(orderId: String, status: String)

    // --- Order Items ---
    @Query("SELECT * FROM order_items WHERE orderId = :orderId")
    fun getOrderItemsFlow(orderId: String): Flow<List<OrderItemEntity>>

    @Query("SELECT * FROM order_items WHERE orderId = :orderId")
    suspend fun getOrderItems(orderId: String): List<OrderItemEntity>

    @Query("SELECT * FROM order_items")
    fun getAllOrderItemsFlow(): Flow<List<OrderItemEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrderItem(item: OrderItemEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrderItems(items: List<OrderItemEntity>)

    // --- Delivery Zones ---
    @Query("SELECT * FROM delivery_zones WHERE storeId = :storeId AND active = 1")
    fun getDeliveryZonesForStoreFlow(storeId: String): Flow<List<DeliveryZoneEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertDeliveryZone(zone: DeliveryZoneEntity)

    @Query("DELETE FROM delivery_zones WHERE id = :id")
    suspend fun deleteDeliveryZone(id: Long)

    // --- Cart Items ---
    @Query("SELECT * FROM cart_items ORDER BY addedAt DESC")
    fun getCartItemsFlow(): Flow<List<CartItemEntity>>

    @Query("SELECT * FROM cart_items WHERE productId = :productId LIMIT 1")
    suspend fun getCartItemByProductId(productId: String): CartItemEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertCartItem(cartItem: CartItemEntity)

    @Query("UPDATE cart_items SET quantity = :quantity WHERE productId = :productId")
    suspend fun updateCartQuantity(productId: String, quantity: Int)

    @Query("DELETE FROM cart_items WHERE productId = :productId")
    suspend fun deleteCartItem(productId: String)

    @Query("DELETE FROM cart_items")
    suspend fun clearCart()
}
