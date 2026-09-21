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
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.LocalShipping
import androidx.compose.material.icons.filled.Remove
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material.icons.filled.Store
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Divider
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.RadioButton
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
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.ui.theme.EmeraldPrimary
import com.example.ui.theme.PromoRed
import com.example.ui.viewmodel.MainViewModel
import com.example.ui.viewmodel.Screen
import com.example.util.LanguageManager
import java.text.NumberFormat
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CartAndCheckoutScreen(
    viewModel: MainViewModel,
    modifier: Modifier = Modifier
) {
    val language by viewModel.language.collectAsState()
    val cartItems by viewModel.cartItems.collectAsState()
    val formatter = remember { NumberFormat.getNumberInstance(Locale.FRANCE) }

    // Checkout form state
    var customerName by remember { mutableStateOf("Karim Larbi") }
    var customerPhone by remember { mutableStateOf("0555 44 33 22") }
    var selectedWilaya by remember { mutableStateOf(LanguageManager.ALGERIA_WILAYAS[0]) }
    var wilayaExpanded by remember { mutableStateOf(false) }
    var commune by remember { mutableStateOf("Hydra") }
    var address by remember { mutableStateOf("Cité des Pins, Bâtiment B") }
    var deliveryMethod by remember { mutableStateOf("HOME_DELIVERY") }
    var paymentMethod by remember { mutableStateOf("CASH_ON_DELIVERY") }
    var notes by remember { mutableStateOf("") }
    var isCheckingOut by remember { mutableStateOf(false) }

    val itemsByStore = remember(cartItems) {
        cartItems.groupBy { it.store.id }
    }

    if (cartItems.isEmpty()) {
        Box(
            modifier = modifier
                .fillMaxSize()
                .background(MaterialTheme.colorScheme.background)
                .padding(32.dp),
            contentAlignment = Alignment.Center
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Icon(
                    imageVector = Icons.Default.ShoppingCart,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.outline,
                    modifier = Modifier.size(72.dp)
                )
                Spacer(modifier = Modifier.height(14.dp))
                Text(
                    text = "Votre panier est vide",
                    fontSize = 17.sp,
                    fontWeight = FontWeight.Bold
                )
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = "Explorez les vitrines virtuelles pour ajouter des produits.",
                    fontSize = 12.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Spacer(modifier = Modifier.height(16.dp))
                Button(
                    onClick = { viewModel.navigateTo(Screen.Catalog()) },
                    shape = RoundedCornerShape(10.dp)
                ) {
                    Text("Découvrir les produits")
                }
            }
        }
        return
    }

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        contentPadding = PaddingValues(16.dp, 12.dp, 16.dp, 90.dp)
    ) {
        item {
            Text(
                text = "Mon Panier (${cartItems.sumOf { it.cartItem.quantity }} articles)",
                fontSize = 19.sp,
                fontWeight = FontWeight.Black,
                color = MaterialTheme.colorScheme.onBackground
            )
            Spacer(modifier = Modifier.height(12.dp))
        }

        // Cart Items grouped by Store
        itemsByStore.forEach { (storeId, items) ->
            val store = items.first().store
            val subtotal = items.sumOf { it.itemTotal }
            val isFreeDelivery = subtotal >= store.freeDeliveryMinimum
            val deliveryFee = if (deliveryMethod == "STORE_PICKUP") 0.0 else if (isFreeDelivery) 0.0 else store.defaultDeliveryFee
            val total = subtotal + deliveryFee

            item {
                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 14.dp)
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        // Store header
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(imageVector = Icons.Default.Store, contentDescription = null, tint = EmeraldPrimary, modifier = Modifier.size(18.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = store.name,
                                fontWeight = FontWeight.Bold,
                                fontSize = 14.sp,
                                color = EmeraldPrimary
                            )
                        }

                        Spacer(modifier = Modifier.height(10.dp))
                        Divider(color = MaterialTheme.colorScheme.outline.copy(alpha = 0.2f))
                        Spacer(modifier = Modifier.height(10.dp))

                        // Items list for this store
                        items.forEach { cartItem ->
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 6.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(54.dp)
                                        .clip(RoundedCornerShape(8.dp))
                                        .background(MaterialTheme.colorScheme.surfaceVariant)
                                ) {
                                    if (cartItem.primaryImage.isNotBlank()) {
                                        AsyncImage(
                                            model = cartItem.primaryImage,
                                            contentDescription = cartItem.product.name,
                                            contentScale = ContentScale.Crop,
                                            modifier = Modifier.matchParentSize()
                                        )
                                    }
                                }

                                Spacer(modifier = Modifier.width(10.dp))

                                Column(modifier = Modifier.weight(1f)) {
                                    Text(
                                        text = cartItem.product.name,
                                        fontWeight = FontWeight.SemiBold,
                                        fontSize = 13.sp,
                                        maxLines = 1
                                    )
                                    Text(
                                        text = "${formatter.format(cartItem.product.price)} DA",
                                        fontSize = 12.sp,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                }

                                // Quantity Controls
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    IconButton(
                                        onClick = {
                                            viewModel.updateCartQuantity(cartItem.product.id, cartItem.cartItem.quantity - 1)
                                        },
                                        modifier = Modifier.size(28.dp)
                                    ) {
                                        Icon(
                                            imageVector = if (cartItem.cartItem.quantity == 1) Icons.Default.Delete else Icons.Default.Remove,
                                            contentDescription = "Moins",
                                            tint = if (cartItem.cartItem.quantity == 1) PromoRed else MaterialTheme.colorScheme.onSurface
                                        )
                                    }

                                    Text(
                                        text = cartItem.cartItem.quantity.toString(),
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 13.sp,
                                        modifier = Modifier.padding(horizontal = 6.dp)
                                    )

                                    IconButton(
                                        onClick = {
                                            viewModel.updateCartQuantity(cartItem.product.id, cartItem.cartItem.quantity + 1)
                                        },
                                        modifier = Modifier.size(28.dp)
                                    ) {
                                        Icon(
                                            imageVector = Icons.Default.Add,
                                            contentDescription = "Plus",
                                            tint = MaterialTheme.colorScheme.primary
                                        )
                                    }
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(10.dp))
                        Divider(color = MaterialTheme.colorScheme.outline.copy(alpha = 0.2f))
                        Spacer(modifier = Modifier.height(8.dp))

                        // Subtotals
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text("Sous-total :", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            Text("${formatter.format(subtotal)} DA", fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                        }
                        Spacer(modifier = Modifier.height(4.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text("Frais de livraison :", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            if (isFreeDelivery) {
                                Text("GRATUIT (Seuil atteint)", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = EmeraldPrimary)
                            } else {
                                Text("${formatter.format(deliveryFee)} DA", fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                            }
                        }
                        Spacer(modifier = Modifier.height(6.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text("Total pour ce magasin :", fontSize = 14.sp, fontWeight = FontWeight.Bold)
                            Text("${formatter.format(total)} DA", fontSize = 15.sp, fontWeight = FontWeight.Black, color = MaterialTheme.colorScheme.primary)
                        }
                    }
                }
            }
        }

        // Checkout Section Toggle
        item {
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 14.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "Coordonnées de livraison en Algérie",
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Spacer(modifier = Modifier.height(12.dp))

                    OutlinedTextField(
                        value = customerName,
                        onValueChange = { customerName = it },
                        label = { Text("Nom et Prénom") },
                        singleLine = true,
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("input_checkout_name")
                    )
                    Spacer(modifier = Modifier.height(8.dp))

                    OutlinedTextField(
                        value = customerPhone,
                        onValueChange = { customerPhone = it },
                        label = { Text("Numéro de téléphone (ex: 0555 12 34 56)") },
                        singleLine = true,
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("input_checkout_phone")
                    )
                    Spacer(modifier = Modifier.height(8.dp))

                    // Wilaya Dropdown
                    ExposedDropdownMenuBox(
                        expanded = wilayaExpanded,
                        onExpandedChange = { wilayaExpanded = !wilayaExpanded }
                    ) {
                        OutlinedTextField(
                            value = selectedWilaya,
                            onValueChange = {},
                            readOnly = true,
                            label = { Text("Wilaya") },
                            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = wilayaExpanded) },
                            modifier = Modifier
                                .menuAnchor()
                                .fillMaxWidth()
                                .testTag("select_checkout_wilaya")
                        )
                        ExposedDropdownMenu(
                            expanded = wilayaExpanded,
                            onDismissRequest = { wilayaExpanded = false }
                        ) {
                            LanguageManager.ALGERIA_WILAYAS.forEach { wilayaName ->
                                DropdownMenuItem(
                                    text = { Text(wilayaName) },
                                    onClick = {
                                        selectedWilaya = wilayaName
                                        wilayaExpanded = false
                                    }
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    OutlinedTextField(
                        value = commune,
                        onValueChange = { commune = it },
                        label = { Text("Commune") },
                        singleLine = true,
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("input_checkout_commune")
                    )
                    Spacer(modifier = Modifier.height(8.dp))

                    OutlinedTextField(
                        value = address,
                        onValueChange = { address = it },
                        label = { Text("Adresse de livraison détaillée") },
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("input_checkout_address")
                    )

                    Spacer(modifier = Modifier.height(14.dp))
                    Text(
                        text = "Mode de livraison :",
                        fontWeight = FontWeight.Bold,
                        fontSize = 13.sp
                    )
                    Spacer(modifier = Modifier.height(4.dp))

                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { deliveryMethod = "HOME_DELIVERY" },
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        RadioButton(
                            selected = deliveryMethod == "HOME_DELIVERY",
                            onClick = { deliveryMethod = "HOME_DELIVERY" }
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("🚚 Livraison à domicile (24h - 48h)", fontSize = 12.sp)
                    }

                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { deliveryMethod = "STORE_PICKUP" },
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        RadioButton(
                            selected = deliveryMethod == "STORE_PICKUP",
                            onClick = { deliveryMethod = "STORE_PICKUP" }
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("🏪 Retrait au magasin (Gratuit)", fontSize = 12.sp)
                    }

                    Spacer(modifier = Modifier.height(14.dp))
                    Text(
                        text = "Mode de paiement :",
                        fontWeight = FontWeight.Bold,
                        fontSize = 13.sp
                    )
                    Spacer(modifier = Modifier.height(4.dp))

                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { paymentMethod = "CASH_ON_DELIVERY" },
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        RadioButton(
                            selected = paymentMethod == "CASH_ON_DELIVERY",
                            onClick = { paymentMethod = "CASH_ON_DELIVERY" }
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("💵 Paiement à la livraison (En espèces)", fontSize = 12.sp)
                    }

                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { paymentMethod = "STORE_PICKUP" },
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        RadioButton(
                            selected = paymentMethod == "STORE_PICKUP",
                            onClick = { paymentMethod = "STORE_PICKUP" }
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("🏪 Paiement au retrait", fontSize = 12.sp)
                    }

                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { paymentMethod = "ONLINE_PAYMENT" },
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        RadioButton(
                            selected = paymentMethod == "ONLINE_PAYMENT",
                            onClick = { paymentMethod = "ONLINE_PAYMENT" }
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("💳 Paiement en ligne (Edahabia / CIB)", fontSize = 12.sp)
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    OutlinedTextField(
                        value = notes,
                        onValueChange = { notes = it },
                        label = { Text("Instructions spéciales / Remarques") },
                        modifier = Modifier.fillMaxWidth()
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    // Final Order Button
                    Button(
                        onClick = {
                            if (customerName.isBlank() || customerPhone.isBlank()) {
                                viewModel.showSnackbar("Veuillez renseigner votre nom et numéro de téléphone.")
                                return@Button
                            }

                            // Place order for each store present in cart
                            itemsByStore.forEach { (stId, items) ->
                                val st = items.first().store
                                viewModel.placeOrder(
                                    storeId = stId,
                                    storeName = st.name,
                                    customerName = customerName,
                                    customerPhone = customerPhone,
                                    wilaya = selectedWilaya,
                                    commune = commune,
                                    address = address,
                                    deliveryMethod = deliveryMethod,
                                    paymentMethod = paymentMethod,
                                    notes = notes
                                )
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = EmeraldPrimary),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(50.dp)
                            .testTag("btn_confirm_order")
                    ) {
                        Text(
                            text = "Confirmer la commande",
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                    }
                }
            }
        }
    }
}
