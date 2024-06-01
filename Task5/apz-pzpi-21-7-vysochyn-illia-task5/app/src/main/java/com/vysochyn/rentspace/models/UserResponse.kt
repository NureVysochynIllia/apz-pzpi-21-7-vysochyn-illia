package com.vysochyn.rentspace.models

data class UserResponse(
    val username: String,
    val role: String,
    val email: String,
    val balance: Int
)
