package com.vysochyn.rentspace.models
data class ClustersResponse(
    val availableClusters: List<Cluster>
)

data class NearestClusterResponse(
    val nearestCluster: Cluster
)
data class ClusterResponseR(
    val cluster: Cluster,
    val storages: List<Storage>
)

data class RentRequest(
    val storageId: String,
    val from: String,
    val to: String
)

data class StorageAvailabilityResponse(
    val isBooked: Boolean
)