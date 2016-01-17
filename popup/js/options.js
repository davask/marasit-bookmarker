jQuery('#resetAll').click(function () {
    chrome.tabs.getCurrent(function(tab){
        chrome.tabs.remove(tab.id, function(){
            chrome.extension.getBackgroundPage().dwlBk.chromeBk.reInitAllBookmarksAsArray();
        });
    })
});

// to store opptions see https://developer.chrome.com/extensions/options