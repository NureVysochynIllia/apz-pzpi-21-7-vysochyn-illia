package com.vysochyn.rentspace.ui.home

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.graphics.Color
import android.location.Location
import android.location.LocationListener
import android.location.LocationManager
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import android.widget.Toast
import androidx.core.app.ActivityCompat
import androidx.fragment.app.Fragment
import com.android.volley.Request
import com.android.volley.Response
import com.android.volley.toolbox.StringRequest
import com.android.volley.toolbox.Volley
import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.GoogleMap
import com.google.android.gms.maps.OnMapReadyCallback
import com.google.android.gms.maps.SupportMapFragment
import com.google.android.gms.maps.model.LatLng
import com.google.android.gms.maps.model.Marker
import com.google.android.gms.maps.model.MarkerOptions
import com.google.android.gms.maps.model.PolylineOptions
import com.google.maps.android.PolyUtil
import com.vysochyn.rentspace.R
import com.vysochyn.rentspace.network.ApiServiceRequests
import com.vysochyn.rentspace.ui.MainActivity
import com.vysochyn.rentspace.ui.cluster.ClusterFragment
import org.json.JSONObject

class MapFragment : Fragment(), OnMapReadyCallback, GoogleMap.OnMarkerClickListener {

    private lateinit var mMap: GoogleMap
    private lateinit var apiService: ApiServiceRequests
    private lateinit var token: String

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_map, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val mapFragment = childFragmentManager.findFragmentById(R.id.map) as SupportMapFragment
        mapFragment.getMapAsync(this)

        apiService = ApiServiceRequests()
        val sharedPreferences = requireActivity().getSharedPreferences("MyAppPreferences", Context.MODE_PRIVATE)
        token = sharedPreferences.getString("user_token", null).toString()
    }

    override fun onMapReady(googleMap: GoogleMap) {
        mMap = googleMap
        mMap.setOnMarkerClickListener(this)
        fetchNearestCluster()
    }

    override fun onMarkerClick(marker: Marker): Boolean {
        val clusterId = marker.tag as? String ?: return false
        (activity as? MainActivity)?.onClusterSelected()
        val clusterFragment = ClusterFragment.newInstance(clusterId, token)
        requireActivity().supportFragmentManager.beginTransaction()
            .replace(R.id.nav_host_fragment, clusterFragment)
            .addToBackStack(null)
            .commit()
        return true
    }

    private fun fetchNearestCluster() {
        val locationManager = requireActivity().getSystemService(Context.LOCATION_SERVICE) as LocationManager
        val locationListener = object : LocationListener {
            override fun onLocationChanged(location: Location) {
                apiService.fetchNearestCluster(token, location.latitude, location.longitude) { cluster, error ->
                    if (cluster != null) {
                        val clusterLocation = LatLng(cluster.location.coordinates[0], cluster.location.coordinates[1])
                        val marker = mMap.addMarker(MarkerOptions().position(clusterLocation).title(cluster.name))
                        marker?.tag = cluster._id
                        mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(clusterLocation, 15f))
                        val tvClusterName: TextView = view?.findViewById(R.id.tvClusterName) ?: return@fetchNearestCluster
                        tvClusterName.text = cluster.name
                        drawRoute(location.latitude, location.longitude, clusterLocation.latitude, clusterLocation.longitude)
                    } else {
                        Toast.makeText(context, error, Toast.LENGTH_SHORT).show()
                    }
                }
                locationManager.removeUpdates(this)
            }

            override fun onStatusChanged(provider: String?, status: Int, extras: Bundle?) {}
            override fun onProviderEnabled(provider: String) {}
            override fun onProviderDisabled(provider: String) {}
        }

        if (ActivityCompat.checkSelfPermission(requireContext(), Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(requireActivity(), arrayOf(Manifest.permission.ACCESS_FINE_LOCATION), 1)
            return
        }

        locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 0L, 0f, locationListener)
    }

    private fun drawRoute(startLat: Double, startLng: Double, endLat: Double, endLng: Double) {
        val url = getDirectionsUrl(startLat, startLng, endLat, endLng)
        val directionsRequest = object : StringRequest(Request.Method.GET, url, Response.Listener<String> { response ->
            val jsonResponse = JSONObject(response)
            val routes = jsonResponse.getJSONArray("routes")
            val points = ArrayList<LatLng>()
            val polylineOptions = PolylineOptions()

            for (i in 0 until routes.length()) {
                val legs = routes.getJSONObject(i).getJSONArray("legs")
                for (j in 0 until legs.length()) {
                    val steps = legs.getJSONObject(j).getJSONArray("steps")
                    for (k in 0 until steps.length()) {
                        val polyline = steps.getJSONObject(k).getJSONObject("polyline").getString("points")
                        points.addAll(PolyUtil.decode(polyline))
                    }
                }
            }

            polylineOptions.addAll(points)
            polylineOptions.width(10f)
            polylineOptions.color(Color.BLUE)
            polylineOptions.geodesic(true)
            mMap.addPolyline(polylineOptions)
        }, Response.ErrorListener {
                error -> error.printStackTrace()
        }) {}

        val requestQueue = Volley.newRequestQueue(requireContext())
        requestQueue.add(directionsRequest)
    }

    private fun getDirectionsUrl(startLat: Double, startLng: Double, endLat: Double, endLng: Double): String {
        val origin = "origin=$startLat,$startLng"
        val dest = "destination=$endLat,$endLng"
        val key = "key=AIzaSyC2gGuKQI1HfzjShUNbilsaYO2zY313cwg"
        val params = "$origin&$dest&$key"
        return "https://maps.googleapis.com/maps/api/directions/json?$params"
    }
}