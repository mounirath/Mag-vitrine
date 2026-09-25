package com.example.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.layout.wrapContentWidth
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Album
import androidx.compose.material.icons.filled.AutoFixHigh
import androidx.compose.material.icons.filled.Bathtub
import androidx.compose.material.icons.filled.Bed
import androidx.compose.material.icons.filled.Build
import androidx.compose.material.icons.filled.Chair
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Checkroom
import androidx.compose.material.icons.filled.ChildCare
import androidx.compose.material.icons.filled.CleanHands
import androidx.compose.material.icons.filled.Devices
import androidx.compose.material.icons.filled.DirectionsCar
import androidx.compose.material.icons.filled.Engineering
import androidx.compose.material.icons.filled.Face
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Headphones
import androidx.compose.material.icons.filled.Healing
import androidx.compose.material.icons.filled.Hiking
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Laptop
import androidx.compose.material.icons.filled.LocalActivity
import androidx.compose.material.icons.filled.LocalDrink
import androidx.compose.material.icons.filled.LocalFlorist
import androidx.compose.material.icons.filled.LocalShipping
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Man
import androidx.compose.material.icons.filled.Palette
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Restaurant
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.ShoppingBag
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material.icons.filled.Smartphone
import androidx.compose.material.icons.filled.SoupKitchen
import androidx.compose.material.icons.filled.Spa
import androidx.compose.material.icons.filled.Store
import androidx.compose.material.icons.filled.Tune
import androidx.compose.material.icons.filled.Tv
import androidx.compose.material.icons.filled.Watch
import androidx.compose.material.icons.filled.Woman
import androidx.compose.material.icons.outlined.ChatBubbleOutline
import androidx.compose.material.icons.outlined.FavoriteBorder
import androidx.compose.material3.Badge
import androidx.compose.material3.BadgedBox
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.data.model.AppLanguage
import com.example.data.model.CategoryEntity
import com.example.data.model.ProductWithDetails
import com.example.data.model.StoreEntity
import com.example.data.model.UserRole
import com.example.ui.theme.AmberSecondary
import com.example.ui.theme.EmeraldPrimary
import com.example.ui.theme.PromoRed
import com.example.util.DistanceUtil
import com.example.util.LanguageManager
import java.text.NumberFormat
import java.util.Locale

@Composable
fun AppHeader(
    currentLanguage: AppLanguage,
    onLanguageSelected: (AppLanguage) -> Unit,
    userRole: UserRole,
    onRoleSelected: (UserRole) -> Unit,
    cartItemCount: Int,
    onCartClicked: () -> Unit,
    onBackClicked: (() -> Unit)? = null,
    modifier: Modifier = Modifier
) {
    var showRoleMenu by remember { mutableStateOf(false) }
    var showLangMenu by remember { mutableStateOf(false) }

    Surface(
        color = MaterialTheme.colorScheme.surface,
        tonalElevation = 2.dp,
        shadowElevation = 2.dp,
        modifier = modifier.fillMaxWidth()
    ) {
        Box(modifier = Modifier.fillMaxWidth(), contentAlignment = Alignment.Center) {
            BoxWithConstraints(
                modifier = Modifier
                    .fillMaxWidth()
                    .widthIn(max = 900.dp)
                    .padding(horizontal = 12.dp, vertical = 8.dp)
            ) {
                val isCompact = maxWidth < 430.dp
                val showSlogan = maxWidth > 360.dp

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    // Left Brand Section
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.weight(1f, fill = false)
                    ) {
                        if (onBackClicked != null) {
                            IconButton(
                                onClick = onBackClicked,
                                modifier = Modifier
                                    .size(36.dp)
                                    .testTag("btn_back")
                            ) {
                                Icon(
                                    imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                                    contentDescription = "Retour",
                                    tint = MaterialTheme.colorScheme.primary
                                )
                            }
                            Spacer(modifier = Modifier.width(4.dp))
                        }

                        Box(
                            modifier = Modifier
                                .size(34.dp)
                                .clip(RoundedCornerShape(8.dp))
                                .background(EmeraldPrimary),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.Store,
                                contentDescription = "Logo",
                                tint = Color.White,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                        Spacer(modifier = Modifier.width(6.dp))
                        Column {
                            Text(
                                text = "MAG VITRINE",
                                fontWeight = FontWeight.Black,
                                fontSize = if (isCompact) 15.sp else 17.sp,
                                color = MaterialTheme.colorScheme.primary,
                                letterSpacing = 0.5.sp,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )
                            if (showSlogan) {
                                Text(
                                    text = LanguageManager.getSlogan(currentLanguage),
                                    fontSize = 9.sp,
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.width(6.dp))

                    // Right Actions Section (Language + Role + Cart)
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.End
                    ) {
                        // Adaptive Language Switcher
                        if (isCompact) {
                            // Compact dropdown language selector to save space on small screens
                            Box {
                                Surface(
                                    shape = RoundedCornerShape(12.dp),
                                    color = MaterialTheme.colorScheme.surfaceVariant,
                                    modifier = Modifier
                                        .clickable { showLangMenu = true }
                                        .testTag("btn_lang_compact")
                                ) {
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 4.dp)
                                    ) {
                                        Text(
                                            text = currentLanguage.displayName,
                                            fontSize = 10.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = MaterialTheme.colorScheme.primary
                                        )
                                        Spacer(modifier = Modifier.width(2.dp))
                                        Text(
                                            text = "▾",
                                            fontSize = 10.sp,
                                            color = MaterialTheme.colorScheme.onSurfaceVariant
                                        )
                                    }
                                }

                                DropdownMenu(
                                    expanded = showLangMenu,
                                    onDismissRequest = { showLangMenu = false }
                                ) {
                                    AppLanguage.values().forEach { lang ->
                                        DropdownMenuItem(
                                            text = {
                                                Text(
                                                    text = lang.displayName,
                                                    fontWeight = if (lang == currentLanguage) FontWeight.Bold else FontWeight.Normal
                                                )
                                            },
                                            onClick = {
                                                onLanguageSelected(lang)
                                                showLangMenu = false
                                            }
                                        )
                                    }
                                }
                            }
                        } else {
                            // Full segmented language control on larger screens
                            Row(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(20.dp))
                                    .background(MaterialTheme.colorScheme.surfaceVariant)
                                    .padding(horizontal = 3.dp, vertical = 2.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                AppLanguage.values().forEach { lang ->
                                    val isSelected = lang == currentLanguage
                                    Box(
                                        modifier = Modifier
                                            .clip(RoundedCornerShape(14.dp))
                                            .background(if (isSelected) MaterialTheme.colorScheme.primary else Color.Transparent)
                                            .clickable { onLanguageSelected(lang) }
                                            .padding(horizontal = 6.dp, vertical = 3.dp)
                                    ) {
                                        Text(
                                            text = lang.displayName,
                                            fontSize = 11.sp,
                                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                                            color = if (isSelected) Color.White else MaterialTheme.colorScheme.onSurfaceVariant
                                        )
                                    }
                                }
                            }
                        }

                        Spacer(modifier = Modifier.width(6.dp))

                        // User Role Chip (Client / Magasin / Admin) - Always offers Admin access
                        Box {
                            Surface(
                                shape = RoundedCornerShape(14.dp),
                                color = when (userRole) {
                                    UserRole.CUSTOMER -> MaterialTheme.colorScheme.primaryContainer
                                    UserRole.STORE -> AmberSecondary.copy(alpha = 0.2f)
                                    UserRole.ADMIN -> PromoRed.copy(alpha = 0.15f)
                                },
                                modifier = Modifier
                                    .clickable { showRoleMenu = true }
                                    .testTag("btn_switch_role")
                            ) {
                                Text(
                                    text = when (userRole) {
                                        UserRole.CUSTOMER -> "👤 Client"
                                        UserRole.STORE -> "🏪 Magasin"
                                        UserRole.ADMIN -> "👑 Admin"
                                    },
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    modifier = Modifier.padding(horizontal = 7.dp, vertical = 4.dp),
                                    color = when (userRole) {
                                        UserRole.CUSTOMER -> MaterialTheme.colorScheme.onPrimaryContainer
                                        UserRole.STORE -> AmberSecondary
                                        UserRole.ADMIN -> PromoRed
                                    }
                                )
                            }

                            DropdownMenu(
                                expanded = showRoleMenu,
                                onDismissRequest = { showRoleMenu = false }
                            ) {
                                DropdownMenuItem(
                                    text = { Text("👤 Espace Client") },
                                    onClick = {
                                        onRoleSelected(UserRole.CUSTOMER)
                                        showRoleMenu = false
                                    }
                                )
                                DropdownMenuItem(
                                    text = { Text("🏪 Espace Magasin") },
                                    onClick = {
                                        onRoleSelected(UserRole.STORE)
                                        showRoleMenu = false
                                    }
                                )
                                // ALWAYS ACCESSIBLE: Espace Administrateur
                                DropdownMenuItem(
                                    text = { Text("👑 Espace Administrateur") },
                                    onClick = {
                                        onRoleSelected(UserRole.ADMIN)
                                        showRoleMenu = false
                                    }
                                )
                            }
                        }

                        Spacer(modifier = Modifier.width(4.dp))

                        // Cart Icon with Badge
                        IconButton(
                            onClick = onCartClicked,
                            modifier = Modifier
                                .size(34.dp)
                                .testTag("btn_header_cart")
                        ) {
                            BadgedBox(
                                badge = {
                                    if (cartItemCount > 0) {
                                        Badge(containerColor = MaterialTheme.colorScheme.primary) {
                                            Text(cartItemCount.toString(), fontSize = 9.sp)
                                        }
                                    }
                                }
                            ) {
                                Icon(
                                    imageVector = Icons.Default.ShoppingCart,
                                    contentDescription = "Panier",
                                    tint = MaterialTheme.colorScheme.primary,
                                    modifier = Modifier.size(20.dp)
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun ProductCard(
    item: ProductWithDetails,
    currentLanguage: AppLanguage,
    onProductClick: () -> Unit,
    onAddToCartClick: () -> Unit,
    onStoreClick: (String) -> Unit,
    isFavorite: Boolean = false,
    onToggleFavorite: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    val formatter = remember { NumberFormat.getNumberInstance(Locale.FRANCE) }

    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        modifier = modifier
            .fillMaxWidth()
            .clickable(onClick = onProductClick)
            .testTag("card_product_${item.product.id}")
    ) {
        Column {
            // Image Box with Badges
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(145.dp)
                    .background(MaterialTheme.colorScheme.surfaceVariant)
            ) {
                if (item.primaryImageUrl.isNotBlank()) {
                    AsyncImage(
                        model = item.primaryImageUrl,
                        contentDescription = item.product.name,
                        contentScale = ContentScale.Crop,
                        modifier = Modifier.matchParentSize()
                    )
                } else {
                    Box(
                        modifier = Modifier.matchParentSize(),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.ShoppingBag,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.outline,
                            modifier = Modifier.size(44.dp)
                        )
                    }
                }

                // Heart Favorite Button (Top End) matching Mockup
                Surface(
                    shape = CircleShape,
                    color = Color.White.copy(alpha = 0.85f),
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .padding(8.dp)
                        .size(32.dp)
                        .clickable(onClick = onToggleFavorite)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Icon(
                            imageVector = if (isFavorite) Icons.Default.Favorite else Icons.Outlined.FavoriteBorder,
                            contentDescription = "Favori",
                            tint = if (isFavorite) Color.Red else Color(0xFF64748B),
                            modifier = Modifier.size(18.dp)
                        )
                    }
                }

                // Promo Badge
                if (item.product.isPromotion && item.product.discountPercent > 0) {
                    Surface(
                        color = PromoRed,
                        shape = RoundedCornerShape(topStart = 0.dp, bottomEnd = 10.dp),
                        modifier = Modifier.align(Alignment.TopStart)
                    ) {
                        Text(
                            text = "-${item.product.discountPercent}%",
                            color = Color.White,
                            fontWeight = FontWeight.Bold,
                            fontSize = 11.sp,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                        )
                    }
                }

                // Distance Badge (if available)
                if (item.distanceMeters != null) {
                    Surface(
                        color = Color.Black.copy(alpha = 0.7f),
                        shape = RoundedCornerShape(6.dp),
                        modifier = Modifier
                            .align(Alignment.BottomStart)
                            .padding(6.dp)
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.LocationOn,
                                contentDescription = null,
                                tint = Color(0xFFFBBF24),
                                modifier = Modifier.size(11.dp)
                            )
                            Spacer(modifier = Modifier.width(3.dp))
                            Text(
                                text = DistanceUtil.formatDistance(item.distanceMeters),
                                color = Color.White,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.SemiBold
                            )
                        }
                    }
                }
            }

            // Product Details
            Column(modifier = Modifier.padding(10.dp)) {
                // Product Name
                Text(
                    text = item.product.name,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                    color = MaterialTheme.colorScheme.onSurface
                )

                Spacer(modifier = Modifier.height(3.dp))

                // Price Row matching Mockup
                val priceDzd = item.product.price
                val priceEur = (priceDzd / 220).toInt()
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        text = "${formatter.format(priceDzd)} DA",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Text(
                        text = "$priceEur €",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = com.example.ui.theme.GoldCta
                    )
                }

                Spacer(modifier = Modifier.height(4.dp))

                // Location Pin
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.LocationOn,
                        contentDescription = null,
                        tint = Color(0xFF94A3B8),
                        modifier = Modifier.size(12.dp)
                    )
                    Spacer(modifier = Modifier.width(2.dp))
                    Text(
                        text = item.store?.let { "${it.wilaya}" } ?: "Algérie",
                        fontSize = 11.sp,
                        color = Color(0xFF64748B),
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }
        }
    }
}

@Composable
fun StoreCard(
    store: StoreEntity,
    distanceMeters: Double?,
    onStoreClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        modifier = modifier
            .fillMaxWidth()
            .clickable(onClick = onStoreClick)
            .testTag("card_store_${store.id}")
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Store Logo
            Box(
                modifier = Modifier
                    .size(64.dp)
                    .clip(RoundedCornerShape(10.dp))
                    .background(MaterialTheme.colorScheme.surfaceVariant),
                contentAlignment = Alignment.Center
            ) {
                if (store.logo.isNotBlank()) {
                    AsyncImage(
                        model = store.logo,
                        contentDescription = store.name,
                        contentScale = ContentScale.Crop,
                        modifier = Modifier.matchParentSize()
                    )
                } else {
                    Icon(
                        imageVector = Icons.Default.Store,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.size(32.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.width(12.dp))

            Column(modifier = Modifier.weight(1f)) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        text = store.name,
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp,
                        color = MaterialTheme.colorScheme.onSurface,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                    if (distanceMeters != null) {
                        Surface(
                            color = MaterialTheme.colorScheme.primaryContainer,
                            shape = RoundedCornerShape(6.dp)
                        ) {
                            Text(
                                text = "📍 ${DistanceUtil.formatDistance(distanceMeters)}",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onPrimaryContainer,
                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(2.dp))

                Text(
                    text = "${store.wilaya}, ${store.commune} • ${store.address}",
                    fontSize = 12.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )

                Spacer(modifier = Modifier.height(4.dp))

                Row(verticalAlignment = Alignment.CenterVertically) {
                    if (store.deliveryEnabled) {
                        Surface(
                            color = EmeraldPrimary.copy(alpha = 0.15f),
                            shape = RoundedCornerShape(4.dp)
                        ) {
                            Text(
                                text = "🚚 Livraison disponible",
                                fontSize = 10.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = EmeraldPrimary,
                                modifier = Modifier.padding(horizontal = 5.dp, vertical = 1.dp)
                            )
                        }
                    }
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "🕒 ${store.openingHours}",
                        fontSize = 10.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }
        }
    }
}

fun getIconForCategory(iconName: String): ImageVector {
    return when (iconName) {
        "Checkroom" -> Icons.Default.Checkroom
        "Man" -> Icons.Default.Man
        "Woman" -> Icons.Default.Woman
        "ChildCare" -> Icons.Default.ChildCare
        "Hiking" -> Icons.Default.Hiking
        "Watch" -> Icons.Default.Watch
        "Devices" -> Icons.Default.Devices
        "Smartphone" -> Icons.Default.Smartphone
        "Laptop" -> Icons.Default.Laptop
        "Tv" -> Icons.Default.Tv
        "Headphones" -> Icons.Default.Headphones
        "Home" -> Icons.Default.Home
        "Chair" -> Icons.Default.Chair
        "Palette" -> Icons.Default.Palette
        "SoupKitchen" -> Icons.Default.SoupKitchen
        "Bathtub" -> Icons.Default.Bathtub
        "Bed" -> Icons.Default.Bed
        "Spa" -> Icons.Default.Spa
        "AutoFixHigh" -> Icons.Default.AutoFixHigh
        "Face" -> Icons.Default.Face
        "Healing" -> Icons.Default.Healing
        "CleanHands" -> Icons.Default.CleanHands
        "Restaurant" -> Icons.Default.Restaurant
        "LocalDrink" -> Icons.Default.LocalDrink
        "LocalFlorist" -> Icons.Default.LocalFlorist
        "DirectionsCar" -> Icons.Default.DirectionsCar
        "Build" -> Icons.Default.Build
        "Album" -> Icons.Default.Album
        "Tune" -> Icons.Default.Tune
        "Engineering" -> Icons.Default.Engineering
        else -> Icons.Default.ShoppingBag
    }
}

@Composable
fun AppBottomNav(
    currentScreen: com.example.ui.viewmodel.Screen,
    onNavigate: (com.example.ui.viewmodel.Screen) -> Unit,
    cartCount: Int,
    userRole: UserRole,
    currentLanguage: AppLanguage,
    onOpenPublish: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    Surface(
        color = MaterialTheme.colorScheme.surface,
        tonalElevation = 8.dp,
        modifier = modifier.fillMaxWidth()
    ) {
        Box(
            modifier = Modifier.fillMaxWidth(),
            contentAlignment = Alignment.Center
        ) {
            NavigationBar(
                containerColor = Color.Transparent,
                tonalElevation = 0.dp,
                modifier = Modifier
                    .fillMaxWidth()
                    .widthIn(max = 600.dp)
            ) {
                // 1. Home / الرئيسية
                val isHome = currentScreen is com.example.ui.viewmodel.Screen.Home
                NavigationBarItem(
                    selected = isHome,
                    onClick = { onNavigate(com.example.ui.viewmodel.Screen.Home) },
                    icon = {
                        Icon(
                            imageVector = Icons.Default.Home,
                            contentDescription = "Accueil",
                            tint = if (isHome) com.example.ui.theme.GoldCta else MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    },
                    label = {
                        Text(
                            text = LanguageManager.get("home", currentLanguage),
                            fontSize = 11.sp,
                            fontWeight = if (isHome) FontWeight.Bold else FontWeight.Medium,
                            color = if (isHome) com.example.ui.theme.GoldCta else MaterialTheme.colorScheme.onSurfaceVariant,
                            maxLines = 1,
                            softWrap = false,
                            overflow = TextOverflow.Ellipsis
                        )
                    },
                    alwaysShowLabel = true
                )

                // 2. Recherche / بحث وموقع (Local-Connect / Map)
                val isMap = currentScreen is com.example.ui.viewmodel.Screen.MapView
                NavigationBarItem(
                    selected = isMap,
                    onClick = { onNavigate(com.example.ui.viewmodel.Screen.MapView) },
                    icon = {
                        Icon(
                            imageVector = Icons.Default.Search,
                            contentDescription = "Recherche",
                            tint = if (isMap) com.example.ui.theme.GoldCta else MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    },
                    label = {
                        Text(
                            text = LanguageManager.get("local_connect", currentLanguage),
                            fontSize = 11.sp,
                            fontWeight = if (isMap) FontWeight.Bold else FontWeight.Medium,
                            color = if (isMap) com.example.ui.theme.GoldCta else MaterialTheme.colorScheme.onSurfaceVariant,
                            maxLines = 1,
                            softWrap = false,
                            overflow = TextOverflow.Ellipsis
                        )
                    },
                    alwaysShowLabel = true
                )

                // 3. Publier / Vendre (+) center tab matching Mockup
                NavigationBarItem(
                    selected = false,
                    onClick = onOpenPublish,
                    icon = {
                        Box(
                            modifier = Modifier
                                .size(32.dp)
                                .clip(CircleShape)
                                .background(com.example.ui.theme.GoldCta),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.Add,
                                contentDescription = "Publier",
                                tint = Color.White,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                    },
                    label = {
                        Text(
                            text = LanguageManager.get("vendre_cta", currentLanguage),
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = com.example.ui.theme.GoldCta,
                            maxLines = 1,
                            softWrap = false,
                            overflow = TextOverflow.Ellipsis
                        )
                    },
                    alwaysShowLabel = true
                )

                // 4. Messages / رسائل
                val isMessages = currentScreen is com.example.ui.viewmodel.Screen.Messages
                NavigationBarItem(
                    selected = isMessages,
                    onClick = { onNavigate(com.example.ui.viewmodel.Screen.Messages) },
                    icon = {
                        BadgedBox(
                            badge = {
                                Badge(containerColor = com.example.ui.theme.GoldCta) {
                                    Text("1", fontSize = 8.sp, color = Color.White)
                                }
                            }
                        ) {
                            Icon(
                                imageVector = Icons.Outlined.ChatBubbleOutline,
                                contentDescription = "Messages",
                                tint = if (isMessages) com.example.ui.theme.GoldCta else MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    },
                    label = {
                        Text(
                            text = LanguageManager.get("messages_tab", currentLanguage),
                            fontSize = 11.sp,
                            fontWeight = if (isMessages) FontWeight.Bold else FontWeight.Medium,
                            color = if (isMessages) com.example.ui.theme.GoldCta else MaterialTheme.colorScheme.onSurfaceVariant,
                            maxLines = 1,
                            softWrap = false,
                            overflow = TextOverflow.Ellipsis
                        )
                    },
                    alwaysShowLabel = true
                )

                // 5. Profil / حسابي
                val isProfile = currentScreen is com.example.ui.viewmodel.Screen.Profile ||
                                currentScreen is com.example.ui.viewmodel.Screen.StoreDashboard ||
                                currentScreen is com.example.ui.viewmodel.Screen.AdminPanel
                NavigationBarItem(
                    selected = isProfile,
                    onClick = {
                        when (userRole) {
                            UserRole.STORE -> onNavigate(com.example.ui.viewmodel.Screen.StoreDashboard)
                            UserRole.ADMIN -> onNavigate(com.example.ui.viewmodel.Screen.AdminPanel)
                            UserRole.CUSTOMER -> onNavigate(com.example.ui.viewmodel.Screen.Profile)
                        }
                    },
                    icon = {
                        Icon(
                            imageVector = Icons.Default.Person,
                            contentDescription = "Profil",
                            tint = if (isProfile) com.example.ui.theme.GoldCta else MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    },
                    label = {
                        Text(
                            text = when (userRole) {
                                UserRole.STORE -> LanguageManager.get("my_store", currentLanguage)
                                UserRole.ADMIN -> LanguageManager.get("admin", currentLanguage)
                                UserRole.CUSTOMER -> LanguageManager.get("profile_tab", currentLanguage)
                            },
                            fontSize = 11.sp,
                            fontWeight = if (isProfile) FontWeight.Bold else FontWeight.Medium,
                            color = if (isProfile) com.example.ui.theme.GoldCta else MaterialTheme.colorScheme.onSurfaceVariant,
                            maxLines = 1,
                            softWrap = false,
                            overflow = TextOverflow.Ellipsis
                        )
                    },
                    alwaysShowLabel = true
                )
            }
        }
    }
}

