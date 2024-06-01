package com.vysochyn.rentspace.ui.booking_history

import android.app.AlertDialog
import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.widget.Button
import android.widget.Spinner
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.vysochyn.rentspace.R
import com.vysochyn.rentspace.models.Booking
import com.vysochyn.rentspace.models.Cluster
import com.vysochyn.rentspace.network.ApiServiceRequests
import com.vysochyn.rentspace.services.DateService.Companion.formatDateTime

class BookingHistoryFragment : Fragment() {

    private lateinit var apiService: ApiServiceRequests
    private lateinit var token: String
    private lateinit var adapter: BookingHistoryAdapter
    private val bookings = mutableListOf<Booking>()

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_booking_history, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        apiService = ApiServiceRequests()
        val sharedPreferences = requireActivity().getSharedPreferences("MyAppPreferences", Context.MODE_PRIVATE)
        token = sharedPreferences.getString("user_token", null).toString()

        val rvBookingHistory: RecyclerView = view.findViewById(R.id.rvBookingHistory)
        adapter = BookingHistoryAdapter(bookings, apiService, token) { booking, cluster ->
            showBookingDetails(booking, cluster)
        }
        rvBookingHistory.layoutManager = LinearLayoutManager(context)
        rvBookingHistory.adapter = adapter

        val spinnerSortOptions: Spinner = view.findViewById(R.id.spinnerSortOptions)
        ArrayAdapter.createFromResource(
            requireContext(),
            R.array.sort_options,
            android.R.layout.simple_spinner_item
        ).also { adapter ->
            adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
            spinnerSortOptions.adapter = adapter
        }

        spinnerSortOptions.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(parent: AdapterView<*>, view: View?, position: Int, id: Long) {
                when (position) {
                    0 -> sortBookingsByDate()
                    1 -> sortBookingsByPrice()
                    2 -> sortBookingsByCluster()
                    3 -> sortBookingsByStorage()
                }
                adapter.notifyDataSetChanged()
            }

            override fun onNothingSelected(parent: AdapterView<*>) {}
        }

        fetchBookingHistory()
    }

    private fun sortBookingsByCluster() {
        bookings.sortBy { it.storageId.clusterId }
    }

    private fun sortBookingsByStorage() {
        bookings.sortBy { it.storageId._id }
    }

    private fun fetchBookingHistory() {
        apiService.fetchBookingHistory(token) { fetchedBookings, error ->
            if (fetchedBookings != null) {
                bookings.clear()
                bookings.addAll(fetchedBookings)
                sortBookingsByDate()
                adapter.notifyDataSetChanged()
            } else {
                Toast.makeText(context, error, Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun sortBookingsByDate() {
        bookings.sortByDescending { it.rentalTime.from }
    }

    private fun sortBookingsByPrice() {
        bookings.sortByDescending { it.price }
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