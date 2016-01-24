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

var bgReload = function() {
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
    'similar' : [],
    'query' : '',
    'isLoaded' : false,

    'show' : function(tabId) {

        var _this = this;
        var d = $.Deferred();

        _this.tab = {};
        _this.bookmarks = [];
        _this.similar = [];
        _this.query = '';
        var type = 'query';

        if(typeof(bookmarker) !== 'undefined' && bookmarker.initialized) {

            bookmarker.getTab(tabId).then(function(tab){

                if (tab.id > -1) {

                    _this.tab = _this.upgradeBookmark(tab,'tab');

                    if(_this.tab.title != '') {
                        _this.query = _this.tab.title;
                        type = 'title';
                    }

                    if(_this.tab.url != '') {
                        _this.query = _this.tab.url;
                        type = 'url';
                    }

                    if(_this.tab.parsedUrl.dns != '') {
                        _this.query = _this.tab.parsedUrl.dns;
                        type = 'query';
                    }

                    if(_this.tab.parsedUrl.tld != '') {
                        _this.query = _this.tab.parsedUrl.tld;
                        type = 'query';
                    }

                    if(_this.query != '') {

                        bookmarker.searchChromeBookmark(_this.query, type).then(function(bookmarks){

                            for (var i = 0; i < bookmarks.length; i++) {
                                bookmarks[i] = _this.upgradeBookmark(bookmarks[i],'bookmark');
                                if (bookmarks[i].url === _this.tab.url) {
                                    _this.bookmarks.push(bookmarks[i]);
                                } else if (bookmarks[i].parsedUrl.tld === _this.tab.parsedUrl.tld) {
                                    _this.similar.push(bookmarks[i]);
                                }
                            }

                            bookmarker.setIcon(_this.tab.id, _this.bookmarks.length + _this.similar.length);
                            d.resolve(true);

                        });

                    } else {

                        bookmarker.setIcon(-1, 'error');
                        console.log('Something went wrong with this tab', _this.tab)
                        d.resolve(null);

                    }

                } else {

                    d.resolve(false);

                }

            });

        } else {

            bookmarker.setIcon(-1, 'error');
            console.log('bookmarker is not initialized', bookmarker)
            d.resolve(null);

        }

        return d;
    },

    upgradeBookmark : function(bookmark, type){

        bookmark = bookmarker.setSpecificTagData(bookmark);
        bookmark['liveTitle'] = '';
        bookmark['type'] = type;
        bookmark['edit'] = false;
        bookmark['parsedUrl'] = parseURL(bookmark.url);

        return bookmark;
    },

    contentResponse : function(element){
        if (typeof(element) !== 'undefined') {
            // console.log(element);
        }
    },

    update : function(tabId) {

        var _this = this;
        var d = $.Deferred();

        _this.show(tabId).then(function(status){
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
                bookmarker.setIcon(-1, 'error');
            } else {
                _this.isLoaded = true;
                chrome.tabs.sendMessage(tabId, {'dwlBk' : dwlBk}, dwlBk.contentResponse);
            }

            d.resolve(show);
        });

        return d;

    }

};

var bookmarker = dwlBookmarker.init();

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

chrome.commands.onCommand.addListener(function(command){
    console.log(command);
    if(command === 'Ctrl+D' && !isPopupOpen()) {
        console.log('opening');
    }
    if(command === 'Ctrl+D' && isPopupOpen()) {
        console.log(popup.window.close());
    }
});

