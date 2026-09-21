package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.Chat
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.ContentCopy
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.LocalFireDepartment
import androidx.compose.material.icons.filled.LocalShipping
import androidx.compose.material.icons.filled.RemoveRedEye
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material.icons.filled.Store
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Checkbox
import androidx.compose.material3.Divider
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.ScrollableTabRow
import androidx.compose.material3.Surface
import androidx.compose.material3.Tab
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableDoubleStateOf
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.data.model.AppLanguage
import com.example.data.model.CategoryEntity
import com.example.data.model.ProductEntity
import com.example.data.model.ProductWithDetails
import com.example.data.model.StoreEntity
import com.example.ui.theme.AmberSecondary
import com.example.ui.theme.EmeraldPrimary
import com.example.ui.theme.PromoRed
import com.example.ui.viewmodel.MainViewModel
import com.example.ui.viewmodel.Screen
import com.example.util.LanguageManager
import java.text.NumberFormat
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun StoreDashboardScreen(
    viewModel: MainViewModel,
    modifier: Modifier = Modifier
) {
    val language by viewModel.language.collectAsState()
    val storeProducts by viewModel.storeProducts.collectAsState()
    val activeCount by viewModel.activeAdsCount.collectAsState()
    val storeOrders by viewModel.storeOrders.collectAsState()
    val currentStore by viewModel.currentStore.collectAsState()
    val categories by viewModel.categories.collectAsState()
    val rootCategories by viewModel.rootCategories.collectAsState()

    var selectedSubTab by remember { mutableIntStateOf(0) }
    val formatter = remember { NumberFormat.getNumberInstance(Locale.FRANCE) }

    // Dialog state for adding or editing product
    var showAddProductDialog by remember { mutableStateOf(false) }
    var editingProduct by remember { mutableStateOf<ProductWithDetails?>(null) }

    val isLimit50Reached = activeCount >= 50

    val subTabs = listOf(
        "Tableau de bord",
        "Mes produits (${storeProducts.size})",
        "Commandes (${storeOrders.size})",
        "Livraison",
        "Aperçu Vitrine"
    )

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        contentPadding = PaddingValues(bottom = 90.dp)
    ) {
        // Top Store Header with 50 Ads Gauge
        item {
            Surface(
                color = MaterialTheme.colorScheme.surface,
                tonalElevation = 2.dp,
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = "Espace Magasin",
                                fontSize = 12.sp,
                                color = EmeraldPrimary,
                                fontWeight = FontWeight.Bold
                            )
                            Text(
                                text = currentStore?.name ?: "Mon Magasin",
                                fontSize = 18.sp,
                                fontWeight = FontWeight.Black,
                                color = MaterialTheme.colorScheme.onSurface
                            )
                        }

                        Button(
                            onClick = { showAddProductDialog = true },
                            enabled = !isLimit50Reached,
                            colors = ButtonDefaults.buttonColors(containerColor = EmeraldPrimary),
                            shape = RoundedCornerShape(10.dp),
                            modifier = Modifier.testTag("btn_add_product_main")
                        ) {
                            Icon(imageVector = Icons.Default.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("Ajouter produit", fontSize = 12.sp)
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    // 50 ACTIVE ADS LIMIT COUNTER & GAUGE
                    Card(
                        shape = RoundedCornerShape(12.dp),
                        colors = CardDefaults.cardColors(
                            containerColor = if (isLimit50Reached) PromoRed.copy(alpha = 0.1f) else MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.5f)
                        ),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(
                                        imageVector = if (isLimit50Reached) Icons.Default.Warning else Icons.Default.Store,
                                        contentDescription = null,
                                        tint = if (isLimit50Reached) PromoRed else EmeraldPrimary,
                                        modifier = Modifier.size(16.dp)
                                    )
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text(
                                        text = "Limite d'annonces actives :",
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.SemiBold
                                    )
                                }

                                Text(
                                    text = "$activeCount / 50",
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Black,
                                    color = if (isLimit50Reached) PromoRed else EmeraldPrimary
                                )
                            }

                            Spacer(modifier = Modifier.height(6.dp))

                            LinearProgressIndicator(
                                progress = (activeCount / 50f).coerceIn(0f, 1f),
                                color = if (isLimit50Reached) PromoRed else EmeraldPrimary,
                                trackColor = MaterialTheme.colorScheme.surfaceVariant,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(6.dp)
                                    .clip(RoundedCornerShape(3.dp))
                            )

                            if (isLimit50Reached) {
                                Spacer(modifier = Modifier.height(6.dp))
                                Text(
                                    text = LanguageManager.get("limit_50_reached", language),
                                    fontSize = 11.sp,
                                    color = PromoRed,
                                    lineHeight = 15.sp,
                                    fontWeight = FontWeight.Medium
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    // Sub Tabs Navigation
                    ScrollableTabRow(
                        selectedTabIndex = selectedSubTab,
                        edgePadding = 0.dp,
                        containerColor = Color.Transparent,
                        divider = {}
                    ) {
                        subTabs.forEachIndexed { index, title ->
                            Tab(
                                selected = selectedSubTab == index,
                                onClick = { selectedSubTab = index },
                                text = {
                                    Text(
                                        text = title,
                                        fontSize = 12.sp,
                                        fontWeight = if (selectedSubTab == index) FontWeight.Bold else FontWeight.Normal
                                    )
                                }
                            )
                        }
                    }
                }
            }
        }

        // Sub Tab Content
        when (selectedSubTab) {
            0 -> {
                // Dashboard Overview Stats
                item {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = "Statistiques de performance",
                            fontWeight = FontWeight.Bold,
                            fontSize = 15.sp
                        )
                        Spacer(modifier = Modifier.height(12.dp))

                        // Stats Grid 2x3
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            StatCard(
                                title = "Annonces actives",
                                value = "$activeCount / 50",
                                icon = Icons.Default.Store,
                                color = EmeraldPrimary,
                                modifier = Modifier.weight(1f)
                            )
                            StatCard(
                                title = "Promotions",
                                value = "${storeProducts.count { it.product.isPromotion }}",
                                icon = Icons.Default.LocalFireDepartment,
                                color = PromoRed,
                                modifier = Modifier.weight(1f)
                            )
                        }

                        Spacer(modifier = Modifier.height(10.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            StatCard(
                                title = "Commandes",
                                value = "${storeOrders.size}",
                                icon = Icons.Default.ShoppingCart,
                                color = AmberSecondary,
                                modifier = Modifier.weight(1f)
                            )
                            StatCard(
                                title = "Vues vitrine",
                                value = "${currentStore?.viewsCount ?: 380}",
                                icon = Icons.Default.RemoveRedEye,
                                color = Color(0xFF3B82F6),
                                modifier = Modifier.weight(1f)
                            )
                        }

                        Spacer(modifier = Modifier.height(10.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            StatCard(
                                title = "Contacts WhatsApp",
                                value = "${currentStore?.whatsappClicks ?: 45}",
                                icon = Icons.Default.Chat,
                                color = Color(0xFF25D366),
                                modifier = Modifier.weight(1f)
                            )
                            StatCard(
                                title = "Appels reçus",
                                value = "${currentStore?.phoneCalls ?: 22}",
                                icon = Icons.Default.Call,
                                color = Color(0xFF8B5CF6),
                                modifier = Modifier.weight(1f)
                            )
                        }
                    }
                }
            }

            1 -> {
                // Products Table / List with Actions
                item {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "Mes annonces publiées",
                                fontWeight = FontWeight.Bold,
                                fontSize = 15.sp
                            )
                        }
                        Spacer(modifier = Modifier.height(10.dp))

                        storeProducts.forEach { item ->
                            StoreProductManageCard(
                                item = item,
                                formatter = formatter,
                                onEdit = {
                                    editingProduct = item
                                    showAddProductDialog = true
                                },
                                onToggleStatus = { viewModel.toggleProductStatus(item.product) },
                                onDelete = { viewModel.deleteProduct(item.product.id) },
                                onDuplicate = { viewModel.duplicateProduct(item.product.id) }
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                        }
                    }
                }
            }

            2 -> {
                // Orders Management
                item {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = "Commandes des clients",
                            fontWeight = FontWeight.Bold,
                            fontSize = 15.sp
                        )
                        Spacer(modifier = Modifier.height(10.dp))

                        if (storeOrders.isEmpty()) {
                            Text("Aucune commande reçue pour le moment.", fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        } else {
                            storeOrders.forEach { ordWithItems ->
                                val ord = ordWithItems.order
                                Card(
                                    shape = RoundedCornerShape(12.dp),
                                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(vertical = 4.dp)
                                ) {
                                    Column(modifier = Modifier.padding(12.dp)) {
                                        Row(
                                            modifier = Modifier.fillMaxWidth(),
                                            horizontalArrangement = Arrangement.SpaceBetween
                                        ) {
                                            Text("Commande N° ${ord.id}", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                                            Surface(
                                                color = EmeraldPrimary.copy(alpha = 0.15f),
                                                shape = RoundedCornerShape(4.dp)
                                            ) {
                                                Text(
                                                    text = ord.status,
                                                    fontSize = 11.sp,
                                                    fontWeight = FontWeight.Bold,
                                                    color = EmeraldPrimary,
                                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                                )
                                            }
                                        }
                                        Text("Client : ${ord.customerName} (${ord.customerPhone})", fontSize = 12.sp)
                                        Text("Total : ${formatter.format(ord.total)} DA", fontSize = 12.sp, fontWeight = FontWeight.SemiBold)

                                        Spacer(modifier = Modifier.height(8.dp))

                                        // Status changer buttons
                                        Row(
                                            horizontalArrangement = Arrangement.spacedBy(6.dp),
                                            modifier = Modifier.fillMaxWidth()
                                        ) {
                                            OutlinedButton(
                                                onClick = { viewModel.updateOrderStatus(ord.id, "CONFIRMED") },
                                                shape = RoundedCornerShape(8.dp),
                                                modifier = Modifier.weight(1f)
                                            ) {
                                                Text("Confirmer", fontSize = 10.sp)
                                            }
                                            OutlinedButton(
                                                onClick = { viewModel.updateOrderStatus(ord.id, "PREPARING") },
                                                shape = RoundedCornerShape(8.dp),
                                                modifier = Modifier.weight(1f)
                                            ) {
                                                Text("Préparer", fontSize = 10.sp)
                                            }
                                            OutlinedButton(
                                                onClick = { viewModel.updateOrderStatus(ord.id, "SHIPPING") },
                                                shape = RoundedCornerShape(8.dp),
                                                modifier = Modifier.weight(1f)
                                            ) {
                                                Text("Livrer", fontSize = 10.sp)
                                            }
                                            Button(
                                                onClick = { viewModel.updateOrderStatus(ord.id, "DELIVERED") },
                                                colors = ButtonDefaults.buttonColors(containerColor = EmeraldPrimary),
                                                shape = RoundedCornerShape(8.dp),
                                                modifier = Modifier.weight(1f)
                                            ) {
                                                Text("Livrée", fontSize = 10.sp)
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            3 -> {
                // Delivery Settings
                item {
                    val st = currentStore
                    Card(
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp)
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text(
                                text = "Paramètres de livraison du magasin",
                                fontWeight = FontWeight.Bold,
                                fontSize = 15.sp
                            )
                            Spacer(modifier = Modifier.height(12.dp))

                            Text("Frais de livraison standard : ${st?.defaultDeliveryFee?.toInt() ?: 400} DA", fontSize = 13.sp)
                            Text("Seuil de gratuité : Dès ${st?.freeDeliveryMinimum?.toInt() ?: 5000} DA", fontSize = 13.sp, fontWeight = FontWeight.SemiBold, color = EmeraldPrimary)
                            Text("Délai de livraison estimé : ${st?.estimatedDeliveryTime ?: "24h - 48h"}", fontSize = 13.sp)
                            Text("Zones couvertes : Alger, Blida, Tipaza, Boumerdès, Oran, Constantine", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)

                            Spacer(modifier = Modifier.height(14.dp))
                            Button(
                                onClick = { viewModel.showSnackbar("Paramètres de livraison enregistrés avec succès.") },
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Text("Enregistrer les tarifs")
                            }
                        }
                    }
                }
            }

            4 -> {
                // Preview Vitrine
                item {
                    Box(modifier = Modifier.padding(16.dp)) {
                        Button(
                            onClick = {
                                if (currentStore != null) {
                                    viewModel.navigateTo(Screen.StoreVitrine(currentStore!!.id))
                                }
                            },
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text("Ouvrir ma vitrine publique en ligne")
                        }
                    }
                }
            }
        }
    }

    // Add / Edit Product Dialog with Validation & Max 3 Photos
    if (showAddProductDialog) {
        AddEditProductDialog(
            categories = categories,
            rootCategories = rootCategories,
            productWithDetails = editingProduct,
            onDismiss = {
                showAddProductDialog = false
                editingProduct = null
            },
            onSave = { name, catId, subcatId, desc, brand, model, ref, price, oldPrice, promoPrice, disc, isPromo, stock, delivery, photos ->
                if (editingProduct != null) {
                    val updated = editingProduct!!.product.copy(
                        name = name,
                        categoryId = catId,
                        subcategoryId = subcatId,
                        description = desc,
                        brand = brand,
                        model = model,
                        reference = ref,
                        price = price,
                        oldPrice = oldPrice,
                        promotionPrice = promoPrice,
                        discountPercent = disc,
                        isPromotion = isPromo,
                        stockStatus = stock,
                        deliveryAvailable = delivery
                    )
                    viewModel.updateProduct(updated, photos)
                } else {
                    viewModel.addProduct(
                        name = name,
                        categoryId = catId,
                        subcategoryId = subcatId,
                        description = desc,
                        brand = brand,
                        model = model,
                        reference = ref,
                        price = price,
                        oldPrice = oldPrice,
                        promotionPrice = promoPrice,
                        discountPercent = disc,
                        isPromotion = isPromo,
                        stockStatus = stock,
                        deliveryAvailable = delivery,
                        photos = photos
                    )
                }
                showAddProductDialog = false
                editingProduct = null
            }
        )
    }
}

@Composable
fun StatCard(
    title: String,
    value: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    color: Color,
    modifier: Modifier = Modifier
) {
    Card(
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        modifier = modifier
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Box(
                modifier = Modifier
                    .size(34.dp)
                    .clip(RoundedCornerShape(8.dp))
                    .background(color.copy(alpha = 0.15f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(imageVector = icon, contentDescription = null, tint = color, modifier = Modifier.size(20.dp))
            }
            Spacer(modifier = Modifier.height(10.dp))
            Text(text = value, fontSize = 18.sp, fontWeight = FontWeight.Black, color = MaterialTheme.colorScheme.onSurface)
            Text(text = title, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}

@Composable
fun StoreProductManageCard(
    item: ProductWithDetails,
    formatter: NumberFormat,
    onEdit: () -> Unit,
    onToggleStatus: () -> Unit,
    onDelete: () -> Unit,
    onDuplicate: () -> Unit
) {
    Card(
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier.padding(10.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(56.dp)
                    .clip(RoundedCornerShape(8.dp))
                    .background(MaterialTheme.colorScheme.surfaceVariant)
            ) {
                if (item.primaryImageUrl.isNotBlank()) {
                    AsyncImage(
                        model = item.primaryImageUrl,
                        contentDescription = item.product.name,
                        contentScale = ContentScale.Crop,
                        modifier = Modifier.matchParentSize()
                    )
                }
            }

            Spacer(modifier = Modifier.width(10.dp))

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = item.product.name,
                    fontWeight = FontWeight.Bold,
                    fontSize = 13.sp,
                    maxLines = 1
                )
                Text(
                    text = "${formatter.format(item.effectivePrice)} DA • ${if (item.product.isPromotion) "-${item.product.discountPercent}%" else "Normal"}",
                    fontSize = 11.sp,
                    color = if (item.product.isPromotion) PromoRed else MaterialTheme.colorScheme.onSurfaceVariant
                )
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Surface(
                        color = if (item.product.status == "ACTIVE") EmeraldPrimary.copy(alpha = 0.15f) else MaterialTheme.colorScheme.outline.copy(alpha = 0.2f),
                        shape = RoundedCornerShape(4.dp)
                    ) {
                        Text(
                            text = if (item.product.status == "ACTIVE") "Actif" else "Désactivé",
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (item.product.status == "ACTIVE") EmeraldPrimary else MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.padding(horizontal = 4.dp, vertical = 1.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(text = "Photos: ${item.images.size}/3", fontSize = 10.sp, color = MaterialTheme.colorScheme.outline)
                }
            }

            // Actions Row
            Row(horizontalArrangement = Arrangement.spacedBy(2.dp)) {
                IconButton(onClick = onEdit, modifier = Modifier.size(32.dp)) {
                    Icon(imageVector = Icons.Default.Edit, contentDescription = "Modifier", tint = MaterialTheme.colorScheme.primary, modifier = Modifier.size(16.dp))
                }
                IconButton(onClick = onDuplicate, modifier = Modifier.size(32.dp)) {
                    Icon(imageVector = Icons.Default.ContentCopy, contentDescription = "Dupliquer", tint = AmberSecondary, modifier = Modifier.size(16.dp))
                }
                IconButton(onClick = onToggleStatus, modifier = Modifier.size(32.dp)) {
                    Icon(
                        imageVector = Icons.Default.CheckCircle,
                        contentDescription = "Activer/Désactiver",
                        tint = if (item.product.status == "ACTIVE") EmeraldPrimary else MaterialTheme.colorScheme.outline,
                        modifier = Modifier.size(16.dp)
                    )
                }
                IconButton(onClick = onDelete, modifier = Modifier.size(32.dp)) {
                    Icon(imageVector = Icons.Default.Delete, contentDescription = "Supprimer", tint = PromoRed, modifier = Modifier.size(16.dp))
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddEditProductDialog(
    categories: List<CategoryEntity>,
    rootCategories: List<CategoryEntity>,
    productWithDetails: ProductWithDetails?,
    onDismiss: () -> Unit,
    onSave: (
        name: String,
        catId: String,
        subcatId: String?,
        desc: String,
        brand: String,
        model: String,
        ref: String,
        price: Double,
        oldPrice: Double?,
        promoPrice: Double?,
        discount: Int,
        isPromo: Boolean,
        stock: String,
        delivery: Boolean,
        photos: List<String>
    ) -> Unit
) {
    var name by remember { mutableStateOf(productWithDetails?.product?.name ?: "") }
    var categoryId by remember { mutableStateOf(productWithDetails?.product?.categoryId ?: rootCategories.firstOrNull()?.id ?: "cat_fashion") }
    var subcategoryId by remember { mutableStateOf(productWithDetails?.product?.subcategoryId) }
    var description by remember { mutableStateOf(productWithDetails?.product?.description ?: "") }
    var brand by remember { mutableStateOf(productWithDetails?.product?.brand ?: "") }
    var model by remember { mutableStateOf(productWithDetails?.product?.model ?: "") }
    var reference by remember { mutableStateOf(productWithDetails?.product?.reference ?: "") }
    var priceStr by remember { mutableStateOf(productWithDetails?.product?.price?.toInt()?.toString() ?: "5000") }
    var isPromo by remember { mutableStateOf(productWithDetails?.product?.isPromotion ?: false) }
    var promoPriceStr by remember { mutableStateOf(productWithDetails?.product?.promotionPrice?.toInt()?.toString() ?: "4000") }
    var oldPriceStr by remember { mutableStateOf(productWithDetails?.product?.oldPrice?.toInt()?.toString() ?: "5000") }
    var deliveryAvailable by remember { mutableStateOf(productWithDetails?.product?.deliveryAvailable ?: true) }

    // Photos: Max 3 photos
    var photo1 by remember { mutableStateOf(productWithDetails?.images?.getOrNull(0)?.imageUrl ?: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600") }
    var photo2 by remember { mutableStateOf(productWithDetails?.images?.getOrNull(1)?.imageUrl ?: "") }
    var photo3 by remember { mutableStateOf(productWithDetails?.images?.getOrNull(2)?.imageUrl ?: "") }

    var catDropdownExpanded by remember { mutableStateOf(false) }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Text(
                text = if (productWithDetails != null) "Modifier l'annonce" else "Ajouter un produit (Vitrine)",
                fontWeight = FontWeight.Bold,
                fontSize = 17.sp
            )
        },
        text = {
            LazyColumn(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(450.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                item {
                    Text("1. Photo principale (Obligatoire, max 3 photos) :", fontWeight = FontWeight.SemiBold, fontSize = 12.sp)
                    OutlinedTextField(
                        value = photo1,
                        onValueChange = { photo1 = it },
                        label = { Text("URL Photo 1 (Principale)*") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                    OutlinedTextField(
                        value = photo2,
                        onValueChange = { photo2 = it },
                        label = { Text("URL Photo 2 (Optionnelle)") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                    OutlinedTextField(
                        value = photo3,
                        onValueChange = { photo3 = it },
                        label = { Text("URL Photo 3 (Optionnelle)") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                }

                item {
                    Spacer(modifier = Modifier.height(6.dp))
                    Text("2. Informations du produit :", fontWeight = FontWeight.SemiBold, fontSize = 12.sp)
                    OutlinedTextField(
                        value = name,
                        onValueChange = { name = it },
                        label = { Text("Nom du produit*") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                }

                item {
                    // Category selector
                    ExposedDropdownMenuBox(
                        expanded = catDropdownExpanded,
                        onExpandedChange = { catDropdownExpanded = !catDropdownExpanded }
                    ) {
                        val currentCatName = categories.firstOrNull { it.id == categoryId }?.nameFr ?: "Sélectionner"
                        OutlinedTextField(
                            value = currentCatName,
                            onValueChange = {},
                            readOnly = true,
                            label = { Text("Catégorie*") },
                            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = catDropdownExpanded) },
                            modifier = Modifier
                                .menuAnchor()
                                .fillMaxWidth()
                        )
                        ExposedDropdownMenu(
                            expanded = catDropdownExpanded,
                            onDismissRequest = { catDropdownExpanded = false }
                        ) {
                            rootCategories.forEach { cat ->
                                DropdownMenuItem(
                                    text = { Text(cat.nameFr) },
                                    onClick = {
                                        categoryId = cat.id
                                        catDropdownExpanded = false
                                    }
                                )
                            }
                        }
                    }
                }

                item {
                    OutlinedTextField(
                        value = priceStr,
                        onValueChange = { priceStr = it },
                        label = { Text("Prix (DA)*") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                }

                item {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Checkbox(checked = isPromo, onCheckedChange = { isPromo = it })
                        Text("Mettre en promotion", fontSize = 13.sp)
                    }
                    if (isPromo) {
                        OutlinedTextField(
                            value = promoPriceStr,
                            onValueChange = { promoPriceStr = it },
                            label = { Text("Prix promotionnel (DA)") },
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth()
                        )
                        OutlinedTextField(
                            value = oldPriceStr,
                            onValueChange = { oldPriceStr = it },
                            label = { Text("Ancien prix barré (DA)") },
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                }

                item {
                    OutlinedTextField(
                        value = brand,
                        onValueChange = { brand = it },
                        label = { Text("Marque") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                    OutlinedTextField(
                        value = model,
                        onValueChange = { model = it },
                        label = { Text("Modèle") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                    OutlinedTextField(
                        value = reference,
                        onValueChange = { reference = it },
                        label = { Text("Référence") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                }

                item {
                    OutlinedTextField(
                        value = description,
                        onValueChange = { description = it },
                        label = { Text("Description") },
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    val price = priceStr.toDoubleOrNull() ?: 0.0
                    val promoPrice = if (isPromo) promoPriceStr.toDoubleOrNull() else null
                    val oldPrice = if (isPromo) oldPriceStr.toDoubleOrNull() ?: price else null
                    val disc = if (isPromo && oldPrice != null && promoPrice != null && oldPrice > 0) {
                        (((oldPrice - promoPrice) / oldPrice) * 100).toInt()
                    } else 0

                    val photos = listOf(photo1, photo2, photo3).filter { it.isNotBlank() }

                    onSave(
                        name,
                        categoryId,
                        subcategoryId,
                        description,
                        brand,
                        model,
                        reference,
                        price,
                        oldPrice,
                        promoPrice,
                        disc,
                        isPromo,
                        "IN_STOCK",
                        deliveryAvailable,
                        photos
                    )
                }
            ) {
                Text("Publier l'annonce")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Annuler")
            }
        }
    )
}
