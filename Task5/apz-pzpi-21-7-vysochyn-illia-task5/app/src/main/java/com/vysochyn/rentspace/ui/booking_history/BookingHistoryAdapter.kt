package com.vysochyn.rentspace.ui.booking_history

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.vysochyn.rentspace.R
import com.vysochyn.rentspace.models.Booking
import com.vysochyn.rentspace.models.Cluster
import com.vysochyn.rentspace.network.ApiServiceRequests
import com.vysochyn.rentspace.services.DateService.Companion.formatDateTime

class BookingHistoryAdapter(
    private val bookings: List<Booking>,
    private val apiService: ApiServiceRequests,
    private val token: String,
    private val showBookingDetails: (Booking, Cluster) -> Unit
) : RecyclerView.Adapter<BookingHistoryAdapter.ViewHolder>() {

    inner class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val tvStorageNumber: TextView = itemView.findViewById(R.id.tvStorageNumber)
        val tvRentalTime: TextView = itemView.findViewById(R.id.tvRentalTime)
        val tvClusterName: TextView = itemView.findViewById(R.id.tvClusterName)
        val tvPrice: TextView = itemView.findViewById(R.id.tvPrice)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_booking_history, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val booking = bookings[position]

        holder.tvStorageNumber.text = "Storage Number: ${booking.storageId.number}"
        holder.tvRentalTime.text = "From: ${formatDateTime(booking.rentalTime.from)} \nTo: ${formatDateTime(booking.rentalTime.to)}"
        holder.tvPrice.text ="Paycheck: ${booking.price}"

        apiService.fetchClusterDetails(booking.storageId.clusterId,token) { cluster, error ->
            if (cluster != null) {
                holder.tvClusterName.text = "Cluster Name: \n${cluster.name}"
                holder.itemView.setOnClickListener {
                    showBookingDetails(booking, cluster)
                }
            }
        }
    }

    override fun getItemCount(): Int {
        return bookings.size
    }
}