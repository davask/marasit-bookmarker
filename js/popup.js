addEventListener("unload", function (event) {
    chrome.extension.getBackgroundPage().location.reload();
}, true);
