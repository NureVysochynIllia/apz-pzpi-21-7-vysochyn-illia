package com.vysochyn.rentspace.ui.cluster

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.Spinner
import android.widget.TextView
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.RecyclerView
import com.vysochyn.rentspace.R
import com.vysochyn.rentspace.models.Storage

class StorageAdapter(
    private var storages: List<Storage>,
    private val onStorageSelected: (Storage) -> Unit
) : RecyclerView.Adapter<StorageAdapter.StorageViewHolder>() {

    private var selectedPosition = RecyclerView.NO_POSITION

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): StorageViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_storage, parent, false)
        return StorageViewHolder(view, onStorageSelected)
    }
    fun updateData(newStorages: List<Storage>) {
        storages = newStorages
        notifyDataSetChanged()
    }
    override fun onBindViewHolder(holder: StorageViewHolder, position: Int) {
        holder.bind(storages[position], position == selectedPosition)
        holder.itemView.setOnClickListener {
            onStorageSelected(storages[position])
            notifyItemChanged(selectedPosition)
            selectedPosition = holder.adapterPosition
            notifyItemChanged(selectedPosition)
        }
    }

    override fun getItemCount(): Int = storages.size

    class StorageViewHolder(itemView: View, private val onStorageSelected: (Storage) -> Unit) : RecyclerView.ViewHolder(itemView) {
        private val storageNumber: TextView = itemView.findViewById(R.id.tvStorageNumber)
        private val storagePrice: TextView = itemView.findViewById(R.id.tvStoragePrice)
        private val storageIsOpened: TextView = itemView.findViewById(R.id.tvStorageIsOpened)

        fun bind(storage: Storage, isSelected: Boolean) {
            storageNumber.text = storage.number.toString()
            storagePrice.text = storage.price.toString()
            storageIsOpened.text = if (storage.isOpened) "Opened" else "Closed"
            val spinner = itemView.findViewById<Spinner>(R.id.spinnerVolumes)
            val volumes = storage.volumes.map { "${it.height}x${it.width}x${it.length} ${it.unit}" }
            val adapter = ArrayAdapter(itemView.context, android.R.layout.simple_spinner_item, volumes)
            adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
            spinner.adapter = adapter
            itemView.setBackgroundColor(
                if (isSelected) ContextCompat.getColor(itemView.context, R.color.selected_item)
                else ContextCompat.getColor(itemView.context, R.color.default_item)
            )
        }
    }
}
