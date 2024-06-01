package com.vysochyn.rentspace.ui.home

import androidx.fragment.app.Fragment
import androidx.viewpager2.adapter.FragmentStateAdapter

class HomePagerAdapter(fragment: Fragment) : FragmentStateAdapter(fragment) {
    override fun getItemCount(): Int = 2

    override fun createFragment(position: Int): Fragment {
        return when (position) {
            0 -> ClustersListFragment()
            1 -> MapFragment()
            else -> throw IllegalStateException("Invalid position: $position")
        }
    }
}