var _this = this;
_this.dwlShow = function(tbaId) {

    chrome.tabs.get(tbaId,function(tab){
        chrome.bookmarks.search(tab.url, function(bookmarks){
            var nb = bookmarks.length;
            if (nb > 1) {
                chrome.pageAction.setIcon({tabId: tbaId, path: 'img/icon-black16.png'});
            } else if (nb == 1) {
                // chrome.pageAction.setIcon({tabId: tbaId, path: 'img/spinner.gif'});
            } else {
                chrome.pageAction.setIcon({tabId: tbaId, path: 'img/icon-white16.png'});
            }
            chrome.pageAction.show(tbaId);
        });
    });

}
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
