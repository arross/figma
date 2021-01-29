var thingShadow = require('aws-iot-device-sdk');

var basePath = "/Users/austin.ross/Downloads/connect_device_package/"

var thingName = "CustomerThing"

var thingShadows = new thingShadow({
   keyPath: basePath + thingName + "-private.pem.key",
   certPath: basePath + thingShadows + "-certificate.pem.crt",
   caPath: basePath + "root-CA.cert",
   clientId: "figma",
   host: "a3bp85rmkw5xc1-ats.iot.us-east-1.amazonaws.com"
});

const textnodes = figma.root.findAll(node => node.type === "TEXT")
console.log("{")
textnodes.forEach(element => {
  if (element.type === "TEXT") {
    console.log(element.name + " : " + "\"" + element.characters.toString() + "\"" + ",")
  }
});
console.log("}")

thingShadows.update(thingName, "TEsting this now")
figma.closePlugin();


var clientTokenUpdate;

thingShadows.on('connect', function() {
    thingShadows.register( thingName, {}, function() {


       clientTokenUpdate = thingShadows.update(thingName, "update");
       if (clientTokenUpdate === null)
       {
          console.log('update shadow failed, operation still in progress');
       }
    });
});
thingShadows.on('status',
    function(thingName, stat, clientToken, stateObject) {
       console.log('received '+stat+' on '+thingName+': '+
                   JSON.stringify(stateObject));
    });

thingShadows.on('delta',
    function(thingName, stateObject) {
       console.log('received delta on '+thingName+': '+
                   JSON.stringify(stateObject));
    });

thingShadows.on('timeout',
    function(thingName, clientToken) {
       console.log('received timeout on '+thingName+
                   ' with token: '+ clientToken);
    });