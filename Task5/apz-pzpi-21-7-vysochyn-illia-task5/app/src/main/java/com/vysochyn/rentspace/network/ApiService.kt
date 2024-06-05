package com.vysochyn.rentspace.network

import com.vysochyn.rentspace.models.ClusterResponse
import com.vysochyn.rentspace.models.ClusterResponseR
import com.vysochyn.rentspace.models.ClustersResponse
import com.vysochyn.rentspace.models.LoginRequest
import com.vysochyn.rentspace.models.LoginResponse
import com.vysochyn.rentspace.models.NearestClusterResponse
import com.vysochyn.rentspace.models.RegisterRequest
import com.vysochyn.rentspace.models.RegisterResponse
import com.vysochyn.rentspace.models.RentRequest
import com.vysochyn.rentspace.models.RentalsResponse
import com.vysochyn.rentspace.models.ReplenishRequest
import com.vysochyn.rentspace.models.StorageAvailabilityResponse
import com.vysochyn.rentspace.models.ToggleStorageRequest
import com.vysochyn.rentspace.models.UserResponse
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.POST
import retrofit2.http.GET
import retrofit2.http.PATCH
import retrofit2.http.Header
import retrofit2.http.Path
import retrofit2.http.Query

interface ApiService {

    @POST("user/login/")
    fun loginUser(@Body request: LoginRequest): Call<LoginResponse>

    @POST("user/reg/")
    fun registerUser(@Body request: RegisterRequest): Call<RegisterResponse>
    @GET("user/")
    fun getUser(@Header("Authorization") token: String): Call<UserResponse>

    @PATCH("user/replenish/")
    fun replenishBalance(@Header("Authorization") token: String, @Body request: ReplenishRequest): Call<Void>

    @GET("rent/active/")
    fun getActiveRentals(@Header("Authorization") token: String): Call<RentalsResponse>

    @GET("rent/all/")
    fun getBookingHistory(@Header("Authorization") token: String): Call<RentalsResponse>

    @GET("clusters/{id}/")
    fun getClusterDetails(@Path("id") clusterId: String, @Header("Authorization") token: String,@Header("lang") lang: String): Call<ClusterResponse>

    @PATCH("rent/open/")
    fun toggleStorage(@Header("Authorization") token: String, @Body request: ToggleStorageRequest): Call<Void>

    @GET("rent/")
    fun getClusters(@Header("Authorization") token: String,@Header("lang") lang: String): Call<ClustersResponse>

    @GET("rent/nearest/")
    fun getNearestCluster(@Header("Authorization") token: String, @Query("latitude") latitude: Double, @Query("longitude") longitude: Double): Call<NearestClusterResponse>

    @GET("clusters/{id}/")
    fun fetchClusterInfo(@Path("id") clusterId: String, @Header("Authorization") token: String, @Header("lang") lang: String): Call<ClusterResponseR>

    @POST("rent/new/")
    fun rentStorage(@Header("Authorization") token: String, @Body request: RentRequest): Call<Void>

    @GET("rent/{id}/")
    fun checkStorageAvailability(@Path("id") storageId: String, @Header("Authorization") token: String): Call<StorageAvailabilityResponse>

}