package com.example.util

import kotlin.math.atan2
import kotlin.math.cos
import kotlin.math.sin
import kotlin.math.sqrt

object DistanceUtil {

    // Default user coordinates (e.g. Algiers Center: Didouche Mourad / Grande Poste)
    const val DEFAULT_USER_LAT = 36.7755
    const val DEFAULT_USER_LNG = 3.0598

    fun calculateDistanceMeters(
        lat1: Double,
        lon1: Double,
        lat2: Double,
        lon2: Double
    ): Double {
        val earthRadius = 6371000.0 // meters
        val dLat = Math.toRadians(lat2 - lat1)
        val dLon = Math.toRadians(lon2 - lon1)
        val a = sin(dLat / 2) * sin(dLat / 2) +
                cos(Math.toRadians(lat1)) * cos(Math.toRadians(lat2)) *
                sin(dLon / 2) * sin(dLon / 2)
        val c = 2 * atan2(sqrt(a), sqrt(1 - a))
        return earthRadius * c
    }

    fun formatDistance(distanceMeters: Double): String {
        return if (distanceMeters < 1000) {
            "${distanceMeters.toInt()} m"
        } else {
            String.format("%.1f km", distanceMeters / 1000)
        }
    }
}
