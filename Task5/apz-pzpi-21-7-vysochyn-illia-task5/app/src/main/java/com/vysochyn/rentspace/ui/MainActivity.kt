package com.vysochyn.rentspace.ui

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.ActionBarDrawerToggle
import androidx.appcompat.app.AppCompatActivity
import androidx.drawerlayout.widget.DrawerLayout
import androidx.navigation.NavController
import androidx.navigation.fragment.NavHostFragment
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.NavigationUI
import com.google.android.material.navigation.NavigationView
import com.vysochyn.rentspace.R
import com.vysochyn.rentspace.network.ApiServiceRequests
import com.vysochyn.rentspace.ui.home.ClustersListFragment

class MainActivity : AppCompatActivity(), ClustersListFragment.OnClusterSelectedListener {

    private lateinit var drawerLayout: DrawerLayout
    private lateinit var navController: NavController
    private lateinit var navigationView: NavigationView
    private lateinit var appBarConfiguration: AppBarConfiguration
    private lateinit var toolbar: androidx.appcompat.widget.Toolbar
    override fun onClusterSelected() {
        toolbar.visibility = View.GONE
        navigationView.visibility = View.GONE
    }
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        val sharedPreferences = getSharedPreferences("MyAppPreferences", Context.MODE_PRIVATE)
        val token = sharedPreferences.getString("user_token", null).toString()
        drawerLayout = findViewById(R.id.drawer_layout)
        navigationView = findViewById(R.id.nav_view)
        val headerView = navigationView.getHeaderView(0)
        val navHeaderTitle: TextView = headerView.findViewById(R.id.nav_header_title)
        val apiServiceRequests = ApiServiceRequests()
        apiServiceRequests.getUser(token) { user, error ->
            if (user != null) {
                navHeaderTitle.text = user.username
            }
        }
        val navHostFragment =
            supportFragmentManager.findFragmentById(R.id.nav_host_fragment) as NavHostFragment
        navController = navHostFragment.navController

        appBarConfiguration = AppBarConfiguration(
            setOf(
                R.id.nav_home,
                R.id.nav_active,
                R.id.nav_booking,
                R.id.nav_account
            ), drawerLayout
        )
        toolbar = findViewById(R.id.toolbar)
        setSupportActionBar(toolbar)

        val toggle = ActionBarDrawerToggle(
            this, drawerLayout, toolbar,
            R.string.navigation_drawer_open,
            R.string.navigation_drawer_close
        )
        drawerLayout.addDrawerListener(toggle)
        toggle.syncState()
        NavigationUI.setupActionBarWithNavController(this, navController, appBarConfiguration)
        NavigationUI.setupWithNavController(navigationView, navController)

        navigationView.setNavigationItemSelectedListener { menuItem ->
            when (menuItem.itemId) {
                R.id.nav_home -> {
                    navController.navigate(R.id.nav_home)
                }
                R.id.nav_active -> {
                    navController.navigate(R.id.nav_active)
                }
                R.id.nav_booking -> {
                    navController.navigate(R.id.nav_booking)
                }
                R.id.nav_account -> {
                    navController.navigate(R.id.nav_account)
                }
                R.id.nav_logout -> {
                    val sharedPreferences = getSharedPreferences("MyAppPreferences", Context.MODE_PRIVATE)
                    val editor = sharedPreferences.edit()
                    editor.clear()
                    editor.apply()
                    val intent = Intent(this, LoginActivity::class.java)
                    startActivity(intent)
                }
            }
            drawerLayout.closeDrawers()
            true
        }
    }

    override fun onSupportNavigateUp(): Boolean {
        return NavigationUI.navigateUp(navController, appBarConfiguration) || super.onSupportNavigateUp()
    }
    override fun onBackPressed() {
        if (supportFragmentManager.backStackEntryCount > 0) {
            supportFragmentManager.popBackStack()
            toolbar.visibility = View.VISIBLE
            navigationView.visibility = View.VISIBLE
        } else {
            super.onBackPressed()
        }
    }
}