package com.example.ui.screens

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.Canvas
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
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.LocalShipping
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Navigation
import androidx.compose.material.icons.filled.Store
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
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
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.data.model.StoreEntity
import com.example.ui.theme.AmberSecondary
import com.example.ui.theme.EmeraldPrimary
import com.example.ui.viewmodel.MainViewModel
import com.example.ui.viewmodel.Screen
import com.example.util.DistanceUtil

@Composable
fun StoresMapScreen(
    viewModel: MainViewModel,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val stores by viewModel.activeStores.collectAsState()
    val userLat by viewModel.userLat.collectAsState()
    val userLng by viewModel.userLng.collectAsState()

    var selectedStore by remember(stores) {
        mutableStateOf<StoreEntity?>(stores.firstOrNull())
    }

    Box(
        modifier = modifier
            .fillMaxSize()
            .background(Color(0xFFE2E8F0))
    ) {
        // Map Radar Grid Canvas
        Canvas(modifier = Modifier.fillMaxSize()) {
            val center = Offset(size.width / 2f, size.height * 0.42f)

            // Draw radar rings representing distance (5km, 10km, 20km)
            val radii = listOf(size.width * 0.22f, size.width * 0.40f, size.width * 0.60f)
            for (r in radii) {
                drawCircle(
                    color = Color.White.copy(alpha = 0.6f),
                    radius = r,
                    center = center,
                    style = androidx.compose.ui.graphics.drawscope.Stroke(width = 2.dp.toPx())
                )
            }

            // Draw crosshair axes
            drawLine(
                color = Color.White.copy(alpha = 0.5f),
                start = Offset(center.x, center.y - radii.last()),
                end = Offset(center.x, center.y + radii.last()),
                strokeWidth = 2.dp.toPx()
            )
            drawLine(
                color = Color.White.copy(alpha = 0.5f),
                start = Offset(center.x - radii.last(), center.y),
                end = Offset(center.x + radii.last(), center.y),
                strokeWidth = 2.dp.toPx()
            )

            // User location indicator
            drawCircle(
                color = EmeraldPrimary,
                radius = 12.dp.toPx(),
                center = center
            )
            drawCircle(
                color = Color.White,
                radius = 5.dp.toPx(),
                center = center
            )
        }

        // Top Information Banner
        Surface(
            color = MaterialTheme.colorScheme.surface,
            shape = RoundedCornerShape(12.dp),
            shadowElevation = 3.dp,
            modifier = Modifier
                .align(Alignment.TopCenter)
                .padding(16.dp)
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.padding(horizontal = 14.dp, vertical = 8.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.Navigation,
                    contentDescription = null,
                    tint = EmeraldPrimary,
                    modifier = Modifier.size(16.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "Vitrines géolocalisées en Algérie (${stores.size} magasins)",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurface
                )
            }
        }

        // Horizontal Stores Carousel / Pins Selector
        Column(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .padding(bottom = 80.dp)
        ) {
            // Horizontal list of store chips
            LazyRow(
                contentPadding = PaddingValues(horizontal = 14.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.padding(bottom = 10.dp)
            ) {
                items(stores) { st ->
                    val isSelected = selectedStore?.id == st.id
                    val dist = DistanceUtil.calculateDistanceMeters(userLat, userLng, st.latitude, st.longitude)

                    Surface(
                        shape = RoundedCornerShape(20.dp),
                        color = if (isSelected) EmeraldPrimary else MaterialTheme.colorScheme.surface,
                        shadowElevation = 2.dp,
                        modifier = Modifier
                            .clickable { selectedStore = st }
                            .testTag("pin_store_${st.id}")
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Default.LocationOn,
                                contentDescription = null,
                                tint = if (isSelected) Color.White else EmeraldPrimary,
                                modifier = Modifier.size(14.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = "${st.name} (${DistanceUtil.formatDistance(dist)})",
                                fontSize = 11.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                color = if (isSelected) Color.White else MaterialTheme.colorScheme.onSurface
                            )
                        }
                    }
                }
            }

            // Detailed Card for Selected Store
            if (selectedStore != null) {
                val st = selectedStore!!
                val dist = DistanceUtil.calculateDistanceMeters(userLat, userLng, st.latitude, st.longitude)

                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 14.dp)
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(54.dp)
                                    .clip(RoundedCornerShape(10.dp))
                                    .background(MaterialTheme.colorScheme.surfaceVariant)
                            ) {
                                if (st.logo.isNotBlank()) {
                                    AsyncImage(
                                        model = st.logo,
                                        contentDescription = st.name,
                                        contentScale = ContentScale.Crop,
                                        modifier = Modifier.matchParentSize()
                                    )
                                } else {
                                    Icon(
                                        imageVector = Icons.Default.Store,
                                        contentDescription = null,
                                        tint = EmeraldPrimary,
                                        modifier = Modifier
                                            .align(Alignment.Center)
                                            .size(28.dp)
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.width(12.dp))

                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = st.name,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 15.sp,
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )
                                Text(
                                    text = "${st.address}, ${st.commune} (${st.wilaya})",
                                    fontSize = 11.sp,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )
                                Spacer(modifier = Modifier.height(2.dp))
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Surface(
                                        color = MaterialTheme.colorScheme.primaryContainer,
                                        shape = RoundedCornerShape(4.dp)
                                    ) {
                                        Text(
                                            text = "📍 ${DistanceUtil.formatDistance(dist)}",
                                            fontSize = 10.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = MaterialTheme.colorScheme.onPrimaryContainer,
                                            modifier = Modifier.padding(horizontal = 4.dp, vertical = 1.dp)
                                        )
                                    }
                                    Spacer(modifier = Modifier.width(6.dp))
                                    if (st.deliveryEnabled) {
                                        Text(
                                            text = "🚚 Livraison dispo",
                                            fontSize = 10.sp,
                                            fontWeight = FontWeight.SemiBold,
                                            color = EmeraldPrimary
                                        )
                                    }
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(10.dp))

                        // Action Buttons
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Button(
                                onClick = {
                                    viewModel.navigateTo(Screen.StoreVitrine(st.id))
                                },
                                colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary),
                                shape = RoundedCornerShape(10.dp),
                                modifier = Modifier
                                    .weight(1.2f)
                                    .testTag("btn_map_view_vitrine")
                            ) {
                                Text("Voir la vitrine", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                            }

                            OutlinedButton(
                                onClick = {
                                    val uri = Uri.parse("geo:${st.latitude},${st.longitude}?q=${st.latitude},${st.longitude}(${st.name})")
                                    context.startActivity(Intent(Intent.ACTION_VIEW, uri))
                                },
                                shape = RoundedCornerShape(10.dp),
                                modifier = Modifier.weight(0.9f)
                            ) {
                                Text("Itinéraire", fontSize = 12.sp)
                            }
                        }
                    }
                }
            }
        }
    }
}
