package com.vysochyn.rentspace.models

data class ClusterResponse(val cluster: Cluster)

data class Cluster(
    val location: Location,
    val workTime: WorkTime,
    val _id: String,
    val name: String,
    val city: String,
    val type: String,
    val __v: Int
)

data class Location(val type: String, val coordinates: List<Double>)

data class WorkTime(val from: String, val to: String)