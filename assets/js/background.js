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

chrome.tabs.getSelected(null, function(tab) {
    // console.log('getSelected',tab);
    dwlBk.update(tab.id);
});

chrome.tabs.onActivated.addListener(function(evt) {
    dwlBk.update(evt.tabId);
});

chrome.tabs.onCreated.addListener(function(tab) {
    dwlBk.update(tab.id);
});

chrome.tabs.onUpdated.addListener(function(tabId) {
    if(typeof(dwlBk.tab.id) !== 'undefined' && dwlBk.tab.id === tabId) {
        dwlBk.update(tabId);
    }
});

