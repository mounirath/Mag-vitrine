package com.example.ui.screens

import android.graphics.BitmapFactory
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
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
import androidx.compose.foundation.layout.wrapContentWidth
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.CameraAlt
import androidx.compose.material.icons.filled.Chair
import androidx.compose.material.icons.filled.Checkroom
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.CloudDone
import androidx.compose.material.icons.filled.Construction
import androidx.compose.material.icons.filled.DarkMode
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.Layers
import androidx.compose.material.icons.filled.LightMode
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.PhotoLibrary
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material.icons.filled.Tune
import androidx.compose.material.icons.filled.Tv
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Badge
import androidx.compose.material3.BadgedBox
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
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
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.AppLanguage
import com.example.data.model.UserRole
import com.example.ui.components.AdvancedFilterDialog
import com.example.ui.components.NegotiationChatDialog
import com.example.ui.components.ProductCard
import com.example.ui.components.PublishProductDialog
import com.example.ui.components.TrustAndSafetyDialog
import com.example.ui.components.ValueEstimatorDialog
import com.example.ui.theme.EmeraldPrimary
import com.example.ui.theme.GoldCta
import com.example.ui.theme.GoldCtaDark
import com.example.ui.theme.NavyBorder
import com.example.ui.theme.NavyDark
import com.example.ui.theme.NavyHero
import com.example.ui.theme.NavyInput
import com.example.ui.theme.NavySurface
import com.example.ui.theme.PastelBlue
import com.example.ui.theme.PastelBlueIcon
import com.example.ui.theme.PastelOrange
import com.example.ui.theme.PastelOrangeIcon
import com.example.ui.theme.PastelPink
import com.example.ui.theme.PastelPinkIcon
import com.example.ui.theme.PastelPurple
import com.example.ui.theme.PastelPurpleIcon
import com.example.ui.theme.PastelTeal
import com.example.ui.theme.PastelTealIcon
import com.example.ui.theme.PastelYellow
import com.example.ui.theme.PastelYellowIcon
import com.example.ui.theme.SkyCyan
import com.example.ui.theme.TrustViolet
import com.example.ui.viewmodel.MainViewModel
import com.example.ui.viewmodel.Screen
import com.example.util.LanguageManager

data class SmartCategoryItem(
    val id: String,
    val titleAr: String,
    val titleFr: String,
    val icon: ImageVector,
    val bgColor: Color,
    val iconColor: Color
)

@Composable
fun HomeScreen(
    viewModel: MainViewModel,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val language by viewModel.language.collectAsState()
    val searchQuery by viewModel.searchQuery.collectAsState()
    val allProducts by viewModel.allProductsWithDetails.collectAsState()
    val cartItems by viewModel.cartItems.collectAsState()
    val favorites by viewModel.favorites.collectAsState()
    val wilayaFilter by viewModel.wilayaFilter.collectAsState()
    val selectedSmartCat by viewModel.selectedSmartCategory.collectAsState()

    var showLangDropdown by remember { mutableStateOf(false) }
    var isDarkMode by remember { mutableStateOf(false) }

    // Dialog states
    var isTrustOpen by remember { mutableStateOf(false) }
    var isEstimatorOpen by remember { mutableStateOf(false) }
    var isFilterOpen by remember { mutableStateOf(false) }
    var isPublishOpen by remember { mutableStateOf(false) }

    // Admin Auth State
    var showHiddenAdminAuthDialog by remember { mutableStateOf(false) }
    var adminEmailInput by remember { mutableStateOf("") }
    var adminEmailError by remember { mutableStateOf(false) }

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

    // Filter products matching search and wilaya
    val displayedProducts = remember(allProducts, searchQuery, wilayaFilter, selectedSmartCat) {
        allProducts.filter { item ->
            val matchQuery = searchQuery.isBlank() ||
                    item.product.name.contains(searchQuery, ignoreCase = true) ||
                    item.product.searchableText.contains(searchQuery, ignoreCase = true) ||
                    (item.store?.name?.contains(searchQuery, ignoreCase = true) == true)
            val matchWilaya = wilayaFilter.isBlank() ||
                    (item.store?.wilaya?.contains(wilayaFilter, ignoreCase = true) == true) ||
                    (item.store?.commune?.contains(wilayaFilter, ignoreCase = true) == true)
            val matchCategory = selectedSmartCat == null || selectedSmartCat == "all" || when (selectedSmartCat) {
                "cat_furniture" -> item.product.categoryId == "cat_home" || item.product.subcategoryId == "sub_meubles"
                "cat_electronics" -> item.product.categoryId == "cat_electronics"
                "cat_fashion" -> item.product.categoryId == "cat_fashion"
                "cat_parts" -> item.product.categoryId == "cat_auto" || item.product.subcategoryId == "sub_pieces"
                "cat_artisanat" -> item.product.categoryId == "cat_home" || item.product.isPromotion
                "cat_materials" -> item.product.categoryId == "cat_auto"
                else -> true
            }
            matchQuery && matchWilaya && matchCategory
        }.ifEmpty { allProducts }
    }

    // 6 Smart Categories matching Screenshot 1 & 2
    val smartCategories = listOf(
        SmartCategoryItem("cat_furniture", "أثاث\nوديكور", "Meubles &\nDéco", Icons.Default.Chair, PastelYellow, PastelYellowIcon),
        SmartCategoryItem("cat_electronics", "إلكترونيات", "Électronique", Icons.Default.Tv, PastelBlue, PastelBlueIcon),
        SmartCategoryItem("cat_fashion", "موضة\nوأزياء", "Mode &\nStyle", Icons.Default.Checkroom, PastelPink, PastelPinkIcon),
        SmartCategoryItem("cat_parts", "قطع غيار", "Pièces &\nRechanges", Icons.Default.Construction, PastelTeal, PastelTealIcon),
        SmartCategoryItem("cat_artisanat", "صناعة\nتقليدية", "Artisanat\nLocal", Icons.Default.AutoAwesome, PastelOrange, PastelOrangeIcon),
        SmartCategoryItem("cat_materials", "مواد\nولوازم", "Matériaux", Icons.Default.Layers, PastelPurple, PastelPurpleIcon)
    )

    Box(modifier = modifier.fillMaxSize()) {
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .background(MaterialTheme.colorScheme.background),
            contentPadding = PaddingValues(bottom = 90.dp)
        ) {
            // 1. SIGNATURE NAVY HERO HEADER (Screenshot 1 & 2)
            item {
                BoxWithConstraints(modifier = Modifier.fillMaxWidth()) {
                    val isCompact = maxWidth < 410.dp
                    val iconSize = if (isCompact) 32.dp else 36.dp
                    val itemSpacing = if (isCompact) 4.dp else 6.dp
                    val titleSize = if (isCompact) 18.sp else 22.sp
                    val titleLineHeight = if (isCompact) 22.sp else 26.sp

                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(NavyHero)
                            .padding(horizontal = 16.dp, vertical = 12.dp)
                    ) {
                        // Phone Status Bar Simulation (9:41, Signal, Wifi, Battery)
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(bottom = 12.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "9:41",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFF94A3B8)
                            )
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(6.dp)
                            ) {
                                Text(text = "4G", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color(0xFF94A3B8))
                                Text(text = "📶", fontSize = 10.sp)
                                Text(text = "🔋 78%", fontSize = 10.sp, color = Color(0xFF94A3B8))
                            }
                        }

                        // Top Row: Title + Action Buttons
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.Top
                        ) {
                            // Title ("اكتشف وبع في الجزائر" / "Découvrez & Vendez")
                            Column(modifier = Modifier.weight(1f, fill = false)) {
                                Text(
                                    text = LanguageManager.get("hero_title", language),
                                    fontSize = titleSize,
                                    fontWeight = FontWeight.Black,
                                    color = Color.White,
                                    lineHeight = titleLineHeight,
                                    maxLines = 2,
                                    overflow = TextOverflow.Ellipsis
                                )
                                Spacer(modifier = Modifier.height(2.dp))
                                Text(
                                    text = "MAG VITRINE • 58 Wilayas",
                                    fontSize = if (isCompact) 10.sp else 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color(0xFF94A3B8),
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )
                            }

                            Spacer(modifier = Modifier.width(6.dp))

                            // Quick circular tools (Cart, ADM, Database, Theme, Lang, Camera AI)
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(itemSpacing)
                            ) {
                                // Camera AI Search (Cyan circular highlight)
                                Box(
                                    modifier = Modifier
                                        .size(iconSize)
                                        .clip(CircleShape)
                                        .background(Color(0xFF1E293B))
                                        .clickable { viewModel.navigateTo(Screen.CameraAiSearch) }
                                        .testTag("btn_camera_ai"),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.CameraAlt,
                                        contentDescription = "Camera IA",
                                        tint = SkyCyan,
                                        modifier = Modifier.size(if (isCompact) 16.dp else 19.dp)
                                    )
                                }

                                // Language Selector Pill (عربي ▾ / FR ▾)
                                Box {
                                    Surface(
                                        shape = RoundedCornerShape(20.dp),
                                        color = Color(0xFF1E293B),
                                        border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF334155)),
                                        modifier = Modifier.clickable { showLangDropdown = true }
                                    ) {
                                        Row(
                                            verticalAlignment = Alignment.CenterVertically,
                                            modifier = Modifier.padding(horizontal = if (isCompact) 6.dp else 8.dp, vertical = if (isCompact) 4.dp else 6.dp)
                                        ) {
                                            Text(
                                                text = if (language == AppLanguage.AR) "عربي ▾" else if (language == AppLanguage.FR) "FR ▾" else "EN ▾",
                                                color = Color.White,
                                                fontSize = if (isCompact) 10.sp else 11.sp,
                                                fontWeight = FontWeight.Bold
                                            )
                                        }
                                    }

                                    DropdownMenu(
                                        expanded = showLangDropdown,
                                        onDismissRequest = { showLangDropdown = false }
                                    ) {
                                        AppLanguage.values().forEach { lang ->
                                            DropdownMenuItem(
                                                text = {
                                                    Text(
                                                        text = lang.displayName,
                                                        fontWeight = if (lang == language) FontWeight.Bold else FontWeight.Normal
                                                    )
                                                },
                                                onClick = {
                                                    viewModel.setLanguage(lang)
                                                    showLangDropdown = false
                                                }
                                            )
                                        }
                                    }
                                }

                                // Theme Toggle
                                Box(
                                    modifier = Modifier
                                        .size(iconSize)
                                        .clip(CircleShape)
                                        .background(Color(0xFF1E293B))
                                        .clickable { isDarkMode = !isDarkMode },
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        imageVector = if (isDarkMode) Icons.Default.LightMode else Icons.Default.DarkMode,
                                        contentDescription = "Theme",
                                        tint = Color.White,
                                        modifier = Modifier.size(if (isCompact) 15.dp else 18.dp)
                                    )
                                }

                                // Backend Database Status
                                Box(
                                    modifier = Modifier
                                        .size(iconSize)
                                        .clip(CircleShape)
                                        .background(Color(0xFF1E293B))
                                        .clickable {
                                            viewModel.showSnackbar("Backend Cloud & Base Locale Synchronisés 🟢")
                                        },
                                    contentAlignment = Alignment.Center
                                ) {
                                    Box(contentAlignment = Alignment.BottomEnd) {
                                        Icon(
                                            imageVector = Icons.Default.CloudDone,
                                            contentDescription = "Database",
                                            tint = Color(0xFF34D399),
                                            modifier = Modifier.size(if (isCompact) 15.dp else 18.dp)
                                        )
                                        Box(
                                            modifier = Modifier
                                                .size(5.dp)
                                                .clip(CircleShape)
                                                .background(EmeraldPrimary)
                                        )
                                    }
                                }

                                // Admin Shield Button (Direct Admin Access with ADM badge)
                                Box(
                                    modifier = Modifier
                                        .size(iconSize)
                                        .clip(CircleShape)
                                        .background(Color(0xFF1E293B))
                                        .border(1.dp, Color(0xFF10B981).copy(alpha = 0.5f), CircleShape)
                                        .clickable {
                                            if (viewModel.isAdminAuthenticated) {
                                                viewModel.setUserRole(UserRole.ADMIN)
                                                viewModel.navigateTo(Screen.AdminPanel)
                                            } else {
                                                adminEmailInput = "mounirath@yahoo.fr"
                                                showHiddenAdminAuthDialog = true
                                            }
                                        }
                                        .testTag("btn_admin_shield"),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Box(contentAlignment = Alignment.TopEnd) {
                                        Icon(
                                            imageVector = Icons.Default.Shield,
                                            contentDescription = "Espace Admin",
                                            tint = Color(0xFF34D399),
                                            modifier = Modifier.size(if (isCompact) 15.dp else 17.dp)
                                        )
                                        Surface(
                                            shape = RoundedCornerShape(3.dp),
                                            color = Color(0xFF10B981),
                                            modifier = Modifier.padding(start = 7.dp)
                                        ) {
                                            Text(
                                                text = "ADM",
                                                fontSize = 6.sp,
                                                fontWeight = FontWeight.Black,
                                                color = Color(0xFF064E3B),
                                                modifier = Modifier.padding(horizontal = 1.dp)
                                            )
                                        }
                                    }
                                }

                                // Shopping Cart with badge
                                Box(
                                    modifier = Modifier
                                        .size(iconSize)
                                        .clip(CircleShape)
                                        .background(Color(0xFF1E293B))
                                        .clickable { viewModel.navigateTo(Screen.Cart) }
                                        .testTag("btn_home_cart"),
                                    contentAlignment = Alignment.Center
                                ) {
                                    BadgedBox(
                                        badge = {
                                            if (cartItems.isNotEmpty()) {
                                                Badge(containerColor = GoldCta) {
                                                    Text("${cartItems.size}", fontSize = 8.sp, color = Color.White)
                                                }
                                            }
                                        }
                                    ) {
                                        Icon(
                                            imageVector = Icons.Default.ShoppingCart,
                                            contentDescription = "Panier",
                                            tint = Color.White,
                                            modifier = Modifier.size(if (isCompact) 15.dp else 18.dp)
                                        )
                                    }
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(14.dp))

                        // Primary Search Bar (White Pill with Sliders button)
                        Surface(
                            shape = RoundedCornerShape(26.dp),
                            color = Color.White,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.padding(horizontal = 14.dp, vertical = 4.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.Search,
                                contentDescription = "Rechercher",
                                tint = Color(0xFF64748B),
                                modifier = Modifier.size(20.dp)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            OutlinedTextField(
                                value = searchQuery,
                                onValueChange = {
                                    viewModel.searchQuery.value = it
                                    val trimmed = it.trim()
                                    if (trimmed.equals("admin", ignoreCase = true) ||
                                        trimmed.equals("mounirath@yahoo.fr", ignoreCase = true) ||
                                        trimmed.equals("mounirathdz@gmail.com", ignoreCase = true) ||
                                        trimmed.equals("adm", ignoreCase = true)
                                    ) {
                                        adminEmailInput = "mounirath@yahoo.fr"
                                        showHiddenAdminAuthDialog = true
                                        viewModel.searchQuery.value = ""
                                    }
                                },
                                placeholder = {
                                    Text(
                                        text = LanguageManager.get("hero_search_hint", language),
                                        fontSize = 12.sp,
                                        color = Color(0xFF94A3B8),
                                        maxLines = 1,
                                        overflow = TextOverflow.Ellipsis
                                    )
                                },
                                singleLine = true,
                                colors = OutlinedTextFieldDefaults.colors(
                                    focusedBorderColor = Color.Transparent,
                                    unfocusedBorderColor = Color.Transparent,
                                    focusedContainerColor = Color.Transparent,
                                    unfocusedContainerColor = Color.Transparent
                                ),
                                modifier = Modifier.weight(1f)
                            )
                            IconButton(onClick = { isFilterOpen = true }, modifier = Modifier.size(34.dp)) {
                                Icon(
                                    imageVector = Icons.Default.Tune,
                                    contentDescription = "Filtres",
                                    tint = Color(0xFF64748B),
                                    modifier = Modifier.size(20.dp)
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    // Horizontal Quick Filter Chips (Furniture, Local-Connect, Confiance, Estimateur, Vendre)
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .horizontalScroll(rememberScrollState()),
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        // Furniture active chip
                        Surface(
                            shape = RoundedCornerShape(20.dp),
                            color = PastelYellow,
                            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFFDE68A)),
                            modifier = Modifier.clickable {
                                viewModel.selectedSmartCategory.value = if (selectedSmartCat == "cat_furniture") null else "cat_furniture"
                            }
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier.padding(horizontal = 14.dp, vertical = 7.dp)
                            ) {
                                Text(
                                    text = "Furniture 🛋️",
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.ExtraBold,
                                    color = Color(0xFF92400E)
                                )
                            }
                        }

                        // Local-Connect Chip
                        Surface(
                            shape = RoundedCornerShape(20.dp),
                            color = NavySurface,
                            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF334155)),
                            modifier = Modifier.clickable { viewModel.navigateTo(Screen.MapView) }
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier.padding(horizontal = 12.dp, vertical = 7.dp)
                            ) {
                                Text("Local-Connect", color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("📍", fontSize = 12.sp)
                            }
                        }

                        // Confiance / Trust Portal Chip
                        Surface(
                            shape = RoundedCornerShape(20.dp),
                            color = NavySurface,
                            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF334155)),
                            modifier = Modifier.clickable { isTrustOpen = true }
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier.padding(horizontal = 12.dp, vertical = 7.dp)
                            ) {
                                Text("Confiance", color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("🛡️", fontSize = 12.sp)
                            }
                        }

                        // Estimateur Chip
                        Surface(
                            shape = RoundedCornerShape(20.dp),
                            color = NavySurface,
                            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF334155)),
                            modifier = Modifier.clickable { isEstimatorOpen = true }
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier.padding(horizontal = 12.dp, vertical = 7.dp)
                            ) {
                                Text("Estimateur", color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("💰", fontSize = 12.sp)
                            }
                        }

                        // Vendre (+) Golden Chip
                        Surface(
                            shape = RoundedCornerShape(20.dp),
                            color = GoldCta,
                            modifier = Modifier.clickable { isPublishOpen = true }
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier.padding(horizontal = 14.dp, vertical = 7.dp)
                            ) {
                                Icon(Icons.Default.Add, contentDescription = null, tint = Color.White, modifier = Modifier.size(14.dp))
                                Spacer(modifier = Modifier.width(3.dp))
                                Text("Vendre (+)", color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    // Secondary Wilaya Search Box
                    Surface(
                        shape = RoundedCornerShape(20.dp),
                        color = NavyInput,
                        border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF334155)),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 2.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.Search,
                                contentDescription = null,
                                tint = Color(0xFF94A3B8),
                                modifier = Modifier.size(16.dp)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            OutlinedTextField(
                                value = wilayaFilter,
                                onValueChange = { viewModel.wilayaFilter.value = it },
                                placeholder = {
                                    Text(
                                        text = LanguageManager.get("hero_wilaya_hint", language),
                                        fontSize = 11.sp,
                                        color = Color(0xFF94A3B8),
                                        maxLines = 1,
                                        overflow = TextOverflow.Ellipsis
                                    )
                                },
                                singleLine = true,
                                colors = OutlinedTextFieldDefaults.colors(
                                    focusedBorderColor = Color.Transparent,
                                    unfocusedBorderColor = Color.Transparent,
                                    focusedContainerColor = Color.Transparent,
                                    unfocusedContainerColor = Color.Transparent,
                                    focusedTextColor = Color.White,
                                    unfocusedTextColor = Color.White
                                ),
                                modifier = Modifier.weight(1f)
                            )
                            if (wilayaFilter.isNotEmpty()) {
                                IconButton(onClick = { viewModel.wilayaFilter.value = "" }, modifier = Modifier.size(24.dp)) {
                                    Icon(Icons.Default.Clear, contentDescription = "Effacer", tint = Color.White, modifier = Modifier.size(14.dp))
                                }
                            }
                        }
                    }
                }
            }
        }

            // 2. "الأقسام الذكية" (SMART CATEGORIES - Matching Screenshot 1 & 2)
            item {
                Column(modifier = Modifier.padding(top = 16.dp)) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp, vertical = 6.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = LanguageManager.get("smart_categories", language),
                            fontSize = 18.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = MaterialTheme.colorScheme.onBackground
                        )
                        Text(
                            text = LanguageManager.get("see_all", language),
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            color = SkyCyan,
                            modifier = Modifier.clickable {
                                viewModel.selectedSmartCategory.value = null
                                viewModel.navigateTo(Screen.Catalog())
                            }
                        )
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    // Large vertical pastel category cards in horizontal scroll (Screenshot 1)
                    LazyRow(
                        contentPadding = PaddingValues(horizontal = 16.dp),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        items(smartCategories) { cat ->
                            val isSelected = selectedSmartCat == cat.id
                            Card(
                                shape = RoundedCornerShape(20.dp),
                                colors = CardDefaults.cardColors(
                                    containerColor = if (isSelected) cat.bgColor.copy(alpha = 0.4f) else MaterialTheme.colorScheme.surface
                                ),
                                border = androidx.compose.foundation.BorderStroke(
                                    if (isSelected) 2.dp else 1.dp,
                                    if (isSelected) cat.iconColor else Color(0xFFE2E8F0)
                                ),
                                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
                                modifier = Modifier
                                    .width(96.dp)
                                    .clickable {
                                        viewModel.selectedSmartCategory.value = if (isSelected) null else cat.id
                                    }
                            ) {
                                Column(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(vertical = 14.dp, horizontal = 6.dp),
                                    horizontalAlignment = Alignment.CenterHorizontally
                                ) {
                                    // Rounded Pastel Icon Container
                                    Box(
                                        modifier = Modifier
                                            .size(54.dp)
                                            .clip(RoundedCornerShape(16.dp))
                                            .background(cat.bgColor),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Icon(
                                            imageVector = cat.icon,
                                            contentDescription = cat.titleFr,
                                            tint = cat.iconColor,
                                            modifier = Modifier.size(28.dp)
                                        )
                                    }

                                    Spacer(modifier = Modifier.height(10.dp))

                                    Text(
                                        text = if (language == AppLanguage.AR) cat.titleAr else cat.titleFr,
                                        fontSize = 12.sp,
                                        fontWeight = FontWeight.Bold,
                                        textAlign = TextAlign.Center,
                                        lineHeight = 15.sp,
                                        maxLines = 2,
                                        overflow = TextOverflow.Ellipsis,
                                        color = MaterialTheme.colorScheme.onSurface
                                    )
                                }
                            }
                        }
                    }
                }
            }

            // 3. "RECENT LINES" (PRODUCT FEED - Matching Screenshot 2)
            item {
                Column(modifier = Modifier.padding(top = 22.dp, start = 16.dp, end = 16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = LanguageManager.get("recent_lines", language),
                            fontSize = 18.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = MaterialTheme.colorScheme.onBackground
                        )
                        Text(
                            text = "${displayedProducts.size} articles",
                            fontSize = 12.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    // 2-Column Product Grid with Heart Favorites & Video Badges
                    displayedProducts.chunked(2).forEach { pair ->
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            for (prod in pair) {
                                Box(modifier = Modifier.weight(1f)) {
                                    ProductCard(
                                        item = prod,
                                        currentLanguage = language,
                                        isFavorite = favorites.contains(prod.product.id),
                                        onToggleFavorite = { viewModel.toggleFavorite(prod.product.id) },
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

            // Admin Footer trigger
            item {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 24.dp, bottom = 16.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        text = "MAG VITRINE • Vitrines Virtuelles d'Algérie",
                        fontSize = 11.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.6f)
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier
                            .clickable {
                                adminEmailInput = "mounirath@yahoo.fr"
                                showHiddenAdminAuthDialog = true
                            }
                            .padding(horizontal = 8.dp, vertical = 4.dp)
                    ) {
                        Icon(Icons.Default.Lock, contentDescription = null, tint = Color(0xFF94A3B8), modifier = Modifier.size(12.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Accès Gestion", fontSize = 10.sp, color = Color(0xFF94A3B8))
                    }
                }
            }
        }

        // FLOATING "Vendre (+)" BUTTON (Matching Screenshot 2)
        Surface(
            shape = RoundedCornerShape(26.dp),
            color = GoldCta,
            shadowElevation = 8.dp,
            modifier = Modifier
                .align(Alignment.BottomEnd)
                .padding(end = 18.dp, bottom = 80.dp)
                .clickable { isPublishOpen = true }
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.padding(horizontal = 18.dp, vertical = 12.dp)
            ) {
                Icon(Icons.Default.Add, contentDescription = null, tint = Color.White, modifier = Modifier.size(18.dp))
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    text = LanguageManager.get("vendre_cta", language),
                    fontWeight = FontWeight.Black,
                    fontSize = 13.sp,
                    color = Color.White
                )
            }
        }

        // INTERACTIVE MODALS MATCHING SCREENSHOT 2
        TrustAndSafetyDialog(isOpen = isTrustOpen, onDismiss = { isTrustOpen = false })
        ValueEstimatorDialog(isOpen = isEstimatorOpen, onDismiss = { isEstimatorOpen = false })
        AdvancedFilterDialog(isOpen = isFilterOpen, onDismiss = { isFilterOpen = false })
        PublishProductDialog(isOpen = isPublishOpen, onDismiss = { isPublishOpen = false })

        // Hidden Admin Access Dialog with instant 1-click unlock and authorized email chips
        if (showHiddenAdminAuthDialog) {
            AlertDialog(
                onDismissRequest = { showHiddenAdminAuthDialog = false },
                icon = {
                    Surface(shape = CircleShape, color = Color(0xFFFEF3C7), modifier = Modifier.size(48.dp)) {
                        Box(contentAlignment = Alignment.Center) {
                            Icon(Icons.Default.Lock, contentDescription = null, tint = Color(0xFFD97706), modifier = Modifier.size(24.dp))
                        }
                    }
                },
                title = { Text("Accès Espace Administrateur", fontWeight = FontWeight.Bold, fontSize = 16.sp) },
                text = {
                    Column {
                        Text("Sélectionnez votre compte ou saisissez un email autorisé :", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        Spacer(modifier = Modifier.height(10.dp))
                        Row(
                            horizontalArrangement = Arrangement.spacedBy(6.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Surface(
                                shape = RoundedCornerShape(14.dp),
                                color = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.6f),
                                modifier = Modifier
                                    .weight(1f)
                                    .clickable {
                                        adminEmailInput = "mounirath@yahoo.fr"
                                        adminEmailError = false
                                    }
                            ) {
                                Text(
                                    text = "mounirath@yahoo.fr",
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis,
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 6.dp),
                                    textAlign = TextAlign.Center
                                )
                            }
                            Surface(
                                shape = RoundedCornerShape(14.dp),
                                color = MaterialTheme.colorScheme.secondaryContainer.copy(alpha = 0.6f),
                                modifier = Modifier
                                    .weight(1f)
                                    .clickable {
                                        adminEmailInput = "mounirathdz@gmail.com"
                                        adminEmailError = false
                                    }
                            ) {
                                Text(
                                    text = "mounirathdz@gmail.com",
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis,
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 6.dp),
                                    textAlign = TextAlign.Center
                                )
                            }
                        }
                        Spacer(modifier = Modifier.height(10.dp))
                        OutlinedTextField(
                            value = adminEmailInput,
                            onValueChange = { adminEmailInput = it; adminEmailError = false },
                            label = { Text("Email administrateur") },
                            singleLine = true,
                            isError = adminEmailError,
                            modifier = Modifier.fillMaxWidth()
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Button(
                            onClick = {
                                viewModel.verifyAndLoginAdmin("mounirath@yahoo.fr")
                                showHiddenAdminAuthDialog = false
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = EmeraldPrimary),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text("⚡ Déverrouiller en 1 Clic (mounirath@yahoo.fr)", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                },
                confirmButton = {
                    Button(onClick = {
                        val success = viewModel.verifyAndLoginAdmin(adminEmailInput)
                        if (success) showHiddenAdminAuthDialog = false else adminEmailError = true
                    }) {
                        Text("Valider")
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
}
