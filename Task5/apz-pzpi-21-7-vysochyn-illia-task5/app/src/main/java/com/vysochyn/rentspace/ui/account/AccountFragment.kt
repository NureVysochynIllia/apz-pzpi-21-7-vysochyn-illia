package com.vysochyn.rentspace.ui.account

import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import com.vysochyn.rentspace.R
import com.vysochyn.rentspace.network.ApiServiceRequests

class AccountFragment : Fragment() {

    private lateinit var apiServiceRequests: ApiServiceRequests
    private lateinit var token: String
    private lateinit var tvUsername: TextView
    private lateinit var tvEmail: TextView
    private lateinit var tvBalance: TextView
    private lateinit var etAmount: EditText
    private lateinit var btnReplenish: Button

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_account, container, false)

        apiServiceRequests = ApiServiceRequests()

        tvUsername = view.findViewById(R.id.tvUsername)
        tvEmail = view.findViewById(R.id.tvEmail)
        tvBalance = view.findViewById(R.id.tvBalance)
        etAmount = view.findViewById(R.id.etAmount)
        btnReplenish = view.findViewById(R.id.btnReplenish)

        val sharedPreferences = requireActivity().getSharedPreferences("MyAppPreferences", Context.MODE_PRIVATE)
        token = sharedPreferences.getString("user_token", null).toString()

        getUserInfo()

        btnReplenish.setOnClickListener {
            val amount = etAmount.text.toString().toIntOrNull()
            if (amount != null) {
                replenishBalance(amount)
            } else {
                Toast.makeText(context, "Please enter a valid amount", Toast.LENGTH_SHORT).show()
            }
        }

        return view
    }

    private fun getUserInfo() {
        apiServiceRequests.getUser(token) { user, error ->
            if (user != null) {
                tvUsername.text = "Username: "+ user.username
                tvEmail.text = "User email: "+ user.email
                tvBalance.text = "Balance amount: "+ user.balance.toString()
            } else {
                Toast.makeText(context, error, Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun replenishBalance(amount: Int) {
        apiServiceRequests.replenishBalance(token, amount) { success, error ->
            if (success) {
                Toast.makeText(context, "Balance replenished successfully", Toast.LENGTH_SHORT).show()
                getUserInfo()
            } else {
                Toast.makeText(context, error, Toast.LENGTH_SHORT).show()
            }
        }
    }
}