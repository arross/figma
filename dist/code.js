var thingShadow = require('aws-iot-device-sdk');
// var awsIot =require('aws-iot-device-sdk')
var basePath = "/Users/austin.ross/Downloads/connect_device_package/";
var thingName = "CustomerThing";
var thingShadows = new thingShadow({
    keyPath: basePath + thingName + "-private.pem.key",
    certPath: basePath + thingShadows + "-certificate.pem.crt",
    caPath: basePath + "root-CA.cert",
    clientId: "figma",
    host: "a3bp85rmkw5xc1-ats.iot.us-east-1.amazonaws.com"
});
// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs such as the network by creating a UI which contains
// a full browser environment (see documentation).
// const nodes: SceneNode[] = [];
// for (let i = 0; i < numberOfRectangles; i++) {
//   const rect = figma.createRectangle();
//   rect.x = i * 150;
//   rect.fills = [{type: 'SOLID', color: {r: 1, g: 0.5, b: 0}}];
//   figma.currentPage.appendChild(rect);
//   nodes.push(rect);
// }
const textnodes = figma.root.findAll(node => node.type === "TEXT");
console.log("{");
textnodes.forEach(element => {
    if (element.type === "TEXT") {
        console.log(element.id + " : " + "\"" + element.characters.toString() + "\"" + ",");
    }
});
console.log("}");
// thingShadows.
// figma.currentPage.selection = nodes;
// figma.viewport.scrollAndZoomIntoView(nodes);
// Make sure to close the plugin when you're done. Otherwise the plugin will
// keep running, which shows the cancel button at the bottom of the screen.
thingShadows.update(thingName, "TEsting this now");
figma.closePlugin();
//
// Replace the values of '<YourUniqueClientIdentifier>' and '<YourCustomEndpoint>'
// with a unique client identifier and custom host endpoint provided in AWS IoT cloud
// NOTE: client identifiers must be unique within your AWS account; if a client attempts
// to connect with a client identifier which is already in use, the existing
// connection will be terminated.
//
//
// Client token value returned from thingShadows.update() operation
//
var clientTokenUpdate;
//
// Simulated device values
//
var rval = 187;
var gval = 114;
var bval = 222;
thingShadows.on('connect', function () {
    //
    // After connecting to the AWS IoT platform, register interest in the
    // Thing Shadow named 'RGBLedLamp'.
    //
    thingShadows.register(thingName, {}, function () {
        // Once registration is complete, update the Thing Shadow named
        // 'RGBLedLamp' with the latest device state and save the clientToken
        // so that we can correlate it with status or timeout events.
        //
        // Thing shadow state
        //
        var rgbLedLampState = { "state": { "desired": { "red": rval, "green": gval, "blue": bval } } };
        clientTokenUpdate = thingShadows.update(thingName, rgbLedLampState);
        //
        // The update method returns a clientToken; if non-null, this value will
        // be sent in a 'status' event when the operation completes, allowing you
        // to know whether or not the update was successful.  If the update method
        // returns null, it's because another operation is currently in progress and
        // you'll need to wait until it completes (or times out) before updating the
        // shadow.
        //
        if (clientTokenUpdate === null) {
            console.log('update shadow failed, operation still in progress');
        }
    });
});
thingShadows.on('status', function (thingName, stat, clientToken, stateObject) {
    console.log('received ' + stat + ' on ' + thingName + ': ' +
        JSON.stringify(stateObject));
    //
    // These events report the status of update(), get(), and delete()
    // calls.  The clientToken value associated with the event will have
    // the same value which was returned in an earlier call to get(),
    // update(), or delete().  Use status events to keep track of the
    // status of shadow operations.
    //
});
thingShadows.on('delta', function (thingName, stateObject) {
    console.log('received delta on ' + thingName + ': ' +
        JSON.stringify(stateObject));
});
thingShadows.on('timeout', function (thingName, clientToken) {
    console.log('received timeout on ' + thingName +
        ' with token: ' + clientToken);
    //
    // In the event that a shadow operation times out, you'll receive
    // one of these events.  The clientToken value associated with the
    // event will have the same value which was returned in an earlier
    // call to get(), update(), or delete().
    //
});
