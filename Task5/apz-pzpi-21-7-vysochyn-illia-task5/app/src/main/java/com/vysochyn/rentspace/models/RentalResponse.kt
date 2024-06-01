package com.vysochyn.rentspace.models


data class RentalsResponse(val bookings: List<Booking>)
data class Volume(
    val height: Number,
    val width: Number,
    val length: Number,
    val unit: String
)

data class Booking(
    val rentalTime: RentalTime,
    val _id: String,
    val price: Int,
    val storageId: Storage,
    val userId: String,
    val __v: Int,
)

data class RentalTime(val from: String, val to: String)

data class Storage(
    val _id: String,
    val number: String,
    val isOpened: Boolean,
    val price: Int,
    val clusterId: String,
    val __v: Int,
    val volumes: List<Volume>
)

