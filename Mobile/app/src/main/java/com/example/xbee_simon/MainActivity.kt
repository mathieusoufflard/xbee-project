package com.example.xbee_simon

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import com.example.xbee_simon.databinding.ActivityMainBinding
import com.google.firebase.analytics.FirebaseAnalytics
import com.google.firebase.database.DatabaseReference
import com.google.firebase.database.IgnoreExtraProperties
import com.google.firebase.database.ktx.database
import com.google.firebase.ktx.Firebase
import java.util.*


class MainActivity : AppCompatActivity() {

    private lateinit var binding : ActivityMainBinding
    private var nbSequence = 4
    private var tippingSequence = 0
    private var canAddSequence = true
    private var sequence = ""
    private lateinit var database: DatabaseReference



    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

            binding.sequenceSizeTxt.text = binding.sequenceSizeTxt.text.toString() + nbSequence
            database = Firebase.database.reference


        binding.blueBtn.setOnClickListener {
                if(canAddSequence) {
                    tippingSequence++
                    addSequence("blue")
                }
            }
            binding.greenBtn.setOnClickListener {
                if(canAddSequence) {
                    tippingSequence++
                    addSequence("Green")
                }
            }

            binding.redBtn.setOnClickListener {
                if(canAddSequence) {
                    tippingSequence++
                    addSequence("Red")
                }
            }
    }

    private fun addSequence(s: String) {

        sequence = sequence + s + ","
        if(tippingSequence == nbSequence) {
            canAddSequence = false;
            Log.i("sequence", sequence)

            writeSequence(java.util.Calendar.getInstance().time, sequence)
        }
    }

    private fun writeSequence(date: Date, sequence: String) {

        Log.i("datatest", sequence)
        Log.i("datatest", "coucou")

        val data = DataSequence(date, sequence)

        try {
            database.child("sequence").child("1").setValue(data)
            Log.i("trydata", "on est la")
       }
        catch (ex: Exception){
            Log.i("catch", ex.toString())
        }
    }
}

@IgnoreExtraProperties
data class DataSequence(val date: Date? = null, val sequence: String? = null) {
    // Null default values create a no-argument default constructor, which is needed
    // for deserialization from a DataSnapshot.
}
