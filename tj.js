//TJBot libs
var TJBot = require("tjbotczlib");
var conf = require("./configuration/config"); //tjConfig & local czech enhancements
var confCred = require("./configuration/credentials"); //credentials only
var fs = require("fs"); //filesystem

//Pigpio library for LED (simple version)
var gpio = require("pigpio").Gpio;
const _basic_colors = ["red", "green", "blue", "yellow", "magenta", "cyan", "white"];

var pinR = new gpio(conf.ledpins.R, { mode: gpio.OUTPUT });
var pinG = new gpio(conf.ledpins.G, { mode: gpio.OUTPUT });
var pinB = new gpio(conf.ledpins.B, { mode: gpio.OUTPUT });
var _RGBLed = { pinR, pinG, pinB };

//TJBot - Watson services
//---------------------------------------------------------------------
var credentials = confCred.credentials;
var hardware = ['microphone', 'speaker', 'servo', 'camera', 'rgb_led']; 
var tjConfig = conf.tjConfig;
var _paths = conf.paths;

var tj = new TJBot(hardware, tjConfig, credentials);

//Context object
var contextBackup; // last conversation context backup
var ctx = {}; // our internal context object

//---------------------------------------------------------------------
// Functions
//---------------------------------------------------------------------


//CONVERSATION
//---------------------------------------------------------------------

function listen() {
    tj.listen(function (msg) {      
        var msgNoName = msg;//.toLowerCase().replace(tj.configuration.robot.name.toLowerCase(), "");  
        processConversation(msgNoName, function (response) {
          if (response.description) {
            var newResponse = response.description;
            converse(newResponse, response);
          }
        });
    });
}


function listen2() {
  //tj.speak("Hello");
    var newResponse;
     tj.listen2(function(msg){
     
     var msgNoName = msg;//.toLowerCase().replace(tj.configuration.robot.name.toLowerCase(), "");
  
        processConversation(msgNoName, function (response) {
          if (response.description) {
            newResponse = response.description;
            converse(newResponse, response);
          }
      });
    });
    //if (response.object.context.action.hasOwnProperty('cmdPayload')) {
    //	cmdPayload = response.object.context.action.cmdPayload;
    //}
      	   
}

function converse(text, response) {
  tj.speak(text).then(function () {
    if (response.object.context.hasOwnProperty('action')) {
      var cmdType = response.object.context.action.cmdType;
      var cmdPayload;
      if (response.object.context.action.hasOwnProperty('cmdPayload')) {
        cmdPayload = response.object.context.action.cmdPayload;
      }
      
      var cmdType2;
      if (response.object.context.action.hasOwnProperty('cmdType2')) {
        cmdType2 = response.object.context.action.cmdType2;      
      }
      var cmdPayload2;
      if (response.object.context.action.hasOwnProperty('cmdPayload2')) {
        cmdPayload2 = response.object.context.action.cmdPayload2;
      }
      processAction(cmdType, cmdPayload, cmdType2, cmdPayload2);
    }
  });
}


/**
 * Stop listening
 */
function stopListening() {
  tj.stopListening();

  var msg = "Listening was stopped.";
  tj.speak(msg);
  console.log(msg);
}

/**
 * PROCESS CONVERSATION
 * @param inTextMessage - text
 */
function processConversation(inTextMessage, callback) {
  if(contextBackup == null) contextBackup = ctx;
  if(contextBackup.hasOwnProperty('action')) delete contextBackup.action;
  if(contextBackup.hasOwnProperty('yes_photo')) delete contextBackup.yes_photo;
  // Object.assign(contextBackup, ctx);

  // send to the conversation service
  tj.converse(confCred.conversationWorkspaceId, inTextMessage, contextBackup, function (response) {
    console.log(JSON.stringify(response, null, 2));
    contextBackup = response.object.context;
    callback(response);
  });
}


//PROCESS ACTIONS
//---------------------------------------------------------------------
function processAction(cmd, payload, cmd2, payload2) {
  doAction(cmd,payload);
  doAction(cmd2,payload2);
}

function doAction(cmd,payload){
    switch (cmd) {
    case "tjbot_reset":
      resetTJBot();
      break;
    case "listen":
      listen();
      break;
    case "listen2":
      listen2();
      break;
    case "stop_listening":
      stopListening();
      break;
    case "led_turn_on":
      led_turn_on_all();
      break;
    case "led_turn_off":
      led_turn_off_all();
      break;
    case "led_change_color":
      led_change_color(payload.color);
      break;
    case "wave_arm":
      wave_arm(payload.position);
      break;
    default:
      console.log("Command not supported... " + cmd);
  }     
}


//LED
//---------------------------------------------------------------------


//Turns off all the LED colors
//---------------------------------------------------------------------
function led_turn_off_all() {
  tj.turnOffRGBLed();
}


//Turns on all the LED on random color
//---------------------------------------------------------------------
function led_turn_on_all() {
  tj.turnOnRGBLed(function(ret_color){
    if(ret_color){
      console.log("Color is: " + ret_color);
    } else{
      console.log("LED did not turn on.");
    }
  });
}


//Changes the color of th RGB diode
//---------------------------------------------------------------------
function led_change_color(color){
  tj.changeColorRGBLed(color, function(ret_color){
    if(ret_color) {
      console.log("Color is: " + ret_color);
    } else {
      console.log("Color did not set.");
    }
  });
}


//ARM
//---------------------------------------------------------------------
function wave_arm(position) {
  switch (position) {
    case "back":
      tj.armBack();
      break;
    case "raised":
      tj.raiseArm();
      break;
    case "forward":
      tj.lowerArm();
      break;
    case "wave":
      tj.wave();
      break;
    default:
      tj.speak("I'm not able to set my arm into this position.");
  }
}


//RESET TJBOT
//---------------------------------------------------------------------
function resetTJBot() {
  tj.raiseArm();
  led_turn_off_all();
  tj.stopListening();
  listen2();
}


//CALL INIT
//---------------------------------------------------------------------
resetTJBot();