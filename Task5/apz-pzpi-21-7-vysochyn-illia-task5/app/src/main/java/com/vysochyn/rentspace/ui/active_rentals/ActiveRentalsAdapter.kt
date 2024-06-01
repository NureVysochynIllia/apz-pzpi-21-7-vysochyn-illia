package com.vysochyn.rentspace.ui.active_rentals

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.recyclerview.widget.RecyclerView
import com.vysochyn.rentspace.R
import com.vysochyn.rentspace.models.Booking
import com.vysochyn.rentspace.network.ApiServiceRequests
import com.vysochyn.rentspace.services.DateService.Companion.formatDateTime

class ActiveRentalsAdapter(
    private val bookings: List<Booking>,
    private val onItemClick: (Booking) -> Unit,
    private val apiServiceRequests: ApiServiceRequests,
    private val token: String
) : RecyclerView.Adapter<ActiveRentalsAdapter.ViewHolder>() {

    inner class ViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val tvStorageNumber: TextView = itemView.findViewById(R.id.tvStorageNumber)
        val tvRentalTime: TextView = itemView.findViewById(R.id.tvRentalTime)
        val tvClusterName: TextView = itemView.findViewById(R.id.tvClusterName)
        val btnToggleStorage: Button = itemView.findViewById(R.id.btnToggleStorage)

        fun bind(booking: Booking) {
            tvStorageNumber.text = "Storage Number: ${booking.storageId.number}"
            tvRentalTime.text = "From: ${formatDateTime(booking.rentalTime.from)} \nTo: ${formatDateTime(booking.rentalTime.to)}"
            fetchClusterName(booking.storageId.clusterId)
            itemView.setOnClickListener {
                onItemClick(booking)
            }
            btnToggleStorage.setText(if (booking.storageId.isOpened)  R.string.close_storage else R.string.open_storage)

            btnToggleStorage.setOnClickListener {
                toggleStorage(booking._id)
            }
        }

        private fun fetchClusterName(clusterId: String) {
            apiServiceRequests.fetchClusterDetails(clusterId, token) { cluster, _ ->
                if (cluster != null) {
                    tvClusterName.text = "Cluster Name: \n${cluster.name}"
                } else {
                    tvClusterName.text = "Cluster Name: \nN/A"
                }
            }
        }
        private fun toggleStorage(bookingId: String) {
            apiServiceRequests.toggleStorageStatus(bookingId, token) { success, error ->
                if (success) {
                    Toast.makeText(itemView.context, "Storage status toggled successfully", Toast.LENGTH_SHORT).show()
                    btnToggleStorage.text = if (btnToggleStorage.text =="Open Storage") "Close Storage" else "Open Storage"
                } else {
                    error?.let {
                        Toast.makeText(itemView.context, it, Toast.LENGTH_SHORT).show()
                    }
                }
            }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_active_rental, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.bind(bookings[position])
    }

    override fun getItemCount(): Int = bookings.size
}