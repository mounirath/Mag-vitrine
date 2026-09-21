package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
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
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.FilterList
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Sort
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.AppLanguage
import com.example.data.model.CategoryEntity
import com.example.data.model.SortOption
import com.example.ui.components.ProductCard
import com.example.ui.components.getIconForCategory
import com.example.ui.theme.EmeraldPrimary
import com.example.ui.theme.PromoRed
import com.example.ui.viewmodel.MainViewModel
import com.example.ui.viewmodel.Screen
import com.example.util.LanguageManager

@Composable
fun CatalogScreen(
    viewModel: MainViewModel,
    modifier: Modifier = Modifier
) {
    val language by viewModel.language.collectAsState()
    val searchQuery by viewModel.searchQuery.collectAsState()
    val selectedCategory by viewModel.selectedCategory.collectAsState()
    val selectedSubcategory by viewModel.selectedSubcategory.collectAsState()
    val categories by viewModel.categories.collectAsState()
    val rootCategories by viewModel.rootCategories.collectAsState()
    val filteredProducts by viewModel.filteredProducts.collectAsState()
    val filterNearMe by viewModel.filterNearMe.collectAsState()
    val filterPromotions by viewModel.filterOnlyPromotions.collectAsState()
    val filterDelivery by viewModel.filterOnlyDelivery.collectAsState()
    val sortOption by viewModel.sortOption.collectAsState()

    var showSortMenu by remember { mutableStateOf(false) }

    val subcategories = remember(selectedCategory, categories) {
        if (selectedCategory != null) {
            categories.filter { it.parentId == selectedCategory?.id }
        } else emptyList()
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
    ) {
        // Search Input Bar
        Surface(
            color = MaterialTheme.colorScheme.surface,
            tonalElevation = 2.dp,
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(horizontal = 14.dp, vertical = 8.dp)) {
                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = { viewModel.searchQuery.value = it },
                    placeholder = { Text(LanguageManager.get("search_hint", language), fontSize = 13.sp) },
                    leadingIcon = {
                        Icon(
                            imageVector = Icons.Default.Search,
                            contentDescription = null,
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
                        unfocusedBorderColor = MaterialTheme.colorScheme.outline.copy(alpha = 0.5f)
                    ),
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("input_catalog_search")
                )

                Spacer(modifier = Modifier.height(8.dp))

                // Root Category Filter Chips
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    item {
                        FilterChip(
                            selected = selectedCategory == null,
                            onClick = {
                                viewModel.selectedCategory.value = null
                                viewModel.selectedSubcategory.value = null
                            },
                            label = { Text(LanguageManager.get("all", language)) },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = MaterialTheme.colorScheme.primary,
                                selectedLabelColor = Color.White
                            ),
                            modifier = Modifier.testTag("chip_cat_all")
                        )
                    }

                    items(rootCategories) { cat ->
                        val isSelected = selectedCategory?.id == cat.id
                        FilterChip(
                            selected = isSelected,
                            onClick = {
                                if (isSelected) {
                                    viewModel.selectedCategory.value = null
                                    viewModel.selectedSubcategory.value = null
                                } else {
                                    viewModel.selectedCategory.value = cat
                                    viewModel.selectedSubcategory.value = null
                                }
                            },
                            label = { Text(LanguageManager.getCategoryName(cat, language)) },
                            leadingIcon = {
                                Icon(
                                    imageVector = getIconForCategory(cat.iconName),
                                    contentDescription = null,
                                    modifier = Modifier.size(16.dp)
                                )
                            },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = MaterialTheme.colorScheme.primary,
                                selectedLabelColor = Color.White,
                                selectedLeadingIconColor = Color.White
                            ),
                            modifier = Modifier.testTag("chip_cat_${cat.id}")
                        )
                    }
                }

                // Subcategories if category selected
                if (subcategories.isNotEmpty()) {
                    Spacer(modifier = Modifier.height(6.dp))
                    LazyRow(
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        items(subcategories) { subcat ->
                            val isSubSelected = selectedSubcategory?.id == subcat.id
                            Surface(
                                shape = RoundedCornerShape(14.dp),
                                color = if (isSubSelected) MaterialTheme.colorScheme.primaryContainer else MaterialTheme.colorScheme.surfaceVariant,
                                modifier = Modifier
                                    .clickable {
                                        viewModel.selectedSubcategory.value = if (isSubSelected) null else subcat
                                    }
                                    .testTag("chip_subcat_${subcat.id}")
                            ) {
                                Text(
                                    text = LanguageManager.getCategoryName(subcat, language),
                                    fontSize = 11.sp,
                                    fontWeight = if (isSubSelected) FontWeight.Bold else FontWeight.Normal,
                                    color = if (isSubSelected) MaterialTheme.colorScheme.onPrimaryContainer else MaterialTheme.colorScheme.onSurfaceVariant,
                                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 5.dp)
                                )
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(6.dp))

                // Toggle Filters & Sorting Row
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                        modifier = Modifier.horizontalScroll(rememberScrollState())
                    ) {
                        FilterTogglePill(
                            label = LanguageManager.get("near_me", language),
                            selected = filterNearMe,
                            onClick = { viewModel.filterNearMe.value = !filterNearMe },
                            tag = "pill_near_me"
                        )
                        FilterTogglePill(
                            label = "🔥 " + LanguageManager.get("promotions", language),
                            selected = filterPromotions,
                            accentColor = PromoRed,
                            onClick = { viewModel.filterOnlyPromotions.value = !filterPromotions },
                            tag = "pill_promotions"
                        )
                        FilterTogglePill(
                            label = "🚚 " + LanguageManager.get("delivery_available", language),
                            selected = filterDelivery,
                            onClick = { viewModel.filterOnlyDelivery.value = !filterDelivery },
                            tag = "pill_delivery"
                        )
                    }

                    // Sort Menu Button
                    Box {
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = MaterialTheme.colorScheme.surfaceVariant,
                            modifier = Modifier
                                .clickable { showSortMenu = true }
                                .testTag("btn_sort_menu")
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 5.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Sort,
                                    contentDescription = "Trier",
                                    tint = MaterialTheme.colorScheme.primary,
                                    modifier = Modifier.size(16.dp)
                                )
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(
                                    text = when (sortOption) {
                                        SortOption.RELEVANCE -> LanguageManager.get("sort_relevance", language)
                                        SortOption.PRICE_ASC -> "Prix ↑"
                                        SortOption.PRICE_DESC -> "Prix ↓"
                                        SortOption.DISTANCE_ASC -> "Distance ↑"
                                        SortOption.DISTANCE_DESC -> "Distance ↓"
                                        SortOption.PROMOTIONS -> "Promos"
                                    },
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = MaterialTheme.colorScheme.primary
                                )
                            }
                        }

                        DropdownMenu(
                            expanded = showSortMenu,
                            onDismissRequest = { showSortMenu = false }
                        ) {
                            DropdownMenuItem(
                                text = { Text(LanguageManager.get("sort_relevance", language)) },
                                onClick = {
                                    viewModel.sortOption.value = SortOption.RELEVANCE
                                    showSortMenu = false
                                }
                            )
                            DropdownMenuItem(
                                text = { Text(LanguageManager.get("sort_price_asc", language)) },
                                onClick = {
                                    viewModel.sortOption.value = SortOption.PRICE_ASC
                                    showSortMenu = false
                                }
                            )
                            DropdownMenuItem(
                                text = { Text(LanguageManager.get("sort_price_desc", language)) },
                                onClick = {
                                    viewModel.sortOption.value = SortOption.PRICE_DESC
                                    showSortMenu = false
                                }
                            )
                            DropdownMenuItem(
                                text = { Text(LanguageManager.get("sort_distance_asc", language)) },
                                onClick = {
                                    viewModel.sortOption.value = SortOption.DISTANCE_ASC
                                    showSortMenu = false
                                }
                            )
                            DropdownMenuItem(
                                text = { Text(LanguageManager.get("sort_distance_desc", language)) },
                                onClick = {
                                    viewModel.sortOption.value = SortOption.DISTANCE_DESC
                                    showSortMenu = false
                                }
                            )
                            DropdownMenuItem(
                                text = { Text(LanguageManager.get("promotions", language)) },
                                onClick = {
                                    viewModel.sortOption.value = SortOption.PROMOTIONS
                                    showSortMenu = false
                                }
                            )
                        }
                    }
                }
            }
        }

        // Product Count Bar
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 8.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "${filteredProducts.size} produit(s) trouvé(s)",
                fontSize = 13.sp,
                fontWeight = FontWeight.SemiBold,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }

        // Product Grid
        if (filteredProducts.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(32.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(
                        imageVector = Icons.Default.Search,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.outline,
                        modifier = Modifier.size(60.dp)
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = "Aucun produit ne correspond à vos critères",
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onBackground
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Essayez de modifier vos filtres ou votre recherche.",
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        } else {
            LazyVerticalGrid(
                columns = GridCells.Fixed(2),
                contentPadding = PaddingValues(start = 14.dp, end = 14.dp, bottom = 80.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier.fillMaxSize()
            ) {
                items(filteredProducts) { item ->
                    ProductCard(
                        item = item,
                        currentLanguage = language,
                        onProductClick = {
                            viewModel.navigateTo(Screen.ProductDetail(item.product.id))
                        },
                        onAddToCartClick = {
                            viewModel.addToCart(item.product.id, item.product.storeId)
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

@Composable
fun FilterTogglePill(
    label: String,
    selected: Boolean,
    onClick: () -> Unit,
    tag: String,
    accentColor: Color? = null
) {
    val bg = if (selected) {
        accentColor ?: MaterialTheme.colorScheme.primary
    } else {
        MaterialTheme.colorScheme.surfaceVariant
    }
    val fg = if (selected) Color.White else MaterialTheme.colorScheme.onSurface

    Surface(
        shape = RoundedCornerShape(12.dp),
        color = bg,
        modifier = Modifier
            .clickable(onClick = onClick)
            .testTag(tag)
    ) {
        Text(
            text = label,
            fontSize = 11.sp,
            fontWeight = if (selected) FontWeight.Bold else FontWeight.Normal,
            color = fg,
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
        )
    }
}
