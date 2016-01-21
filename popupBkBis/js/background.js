var _this = this;

window.dwlBk = {
    'tab' : {},
    'bookmarks' : [],
    'chromeBk' : {},
    'refreshChromeBk' : function () {
        var _this = this;
        chromeBookmarker.init().then(function(chromeBk){
            _this.chromeBk = chromeBk;
        });
    },
    'show' : function(tabId, force) {

        var _this = this;
        var d = $.Deferred();

        if (typeof force == "undefined") {
            force = false;
        } else {
            force = true;
        }

        if(_this.bookmarks.length == 0 || force) {

            _this.tab = {};
            _this.bookmarks = [];

            _this.chromeBk.getTab(tabId).then(function(tab){
                if (tab.id > -1) {
                    tab = _this.chromeBk.tagBk.setSpecificTagData(tab);


                    _this.chromeBk.searchChromeBookmark(tab.url).then(function(bookmarks){

                        for (var i = 0; i < bookmarks.length; i++) {
                            bookmarks[i] = _this.chromeBk.setUpBookmark(bookmarks[i]);
                        };

                        if (bookmarks.length > 0 && tab.titleNoTag == bookmarks[0].titleNoTag) {
                            bookmarks[0]['tab'] = tab;
                        } else {
                            _this.tab = tab;
                        }

                        _this.bookmarks = bookmarks;
                        _this.chromeBk.setIcon(tab.id, bookmarks);

                        d.resolve(_this);
                    });
                }

            });
        } else {
            d.resolve(_this);
        }

        return d;

    }

};

chromeBookmarker.init().then(function(chromeBk){
    window.dwlBk.chromeBk = chromeBk;
});

chrome.tabs.onActivated.addListener(function(evt){
    window.dwlBk.show(evt.tabId, true).then(function(){
        chrome.tabs.sendMessage(evt.tabId, {'dwlBk' : window.dwlBk}, function(element){
            console.log(element);
        });
    });
});

chrome.tabs.onCreated.addListener(function(tab) {
    window.dwlBk.show(tab.id, true).then(function(){
        chrome.tabs.sendMessage(tab.id, {'dwlBk' : window.dwlBk}, function(element){
            console.log(element);
        });
    });
});

chrome.tabs.onUpdated.addListener(function(tab) {
    window.dwlBk.show(tab.id, true).then(function(){
        chrome.tabs.sendMessage(tab.id, {'dwlBk' : window.dwlBk}, function(element){
            console.log(element);
        });
    });
});

chrome.tabs.getSelected(null, function(tab) {
    window.dwlBk.show(tab.id).then(function(){
        chrome.tabs.sendMessage(tab.id, {'dwlBk' : window.dwlBk}, function(element){
            console.log(element);
        });
    });
});