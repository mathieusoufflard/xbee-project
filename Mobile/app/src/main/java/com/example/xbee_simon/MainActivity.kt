package com.example.xbee_simon

import android.os.Bundle
import android.util.Log
import android.widget.LinearLayout
import android.widget.PopupWindow
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.xbee_simon.databinding.ActivityMainBinding
import com.google.firebase.database.DatabaseReference
import com.google.firebase.database.FirebaseDatabase
import com.google.firebase.database.IgnoreExtraProperties
import com.google.firebase.database.ktx.database
import com.google.firebase.firestore.ktx.firestore
import com.google.firebase.ktx.Firebase
import java.util.*


class MainActivity : AppCompatActivity() {

    private lateinit var binding : ActivityMainBinding
    private var nbSequence = 2
    private var tippingSequence = 0
    private var canAddSequence = true
    private var sequence = ""
    private var database = Firebase.firestore

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.sequenceSizeTxt.text = "Taille de la séquence : " + nbSequence

        binding.blueBtn.setOnClickListener {
                if(canAddSequence) {
                    tippingSequence++
                    addSequence("blue")
                }
            }
            binding.greenBtn.setOnClickListener {
                if(canAddSequence) {
                    tippingSequence++
                    addSequence("green")
                }
            }

            binding.redBtn.setOnClickListener {
                if(canAddSequence) {
                    tippingSequence++
                    addSequence("red")
                }
            }

        val docRef = database.collection("score").document("0")
        docRef.addSnapshotListener { snapshot, e ->
            if (e != null) {
                Log.w("DB listener", "Listen failed.", e)
                return@addSnapshotListener
            }
            if (snapshot != null && snapshot.exists()) {
                Log.d("DB listener", "Current data: ${snapshot.data}")
                if (!canAddSequence){
                    popUpScore()
                }
                canAddSequence = true
                nbSequence++;
                binding.sequenceSizeTxt.text = "Taille de la séquence : " + nbSequence
                sequence = ""



            } else {
                Log.d("DB listener", "Current data: null")
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



        val newSequence = hashMapOf(
                "value" to sequence,
                "date" to date
        )
            database.collection("sequence").document("0").update("date", date,
                    "value", sequence)
        tippingSequence = 0;
        Log.i("toto", sequence)
}

    private fun popUpScore(){

        var str = ""

        database.collection("score")
                .get()
                .addOnSuccessListener { result ->
                    for (document in result) {
                        Log.d("score", "${document.id} => ${document.data}")
                        str = "le joueur ${document.data["playerId"]} as gagné en ${document.data["gameTime"]} seconde"
                        Log.d("final", "le joueur ${document.data["playerId"]} as gagné en ${document.data["gameTime"]} secondes")
                        Toast.makeText(this, str, Toast.LENGTH_LONG).show()
                    }
                }
                .addOnFailureListener { exception ->
                    Log.w("score", "Error getting documents.", exception)
                }




    }

}

@IgnoreExtraProperties
data class DataSequence(val date: Date? = null, val sequence: String? = null) {
    // Null default values create a no-argument default constructor, which is needed
    // for deserialization from a DataSnapshot.
}

