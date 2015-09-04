// tessel run index.js

var tessel = require('tessel');
var ambientlib = require('ambient-attx4');
var climatelib = require('climate-si7020');
var https = require('https');
var needle = require("needle");
var config = require("./config/config.json");
var wifi = require('wifi-cc3000');
var allowedTimeouts = 0+config.allowedTimouts;
var ambient = ambientlib.use(tessel.port[config.ambientPort]);
var climate = climatelib.use(tessel.port[config.climatePort]);
// var led1 = tessel.led[0].output(1);
// var led2 = tessel.led[1].output(1);

var fetchingData = null;

var wifiManager = {
  connect: function connect() {
    console.log("Connecting to %s...", config.wifi.network)

    wifi.connect({
      security: config.wifi.security || 'wpa2'
      , ssid: config.wifi.network
      , password: config.wifi.password
      , timeout: config.wifi.timeout || 20
    });
  }
  ,
  powerCycle: function powerCycle() {
    wifi.reset(function() {
      console.log('Reset called');
      allowedTimeouts = 0+config.allowedTimouts;
      setTimeout(function() {
        if (!wifi.isConnected()) {
          console.log('Wifi not connected, trying...');
          this.connect()
        }
      }, 20 * 1000);
    })
  }
};

function getLightLevel() {
  ambient.getLightLevel( function(err, ldata) {
    if (err) throw err;
    ambient.getSoundLevel( function(err, sdata) {
      if (err) throw err;

      climate.readTemperature('c', function (err, temp) {
        climate.readHumidity(function (err, humid) {
          console.log('Degrees:', temp.toFixed(4) + 'C', 'Humidity:', humid.toFixed(4) + '%RH');
          console.log("Light level:", ldata.toFixed(8), " ", "Sound Level:", sdata.toFixed(8));
          postData({
            "time": time,
            "light": ldata.toFixed(8),
            "sound": sdata.toFixed(8),
            "temp": temp.toFixed(4),
            "humid": humid.toFixed(4)
          })
        });
      });
    });
  });
}

function postData(data) {
  console.log("posting to %s [%s]", config.repoUrl, data)
  needle.post( config.repoUrl, data, function(error, resp) {
    if (!error && resp.statusCode == 200) {
      console.log("RESPONSE", resp.body)
    } else {
      console.log("FAIL", error)
    }
  })
}

console.log("Binding to the ambient ready signal");
ambient.on('ready', function () {
  fetchingData = setInterval( getLightLevel, 500)
});

ambient.on('error', function (err) {
  console.log("AMBIENT ERROR: " + err)
});

climate.on('error', function (err) {
  console.log("CLIMATE ERROR: " + err)
});

wifi.on("connect", function(data) {
  console.log('wifi> on:connect', data);
});
wifi.on("disconnect", function(data) {
  console.log('wifi> on:disconnect', data);
});
wifi.on("timeout", function(data) {
  console.log('wifi> on:timeout', data);
  if (timeouts-- > 0) {
    console.log("simple reconnect...");
    wifiManager.connect()
  } else {
    wifiManager.powerCycle()
  }
});
wifi.on("error", function(data) {
  console.log('wifi> on:error', data);
});

console.log("Running...")
wifiManager.connect()


// function postToFirebase(data) {
//   led2.toggle();
//   console.log("postData to " + firebaseData.host);

//   var options = {
//     hostname: firebaseData.host,
//     port: 80,
//     path: '/tessel/sensors.json',
//     method: 'POST'
//   };

//   var req = https.request(options, function(res) {
//     console.log('STATUS: ' + res.statusCode);
//     led2.toggle();
//     getLightLevel();
//   });

//   req.on('error', function(e) {
//     console.error("Request error: " + e);
//   });

//   var time = new Date().getTime();
//   req.write(JSON.stringify(data));
//   req.end();
// }
