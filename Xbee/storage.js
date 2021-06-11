const admin = require('firebase-admin');
const index = require('./index');
const serviceAccount = require('./ServiceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();


console.log("Conexion bdd");

module.exports.registerScore = async function (doc, gameStart, gameEnd, isWinner, playerId, idSequence){
    const docRef = db.collection('score').doc(doc);
    var gameTime = (gameEnd - gameStart) /1000;

    const score = {
        gameTime: gameTime,
        isWinner: isWinner,
        playerId: playerId,
        sequenceId: idSequence
    }

    await docRef.get().then((snapshotDoc)=> {
        if (!snapshotDoc.exists) {
            docRef.set(score);
        }
        else
            docRef.update(score);
    })
}

module.exports.sequence = function (){
    const docRef = db.collection('sequence');
    return docRef.get() 
}


    db.collection("sequence").doc("0")
    .onSnapshot((collection) => {
        console.log("Current data: ", collection.data());
        index.getSequence(collection.data());
    });




/* db.collection("sequence").doc("0")
.onSnapshot((collection) => {
    console.log("Current data: ", collection.data());
}); */
