package com.example.xbee_simon

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import com.example.xbee_simon.databinding.ActivityMainBinding

private const val TAG = "MainActivity"


class MainActivity : AppCompatActivity() {

    private lateinit var binding : ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        Log.i("message", binding.SequenceTxt.text.toString())
        binding.yellowBtn.setOnClickListener{
            addSequece("Yellow")
        }
        binding.greenBtn.setOnClickListener{
            addSequece("Green")
        }

        binding.redBtn.setOnClickListener{
            addSequece("Red")
        }


    }

    private fun addSequece(s: String) {

        Log.i("message", s)

        binding.SequenceTxt.text = binding.SequenceTxt.text.toString() + s + ","
    }


}