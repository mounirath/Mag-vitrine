package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.unit.LayoutDirection
import com.example.data.model.AppLanguage
import com.example.data.model.UserRole
import com.example.ui.components.AppBottomNav
import com.example.ui.components.AppHeader
import com.example.ui.screens.AdminScreen
import com.example.ui.screens.AuthScreen
import com.example.ui.screens.CameraAiSearchScreen
import com.example.ui.screens.CartAndCheckoutScreen
import com.example.ui.screens.CatalogScreen
import com.example.ui.screens.HomeScreen
import com.example.ui.screens.OrderTrackingScreen
import com.example.ui.screens.ProductDetailScreen
import com.example.ui.screens.StoreDashboardScreen
import com.example.ui.screens.StoreVitrineScreen
import com.example.ui.screens.StoresMapScreen
import com.example.ui.theme.MyApplicationTheme
import com.example.ui.viewmodel.MainViewModel
import com.example.ui.viewmodel.Screen

class MainActivity : ComponentActivity() {

    private val viewModel: MainViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            MyApplicationTheme {
                MagVitrineApp(viewModel = viewModel)
            }
        }
    }
}

@Composable
fun MagVitrineApp(viewModel: MainViewModel) {
    val language by viewModel.language.collectAsState()
    val currentScreen by viewModel.currentScreen.collectAsState()
    val cartCount by viewModel.cartCount.collectAsState()
    val userRole by viewModel.userRole.collectAsState()
    val snackbarMessage by viewModel.snackbarMessage.collectAsState()

    val snackbarHostState = remember { SnackbarHostState() }

    // Show snackbar notifications
    LaunchedEffect(snackbarMessage) {
        snackbarMessage?.let { msg ->
            snackbarHostState.showSnackbar(msg)
            viewModel.clearSnackbar()
        }
    }

    // Handle Android system back button
    BackHandler(enabled = currentScreen !is Screen.Home) {
        viewModel.navigateBack()
    }

    // Dynamic RTL/LTR Layout Direction based on selected language (Arabic = RTL)
    val layoutDirection = if (language.isRtl) {
        LayoutDirection.Rtl
    } else {
        LayoutDirection.Ltr
    }

    CompositionLocalProvider(LocalLayoutDirection provides layoutDirection) {
        Scaffold(
            snackbarHost = { SnackbarHost(snackbarHostState) },
            topBar = {
                AppHeader(
                    currentLanguage = language,
                    onLanguageSelected = { viewModel.setLanguage(it) },
                    userRole = userRole,
                    onRoleSelected = { viewModel.setUserRole(it) },
                    cartItemCount = cartCount,
                    onCartClicked = { viewModel.navigateTo(Screen.Cart) },
                    onBackClicked = if (currentScreen !is Screen.Home) {
                        { viewModel.navigateBack() }
                    } else null
                )
            },
            bottomBar = {
                AppBottomNav(
                    currentScreen = currentScreen,
                    onNavigate = { viewModel.navigateTo(it) },
                    cartCount = cartCount,
                    userRole = userRole,
                    currentLanguage = language
                )
            },
            modifier = Modifier.fillMaxSize()
        ) { innerPadding ->
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(innerPadding)
                    .background(MaterialTheme.colorScheme.background)
            ) {
                AnimatedContent(
                    targetState = currentScreen,
                    transitionSpec = { fadeIn() togetherWith fadeOut() },
                    label = "screen_transition"
                ) { target ->
                    when (target) {
                        is Screen.Home -> HomeScreen(viewModel = viewModel)
                        is Screen.Catalog -> CatalogScreen(viewModel = viewModel)
                        is Screen.ProductDetail -> ProductDetailScreen(productId = target.productId, viewModel = viewModel)
                        is Screen.StoreVitrine -> StoreVitrineScreen(storeId = target.storeId, viewModel = viewModel)
                        is Screen.CameraAiSearch -> CameraAiSearchScreen(viewModel = viewModel)
                        is Screen.MapView -> StoresMapScreen(viewModel = viewModel)
                        is Screen.Cart -> CartAndCheckoutScreen(viewModel = viewModel)
                        is Screen.OrderTracking -> OrderTrackingScreen(orderId = target.orderId, viewModel = viewModel)
                        is Screen.StoreDashboard -> StoreDashboardScreen(viewModel = viewModel)
                        is Screen.AdminPanel -> AdminScreen(viewModel = viewModel)
                    }
                }
            }
        }
    }
}
