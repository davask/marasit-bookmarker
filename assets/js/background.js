/* content process */
var popup = [];
var isPopupOpen = function () {

    popup = chrome.extension.getViews({ type: "popup" });

    var isOpen = false;
    if(popup.length === 1) {
        isOpen = true;
    } else {
        popup = [];
    }

    return isOpen;
};

var getActiveTab = function() {
    var d = $.Deferred();

    chrome.tabs.query({ active: true }, function(tabs) {
        if(tabs[0].id > -1) {
            dwlBk.update(tabs[0].id).then(function(show){
                d.resolve(show);
            });
        }
    });
    return d;
};

var dwlDefault = dwl_Default.init();
var dwlBk = dwl_Bk.init(dwlDefault);
var bookmarker = dwlBookmarker.init();
var dwlTags = dwl_Tags.init();


var page_init = function (dwlBk) {

    // Do NOT forget that the method is ASYNCHRONOUS
    chrome.tabs.query({
        active: true
    }, function(tabs) {
        // Since there can only be one active tab in one active window,
        //  the array has only one element
        var tab = tabs[0];

        var goodPage = tab.url.match(/google\.[a-z]{2,3}\/(search|webhp)/);

        // if ( goodHost != null && goodPathname != null ) {
        if ( goodPage != null ) {

          console.log('Searching in your bookmarks');
          // ... show the page action.
          chrome.pageAction.show(tab.id);

          dwlBk.update(tab.id);

        }

    });

}

chrome.tabs.onActivated.addListener(function(activeInfo) {
    // page_init(dwlBk);
});

chrome.tabs.onCreated.addListener(function(tab) {
    // page_init(dwlBk);
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
      page_init(dwlBk);
    }
});
