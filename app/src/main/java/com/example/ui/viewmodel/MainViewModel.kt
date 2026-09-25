package com.example.ui.viewmodel

import android.app.Application
import android.graphics.Bitmap
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.ai.GeminiAiService
import com.example.data.local.AppDatabase
import com.example.data.model.AdStatus
import com.example.data.model.AiVisionAnalysisResult
import com.example.data.model.AppLanguage
import com.example.data.model.CartItemWithDetails
import com.example.data.model.CategoryEntity
import com.example.data.model.DeliveryZoneEntity
import com.example.data.model.OrderWithItems
import com.example.data.model.ProductEntity
import com.example.data.model.ProductWithDetails
import com.example.data.model.SortOption
import com.example.data.model.StockStatus
import com.example.data.model.StoreEntity
import com.example.data.model.UserRole
import com.example.data.repository.MagVitrineRepository
import com.example.util.DistanceUtil
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import java.util.UUID

sealed class Screen {
    object Home : Screen()
    data class Catalog(val categoryId: String? = null) : Screen()
    data class ProductDetail(val productId: String) : Screen()
    data class StoreVitrine(val storeId: String) : Screen()
    object CameraAiSearch : Screen()
    object MapView : Screen()
    object Cart : Screen()
    data class OrderTracking(val orderId: String? = null) : Screen()
    object StoreDashboard : Screen()
    object AdminPanel : Screen()
    object Messages : Screen()
    object Profile : Screen()
}

class MainViewModel(application: Application) : AndroidViewModel(application) {

    private val db = AppDatabase.getDatabase(application, viewModelScope)
    private val repository = MagVitrineRepository(db.dao())
    private val geminiAiService = GeminiAiService()

    // Navigation & App Settings
    private val _currentScreen = MutableStateFlow<Screen>(Screen.Home)
    val currentScreen: StateFlow<Screen> = _currentScreen.asStateFlow()

    private val _screenStack = mutableListOf<Screen>()

    private val _language = MutableStateFlow(AppLanguage.FR)
    val language: StateFlow<AppLanguage> = _language.asStateFlow()

    private val _userRole = MutableStateFlow(UserRole.CUSTOMER)
    val userRole: StateFlow<UserRole> = _userRole.asStateFlow()

    // Wilaya quick filter and Smart Category filter matching Mockup
    val wilayaFilter = MutableStateFlow("")
    val selectedSmartCategory = MutableStateFlow<String?>("cat_furniture")
    val favorites = MutableStateFlow<Set<String>>(setOf("prod_1", "prod_2"))

    fun toggleFavorite(productId: String) {
        val current = favorites.value
        favorites.value = if (current.contains(productId)) current - productId else current + productId
    }

    // Interactive Dialogs from Mockup
    val isTrustPortalOpen = MutableStateFlow(false)
    val isValueEstimatorOpen = MutableStateFlow(false)
    val isAdvancedFilterOpen = MutableStateFlow(false)
    val isPublishModalOpen = MutableStateFlow(false)
    val isNegotiationChatOpen = MutableStateFlow(false)

    // Admin authentication with authorized email
    companion object {
        const val AUTHORIZED_ADMIN_EMAIL = "mounirath@yahoo.fr"
        val AUTHORIZED_ADMIN_EMAILS = listOf(
            "mounirath@yahoo.fr",
            "mounirathdz@gmail.com",
            "admin@magvitrine.com",
            "admin@magvitrine.dz",
            "admin"
        )
    }

    private val _authenticatedAdminEmail = MutableStateFlow<String?>(null)
    val authenticatedAdminEmail: StateFlow<String?> = _authenticatedAdminEmail.asStateFlow()

    fun isEmailAuthorized(email: String?): Boolean {
        if (email.isNullOrBlank()) return false
        val trimmed = email.trim()
        return AUTHORIZED_ADMIN_EMAILS.any { it.equals(trimmed, ignoreCase = true) }
    }

    val isAdminAuthenticated: Boolean
        get() = _authenticatedAdminEmail.value != null && isEmailAuthorized(_authenticatedAdminEmail.value)

    private val _currentStoreId = MutableStateFlow("store_techzone")
    val currentStoreId: StateFlow<String> = _currentStoreId.asStateFlow()

    private val _snackbarMessage = MutableStateFlow<String?>(null)
    val snackbarMessage: StateFlow<String?> = _snackbarMessage.asStateFlow()

    // User Location (Default: Algiers Center)
    private val _userLat = MutableStateFlow(DistanceUtil.DEFAULT_USER_LAT)
    val userLat: StateFlow<Double> = _userLat.asStateFlow()

    private val _userLng = MutableStateFlow(DistanceUtil.DEFAULT_USER_LNG)
    val userLng: StateFlow<Double> = _userLng.asStateFlow()

    // Search and Filtering Filters
    val searchQuery = MutableStateFlow("")
    val selectedCategory = MutableStateFlow<CategoryEntity?>(null)
    val selectedSubcategory = MutableStateFlow<CategoryEntity?>(null)
    val filterOnlyPromotions = MutableStateFlow(false)
    val filterOnlyDelivery = MutableStateFlow(false)
    val filterNearMe = MutableStateFlow(false)
    val minPrice = MutableStateFlow<Double?>(null)
    val maxPrice = MutableStateFlow<Double?>(null)
    val sortOption = MutableStateFlow(SortOption.RELEVANCE)

    // Data Sources
    val categories = repository.getAllCategories()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val rootCategories = repository.getRootCategories()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val allStores = repository.getAllStores()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val activeStores = repository.getActiveStores()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val currentStore = _currentStoreId.combine(allStores) { id, stores ->
        stores.firstOrNull { it.id == id }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)

    val allProductsWithDetails = repository.getActiveProductsWithDetails()
        .combine(_userLat.combine(_userLng) { lat, lng -> Pair(lat, lng) }) { products, (lat, lng) ->
            products.map { p ->
                val dist = if (p.store != null) {
                    DistanceUtil.calculateDistanceMeters(lat, lng, p.store.latitude, p.store.longitude)
                } else null
                p.copy(distanceMeters = dist)
            }
        }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // Filtered Products for Catalog & Search
    val filteredProducts = combine(
        allProductsWithDetails,
        searchQuery,
        selectedCategory,
        selectedSubcategory,
        filterOnlyPromotions,
        filterOnlyDelivery,
        filterNearMe,
        minPrice,
        maxPrice,
        sortOption
    ) { args ->
        val list = args[0] as List<ProductWithDetails>
        val query = (args[1] as String).trim().lowercase()
        val cat = args[2] as CategoryEntity?
        val subcat = args[3] as CategoryEntity?
        val promoOnly = args[4] as Boolean
        val deliveryOnly = args[5] as Boolean
        val nearMe = args[6] as Boolean
        val minP = args[7] as Double?
        val maxP = args[8] as Double?
        val sort = args[9] as SortOption

        var result = list

        if (query.isNotEmpty()) {
            result = result.filter { item ->
                item.product.name.lowercase().contains(query) ||
                        item.product.brand.lowercase().contains(query) ||
                        item.product.model.lowercase().contains(query) ||
                        item.product.searchableText.lowercase().contains(query) ||
                        (item.store?.name?.lowercase()?.contains(query) == true) ||
                        (item.store?.wilaya?.lowercase()?.contains(query) == true) ||
                        (item.store?.commune?.lowercase()?.contains(query) == true) ||
                        (item.category?.nameFr?.lowercase()?.contains(query) == true) ||
                        (item.category?.nameAr?.lowercase()?.contains(query) == true) ||
                        (item.category?.nameEn?.lowercase()?.contains(query) == true)
            }
        }

        if (cat != null) {
            result = result.filter { it.product.categoryId == cat.id }
        }

        if (subcat != null) {
            result = result.filter { it.product.subcategoryId == subcat.id }
        }

        if (promoOnly) {
            result = result.filter { it.product.isPromotion }
        }

        if (deliveryOnly) {
            result = result.filter { it.product.deliveryAvailable }
        }

        if (nearMe) {
            // Within 15 km
            result = result.filter { (it.distanceMeters ?: Double.MAX_VALUE) <= 15000.0 }
        }

        if (minP != null) {
            result = result.filter { it.effectivePrice >= minP }
        }

        if (maxP != null) {
            result = result.filter { it.effectivePrice <= maxP }
        }

        when (sort) {
            SortOption.RELEVANCE -> result
            SortOption.PRICE_ASC -> result.sortedBy { it.effectivePrice }
            SortOption.PRICE_DESC -> result.sortedByDescending { it.effectivePrice }
            SortOption.DISTANCE_ASC -> result.sortedBy { it.distanceMeters ?: Double.MAX_VALUE }
            SortOption.DISTANCE_DESC -> result.sortedByDescending { it.distanceMeters ?: 0.0 }
            SortOption.PROMOTIONS -> result.sortedByDescending { if (it.product.isPromotion) it.product.discountPercent else -1 }
        }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // Cart and Orders
    val cartItems = repository.getCartWithDetails()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val cartCount = cartItems.combine(cartItems) { items, _ ->
        items.sumOf { it.cartItem.quantity }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0)

    val allOrders = repository.getAllOrdersWithItems()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val storeOrders = combine(_currentStoreId, allOrders) { storeId, orders ->
        orders.filter { it.order.storeId == storeId }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // Store Dashboard Products & Ads Count (Limit 50)
    val storeProducts = combine(_currentStoreId, repository.getAllProductsWithDetails()) { storeId, prods ->
        prods.filter { it.product.storeId == storeId }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val activeAdsCount = storeProducts.combine(storeProducts) { prods, _ ->
        prods.count { it.product.status == "ACTIVE" }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), 0)

    val storeDeliveryZones = _currentStoreId.combine(allStores) { storeId, _ ->
        storeId
    }.combine(repository.getDeliveryZonesForStore(_currentStoreId.value)) { _, zones ->
        zones
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // AI Camera Search State
    private val _isAnalyzingImage = MutableStateFlow(false)
    val isAnalyzingImage: StateFlow<Boolean> = _isAnalyzingImage.asStateFlow()

    private val _aiAnalysisResult = MutableStateFlow<AiVisionAnalysisResult?>(null)
    val aiAnalysisResult: StateFlow<AiVisionAnalysisResult?> = _aiAnalysisResult.asStateFlow()

    private val _aiMatchingProducts = MutableStateFlow<List<ProductWithDetails>>(emptyList())
    val aiMatchingProducts: StateFlow<List<ProductWithDetails>> = _aiMatchingProducts.asStateFlow()

    private val _selectedImageBitmap = MutableStateFlow<Bitmap?>(null)
    val selectedImageBitmap: StateFlow<Bitmap?> = _selectedImageBitmap.asStateFlow()

    // Navigation Methods
    fun navigateTo(screen: Screen) {
        if (_currentScreen.value != screen) {
            _screenStack.add(_currentScreen.value)
            _currentScreen.value = screen
        }
    }

    fun navigateBack(): Boolean {
        if (_screenStack.isNotEmpty()) {
            _currentScreen.value = _screenStack.removeAt(_screenStack.size - 1)
            return true
        }
        if (_currentScreen.value !is Screen.Home) {
            _currentScreen.value = Screen.Home
            return true
        }
        return false
    }

    fun setLanguage(lang: AppLanguage) {
        _language.value = lang
    }

    fun loginAsMerchant() {
        setUserRole(UserRole.STORE)
    }

    fun loginAsCustomer() {
        setUserRole(UserRole.CUSTOMER)
    }

    fun loginAsAdmin() {
        if (isAdminAuthenticated) {
            setUserRole(UserRole.ADMIN)
        } else {
            navigateTo(Screen.AdminPanel)
        }
    }

    /**
     * Tente de connecter l'administrateur avec un des emails autorisés.
     * Accepte mounirath@yahoo.fr, mounirathdz@gmail.com, etc.
     */
    fun verifyAndLoginAdmin(emailInput: String): Boolean {
        val trimmed = emailInput.trim()
        return if (isEmailAuthorized(trimmed)) {
            val emailToSave = if (trimmed.equals("admin", ignoreCase = true)) AUTHORIZED_ADMIN_EMAIL else trimmed
            _authenticatedAdminEmail.value = emailToSave
            _userRole.value = UserRole.ADMIN
            navigateTo(Screen.AdminPanel)
            showSnackbar("Accès Administrateur validé : $emailToSave")
            true
        } else {
            showSnackbar("Accès refusé : email non autorisé pour l'administration")
            false
        }
    }

    /**
     * Déverrouillage rapide de l'espace administrateur
     */
    fun quickAdminLogin(email: String = AUTHORIZED_ADMIN_EMAIL) {
        _authenticatedAdminEmail.value = email
        _userRole.value = UserRole.ADMIN
        navigateTo(Screen.AdminPanel)
        showSnackbar("Accès Administrateur déverrouillé : $email")
    }

    fun logoutAdmin() {
        _authenticatedAdminEmail.value = null
        _userRole.value = UserRole.CUSTOMER
        navigateTo(Screen.Home)
        showSnackbar("Déconnexion de l'espace administrateur effectuée")
    }

    fun setUserRole(role: UserRole) {
        _userRole.value = role
        when (role) {
            UserRole.CUSTOMER -> navigateTo(Screen.Home)
            UserRole.STORE -> navigateTo(Screen.StoreDashboard)
            UserRole.ADMIN -> {
                // Navigate to AdminPanel (shows lock screen if not authenticated yet)
                navigateTo(Screen.AdminPanel)
            }
        }
    }

    fun setCurrentStoreId(storeId: String) {
        _currentStoreId.value = storeId
    }

    fun showSnackbar(msg: String) {
        _snackbarMessage.value = msg
    }

    fun clearSnackbar() {
        _snackbarMessage.value = null
    }

    // AI Camera Vision Search
    fun analyzeImageWithAi(bitmap: Bitmap) {
        _selectedImageBitmap.value = bitmap
        _isAnalyzingImage.value = true
        _aiAnalysisResult.value = null
        _aiMatchingProducts.value = emptyList()

        viewModelScope.launch {
            val result = geminiAiService.analyzeProductImage(bitmap)
            _aiAnalysisResult.value = result

            // Find matching products in catalog based on category, brand, or keywords
            val allProds = allProductsWithDetails.value
            val matches = allProds.filter { p ->
                val nameMatch = result.productType.isNotEmpty() && p.product.name.contains(result.productType, ignoreCase = true)
                val brandMatch = result.brand.isNotEmpty() && p.product.brand.contains(result.brand, ignoreCase = true)
                val catMatch = result.detectedCategory.isNotEmpty() && (
                        p.category?.nameFr?.contains(result.detectedCategory, ignoreCase = true) == true ||
                                p.category?.nameAr?.contains(result.detectedCategory, ignoreCase = true) == true
                        )
                val ocrMatch = result.ocrText.isNotEmpty() && (
                        p.product.name.contains(result.ocrText, ignoreCase = true) ||
                                p.product.searchableText.contains(result.ocrText, ignoreCase = true)
                        )
                nameMatch || brandMatch || catMatch || ocrMatch
            }

            _aiMatchingProducts.value = if (matches.isNotEmpty()) matches else allProds.take(4)
            _isAnalyzingImage.value = false
        }
    }

    fun clearAiSearch() {
        _selectedImageBitmap.value = null
        _aiAnalysisResult.value = null
        _aiMatchingProducts.value = emptyList()
    }

    // Cart Operations
    fun addToCart(productId: String, storeId: String, quantity: Int = 1) {
        viewModelScope.launch {
            repository.addToCart(productId, storeId, quantity)
            showSnackbar("Produit ajouté au panier !")
        }
    }

    fun updateCartQuantity(productId: String, quantity: Int) {
        viewModelScope.launch {
            repository.updateCartQuantity(productId, quantity)
        }
    }

    fun removeFromCart(productId: String) {
        viewModelScope.launch {
            repository.removeFromCart(productId)
        }
    }

    fun placeOrder(
        storeId: String,
        storeName: String,
        customerName: String,
        customerPhone: String,
        wilaya: String,
        commune: String,
        address: String,
        deliveryMethod: String,
        paymentMethod: String,
        notes: String
    ) {
        viewModelScope.launch {
            val itemsForStore = cartItems.value.filter { it.store.id == storeId }
            if (itemsForStore.isEmpty()) {
                showSnackbar("Aucun produit pour ce magasin dans le panier.")
                return@launch
            }

            val result = repository.placeOrder(
                storeId = storeId,
                storeName = storeName,
                customerId = "user_customer_1",
                customerName = customerName,
                customerPhone = customerPhone,
                wilaya = wilaya,
                commune = commune,
                address = address,
                deliveryMethod = deliveryMethod,
                paymentMethod = paymentMethod,
                items = itemsForStore,
                notes = notes
            )

            result.onSuccess { orderId ->
                showSnackbar("Commande $orderId validée avec succès !")
                navigateTo(Screen.OrderTracking(orderId))
            }.onFailure { err ->
                showSnackbar("Erreur: ${err.message}")
            }
        }
    }

    fun updateOrderStatus(orderId: String, newStatus: String) {
        viewModelScope.launch {
            repository.updateOrderStatus(orderId, newStatus)
            showSnackbar("Statut de la commande mis à jour : $newStatus")
        }
    }

    // Store Product Management (Enforcing max 50 ads, max 3 photos)
    fun addProduct(
        name: String,
        categoryId: String,
        subcategoryId: String?,
        description: String,
        brand: String,
        model: String,
        reference: String,
        price: Double,
        oldPrice: Double?,
        promotionPrice: Double?,
        discountPercent: Int,
        isPromotion: Boolean,
        stockStatus: String,
        deliveryAvailable: Boolean,
        photos: List<String> // Max 3 photos
    ) {
        viewModelScope.launch {
            if (photos.isEmpty()) {
                showSnackbar("Impossible de publier : la photo principale est obligatoire.")
                return@launch
            }

            val storeId = _currentStoreId.value
            val count = repository.getActiveProductCountForStore(storeId)
            if (count >= 50) {
                showSnackbar("Vous avez atteint la limite de 50 annonces actives. Désactivez ou supprimez une annonce pour en publier une nouvelle.")
                return@launch
            }

            val newProd = ProductEntity(
                id = "prod_" + UUID.randomUUID().toString().take(8),
                storeId = storeId,
                categoryId = categoryId,
                subcategoryId = subcategoryId,
                name = name,
                description = description,
                brand = brand,
                model = model,
                reference = reference,
                price = price,
                oldPrice = oldPrice,
                promotionPrice = promotionPrice,
                discountPercent = discountPercent,
                isPromotion = isPromotion,
                stockStatus = stockStatus,
                deliveryAvailable = deliveryAvailable,
                searchableText = "$name $brand $model $reference $description".lowercase(),
                keywords = "$name, $brand, $model",
                status = "ACTIVE"
            )

            val result = repository.createProduct(newProd, photos.take(3))
            result.onSuccess {
                showSnackbar("Produit publié avec succès !")
            }.onFailure { e ->
                showSnackbar(e.message ?: "Erreur lors de la publication")
            }
        }
    }

    fun updateProduct(product: ProductEntity, photos: List<String>? = null) {
        viewModelScope.launch {
            val result = repository.updateProduct(product, photos?.take(3))
            result.onSuccess {
                showSnackbar("Produit mis à jour avec succès.")
            }
        }
    }

    fun toggleProductStatus(product: ProductEntity) {
        viewModelScope.launch {
            val newStatus = if (product.status == "ACTIVE") "INACTIVE" else "ACTIVE"
            if (newStatus == "ACTIVE") {
                val count = repository.getActiveProductCountForStore(product.storeId)
                if (count >= 50) {
                    showSnackbar("Vous avez atteint la limite de 50 annonces actives. Désactivez ou supprimez une annonce.")
                    return@launch
                }
            }
            repository.updateProductStatus(product.id, newStatus)
            showSnackbar("Annonce passée à : $newStatus")
        }
    }

    fun deleteProduct(productId: String) {
        viewModelScope.launch {
            repository.deleteProduct(productId)
            showSnackbar("Produit supprimé.")
        }
    }

    fun duplicateProduct(productId: String) {
        viewModelScope.launch {
            val res = repository.duplicateProduct(productId, _currentStoreId.value)
            res.onSuccess {
                showSnackbar("Produit dupliqué avec succès.")
            }.onFailure {
                showSnackbar(it.message ?: "Erreur de duplication")
            }
        }
    }

    fun recordContact(storeId: String, type: String) {
        viewModelScope.launch {
            repository.recordStoreContact(storeId, type)
        }
    }

    // Admin Controls
    fun toggleStoreStatus(storeId: String, currentStatus: String) {
        viewModelScope.launch {
            val newStatus = if (currentStatus == "active") "suspended" else "active"
            repository.updateStoreStatus(storeId, newStatus)
            showSnackbar("Magasin mis à jour : $newStatus")
        }
    }

    fun deleteStore(storeId: String) {
        viewModelScope.launch {
            repository.deleteStore(storeId)
            showSnackbar("Magasin supprimé.")
        }
    }

    fun addCategory(
        nameFr: String,
        nameAr: String,
        nameEn: String,
        icon: String,
        parentId: String?
    ) {
        viewModelScope.launch {
            val newCat = CategoryEntity(
                id = "cat_" + UUID.randomUUID().toString().take(6),
                nameFr = nameFr,
                nameAr = nameAr,
                nameEn = nameEn,
                iconName = icon,
                parentId = parentId,
                active = true,
                sortOrder = (categories.value.maxOfOrNull { it.sortOrder } ?: 0) + 1
            )
            repository.insertCategory(newCat)
            showSnackbar("Catégorie créée.")
        }
    }

    fun deleteCategory(id: String) {
        viewModelScope.launch {
            repository.deleteCategory(id)
            showSnackbar("Catégorie supprimée.")
        }
    }
}
