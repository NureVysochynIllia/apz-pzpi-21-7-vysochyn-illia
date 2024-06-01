package com.vysochyn.rentspace.ui.active_rentals

import android.app.AlertDialog
import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.vysochyn.rentspace.R
import com.vysochyn.rentspace.models.Booking
import com.vysochyn.rentspace.models.Cluster
import com.vysochyn.rentspace.network.ApiServiceRequests
import com.vysochyn.rentspace.services.DateService.Companion.formatDateTime

class ActiveRentalsFragment : Fragment() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var adapter: ActiveRentalsAdapter
    private val bookings = mutableListOf<Booking>()
    private lateinit var apiServiceRequests: ApiServiceRequests
    private lateinit var token: String

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_active_rentals, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val sharedPreferences = requireActivity().getSharedPreferences("MyAppPreferences", Context.MODE_PRIVATE)
        token = sharedPreferences.getString("user_token", null).toString()
        apiServiceRequests = ApiServiceRequests()

        recyclerView = view.findViewById(R.id.recyclerViewActiveRentals)
        adapter = ActiveRentalsAdapter(bookings, { booking ->
            fetchClusterDetails(booking.storageId.clusterId) { cluster ->
                showBookingDetails(booking, cluster)
            }
        }, apiServiceRequests, token)
        recyclerView.layoutManager = LinearLayoutManager(context)
        recyclerView.adapter = adapter
        fetchActiveRentals()
    }

    private fun fetchActiveRentals() {
        apiServiceRequests.fetchActiveRentals(token) { bookingsList, error ->
            if (bookingsList != null) {
                bookings.clear()
                bookings.addAll(bookingsList)
                adapter.notifyDataSetChanged()
            } else {
                error?.let {
                    Toast.makeText(context, it, Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    private fun fetchClusterDetails(clusterId: String, callback: (Cluster) -> Unit) {
        apiServiceRequests.fetchClusterDetails(clusterId, token) { cluster, error ->
            if (cluster != null) {
                callback(cluster)
            } else {
                error?.let {
                    Toast.makeText(context, it, Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    private fun showBookingDetails(booking: Booking, cluster: Cluster) {
        val details = """
            Storage Number: ${booking.storageId.number}
            From: ${formatDateTime(booking.rentalTime.from)}
            To: ${formatDateTime(booking.rentalTime.to)}
            Price: ${booking.price}
            Cluster: ${cluster.name}
            City: ${cluster.city}
            Type: ${cluster.type}
            Location: ${cluster.location.coordinates.joinToString(", ")}
            Work Time: ${cluster.workTime.from} - ${cluster.workTime.to}
        """.trimIndent()
        AlertDialog.Builder(requireContext())
            .setTitle("Booking Details")
            .setMessage(details)
            .setPositiveButton("OK", null)
            .show()
    }
}