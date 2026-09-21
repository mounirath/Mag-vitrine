package com.example.ui.screens

import android.content.Intent
import android.net.Uri
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
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.LocalShipping
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Store
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Divider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.ui.theme.EmeraldPrimary
import com.example.ui.theme.PromoRed
import com.example.ui.viewmodel.MainViewModel
import com.example.ui.viewmodel.Screen
import java.text.NumberFormat
import java.util.Locale

@Composable
fun OrderTrackingScreen(
    orderId: String?,
    viewModel: MainViewModel,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val allOrders by viewModel.allOrders.collectAsState()
    val allStores by viewModel.allStores.collectAsState()
    val formatter = remember { NumberFormat.getNumberInstance(Locale.FRANCE) }

    val orderItem = remember(allOrders, orderId) {
        if (orderId != null) {
            allOrders.firstOrNull { it.order.id == orderId }
        } else {
            allOrders.firstOrNull()
        }
    }

    if (orderItem == null) {
        Box(
            modifier = modifier
                .fillMaxSize()
                .background(MaterialTheme.colorScheme.background)
                .padding(32.dp),
            contentAlignment = Alignment.Center
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Icon(
                    imageVector = Icons.Default.LocalShipping,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.outline,
                    modifier = Modifier.size(64.dp)
                )
                Spacer(modifier = Modifier.height(12.dp))
                Text(
                    text = "Aucune commande en cours",
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp
                )
                Spacer(modifier = Modifier.height(12.dp))
                Button(onClick = { viewModel.navigateTo(Screen.Home) }) {
                    Text("Retour à l'accueil")
                }
            }
        }
        return
    }

    val order = orderItem.order
    val items = orderItem.items
    val store = allStores.firstOrNull { it.id == order.storeId }

    val steps = listOf(
        Pair("NEW", "Commande reçue"),
        Pair("CONFIRMED", "Confirmée par le magasin"),
        Pair("PREPARING", "En préparation"),
        Pair("READY", "Prête au magasin"),
        Pair("SHIPPING", "En cours de livraison"),
        Pair("DELIVERED", "Livrée avec succès")
    )

    val currentStepIndex = when (order.status) {
        "NEW" -> 0
        "CONFIRMED" -> 1
        "PREPARING" -> 2
        "READY" -> 3
        "SHIPPING" -> 4
        "DELIVERED" -> 5
        "CANCELLED" -> -1
        else -> 0
    }

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        contentPadding = PaddingValues(16.dp, 12.dp, 16.dp, 90.dp)
    ) {
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "Suivi de Commande",
                        fontSize = 19.sp,
                        fontWeight = FontWeight.Black,
                        color = MaterialTheme.colorScheme.onBackground
                    )
                    Text(
                        text = "N° ${order.id}",
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.primary,
                        fontWeight = FontWeight.Bold
                    )
                }

                Surface(
                    color = if (order.status == "CANCELLED") PromoRed.copy(alpha = 0.15f) else EmeraldPrimary.copy(alpha = 0.15f),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Text(
                        text = if (order.status == "CANCELLED") "Annulée" else steps.getOrNull(currentStepIndex)?.second ?: order.status,
                        color = if (order.status == "CANCELLED") PromoRed else EmeraldPrimary,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))
        }

        // Timeline Card
        item {
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "Statut en temps réel",
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp
                    )
                    Spacer(modifier = Modifier.height(14.dp))

                    steps.forEachIndexed { index, (code, title) ->
                        val isDone = index <= currentStepIndex
                        val isCurrent = index == currentStepIndex

                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            // Indicator circle
                            Box(
                                modifier = Modifier
                                    .size(24.dp)
                                    .clip(CircleShape)
                                    .background(
                                        if (isDone) EmeraldPrimary else MaterialTheme.colorScheme.surfaceVariant
                                    ),
                                contentAlignment = Alignment.Center
                            ) {
                                if (isDone) {
                                    Icon(
                                        imageVector = Icons.Default.Check,
                                        contentDescription = null,
                                        tint = Color.White,
                                        modifier = Modifier.size(14.dp)
                                    )
                                } else {
                                    Box(
                                        modifier = Modifier
                                            .size(8.dp)
                                            .clip(CircleShape)
                                            .background(MaterialTheme.colorScheme.outline)
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.width(12.dp))

                            Text(
                                text = title,
                                fontSize = 13.sp,
                                fontWeight = if (isCurrent) FontWeight.Bold else if (isDone) FontWeight.Medium else FontWeight.Normal,
                                color = if (isCurrent) EmeraldPrimary else if (isDone) MaterialTheme.colorScheme.onSurface else MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }

                        if (index < steps.size - 1) {
                            Box(
                                modifier = Modifier
                                    .padding(start = 11.dp)
                                    .width(2.dp)
                                    .height(18.dp)
                                    .background(if (index < currentStepIndex) EmeraldPrimary else MaterialTheme.colorScheme.outline.copy(alpha = 0.3f))
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))
        }

        // Store & Delivery Details Card
        item {
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "Détails de la livraison",
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp
                    )
                    Spacer(modifier = Modifier.height(10.dp))

                    Text(text = "Destinataire : ${order.customerName}", fontSize = 12.sp)
                    Text(text = "Téléphone : ${order.customerPhone}", fontSize = 12.sp)
                    Text(text = "Adresse : ${order.address}, ${order.commune} (${order.wilaya})", fontSize = 12.sp)
                    Text(text = "Mode : ${if (order.deliveryMethod == "HOME_DELIVERY") "Livraison à domicile" else "Retrait en magasin"}", fontSize = 12.sp)
                    Text(text = "Paiement : ${if (order.paymentMethod == "CASH_ON_DELIVERY") "Paiement à la livraison" else "En magasin"}", fontSize = 12.sp)

                    Spacer(modifier = Modifier.height(12.dp))
                    Divider(color = MaterialTheme.colorScheme.outline.copy(alpha = 0.2f))
                    Spacer(modifier = Modifier.height(10.dp))

                    Text(
                        text = "Magasin : ${order.storeName}",
                        fontWeight = FontWeight.Bold,
                        fontSize = 13.sp,
                        color = MaterialTheme.colorScheme.primary
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        if (store != null) {
                            Button(
                                onClick = {
                                    val msg = "Bonjour ${store.name}, je vous contacte concernant ma commande ${order.id}."
                                    val url = "https://api.whatsapp.com/send?phone=${store.whatsapp}&text=${Uri.encode(msg)}"
                                    context.startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
                                },
                                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF25D366)),
                                shape = RoundedCornerShape(8.dp),
                                modifier = Modifier.weight(1f)
                            ) {
                                Text("WhatsApp Magasin", fontSize = 11.sp, color = Color.White)
                            }

                            OutlinedButton(
                                onClick = {
                                    context.startActivity(Intent(Intent.ACTION_DIAL, Uri.parse("tel:${store.phone}")))
                                },
                                shape = RoundedCornerShape(8.dp),
                                modifier = Modifier.weight(1f)
                            ) {
                                Text("Appeler", fontSize = 11.sp)
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))
        }

        // Ordered Items List
        item {
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "Articles commandés (${items.size})",
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp
                    )
                    Spacer(modifier = Modifier.height(10.dp))

                    items.forEach { itm ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 4.dp),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(itm.productName, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                                Text("Qté: ${itm.quantity} × ${formatter.format(itm.unitPrice)} DA", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            }
                            Text("${formatter.format(itm.total)} DA", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))
                    Divider(color = MaterialTheme.colorScheme.outline.copy(alpha = 0.2f))
                    Spacer(modifier = Modifier.height(10.dp))

                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("Sous-total :", fontSize = 12.sp)
                        Text("${formatter.format(order.subtotal)} DA", fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                    }
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("Livraison :", fontSize = 12.sp)
                        Text("${formatter.format(order.deliveryFee)} DA", fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                    }
                    Spacer(modifier = Modifier.height(4.dp))
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text("Total payé :", fontSize = 15.sp, fontWeight = FontWeight.Black)
                        Text("${formatter.format(order.total)} DA", fontSize = 16.sp, fontWeight = FontWeight.Black, color = MaterialTheme.colorScheme.primary)
                    }
                }
            }
        }
    }
}
