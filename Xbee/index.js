var SerialPort = require('serialport');
var xbee_api = require('xbee-api');
var C = xbee_api.constants;
var storage = require("./storage");
var sleep = require('system-sleep');
require('dotenv').config()

const SERIAL_PORT = process.env.SERIAL_PORT;
var newSequence;
var SeqTeam;
var i = 0;
var j = 0;

var xbeeAPI = new xbee_api.XBeeAPI({
  api_mode: 2
});



let serialport = new SerialPort(SERIAL_PORT, {
    baudRate: process.env.SERIAL_BAUDRATE || 9600,
  }, function (err) {
    if (err) {
      return console.log('Error: ', err.message)
    }
  });
  
  serialport.pipe(xbeeAPI.parser);
  xbeeAPI.builder.pipe(serialport);
  
  serialport.on("open", function () {
    console.log("ouvert");
    var frame_obj = { // AT Request to be sent
      type: C.FRAME_TYPE.AT_COMMAND,
      command: "NI",
      commandParameter: [],
    };
  
    xbeeAPI.builder.write(frame_obj);
  
    frame_obj = { // AT Request to be sent
      type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
      destination64: "FFFFFFFFFFFFFFFF",
      command: "Test",
      commandParameter: [],
    };
    xbeeAPI.builder.write(frame_obj);
  
  });




  storage.sequence().then((sequence) => sequence.forEach((dataSequence) => console.log(dataSequence.data().date.toDate())))
  
  // All frames parsed by the XBee will be emitted here
  
  xbeeAPI.parser.on("data", function (frame) {
   
  
    //on new device is joined, register it
  
    //on packet received, dispatch event
    //let dataReceived = String.fromCharCode.apply(null, frame.data);
    if (C.FRAME_TYPE.ZIGBEE_RECEIVE_PACKET === frame.type) {
      console.log("C.FRAME_TYPE.ZIGBEE_RECEIVE_PACKET");
      let dataReceived = String.fromCharCode.apply(null, frame.data);
      console.log(">> ZIGBEE_RECEIVE_PACKET >", dataReceived);
  
    }
  
    if (C.FRAME_TYPE.NODE_IDENTIFICATION === frame.type) {
      // let dataReceived = String.fromCharCode.apply(null, frame.nodeIdentifier);
      console.log("NODE_IDENTIFICATION");
      
  
  
    } else if (C.FRAME_TYPE.ZIGBEE_IO_DATA_SAMPLE_RX === frame.type) {
  
      console.log("ZIGBEE_IO_DATA_SAMPLE_RX")
      console.log(frame)
      if (frame.remote16 == "5f06") {

        SeqTeam = newSequence.split(",");
        switch (SeqTeam[i]) {
          case "red":
            if (frame.digitalSamples.DIO0 == 1) {
                i++;
            }
            else{
              //faire tout clignoter
            }
          break;
        
          case "green":
            if (frame.digitalSamples.DIO0 == 0){

            }
            else{
              //faire tout clignoter
            }
          break;

          case "blue":
            if (frame.digitalSamples.DIO0 == 0){

            }
            else{
              //faire tout clignoter
            }
          
          break;
          
        
        }

        
      }
      else if (frame.remote16 == "4057") {
        
      }
      

  
    } else if (C.FRAME_TYPE.REMOTE_COMMAND_RESPONSE === frame.type) {
      console.log("REMOTE_COMMAND_RESPONSE")
    } else {
      console.debug(frame);
      let dataReceived = String.fromCharCode.apply(null, frame.commandData)
      console.log(dataReceived);
    }
  
  });


module.exports.getSequence = function(data) {
    newSequence = data;
    console.log("New sequence function : " + newSequence.value);
    sendSequenceToBuzzer(newSequence.value);
}

async function sendSequenceToBuzzer(sequence){
  console.log(sequence.length);
  sequence.split(',').forEach(value => {
    console.log("LED EN COURS : " + value);
    var frame_obj;
   
    
    
    switch (value) {
      case "blue":
        frame_obj = { // AT Request to be sent
          type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
          destination64: "FFFFFFFFFFFFFFFF",
          command: "D5",
          commandParameter: [0x04],
        };

        xbeeAPI.builder.write(frame_obj);
        console.log("BLUE ON")

        setTimeout(function(){ 
          frame_obj = { // AT Request to be sent
            type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
            destination64: "FFFFFFFFFFFFFFFF",
            command: "D5",
            commandParameter: [0x05],
          };
          
          xbeeAPI.builder.write(frame_obj);
            
          console.log("BLUE OFF")
        }, 800);

    
        break;
      case "red":
        frame_obj = { // AT Request to be sent
          type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
          destination64: "FFFFFFFFFFFFFFFF",
          command: "D1",
          commandParameter: [0x04],
        };

        xbeeAPI.builder.write(frame_obj);
        console.log("RED ON")

        setTimeout(function(){ 
          frame_obj = { // AT Request to be sent
            type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
            destination64: "FFFFFFFFFFFFFFFF",
            command: "D1",
            commandParameter: [0x00],
          };
  
          
          xbeeAPI.builder.write(frame_obj);
            
          console.log("RED OFF")
         }, 800);

       
        break;

      case "green":
        frame_obj = { // AT Request to be sent
          type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
          destination64: "FFFFFFFFFFFFFFFF",
          command: "D3",
          commandParameter: [0x04],
        };

        xbeeAPI.builder.write(frame_obj);
        console.log("GREEN ON")

        setTimeout(function(){
          frame_obj = { // AT Request to be sent
            type: C.FRAME_TYPE.REMOTE_AT_COMMAND_REQUEST,
            destination64: "FFFFFFFFFFFFFFFF",
            command: "D3",
            commandParameter: [0x00],
          };
  
          xbeeAPI.builder.write(frame_obj);
            
          console.log("GREEN OFF")
        }, 800);

        break;
    }
    
    sleep(2000);
  
  });
}

