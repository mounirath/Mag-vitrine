package com.example.ui.screens

import androidx.compose.foundation.background
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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Category
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.LockOpen
import androidx.compose.material.icons.filled.MonetizationOn
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material.icons.filled.Store
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Divider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.ScrollableTabRow
import androidx.compose.material3.Surface
import androidx.compose.material3.Tab
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
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
import com.example.ui.theme.AmberSecondary
import com.example.ui.theme.EmeraldPrimary
import com.example.ui.theme.PromoRed
import com.example.ui.viewmodel.MainViewModel
import com.example.ui.viewmodel.Screen
import com.example.util.LanguageManager
import java.text.NumberFormat
import java.util.Locale

@Composable
fun AdminScreen(
    viewModel: MainViewModel,
    modifier: Modifier = Modifier
) {
    val language by viewModel.language.collectAsState()
    val allStores by viewModel.allStores.collectAsState()
    val allProducts by viewModel.allProductsWithDetails.collectAsState()
    val allOrders by viewModel.allOrders.collectAsState()
    val categories by viewModel.categories.collectAsState()
    val rootCategories by viewModel.rootCategories.collectAsState()

    var selectedTab by remember { mutableIntStateOf(0) }
    var showAddCategoryDialog by remember { mutableStateOf(false) }

    val formatter = remember { NumberFormat.getNumberInstance(Locale.FRANCE) }
    val totalRevenue = remember(allOrders) { allOrders.sumOf { it.order.total } }

    val tabs = listOf(
        "Vue d'ensemble",
        "Magasins (${allStores.size})",
        "Catégories (${categories.size})",
        "Modération Annonces"
    )

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        contentPadding = PaddingValues(bottom = 90.dp)
    ) {
        // Admin Header
        item {
            Surface(
                color = MaterialTheme.colorScheme.surface,
                tonalElevation = 2.dp,
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "👑 " + LanguageManager.get("admin_portal", language),
                        fontSize = 19.sp,
                        fontWeight = FontWeight.Black,
                        color = MaterialTheme.colorScheme.primary
                    )
                    Text(
                        text = "Supervision de la plateforme MAG VITRINE Algérie",
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )

                    Spacer(modifier = Modifier.height(14.dp))

                    ScrollableTabRow(
                        selectedTabIndex = selectedTab,
                        edgePadding = 0.dp,
                        containerColor = Color.Transparent,
                        divider = {}
                    ) {
                        tabs.forEachIndexed { idx, title ->
                            Tab(
                                selected = selectedTab == idx,
                                onClick = { selectedTab = idx },
                                text = {
                                    Text(
                                        text = title,
                                        fontSize = 12.sp,
                                        fontWeight = if (selectedTab == idx) FontWeight.Bold else FontWeight.Normal
                                    )
                                }
                            )
                        }
                    }
                }
            }
        }

        when (selectedTab) {
            0 -> {
                // Overview stats
                item {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text("Chiffres clés de la plateforme", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                        Spacer(modifier = Modifier.height(12.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            StatCard("Total Magasins", "${allStores.size}", Icons.Default.Store, EmeraldPrimary, Modifier.weight(1f))
                            StatCard("Total Produits", "${allProducts.size}", Icons.Default.ShoppingCart, AmberSecondary, Modifier.weight(1f))
                        }
                        Spacer(modifier = Modifier.height(10.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            StatCard("Commandes passées", "${allOrders.size}", Icons.Default.CheckCircle, Color(0xFF3B82F6), Modifier.weight(1f))
                            StatCard("Volume de ventes", "${formatter.format(totalRevenue)} DA", Icons.Default.MonetizationOn, EmeraldPrimary, Modifier.weight(1f))
                        }
                    }
                }
            }

            1 -> {
                // Stores Management
                item {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text("Gestion des Vitrines Magasins", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                        Spacer(modifier = Modifier.height(10.dp))

                        allStores.forEach { st ->
                            Card(
                                shape = RoundedCornerShape(12.dp),
                                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 4.dp)
                            ) {
                                Row(
                                    modifier = Modifier.padding(12.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Column(modifier = Modifier.weight(1f)) {
                                        Text(st.name, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                                        Text("${st.wilaya}, ${st.commune} • Gérant: ${st.managerName}", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                        Text("Tel: ${st.phone} • WhatsApp: ${st.whatsapp}", fontSize = 11.sp, color = EmeraldPrimary)
                                    }

                                    Surface(
                                        color = if (st.status == "active") EmeraldPrimary.copy(alpha = 0.15f) else PromoRed.copy(alpha = 0.15f),
                                        shape = RoundedCornerShape(4.dp)
                                    ) {
                                        Text(
                                            text = if (st.status == "active") "Actif" else "Suspendu",
                                            fontSize = 10.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = if (st.status == "active") EmeraldPrimary else PromoRed,
                                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                        )
                                    }

                                    Spacer(modifier = Modifier.width(6.dp))

                                    IconButton(
                                        onClick = { viewModel.toggleStoreStatus(st.id, st.status) },
                                        modifier = Modifier.size(32.dp)
                                    ) {
                                        Icon(
                                            imageVector = if (st.status == "active") Icons.Default.Lock else Icons.Default.LockOpen,
                                            contentDescription = "Activer / Suspendre",
                                            tint = MaterialTheme.colorScheme.primary,
                                            modifier = Modifier.size(16.dp)
                                        )
                                    }

                                    IconButton(
                                        onClick = { viewModel.deleteStore(st.id) },
                                        modifier = Modifier.size(32.dp)
                                    ) {
                                        Icon(
                                            imageVector = Icons.Default.Delete,
                                            contentDescription = "Supprimer",
                                            tint = PromoRed,
                                            modifier = Modifier.size(16.dp)
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }

            2 -> {
                // Categories Management
                item {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("Catégories de produits", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                            Button(
                                onClick = { showAddCategoryDialog = true },
                                shape = RoundedCornerShape(8.dp)
                            ) {
                                Icon(imageVector = Icons.Default.Add, contentDescription = null, modifier = Modifier.size(14.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("Ajouter catégorie", fontSize = 11.sp)
                            }
                        }

                        Spacer(modifier = Modifier.height(10.dp))

                        rootCategories.forEach { cat ->
                            val subs = categories.filter { it.parentId == cat.id }
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
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Column {
                                            Text("🇫🇷 ${cat.nameFr} | 🇩🇿 ${cat.nameAr} | 🇬🇧 ${cat.nameEn}", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                                            Text("${subs.size} sous-catégories", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                        }

                                        IconButton(onClick = { viewModel.deleteCategory(cat.id) }, modifier = Modifier.size(30.dp)) {
                                            Icon(imageVector = Icons.Default.Delete, contentDescription = null, tint = PromoRed, modifier = Modifier.size(16.dp))
                                        }
                                    }
                                    if (subs.isNotEmpty()) {
                                        Spacer(modifier = Modifier.height(6.dp))
                                        Text(
                                            text = subs.joinToString(", ") { "${it.nameFr} (${it.nameAr})" },
                                            fontSize = 11.sp,
                                            color = MaterialTheme.colorScheme.outline
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }

            3 -> {
                // Products Moderation
                item {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text("Modération des annonces", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                        Spacer(modifier = Modifier.height(10.dp))

                        allProducts.forEach { item ->
                            Card(
                                shape = RoundedCornerShape(12.dp),
                                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 4.dp)
                            ) {
                                Row(
                                    modifier = Modifier.padding(10.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Column(modifier = Modifier.weight(1f)) {
                                        Text(item.product.name, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                                        Text("Magasin : ${item.store?.name ?: "Inconnu"} • ${formatter.format(item.effectivePrice)} DA", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                        Text("Statut: ${item.product.status}", fontSize = 10.sp, color = EmeraldPrimary)
                                    }

                                    IconButton(
                                        onClick = { viewModel.deleteProduct(item.product.id) },
                                        modifier = Modifier.size(32.dp)
                                    ) {
                                        Icon(imageVector = Icons.Default.Delete, contentDescription = "Supprimer annonce", tint = PromoRed, modifier = Modifier.size(16.dp))
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    if (showAddCategoryDialog) {
        var nameFr by remember { mutableStateOf("") }
        var nameAr by remember { mutableStateOf("") }
        var nameEn by remember { mutableStateOf("") }

        AlertDialog(
            onDismissRequest = { showAddCategoryDialog = false },
            title = { Text("Nouvelle Catégorie", fontWeight = FontWeight.Bold) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(
                        value = nameFr,
                        onValueChange = { nameFr = it },
                        label = { Text("Nom en Français") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                    OutlinedTextField(
                        value = nameAr,
                        onValueChange = { nameAr = it },
                        label = { Text("الاسم بالعربية") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                    OutlinedTextField(
                        value = nameEn,
                        onValueChange = { nameEn = it },
                        label = { Text("Name in English") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (nameFr.isNotBlank()) {
                            viewModel.addCategory(nameFr, nameAr.ifBlank { nameFr }, nameEn.ifBlank { nameFr }, "ShoppingBag", null)
                            showAddCategoryDialog = false
                        }
                    }
                ) {
                    Text("Créer")
                }
            },
            dismissButton = {
                TextButton(onClick = { showAddCategoryDialog = false }) {
                    Text("Annuler")
                }
            }
        )
    }
}
