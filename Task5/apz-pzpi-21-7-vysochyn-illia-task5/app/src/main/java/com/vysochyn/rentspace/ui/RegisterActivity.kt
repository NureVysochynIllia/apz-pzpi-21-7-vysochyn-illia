package com.vysochyn.rentspace.ui

import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.vysochyn.rentspace.R
import com.vysochyn.rentspace.network.ApiServiceRequests

class RegisterActivity : AppCompatActivity() {

    private lateinit var etRegisterUsername: EditText
    private lateinit var etRegisterPassword: EditText
    private lateinit var etRegisterEmail: EditText
    private lateinit var btnRegister: Button
    private val apiServiceRequests = ApiServiceRequests()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register)

        etRegisterUsername = findViewById(R.id.etRegisterUsername)
        etRegisterPassword = findViewById(R.id.etRegisterPassword)
        etRegisterEmail = findViewById(R.id.etRegisterEmail)
        btnRegister = findViewById(R.id.btnRegister)

        btnRegister.setOnClickListener {
            val username = etRegisterUsername.text.toString()
            val password = etRegisterPassword.text.toString()
            val email = etRegisterEmail.text.toString()

            apiServiceRequests.registerUser(username, password, email) { success, error ->
                runOnUiThread {
                    if (success) {
                        Toast.makeText(this, "Registration successful", Toast.LENGTH_SHORT).show()
                        finish()
                    } else {
                        println(error)
                        Toast.makeText(this, error ?: "Registration failed", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        }
    }
}