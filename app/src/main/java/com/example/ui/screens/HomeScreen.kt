package com.example.ui.screens

import android.graphics.BitmapFactory
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.Image
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
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CameraAlt
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.FilterList
import androidx.compose.material.icons.filled.LocalFireDepartment
import androidx.compose.material.icons.filled.LocalShipping
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Map
import androidx.compose.material.icons.filled.PhotoLibrary
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Security
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.R
import com.example.data.model.AppLanguage
import com.example.data.model.CategoryEntity
import com.example.data.model.ProductWithDetails
import com.example.data.model.StoreEntity
import com.example.ui.components.ProductCard
import com.example.ui.components.StoreCard
import com.example.ui.components.getIconForCategory
import com.example.ui.theme.AmberSecondary
import com.example.ui.theme.EmeraldPrimary
import com.example.ui.theme.PromoRed
import com.example.ui.viewmodel.MainViewModel
import com.example.ui.viewmodel.Screen
import com.example.util.DistanceUtil
import com.example.util.LanguageManager

@Composable
fun HomeScreen(
    viewModel: MainViewModel,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val language by viewModel.language.collectAsState()
    val searchQuery by viewModel.searchQuery.collectAsState()
    val rootCategories by viewModel.rootCategories.collectAsState()
    val allProducts by viewModel.allProductsWithDetails.collectAsState()
    val stores by viewModel.activeStores.collectAsState()
    val filterNearMe by viewModel.filterNearMe.collectAsState()
    val filterPromotions by viewModel.filterOnlyPromotions.collectAsState()
    val filterDelivery by viewModel.filterOnlyDelivery.collectAsState()
    val userLat by viewModel.userLat.collectAsState()
    val userLng by viewModel.userLng.collectAsState()

    // Gallery picker for AI Vision search
    val photoPickerLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.PickVisualMedia()
    ) { uri ->
        uri?.let {
            try {
                context.contentResolver.openInputStream(it)?.use { stream ->
                    val bitmap = BitmapFactory.decodeStream(stream)
                    if (bitmap != null) {
                        viewModel.analyzeImageWithAi(bitmap)
                        viewModel.navigateTo(Screen.CameraAiSearch)
                    }
                }
            } catch (e: Exception) {
                viewModel.showSnackbar("Erreur lors du chargement de l'image")
            }
        }
    }

    val promotionalProducts = remember(allProducts) {
        allProducts.filter { it.product.isPromotion }
    }

    var showHiddenAdminAuthDialog by remember { mutableStateOf(false) }
    var adminEmailInput by remember { mutableStateOf("") }
    var adminEmailError by remember { mutableStateOf(false) }

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        contentPadding = PaddingValues(bottom = 80.dp)
    ) {
        // Search & AI Bar Section
        item {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(MaterialTheme.colorScheme.surface)
                    .padding(horizontal = 16.dp, vertical = 12.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    OutlinedTextField(
                        value = searchQuery,
                        onValueChange = {
                            viewModel.searchQuery.value = it
                            val trimmed = it.trim()
                            if (trimmed.equals("admin", ignoreCase = true) ||
                                trimmed.equals("mounirath@yahoo.fr", ignoreCase = true) ||
                                trimmed.equals("mounirath", ignoreCase = true) ||
                                trimmed.equals("#admin", ignoreCase = true) ||
                                trimmed.equals("*#admin#*", ignoreCase = true)
                            ) {
                                adminEmailInput = if (trimmed.contains("@")) trimmed else "mounirath@yahoo.fr"
                                adminEmailError = false
                                showHiddenAdminAuthDialog = true
                                viewModel.searchQuery.value = ""
                            } else if (it.isNotBlank()) {
                                viewModel.navigateTo(Screen.Catalog())
                            }
                        },
                        placeholder = {
                            Text(
                                LanguageManager.get("search_hint", language),
                                fontSize = 13.sp
                            )
                        },
                        leadingIcon = {
                            Icon(
                                imageVector = Icons.Default.Search,
                                contentDescription = "Rechercher",
                                tint = MaterialTheme.colorScheme.primary
                            )
                        },
                        trailingIcon = {
                            if (searchQuery.isNotEmpty()) {
                                IconButton(onClick = { viewModel.searchQuery.value = "" }) {
                                    Icon(
                                        imageVector = Icons.Default.Clear,
                                        contentDescription = "Effacer",
                                        tint = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }
                            }
                        },
                        singleLine = true,
                        shape = RoundedCornerShape(12.dp),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = MaterialTheme.colorScheme.primary,
                            unfocusedBorderColor = MaterialTheme.colorScheme.outline.copy(alpha = 0.5f),
                            focusedContainerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f),
                            unfocusedContainerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.3f)
                        ),
                        modifier = Modifier
                            .weight(1f)
                            .testTag("input_home_search")
                    )

                    Spacer(modifier = Modifier.width(8.dp))

                    // AI Camera Search Button
                    Box(
                        modifier = Modifier
                            .size(52.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .background(
                                Brush.linearGradient(
                                    colors = listOf(EmeraldPrimary, AmberSecondary)
                                )
                            )
                            .clickable { viewModel.navigateTo(Screen.CameraAiSearch) }
                            .testTag("btn_camera_ai"),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.CameraAlt,
                            contentDescription = LanguageManager.get("ai_camera_search", language),
                            tint = Color.White,
                            modifier = Modifier.size(24.dp)
                        )
                    }

                    Spacer(modifier = Modifier.width(6.dp))

                    // Photo Library Picker Button
                    Box(
                        modifier = Modifier
                            .size(52.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .background(MaterialTheme.colorScheme.surfaceVariant)
                            .clickable {
                                photoPickerLauncher.launch(
                                    PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly)
                                )
                            }
                            .testTag("btn_gallery_ai"),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.PhotoLibrary,
                            contentDescription = LanguageManager.get("gallery_search", language),
                            tint = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.size(22.dp)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))

                // Quick Filter Pills
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    QuickFilterChip(
                        text = LanguageManager.get("near_me", language),
                        icon = Icons.Default.LocationOn,
                        selected = filterNearMe,
                        onClick = {
                            viewModel.filterNearMe.value = !filterNearMe
                            viewModel.navigateTo(Screen.Catalog())
                        },
                        tag = "filter_near_me"
                    )

                    QuickFilterChip(
                        text = LanguageManager.get("promotions", language),
                        icon = Icons.Default.LocalFireDepartment,
                        selected = filterPromotions,
                        accentColor = PromoRed,
                        onClick = {
                            viewModel.filterOnlyPromotions.value = !filterPromotions
                            viewModel.navigateTo(Screen.Catalog())
                        },
                        tag = "filter_promos"
                    )

                    QuickFilterChip(
                        text = LanguageManager.get("view_on_map", language),
                        icon = Icons.Default.Map,
                        selected = false,
                        onClick = { viewModel.navigateTo(Screen.MapView) },
                        tag = "btn_map_view"
                    )
                }
            }
        }

        // Hero Showcase Banner
        item {
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 12.dp)
                    .clip(RoundedCornerShape(16.dp))
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(160.dp)
                ) {
                    Image(
                        painter = painterResource(id = R.drawable.img_vitrine_hero),
                        contentDescription = "Vitrines virtuelles",
                        contentScale = ContentScale.Crop,
                        modifier = Modifier.matchParentSize()
                    )
                    Box(
                        modifier = Modifier
                            .matchParentSize()
                            .background(
                                Brush.verticalGradient(
                                    colors = listOf(
                                        Color.Transparent,
                                        Color.Black.copy(alpha = 0.85f)
                                    )
                                )
                            )
                    )
                    Column(
                        modifier = Modifier
                            .align(Alignment.BottomStart)
                            .padding(14.dp)
                    ) {
                        Surface(
                            color = EmeraldPrimary,
                            shape = RoundedCornerShape(6.dp)
                        ) {
                            Text(
                                text = "🇩🇿 100% MAGASINS D'ALGÉRIE",
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.White,
                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                            )
                        }
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = LanguageManager.getSlogan(language),
                            fontSize = 15.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = Color.White
                        )
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = "Vitrines virtuelles • Produits • Promotions • Livraison",
                            fontSize = 11.sp,
                            color = Color(0xFFE2E8F0)
                        )
                    }
                }
            }
        }

        // Categories Carousel
        item {
            Column(modifier = Modifier.padding(top = 8.dp)) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 6.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = LanguageManager.get("categories", language),
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onBackground
                    )
                    Text(
                        text = LanguageManager.get("all", language) + " →",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.clickable {
                            viewModel.selectedCategory.value = null
                            viewModel.navigateTo(Screen.Catalog())
                        }
                    )
                }

                LazyRow(
                    contentPadding = PaddingValues(horizontal = 16.dp),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    items(rootCategories) { cat ->
                        CategoryItemCard(
                            category = cat,
                            language = language,
                            onClick = {
                                viewModel.selectedCategory.value = cat
                                viewModel.selectedSubcategory.value = null
                                viewModel.navigateTo(Screen.Catalog(cat.id))
                            }
                        )
                    }
                }
            }
        }

        // Promotions Section
        if (promotionalProducts.isNotEmpty()) {
            item {
                Column(modifier = Modifier.padding(top = 18.dp)) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp, vertical = 6.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = "🔥 " + LanguageManager.get("promotions", language),
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onBackground
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Surface(
                                color = PromoRed.copy(alpha = 0.15f),
                                shape = RoundedCornerShape(6.dp)
                            ) {
                                Text(
                                    text = "Jusqu'à -25%",
                                    color = PromoRed,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                )
                            }
                        }

                        Text(
                            text = LanguageManager.get("all", language) + " →",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.clickable {
                                viewModel.filterOnlyPromotions.value = true
                                viewModel.navigateTo(Screen.Catalog())
                            }
                        )
                    }

                    LazyRow(
                        contentPadding = PaddingValues(horizontal = 16.dp),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        items(promotionalProducts) { prod ->
                            Box(modifier = Modifier.width(170.dp)) {
                                ProductCard(
                                    item = prod,
                                    currentLanguage = language,
                                    onProductClick = { viewModel.navigateTo(Screen.ProductDetail(prod.product.id)) },
                                    onAddToCartClick = {
                                        viewModel.addToCart(prod.product.id, prod.product.storeId)
                                    },
                                    onStoreClick = { storeId ->
                                        viewModel.navigateTo(Screen.StoreVitrine(storeId))
                                    }
                                )
                            }
                        }
                    }
                }
            }
        }

        // Recommended Stores / Vitrines Section
        item {
            Column(modifier = Modifier.padding(top = 20.dp)) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 6.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "🏪 " + LanguageManager.get("stores", language),
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onBackground
                    )
                    Text(
                        text = LanguageManager.get("view_on_map", language) + " 📍",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.clickable { viewModel.navigateTo(Screen.MapView) }
                    )
                }

                Column(
                    modifier = Modifier.padding(horizontal = 16.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    stores.take(3).forEach { store ->
                        val dist = DistanceUtil.calculateDistanceMeters(
                            userLat, userLng, store.latitude, store.longitude
                        )
                        StoreCard(
                            store = store,
                            distanceMeters = dist,
                            onStoreClick = {
                                viewModel.navigateTo(Screen.StoreVitrine(store.id))
                            }
                        )
                    }
                }
            }
        }

        // New Arrivals / Tous les produits
        item {
            Column(modifier = Modifier.padding(top = 22.dp, start = 16.dp, end = 16.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "✨ " + LanguageManager.get("new_products", language),
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onBackground
                    )
                    Text(
                        text = LanguageManager.get("all", language) + " →",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.clickable {
                            viewModel.selectedCategory.value = null
                            viewModel.navigateTo(Screen.Catalog())
                        }
                    )
                }

                Spacer(modifier = Modifier.height(10.dp))

                // 2-column grid of products
                allProducts.chunked(2).forEach { pair ->
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        for (prod in pair) {
                            Box(modifier = Modifier.weight(1f)) {
                                ProductCard(
                                    item = prod,
                                    currentLanguage = language,
                                    onProductClick = { viewModel.navigateTo(Screen.ProductDetail(prod.product.id)) },
                                    onAddToCartClick = {
                                        viewModel.addToCart(prod.product.id, prod.product.storeId)
                                    },
                                    onStoreClick = { storeId ->
                                        viewModel.navigateTo(Screen.StoreVitrine(storeId))
                                    }
                                )
                            }
                        }
                        if (pair.size == 1) {
                            Spacer(modifier = Modifier.weight(1f))
                        }
                    }
                    Spacer(modifier = Modifier.height(12.dp))
                }
            }
        }

        // Discreet Footer with hidden admin trigger
        item {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 28.dp, bottom = 16.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "MAG VITRINE • Vitrines Virtuelles d'Algérie",
                    fontSize = 11.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.6f)
                )
                Spacer(modifier = Modifier.height(6.dp))
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .clip(RoundedCornerShape(8.dp))
                        .clickable {
                            adminEmailInput = "mounirath@yahoo.fr"
                            adminEmailError = false
                            showHiddenAdminAuthDialog = true
                        }
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                        .testTag("btn_hidden_admin_trigger")
                ) {
                    Icon(
                        imageVector = Icons.Default.Lock,
                        contentDescription = "Accès Gestion",
                        tint = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.35f),
                        modifier = Modifier.size(13.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "Accès Gestion",
                        fontSize = 10.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.45f)
                    )
                }
            }
        }
    }

    // Hidden Admin Access Dialog
    if (showHiddenAdminAuthDialog) {
        AlertDialog(
            onDismissRequest = { showHiddenAdminAuthDialog = false },
            icon = {
                Surface(
                    color = MaterialTheme.colorScheme.primaryContainer,
                    shape = CircleShape,
                    modifier = Modifier.size(46.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Icon(
                            imageVector = Icons.Default.Security,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.size(26.dp)
                        )
                    }
                }
            },
            title = {
                Text(
                    text = "Accès Gestion Administrateur",
                    fontWeight = FontWeight.Bold,
                    fontSize = 17.sp
                )
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(
                        text = "Cet espace réservé nécessite une autorisation préalable par email vérifié.",
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    OutlinedTextField(
                        value = adminEmailInput,
                        onValueChange = {
                            adminEmailInput = it
                            adminEmailError = false
                        },
                        label = { Text("Email administrateur") },
                        placeholder = { Text("nom@domaine.com") },
                        leadingIcon = {
                            Icon(
                                imageVector = Icons.Default.Email,
                                contentDescription = null,
                                tint = MaterialTheme.colorScheme.primary
                            )
                        },
                        isError = adminEmailError,
                        supportingText = {
                            if (adminEmailError) {
                                Text(
                                    text = "Accès refusé : Seul l'email mounirath@yahoo.fr est autorisé",
                                    color = MaterialTheme.colorScheme.error,
                                    fontSize = 11.sp
                                )
                            } else {
                                Text(
                                    text = "Email autorisé requis pour ouvrir la console d'administration",
                                    fontSize = 10.sp,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                        },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth().testTag("input_admin_email_dialog")
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val success = viewModel.verifyAndLoginAdmin(adminEmailInput)
                        if (success) {
                            showHiddenAdminAuthDialog = false
                        } else {
                            adminEmailError = true
                        }
                    },
                    modifier = Modifier.testTag("btn_confirm_admin_auth")
                ) {
                    Text("Valider l'accès")
                }
            },
            dismissButton = {
                TextButton(onClick = { showHiddenAdminAuthDialog = false }) {
                    Text("Annuler")
                }
            }
        )
    }
}

@Composable
fun QuickFilterChip(
    text: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    selected: Boolean,
    onClick: () -> Unit,
    tag: String,
    accentColor: Color? = null
) {
    val chipColor = if (selected) {
        accentColor ?: MaterialTheme.colorScheme.primary
    } else {
        MaterialTheme.colorScheme.surfaceVariant
    }

    val textColor = if (selected) {
        Color.White
    } else {
        MaterialTheme.colorScheme.onSurface
    }

    Surface(
        shape = RoundedCornerShape(20.dp),
        color = chipColor,
        modifier = Modifier
            .clickable(onClick = onClick)
            .testTag(tag)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = if (selected) Color.White else (accentColor ?: MaterialTheme.colorScheme.primary),
                modifier = Modifier.size(15.dp)
            )
            Spacer(modifier = Modifier.width(4.dp))
            Text(
                text = text,
                fontSize = 11.sp,
                fontWeight = if (selected) FontWeight.Bold else FontWeight.Medium,
                color = textColor
            )
        }
    }
}

@Composable
fun CategoryItemCard(
    category: CategoryEntity,
    language: AppLanguage,
    onClick: () -> Unit
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier
            .clickable(onClick = onClick)
            .padding(4.dp)
            .testTag("cat_item_${category.id}")
    ) {
        Box(
            modifier = Modifier
                .size(60.dp)
                .clip(CircleShape)
                .background(MaterialTheme.colorScheme.primaryContainer),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = getIconForCategory(category.iconName),
                contentDescription = LanguageManager.getCategoryName(category, language),
                tint = MaterialTheme.colorScheme.onPrimaryContainer,
                modifier = Modifier.size(28.dp)
            )
        }
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = LanguageManager.getCategoryName(category, language),
            fontSize = 11.sp,
            fontWeight = FontWeight.SemiBold,
            color = MaterialTheme.colorScheme.onSurface,
            maxLines = 1
        )
    }
}
