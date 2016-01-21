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

var reloadBg = function() {
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

var dwlBk = {
    'tab' : {},
    'bookmarks' : [],
    'bookmarker' : {},
    'search' : '',
    'isLoaded' : false,

    'show' : function(tabId) {

        var _this = this;
        var d = $.Deferred();

        _this.tab = {};
        _this.bookmarks = [];
        _this.search = '';

        _this.bookmarker.getTab(tabId).then(function(tab){

            if (tab.id > -1) {

                _this.tab = _this.updateBookmark(tab,'tab');

                if(_this.tab.title != '') {
                    _this.search = _this.tab.title;
                }

                if(_this.tab.url != '') {
                    _this.search = _this.tab.url;
                }

                if(_this.search != '') {

                    _this.bookmarker.searchChromeBookmark(_this.search).then(function(bookmarks){

                        for (var i = 0; i < bookmarks.length; i++) {
                            if (bookmarks[i].url == _this.tab.url || bookmarks[i].title == _this.tab.title) {
                                _this.bookmarks.push(_this.updateBookmark(bookmarks[i],'bookmark'));
                            }
                        }

                        _this.bookmarker.setIcon(_this.tab.id, _this.bookmarks.length);
                        d.resolve(true);

                    });

                } else {

                    _this.bookmarker.setIcon(-1, 'error');
                    console.log('Something went wrong with this tab', _this.tab)
                    d.resolve(null);

                }

            } else {

                d.resolve(false);

            }

        });

        return d;

    },

    updateBookmark : function(bookmark, type){
        bookmark['type'] = type;
        bookmark['edit'] = false;
        bookmark['parsedUrl'] = parseURL(bookmark.url);

        return bookmark;
    },

    contentResponse : function(element){
        if (typeof(element) !== 'undefined') {
            console.log(element);
        }
    },

    update : function(tabid) {

        var _this = this;
        var d = $.Deferred();

        _this.show(tabid).then(function(status){
            var show = status;
            if(show === false) {

                reloadBg().then(function(status){
                    show = status;
                });


                chrome.tabs.query({ active: true }, function(tabs) {
                    if(tabs[0].id > -1) {
                        _this.show(tabs[0].id).then(function(status){
                            show = status;
                        });
                    }
                });

            }

            if(show === false) {
                _this.bookmarker.setIcon(-1, 'error');
            } else {
                _this.isLoaded = true;
                chrome.tabs.sendMessage(tabid, {'dwlBk' : dwlBk}, dwlBk.contentResponse);
            }

            d.resolve(show);
        });

        return d;

    }

};

dwlBk.bookmarker = dwlBookmarker.init();

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
