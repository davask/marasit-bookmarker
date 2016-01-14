jQuery('#resetAll').click(function () {
    chrome.extension.getBackgroundPage().chromeBk.reInitAllBookmarksAsArray();
    chrome.tabs.getCurrent(function(tab){
        chrome.tabs.remove(tab.id);
    })
});

// to store opptions see https://developer.chrome.com/extensions/options