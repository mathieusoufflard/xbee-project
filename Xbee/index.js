var SerialPort = require('serialport');
var xbee_api = require('xbee-api');
var C = xbee_api.constants;
var storage = require("./storage");
var sleep = require('system-sleep');
require('dotenv').config()

const SERIAL_PORT = process.env.SERIAL_PORT;
var newSequence;
var SeqTeam;
var player1Index = 0;
var player2Index = 0;
var validTeam1 = false;
var validTeam2 = false;
var canPressButton = false;
var sequenceDate = "";

var xbeeAPI = new xbee_api.XBeeAPI({
  api_mode: 2
});



let serialport = new SerialPort(SERIAL_PORT, {
  baudRate: parseInt(process.env.SERIAL_BAUDRATE) || 9600,
}, function (err) {
  if (err) {
    return console.log('Error: ', err.message)
  }
});

serialport.pipe(xbeeAPI.parser);
xbeeAPI.builder.pipe(serialport);

serialport.on("open", function () {


});


// All frames parsed by the XBee will be emitted here

xbeeAPI.parser.on("data", function (frame) {


  //on new device is joined, register it

  //on packet received, dispatch event
  //let dataReceived = String.fromCharCode.apply(null, frame.data);
  if (C.FRAME_TYPE.ZIGBEE_RECEIVE_PACKET === frame.type) {
/*     console.log("C.FRAME_TYPE.ZIGBEE_RECEIVE_PACKET");
    let dataReceived = String.fromCharCode.apply(null, frame.data);
    console.log(">> ZIGBEE_RECEIVE_PACKET >", dataReceived);
    console.log(frame.remote16); */
  }

  if (C.FRAME_TYPE.NODE_IDENTIFICATION === frame.type) {
    // let dataReceived = String.fromCharCode.apply(null, frame.nodeIdentifier);
    /* console.log("NODE_IDENTIFICATION"); */



  } else if (C.FRAME_TYPE.ZIGBEE_IO_DATA_SAMPLE_RX === frame.type) {

   /*  console.log("ZIGBEE_IO_DATA_SAMPLE_RX")
    console.log(frame) */

    SeqTeam = newSequence.value.split(",");
    SeqTeam.pop();
    console.log(SeqTeam);
    checkButton(SeqTeam, frame);


  } else if (C.FRAME_TYPE.REMOTE_COMMAND_RESPONSE === frame.type) {
/*     console.log("REMOTE_COMMAND_RESPONSE")
    console.log(frame.remote16); */
  } else {
/*     console.debug(frame);
    let dataReceived = String.fromCharCode.apply(null, frame.commandData)
    console.log(dataReceived); */
  }

});


module.exports.getSequence = function (data) {
  reset();
  newSequence = data;
  console.log("New sequence function : " + newSequence.value);
  sendSequenceToBuzzer(newSequence.value);
}

function sendSequenceToBuzzer(sequence) {
  console.log(sequence.split(',').length);
  var sequenceLength = sequence.split(',').length;
  var sequenceIndex = 0;
  console.log(sequence.split(','));
  var seq = sequence.split(',');
  seq.pop();
  console.log(seq);
  var couleurIndex = 0;
  const PAD1 = "0013A20041582FC0";
  const PAD2 = "0013A20041A713BC";
  const players = [PAD1, PAD2]
  players.forEach(player => {
    var interval = setInterval(() => {

      switch (seq[couleurIndex]) {
        case "blue":
          ledOn("D5", player);

          setTimeout(function () {
            ledOff("D5", player);
          }, 800);


          break;
        case "red":
          ledOn("D1", player);

          setTimeout(function () {
            ledOff("D1", player);
          }, 800);
          break;

        case "green":
          ledOn("D3", player);

          setTimeout(function () {
            ledOff("D3", player);
          }, 800);
          break;
      }
      sequenceIndex++;
      console.log(sequenceIndex);
      console.log(sequenceLength * players.length);
      if (sequenceIndex > sequenceLength * players.length) {
        console.log("STOP");
        clearInterval(interval);
        sequenceDate = Date.now();
        canPressButton = true;
        
      }
      if (player == players[players.length-1]) {
        couleurIndex++;
      }
    }, 1000);
    
  });
}

function ledOn(pin, adress) {

  var frame_obj = { // AT Request to be sent
    type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
    destination64: adress,
    command: pin,
    commandParameter: [0x04],
  };

  xbeeAPI.builder.write(frame_obj);
 
}


function ledOff(pin, adress) {
  var frame_obj;
  frame_obj = { // AT Request to be sent
    type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
    destination64: adress,
    command: pin,
    commandParameter: [0x00],
  };


  xbeeAPI.builder.write(frame_obj);

}

function checkButton(seq, frame) {
  if (frame.remote16 == "5f06" && canPressButton == true) {

    console.log(seq[player1Index]);
    switch (seq[player1Index]) {
      case "red":
        if (frame.digitalSamples.DIO0 == 1) {

          validTeam1 = true;
          
          console.log("bonne réponse");
        }
        else if (frame.digitalSamples.DIO0 == 0 && validTeam1 == true) {
          validTeam1 = false;
          player1Index++;
          console.log("bonne réponse");
        } else {
          loseFlashingLed("0013A20041A713BC");
          console.log("mauvaise réponse");
        }
        break;

      case "green":
        if (frame.digitalSamples.DIO2 == 1) {
          validTeam1 = true;
          console.log("bonne réponse");

        }
        else if (frame.digitalSamples.DIO2 == 0 && validTeam1 == true) {
          validTeam1 = false;
          player1Index++;
          console.log("bonne réponse");
        } else {
          loseFlashingLed("0013A20041A713BC");
          console.log("mauvaise réponse");
        }
        break;

      case "blue":
        if (frame.digitalSamples.DIO4 == 1) {
          validTeam1 = true
          console.log("bonne réponse");

        }
        else if (frame.digitalSamples.DIO4 == 0 && validTeam1 == true) {
          validTeam1 = false;
          player1Index++;
          console.log("bonne réponse");
        } else {
          loseFlashingLed("0013A20041A713BC");
          console.log("mauvaise réponse");
        }
        break;


    }

    if (player1Index > seq.length-1) {
      canPressButton = false;
      storage.registerScore("0", sequenceDate, Date.now(), true, "1", "0")
    }


  }
  else if (frame.remote16 == "18a8" && canPressButton == true) {

    console.log(seq[player2Index]);
    console.log("boucle tableau" + player2Index);
    switch (seq[player2Index]) {
      case "red":
        if (frame.digitalSamples.DIO0 == 1) {

          validTeam2 = true;
          
          console.log("bonne réponse tu as appuyé");
        }
        else if (frame.digitalSamples.DIO0 == 0 && validTeam2 == true) {
          validTeam2 = false;
          player2Index++;
          console.log("bonne réponse retour");
        } else {
          loseFlashingLed("0013A20041582FC0");
          console.log("mauvaise réponse");
        }
        break;

      case "green":
        if (frame.digitalSamples.DIO2 == 1) {
          validTeam2 = true;
          console.log("bonne réponse");
        }
        else if (frame.digitalSamples.DIO2 == 0 && validTeam2 == true) {
          validTeam2 = false;
          player2Index++;
          console.log("bonne réponse");
        } else {
          loseFlashingLed("0013A20041582FC0");
          console.log("mauvaise réponse");
        }
        break;

      case "blue":
        if (frame.digitalSamples.DIO4 == 1) {
          validTeam2 = true
          console.log("bonne réponse");
        }
        else if (frame.digitalSamples.DIO4 == 0 && validTeam2 == true) {
          validTeam2 = false;
          player2Index++;
          console.log("bonne réponse");
        } else {
          loseFlashingLed("0013A20041582FC0");
          console.log("mauvaise réponse");
        }
        break;


    }

    if (player2Index > seq.length-1) {
      canPressButton = false;
      storage.registerScore("0", sequenceDate, Date.now(), true, "2", "0")
    }

  }
}

function loseFlashingLed(adress) {
  var index =0;
  var interval = setInterval(() => {
    ledOn("D5", adress);
    ledOn("D1", adress);
    ledOn("D3", adress);

    setTimeout(function () {
      ledOff("D5", adress);
      ledOff("D1", adress);
      ledOff("D3", adress);
    }, 500);
    index++;

    if (index > 5) {
      clearInterval(interval);
    }
  }, 500);
    
}

function reset(){
  canPressButton = false;
  player1Index = 0;
  player2Index = 0;
  validTeam1 = false;
  validTeam2 = false;
}