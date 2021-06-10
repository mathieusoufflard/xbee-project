package com.example.xbee_simon

import android.os.Bundle
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import com.example.xbee_simon.databinding.ActivityMainBinding
import com.google.firebase.database.DatabaseReference
import com.google.firebase.database.FirebaseDatabase
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

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.sequenceSizeTxt.text = binding.sequenceSizeTxt.text.toString() + nbSequence

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

            writeSequence(java.util.Calendar.getInstance().time, sequence)
        }
    }

    private fun writeSequence(date: Date, sequence: String) {

        var database = FirebaseDatabase.getInstance()



        val myRef = database.getReference("sequence").keepSynced(true)

        val dataSequence = DataSequence(date, sequence)
        database.child("sequence").child("0").setValue(myRef)

        Log.i("toto", sequence)
    }
}

@IgnoreExtraProperties
data class DataSequence(val date: Date? = null, val sequence: String? = null) {
    // Null default values create a no-argument default constructor, which is needed
    // for deserialization from a DataSnapshot.
}

