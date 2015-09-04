/*!
 ~ Copyright (c) 2015 George Norman.
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ --------------------------------------------------------------
 ~ Simple Climate App
 ~ --------------------------------------------------------------
 */

var tessel = require('tessel');
var climatelib = require('climate-si7020');
var tesselKit = require('tessel-kit');
var config = require('./config/config.json');

// Configure the application from the commandline. If an argument is missing, then read it from the config file.
var climatePort = tesselKit.tesselUtils.getArgumentValue("climatePort", config);
var refreshRate = tesselKit.tesselUtils.getArgumentValue("refreshRate", config);

// Display startup banner (and list the current configuration)
tesselKit.logHelper.heading1("B E G I N");
tesselKit.logHelper.listProperties({"Climate Port": climatePort, "Refresh Rate": refreshRate});
tesselKit.logHelper.divider1();

// Validate the port
if (!tesselKit.tesselUtils.isValidPort(climatePort)) {
  tesselKit.logHelper.error('Invalid port [' + climatePort + ']. The port must be in: ' + tesselKit.tesselUtils.validPorts + "\n");
  process.exit(0); // @-@:p0 is there a better way to exit on error?
}

// Initialize the climate lib with port
var climate = climatelib.use(tessel.port[climatePort]);

// Register for and handle the climate "ready" event
climate.on('ready', function () {
  tesselKit.logHelper.msg('Connected to si7020');

  // Loop until config button is pressed
  setImmediate(function loop() {
    climate.readTemperature('f', function (err, temp) {
      climate.readHumidity(function (err, humidity) {
        tesselKit.logHelper.msg('Degrees: ' + temp.toFixed(4) + ' F' + ', Humidity: ' + humidity.toFixed(4) + ' %RH');
        setTimeout(loop, refreshRate);
      });
    });
  });
});

// Register for and handle a climate "error" event
climate.on('error', function(err) {
  tesselKit.logHelper.error('The climate module encountered a problem.\n', err);
  process.exit(0);
});

// Exit when the config button "press" event is received
tessel.button.on('press', function(time) {
  tesselKit.logHelper.heading2('The "config" button was pressed. Process will exit.');
  process.exit(0);
});
