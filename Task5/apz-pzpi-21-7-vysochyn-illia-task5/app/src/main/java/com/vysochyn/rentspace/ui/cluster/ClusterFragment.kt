package com.vysochyn.rentspace.ui.cluster

import android.app.DatePickerDialog
import android.app.TimePickerDialog
import android.content.Context
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.MotionEvent
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import android.widget.Toolbar
import androidx.drawerlayout.widget.DrawerLayout
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.navigation.NavigationView
import com.vysochyn.rentspace.R
import com.vysochyn.rentspace.network.ApiService
import com.vysochyn.rentspace.network.ApiServiceRequests
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.Calendar

class ClusterFragment : Fragment() {

    private lateinit var clusterId: String
    private lateinit var token: String
    private lateinit var apiService: ApiServiceRequests
    private lateinit var storageAdapter: StorageAdapter
    private var selectedStorageId: String? = null
    private lateinit var startDate: String
    private lateinit var endDate: String

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_cluster, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        clusterId = arguments?.getString(ARG_CLUSTER_ID) ?: ""
        val sharedPreferences = requireActivity().getSharedPreferences("MyAppPreferences", Context.MODE_PRIVATE)
        token = sharedPreferences.getString("user_token", null).toString()

        this.apiService = ApiServiceRequests()

        setupRecyclerView(view)
        fetchClusterInfo()

        val btnRentStorage: Button = view.findViewById(R.id.btnRentStorage)
        btnRentStorage.setOnClickListener {
            startDate = view.findViewById<EditText>(R.id.etStartDate).text.toString()
            endDate = view.findViewById<EditText>(R.id.etEndDate).text.toString()
            rentStorage()
        }

        val etStartDate: EditText = view.findViewById(R.id.etStartDate)
        val etEndDate: EditText = view.findViewById(R.id.etEndDate)
        val onTouchListener = View.OnTouchListener { view, event ->
            if (event.action == MotionEvent.ACTION_UP) {
                view.performClick()
                when (view.id) {
                    R.id.etStartDate -> showDateTimePickerDialog(etStartDate)
                    R.id.etEndDate -> showDateTimePickerDialog(etEndDate)
                }
            }
            true
        }
        etStartDate.setOnTouchListener(onTouchListener)
        etEndDate.setOnTouchListener(onTouchListener)
    }

    private fun setupRecyclerView(view: View) {
        storageAdapter = StorageAdapter(emptyList()) { storage ->
            selectedStorageId = storage._id
        }
        val recyclerView = view.findViewById<RecyclerView>(R.id.recycler_view_storages)
        recyclerView.adapter = storageAdapter
        recyclerView.layoutManager = LinearLayoutManager(context)
    }

    private fun fetchClusterInfo() {
        apiService.fetchClusterInfo(token, clusterId) { cluster, storages, error ->
            if (cluster != null && storages != null) {
                view?.findViewById<TextView>(R.id.tvClusterName)?.text = cluster.name
                view?.findViewById<TextView>(R.id.tvClusterCity)?.text = cluster.city
                view?.findViewById<TextView>(R.id.tvClusterType)?.text = cluster.type
                view?.findViewById<TextView>(R.id.tvClusterWorkTime)?.text = "${cluster.workTime.from} - ${cluster.workTime.to}"
                storageAdapter.updateData(storages)
            } else {
                if (error != null) {
                    Log.e("ClusterFragment", error)
                }
                Toast.makeText(context, "Error: $error", Toast.LENGTH_LONG).show()
            }
        }
    }

    private fun rentStorage() {
        if (selectedStorageId == null) {
            Toast.makeText(context, "Storage ID is not selected.", Toast.LENGTH_LONG).show()
            return
        }
        apiService.checkStorageAvailability(token, selectedStorageId!!) { isBooked, error ->
            if (!isBooked) {
                apiService.rentStorage(token, selectedStorageId!!, startDate, endDate) { success, error ->
                    if (success) {
                        Toast.makeText(context, "Storage rented successfully!", Toast.LENGTH_LONG).show()
                    } else {
                        Toast.makeText(context, "Error: $error", Toast.LENGTH_LONG).show()
                    }
                }
            } else {
                Toast.makeText(context, "Storage is already booked.", Toast.LENGTH_LONG).show()
            }
        }
    }

    private fun showDateTimePickerDialog(editText: EditText) {
        val calendar = Calendar.getInstance()
        val year = calendar.get(Calendar.YEAR)
        val month = calendar.get(Calendar.MONTH)
        val day = calendar.get(Calendar.DAY_OF_MONTH)
        val hour = calendar.get(Calendar.HOUR_OF_DAY)
        val minute = calendar.get(Calendar.MINUTE)

        DatePickerDialog(requireContext(), { _, selectedYear, selectedMonth, selectedDay ->
            TimePickerDialog(requireContext(), { _, selectedHour, selectedMinute ->
                val selectedDateTime = "$selectedYear-${selectedMonth + 1}-$selectedDay $selectedHour:$selectedMinute"
                editText.setText(selectedDateTime)
            }, hour, minute, true).show()
        }, year, month, day).show()
    }

    companion object {
        private const val ARG_CLUSTER_ID = "cluster_id"
        private const val ARG_TOKEN = "token"

        @JvmStatic
        fun newInstance(clusterId: String, token: String) =
            ClusterFragment().apply {
                arguments = Bundle().apply {
                    putString(ARG_CLUSTER_ID, clusterId)
                    putString(ARG_TOKEN, token)
                }
            }
    }
}