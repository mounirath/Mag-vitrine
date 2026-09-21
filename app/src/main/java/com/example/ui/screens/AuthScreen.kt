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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Phone
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
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.RadioButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Tab
import androidx.compose.material3.TabRow
import androidx.compose.material3.Text
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
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.UserRole
import com.example.ui.theme.EmeraldPrimary
import com.example.ui.viewmodel.MainViewModel
import com.example.ui.viewmodel.Screen
import com.example.util.LanguageManager

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AuthScreen(
    viewModel: MainViewModel,
    modifier: Modifier = Modifier
) {
    val language by viewModel.language.collectAsState()
    val userRole by viewModel.userRole.collectAsState()

    var selectedMode by remember { mutableIntStateOf(0) } // 0: Connexion, 1: Inscription Commerçant (Créer ma vitrine)

    var email by remember { mutableStateOf("boutique.alger@magvitrine.dz") }
    var password by remember { mutableStateOf("••••••••") }

    // Merchant registration fields
    var storeName by remember { mutableStateOf("") }
    var managerName by remember { mutableStateOf("") }
    var phone by remember { mutableStateOf("") }
    var whatsapp by remember { mutableStateOf("") }
    var selectedWilaya by remember { mutableStateOf(LanguageManager.ALGERIA_WILAYAS[0]) }
    var commune by remember { mutableStateOf("") }
    var wilayaExpanded by remember { mutableStateOf(false) }

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        contentPadding = PaddingValues(16.dp, 20.dp, 16.dp, 90.dp)
    ) {
        item {
            Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.fillMaxWidth()) {
                Surface(
                    color = EmeraldPrimary,
                    shape = RoundedCornerShape(14.dp),
                    modifier = Modifier.size(54.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Icon(
                            imageVector = Icons.Default.Store,
                            contentDescription = null,
                            tint = Color.White,
                            modifier = Modifier.size(32.dp)
                        )
                    }
                }
                Spacer(modifier = Modifier.height(10.dp))
                Text(
                    text = "MAG VITRINE",
                    fontWeight = FontWeight.Black,
                    fontSize = 22.sp,
                    color = MaterialTheme.colorScheme.primary
                )
                Text(
                    text = LanguageManager.get("hero_subtitle", language),
                    fontSize = 12.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            Spacer(modifier = Modifier.height(20.dp))
        }

        // Tabs Connexion / Inscription Commerçant
        item {
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    TabRow(
                        selectedTabIndex = selectedMode,
                        containerColor = Color.Transparent
                    ) {
                        Tab(
                            selected = selectedMode == 0,
                            onClick = { selectedMode = 0 },
                            text = { Text("Se connecter", fontSize = 13.sp, fontWeight = FontWeight.Bold) }
                        )
                        Tab(
                            selected = selectedMode == 1,
                            onClick = { selectedMode = 1 },
                            text = { Text("Créer ma vitrine", fontSize = 13.sp, fontWeight = FontWeight.Bold) }
                        )
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    if (selectedMode == 0) {
                        // Connexion
                        OutlinedTextField(
                            value = email,
                            onValueChange = { email = it },
                            label = { Text("Email ou téléphone") },
                            leadingIcon = { Icon(imageVector = Icons.Default.Email, contentDescription = null) },
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth()
                        )
                        Spacer(modifier = Modifier.height(10.dp))
                        OutlinedTextField(
                            value = password,
                            onValueChange = { password = it },
                            label = { Text("Mot de passe") },
                            leadingIcon = { Icon(imageVector = Icons.Default.Lock, contentDescription = null) },
                            visualTransformation = PasswordVisualTransformation(),
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth()
                        )

                        Spacer(modifier = Modifier.height(16.dp))

                        Button(
                            onClick = {
                                viewModel.loginAsMerchant()
                                viewModel.navigateTo(Screen.StoreDashboard)
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = EmeraldPrimary),
                            shape = RoundedCornerShape(10.dp),
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(46.dp)
                                .testTag("btn_login_submit")
                        ) {
                            Text("Connexion Commerçant", fontWeight = FontWeight.Bold)
                        }

                        Spacer(modifier = Modifier.height(12.dp))

                        // Fast Role Switchers for testing
                        Divider(color = MaterialTheme.colorScheme.outline.copy(alpha = 0.2f))
                        Spacer(modifier = Modifier.height(10.dp))
                        Text(
                            text = "Accès rapide démonstration :",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Spacer(modifier = Modifier.height(6.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            OutlinedButton(
                                onClick = {
                                    viewModel.loginAsMerchant()
                                    viewModel.navigateTo(Screen.StoreDashboard)
                                },
                                shape = RoundedCornerShape(8.dp),
                                modifier = Modifier.weight(1f)
                            ) {
                                Text("Commerçant", fontSize = 11.sp)
                            }
                            OutlinedButton(
                                onClick = {
                                    viewModel.loginAsCustomer()
                                    viewModel.navigateTo(Screen.Home)
                                },
                                shape = RoundedCornerShape(8.dp),
                                modifier = Modifier.weight(1f)
                            ) {
                                Text("Client", fontSize = 11.sp)
                            }
                            OutlinedButton(
                                onClick = {
                                    viewModel.loginAsAdmin()
                                    viewModel.navigateTo(Screen.AdminPanel)
                                },
                                shape = RoundedCornerShape(8.dp),
                                modifier = Modifier.weight(1f)
                            ) {
                                Text("Admin", fontSize = 11.sp)
                            }
                        }
                    } else {
                        // Inscription Commerçant - Créer ma vitrine
                        Text(
                            text = "Rejoignez MAG VITRINE et ouvrez votre vitrine virtuelle dès aujourd'hui (Jusqu'à 50 annonces gratuites) !",
                            fontSize = 12.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Spacer(modifier = Modifier.height(12.dp))

                        OutlinedTextField(
                            value = storeName,
                            onValueChange = { storeName = it },
                            label = { Text("Nom du magasin / boutique*") },
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth()
                        )
                        Spacer(modifier = Modifier.height(8.dp))

                        OutlinedTextField(
                            value = managerName,
                            onValueChange = { managerName = it },
                            label = { Text("Nom et prénom du gérant*") },
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth()
                        )
                        Spacer(modifier = Modifier.height(8.dp))

                        OutlinedTextField(
                            value = phone,
                            onValueChange = { phone = it },
                            label = { Text("Téléphone d'appels (ex: 0555 12 34 56)*") },
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth()
                        )
                        Spacer(modifier = Modifier.height(8.dp))

                        OutlinedTextField(
                            value = whatsapp,
                            onValueChange = { whatsapp = it },
                            label = { Text("Numéro WhatsApp commercial*") },
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth()
                        )
                        Spacer(modifier = Modifier.height(8.dp))

                        // Wilaya Selector
                        ExposedDropdownMenuBox(
                            expanded = wilayaExpanded,
                            onExpandedChange = { wilayaExpanded = !wilayaExpanded }
                        ) {
                            OutlinedTextField(
                                value = selectedWilaya,
                                onValueChange = {},
                                readOnly = true,
                                label = { Text("Wilaya d'implantation*") },
                                trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = wilayaExpanded) },
                                modifier = Modifier
                                    .menuAnchor()
                                    .fillMaxWidth()
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
                            label = { Text("Commune*") },
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth()
                        )

                        Spacer(modifier = Modifier.height(16.dp))

                        Button(
                            onClick = {
                                if (storeName.isBlank() || phone.isBlank()) {
                                    viewModel.showSnackbar("Veuillez renseigner le nom du magasin et le téléphone.")
                                    return@Button
                                }
                                viewModel.loginAsMerchant()
                                viewModel.showSnackbar("Vitrine virtuelle créée avec succès !")
                                viewModel.navigateTo(Screen.StoreDashboard)
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = EmeraldPrimary),
                            shape = RoundedCornerShape(10.dp),
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(46.dp)
                                .testTag("btn_register_store_submit")
                        ) {
                            Text("Activer ma vitrine virtuelle", fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }
    }
}
