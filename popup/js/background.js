var _this = this;

_this.dwlShow = function(tbaId) {

    chrome.tabs.get(tbaId,function(tab){

        var nb =0;
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

        chrome.tabs.sendMessage(tab.id, { 'nb' : nb }, function(element){
            // console.log(element);
        });

    });

}

chromeBookmarker.init().then(function(o){

    window.chromeBk = o;

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
