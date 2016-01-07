var _this = this;

_this.dwlShow = function(tbaId) {

    chrome.tabs.get(tbaId,function(tab){

        chrome.tabs.sendMessage(tab.id, { text: "report_back" }, function(element){
            // console.log(element);
        });

        chrome.bookmarks.search(tab.url, function(bookmarks){
            var nb = bookmarks.length;
            if (nb > 1) {
                chrome.browserAction.setIcon({tabId: tbaId, path: 'img/icon-black16.png'});
            } else if (nb == 1) {
                // chrome.browserAction.setIcon({tabId: tbaId, path: 'img/spinner.gif'});
            } else {
                chrome.browserAction.setIcon({tabId: tbaId, path: 'img/icon-white16.png'});
            }
            // chrome.browserAction.show(tbaId);
        });
    });

}

var chromeBk = new chromeNativeBookmarker();
var tagBk = new tagManagerBookmarker();

chromeBk.init().then(function(){

    chrome.tabs.onActivated.addListener(function(evt){
        chrome.tabs.get(evt.tabId, function(tab){
            _this.dwlShow(tab.id);
        });
    });

    chrome.tabs.onCreated.addListener(function(tab){
        _this.dwlShow(tab.id);
    });

    chrome.tabs.onUpdated.addListener(function(tab){
        _this.dwlShow(tab);
    });

    chrome.tabs.getSelected(null, function(tab) {
        _this.dwlShow(tab.id);
    });

});
