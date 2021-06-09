package com.example.xbee_simon

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import com.example.xbee_simon.databinding.ActivityMainBinding

private const val TAG = "MainActivity"


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

            binding.yellowBtn.setOnClickListener {
                if(canAddSequence) {
                    tippingSequence++
                    addSequence("Yellow")
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
        }
    }


}