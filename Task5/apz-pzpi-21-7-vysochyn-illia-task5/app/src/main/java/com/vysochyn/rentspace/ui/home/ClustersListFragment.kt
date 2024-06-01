package com.vysochyn.rentspace.ui.home

import android.content.Context
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.EditText
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.vysochyn.rentspace.R
import com.vysochyn.rentspace.models.Cluster
import com.vysochyn.rentspace.network.ApiServiceRequests
import com.vysochyn.rentspace.ui.cluster.ClusterFragment

class ClustersListFragment : Fragment() {

    private lateinit var apiService: ApiServiceRequests
    private lateinit var token: String
    private lateinit var adapter: ClustersAdapter
    private val clusters = mutableListOf<Cluster>()
    private var listener: OnClusterSelectedListener? = null

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_clusters_list, container, false)
    }

    override fun onAttach(context: Context) {
        super.onAttach(context)
        if (context is OnClusterSelectedListener) {
            listener = context
        } else {
            throw RuntimeException("$context must implement OnClusterSelectedListener")
        }
    }

    override fun onDetach() {
        super.onDetach()
        listener = null
    }
    interface OnClusterSelectedListener {
        fun onClusterSelected(){

        }
    }
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        apiService = ApiServiceRequests()
        val sharedPreferences = requireActivity().getSharedPreferences("MyAppPreferences", Context.MODE_PRIVATE)
        token = sharedPreferences.getString("user_token", null).toString()

        val rvClusters: RecyclerView = view.findViewById(R.id.rvClusters)
        adapter = ClustersAdapter(clusters) { cluster ->
            val clusterFragment = ClusterFragment.newInstance(cluster._id, token)
            requireActivity().supportFragmentManager.beginTransaction()
                .replace(R.id.nav_host_fragment, clusterFragment)
                .addToBackStack(null)
                .commit()
            listener?.onClusterSelected()
        }
        rvClusters.layoutManager = LinearLayoutManager(context)
        rvClusters.adapter = adapter

        fetchClusters()

        val etSearchCity: EditText = view.findViewById(R.id.etSearchCity)
        etSearchCity.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}

            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                filterClusters(s.toString())
            }

            override fun afterTextChanged(s: Editable?) {}
        })
    }

    private fun fetchClusters() {
        apiService.fetchClusters(token) { fetchedClusters, error ->
            if (fetchedClusters != null) {
                clusters.clear()
                clusters.addAll(fetchedClusters)
                adapter.notifyDataSetChanged()
            } else {
                Toast.makeText(context, error, Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun filterClusters(city: String) {
        val filtered = clusters.filter { it.city.contains(city, true) }
        adapter.updateData(filtered)
    }
}