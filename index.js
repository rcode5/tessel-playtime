// tessel run index.js

var tessel = require('tessel');
var ambientlib = require('ambient-attx4');
var climatelib = require('climate-si7020');
var https = require('https');

console.log(tessel.port)
var ambient = ambientlib.use(tessel.port['A']);
var climate = climatelib.use(tessel.port['B']);
// var led1 = tessel.led[0].output(1);
var led2 = tessel.led[1].output(1);

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

function postToFirebase(data) {
  led2.toggle();
  console.log("postData to " + firebaseData.host);

  var options = {
    hostname: firebaseData.host,
    port: 80,
    path: '/tessel/sensors.json',
    method: 'POST'
  };

  var req = https.request(options, function(res) {
    console.log('STATUS: ' + res.statusCode);
    led2.toggle();
    getLightLevel();
  });

  req.on('error', function(e) {
    console.error("Request error: " + e);
  });

  var time = new Date().getTime();
  req.write(JSON.stringify(data));
  req.end();
}

function postData(data) {
  console.log(data)
}


ambient.on('ready', function () {
  getLightLevel();
  // setInterval( function () {
  //   console.log("loop");
  //   getLightLevel();
  // }, 1000);
});

ambient.on('error', function (err) {
  console.log("AMBIENT ERROR: " + err)
});

climate.on('error', function (err) {
  console.log("CLIMATE ERROR: " + err)
});
