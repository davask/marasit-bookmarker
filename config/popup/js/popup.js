var options = {};
chrome.storage.sync.get({
    "dwl.options.route": "{\"path\":\"page\"}",
    "dwl.options.init": false
}, function(o) {
    if(typeof(o["dwl.options.route"]) !== "undefined") {
        o["dwl.options.route"] = JSON.parse(o["dwl.options.route"]);
    }
    options = o;
    angular.element(document).ready(function() {
        angular.bootstrap(document, ["dwlPopup"]);
    });
});
