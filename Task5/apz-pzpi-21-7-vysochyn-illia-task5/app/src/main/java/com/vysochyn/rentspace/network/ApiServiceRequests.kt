package com.vysochyn.rentspace.network

import android.util.Log
import com.vysochyn.rentspace.models.Booking
import com.vysochyn.rentspace.models.Cluster
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
import com.vysochyn.rentspace.models.Storage
import com.vysochyn.rentspace.models.StorageAvailabilityResponse
import com.vysochyn.rentspace.models.ToggleStorageRequest
import com.vysochyn.rentspace.models.UserResponse
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.util.Locale

class ApiServiceRequests {

    private val api: ApiService

    init {
        val retrofit = Retrofit.Builder()
            .baseUrl("http://10.0.2.2:5000/") // базова URL адреса
            .addConverterFactory(GsonConverterFactory.create())
            .build()
        api = retrofit.create(ApiService::class.java)
    }

    fun loginUser(username: String, password: String, callback: (String?, String?) -> Unit) {
        val request = LoginRequest(username, password)
        val call = api.loginUser(request)

        call.enqueue(object : Callback<LoginResponse> {
            override fun onResponse(call: Call<LoginResponse>, response: Response<LoginResponse>) {
                if (response.isSuccessful) {
                    val token = response.body()?.accessToken
                    callback(token, null)
                } else {
                    callback(null, "Login failed: ${response.code()}")
                }
            }

            override fun onFailure(call: Call<LoginResponse>, t: Throwable) {
                callback(null, "Login failed: ${t.message}")
            }
        })
    }

    fun registerUser(username: String, password: String, email: String, callback: (Boolean, String?) -> Unit) {
        val request = RegisterRequest(username, password, email)
        val call = api.registerUser(request)

        call.enqueue(object : Callback<RegisterResponse> {
            override fun onResponse(call: Call<RegisterResponse>, response: Response<RegisterResponse>) {
                if (response.isSuccessful) {
                    callback(true, null)
                } else {
                    callback(false, "Registration failed: ${response.code()}")
                }
            }

            override fun onFailure(call: Call<RegisterResponse>, t: Throwable) {
                callback(false, "Registration failed: ${t.message}")
            }
        })
    }

    fun getUser(token: String, callback: (UserResponse?, String?) -> Unit) {
        val call = api.getUser("Bearer $token")

        call.enqueue(object : Callback<UserResponse> {
            override fun onResponse(call: Call<UserResponse>, response: Response<UserResponse>) {
                if (response.isSuccessful) {
                    callback(response.body(), null)
                } else {
                    callback(null, "Failed to get user info: ${response.code()}")
                }
            }

            override fun onFailure(call: Call<UserResponse>, t: Throwable) {
                callback(null, "Failed to get user info: ${t.message}")
            }
        })
    }

    fun replenishBalance(token: String, amount: Int, callback: (Boolean, String?) -> Unit) {
        val request = ReplenishRequest(amount)
        val call = api.replenishBalance("Bearer $token", request)

        call.enqueue(object : Callback<Void> {
            override fun onResponse(call: Call<Void>, response: Response<Void>) {
                if (response.isSuccessful) {
                    callback(true, null)
                } else {
                    callback(false, "Failed to replenish balance: ${response.code()}")
                }
            }

            override fun onFailure(call: Call<Void>, t: Throwable) {
                callback(false, "Failed to replenish balance: ${t.message}")
            }
        })
    }
    fun fetchActiveRentals(token: String, callback: (List<Booking>?, String?) -> Unit) {
        val call = api.getActiveRentals("Bearer $token")

        call.enqueue(object : Callback<RentalsResponse> {
            override fun onResponse(call: Call<RentalsResponse>, response: Response<RentalsResponse>) {
                if (response.isSuccessful) {
                    callback(response.body()?.bookings, null)
                } else {
                    callback(null, "Failed to fetch active rentals: ${response.code()}")
                }
            }

            override fun onFailure(call: Call<RentalsResponse>, t: Throwable) {
                callback(null, "Failed to fetch active rentals: ${t.message}")
            }
        })
    }

    fun fetchClusterDetails(clusterId: String, token: String, callback: (Cluster?, String?) -> Unit) {
        val call = api.getClusterDetails(clusterId, "Bearer $token", Locale.getDefault().language.uppercase())

        call.enqueue(object : Callback<ClusterResponse> {
            override fun onResponse(call: Call<ClusterResponse>, response: Response<ClusterResponse>) {
                if (response.isSuccessful) {
                    callback(response.body()?.cluster, null)
                } else {
                    callback(null, "Failed to fetch cluster details: ${response.code()}")
                }
            }

            override fun onFailure(call: Call<ClusterResponse>, t: Throwable) {
                callback(null, "Failed to fetch cluster details: ${t.message}")
            }
        })
    }
    fun toggleStorageStatus(bookingId: String, token: String, callback: (Boolean, String?) -> Unit) {
        val request = ToggleStorageRequest(bookingId)
        val call = api.toggleStorage("Bearer $token", request)

        call.enqueue(object : Callback<Void> {
            override fun onResponse(call: Call<Void>, response: Response<Void>) {
                if (response.isSuccessful) {
                    callback(true, null)
                } else {
                    callback(false, "Failed to toggle storage status: ${response.code()}")
                }
            }

            override fun onFailure(call: Call<Void>, t: Throwable) {
                callback(false, "Failed to toggle storage status: ${t.message}")
            }
        })
    }
    fun fetchBookingHistory(token: String, callback: (List<Booking>?, String?) -> Unit) {
        val call = api.getBookingHistory("Bearer $token")

        call.enqueue(object : Callback<RentalsResponse> {
            override fun onResponse(call: Call<RentalsResponse>, response: Response<RentalsResponse>) {
                if (response.isSuccessful) {
                    callback(response.body()?.bookings, null)
                } else {
                    callback(null, "Failed to get booking history: ${response.code()}")
                }
            }

            override fun onFailure(call: Call<RentalsResponse>, t: Throwable) {
                callback(null, "Failed to get booking history: ${t.message}")
            }
        })
    }
    fun fetchClusters(token: String, callback: (List<Cluster>?, String?) -> Unit) {
        api.getClusters("Bearer $token").enqueue(object : Callback<ClustersResponse> {
            override fun onResponse(call: Call<ClustersResponse>, response: Response<ClustersResponse>) {
                if (response.isSuccessful) {
                    callback(response.body()?.availableClusters, null)
                } else {
                    callback(null, response.message())
                }
            }

            override fun onFailure(call: Call<ClustersResponse>, t: Throwable) {
                callback(null, t.message)
            }
        })
    }

    fun fetchNearestCluster(token: String, latitude: Double, longitude: Double, callback: (Cluster?, String?) -> Unit) {
        api.getNearestCluster("Bearer $token", latitude, longitude).enqueue(object : Callback<NearestClusterResponse> {
            override fun onResponse(call: Call<NearestClusterResponse>, response: Response<NearestClusterResponse>) {
                if (response.isSuccessful) {
                    callback(response.body()?.nearestCluster, null)
                } else {
                    callback(null, response.message())
                }
            }

            override fun onFailure(call: Call<NearestClusterResponse>, t: Throwable) {
                callback(null, t.message)
            }
        })
    }
    fun fetchClusterInfo(token: String, clusterId: String, callback: (Cluster?, List<Storage>?, String?) -> Unit) {
        val call = api.fetchClusterInfo(clusterId, "Bearer $token", Locale.getDefault().language.uppercase())

        call.enqueue(object : Callback<ClusterResponseR> {
            override fun onResponse(call: Call<ClusterResponseR>, response: Response<ClusterResponseR>) {
                if (response.isSuccessful) {
                    val cluster = response.body()?.cluster
                    val storages = response.body()?.storages
                    callback(cluster, storages, null)
                } else {
                    callback(null, null, "Error: ${response.code()}")
                }
            }

            override fun onFailure(call: Call<ClusterResponseR>, t: Throwable) {
                callback(null, null, "Error: ${t.message}")
            }
        })
    }

    fun rentStorage(token: String, storageId: String, from: String, to: String, callback: (Boolean, String?) -> Unit) {
        val request = RentRequest(storageId, from, to)
        val call = api.rentStorage("Bearer $token", request)
        Log.d("request",request.toString())
        call.enqueue(object : Callback<Void> {
            override fun onResponse(call: Call<Void>, response: Response<Void>) {
                if (response.isSuccessful) {
                    callback(true, null)
                } else {
                    callback(false, "Error: ${response.code()}")
                }
            }

            override fun onFailure(call: Call<Void>, t: Throwable) {
                callback(false, "Error: ${t.message}")
            }
        })
    }

    fun checkStorageAvailability(token: String, storageId: String, callback: (Boolean, String?) -> Unit) {
        val call = api.checkStorageAvailability(storageId, "Bearer $token")

        call.enqueue(object : Callback<StorageAvailabilityResponse> {
            override fun onResponse(call: Call<StorageAvailabilityResponse>, response: Response<StorageAvailabilityResponse>) {
                if (response.isSuccessful) {
                    val isBooked = response.body()?.isBooked ?: false
                    callback(isBooked, null)
                } else {
                    callback(false, "Error: ${response.code()}")
                }
            }

            override fun onFailure(call: Call<StorageAvailabilityResponse>, t: Throwable) {
                callback(false, "Error: ${t.message}")
            }
        })
    }
}