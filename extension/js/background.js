// chrome.extension.onConnect.addListener(function(port) {
//   console.log("Connected .....");
//   port.onMessage.addListener(function(msg) {
//         console.log("message recieved "+ msg);
//         port.postMessage("Hi Popup.js");
//   });
// });

// var dwlBk = new dwlBookmarker();
// dwlBk.init().then(function(){
//     chrome.runtime.sendMessage({
//         dwlBk: dwlBk
//     });
// });

var chromeBk = new chromeNativeBookmarker();
chromeBk.init();
