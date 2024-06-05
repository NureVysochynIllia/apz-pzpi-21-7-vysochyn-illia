package com.vysochyn.rentspace.ui.home

import android.graphics.Color
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.vysochyn.rentspace.R
import com.vysochyn.rentspace.models.Cluster
class ClustersAdapter(
    private val clusters: MutableList<Cluster>,
    private val onClusterClick: (Cluster) -> Unit
) : RecyclerView.Adapter<ClustersAdapter.ClusterViewHolder>() {

    private var selectedPosition = RecyclerView.NO_POSITION

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ClusterViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_cluster, parent, false)
        return ClusterViewHolder(view)
    }

    override fun onBindViewHolder(holder: ClusterViewHolder, position: Int) {
        holder.bind(clusters[position])
        holder.itemView.setBackgroundColor(
            if (position == selectedPosition) Color.LTGRAY else Color.TRANSPARENT
        )

        holder.itemView.setOnClickListener {
            notifyItemChanged(selectedPosition)
            selectedPosition = position
            notifyItemChanged(selectedPosition)
            onClusterClick(clusters[position])
        }
    }

    override fun getItemCount(): Int = clusters.size

    class ClusterViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val clusterName: TextView = itemView.findViewById(R.id.tvClusterName)
        private val clusterCity: TextView = itemView.findViewById(R.id.tvClusterCity)
        private val clusterType: TextView = itemView.findViewById(R.id.tvClusterType)

        fun bind(cluster: Cluster) {
            clusterName.text = cluster.name
            clusterCity.text = cluster.city
            clusterType.text = cluster.type
        }
    }

    fun updateData(newClusters: MutableList<Cluster>) {
        clusters.clear()
        clusters.addAll(newClusters)
        notifyDataSetChanged()
    }
}