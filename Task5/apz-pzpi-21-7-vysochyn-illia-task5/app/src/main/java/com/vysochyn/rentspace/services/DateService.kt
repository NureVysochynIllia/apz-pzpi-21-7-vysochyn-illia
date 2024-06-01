package com.vysochyn.rentspace.services

import java.text.SimpleDateFormat
import java.util.Locale
import java.util.TimeZone

class DateService {
    companion object {
        fun formatDateTime(dateTime: String): String? {
            val isoFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault())
            isoFormat.timeZone = TimeZone.getTimeZone("UTC")
            val date = isoFormat.parse(dateTime)

            val desiredFormat = SimpleDateFormat("dd MMM yyyy, HH:mm", Locale.getDefault())
            return date?.let { desiredFormat.format(it) }
        }
    }
}