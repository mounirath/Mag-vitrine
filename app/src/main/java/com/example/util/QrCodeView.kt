package com.example.util

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import kotlin.random.Random

@Composable
fun QrCodeView(
    content: String,
    modifier: Modifier = Modifier,
    size: Dp = 180.dp,
    qrColor: Color = Color(0xFF0F172A),
    backgroundColor: Color = Color.White
) {
    val matrixSize = 25
    val grid = remember(content) {
        val random = Random(content.hashCode())
        Array(matrixSize) { r ->
            BooleanArray(matrixSize) { c ->
                // Corner finder patterns (7x7)
                val inTopLeft = r < 7 && c < 7
                val inTopRight = r < 7 && c >= matrixSize - 7
                val inBottomLeft = r >= matrixSize - 7 && c < 7

                when {
                    inTopLeft -> isFinderModule(r, c, 0, 0)
                    inTopRight -> isFinderModule(r, c, 0, matrixSize - 7)
                    inBottomLeft -> isFinderModule(r, c, matrixSize - 7, 0)
                    r == 6 || c == 6 -> (r + c) % 2 == 0 // Timing pattern
                    else -> random.nextBoolean()
                }
            }
        }
    }

    Box(
        modifier = modifier
            .size(size)
            .clip(RoundedCornerShape(12.dp))
            .background(backgroundColor)
            .padding(12.dp),
        contentAlignment = Alignment.Center
    ) {
        Canvas(modifier = Modifier.size(size - 24.dp)) {
            val cellSize = this.size.width / matrixSize
            for (r in 0 until matrixSize) {
                for (c in 0 until matrixSize) {
                    if (grid[r][c]) {
                        drawRect(
                            color = qrColor,
                            topLeft = Offset(c * cellSize, r * cellSize),
                            size = Size(cellSize, cellSize)
                        )
                    }
                }
            }
        }
    }
}

private fun isFinderModule(r: Int, c: Int, top: Int, left: Int): Boolean {
    val relR = r - top
    val relC = c - left
    if (relR in 0..6 && relC in 0..6) {
        if (relR == 0 || relR == 6 || relC == 0 || relC == 6) return true
        if (relR in 2..4 && relC in 2..4) return true
    }
    return false
}
