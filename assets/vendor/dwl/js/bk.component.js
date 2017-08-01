var dwl_Bk = {
    'tab' : {},
    'bookmarks': [],
    'similar':   [],
    'query':     '',
    'isLoaded':  false,
    'config':    {},
    'icons':     {},

    'show' : function(tabId) {

        var _this = this;
        var d = $.Deferred();

        _this.tab = {};
        _this.bookmarks = [];
        _this.similar = [];
        _this.query = '';
        var type = 'query';

        if(typeof(bookmarker) !== 'undefined' && bookmarker.initialized) {

            _this.rules = bookmarker.rules;
            bookmarker.getTab(tabId).then(function(tab){

                if(typeof(tab.id) === 'undefined') {
                    _this.tab = {id : null,title : '',url : ''};
                }
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
                                _this.bookmarks.unshift(bookmarks[i]);
                            } else if (typeof(_this.tab.parsedUrl) !== 'undefined' && typeof(bookmarks[i].parsedUrl) !== 'undefined') {
                                if(bookmarks[i].parsedUrl.hostname === _this.tab.parsedUrl.hostname && bookmarks[i].parsedUrl.pathname === _this.tab.parsedUrl.pathname) {
                                    _this.similar.push(bookmarks[i]);
                                    // _this.bookmarks.push(bookmarks[i]);
                                } else  if (bookmarks[i].parsedUrl.tdl === _this.tab.parsedUrl.tdl) {
                                    _this.similar.push(bookmarks[i]);
                                }
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

        var _this = this;

        if (typeof(element) !== 'undefined' && element.q !== '') {
            bookmarker.searchChromeBookmark(element.q).then(function(bookmarks){
                chrome.tabs.sendMessage(element.tabId, {'dwlBk' : _this.dwlBk, 'gBk' : bookmarks});
            });
        }
    },

    update : function(tabId) {

        var _this = this;
        var d = $.Deferred();

        _this.show(tabId).then(function(status){

            var show = status;
            if(show === false) {

                getActiveTab().then(function(status){
                    show = status;
                    console.log('Active tab used');
                });

                chrome.tabs.query({ active: true }, function(tabs) {
                    if(tabs[0].id > -1) {
                        _this.show(tabs[0].id).then(function(status){
                            show = status;
                        });
                    }
                });

            }

            if(show === false || tabId < 0) {
                bookmarker.setIcon(-1, 'error');
            } else {
                _this.isLoaded = true;
                chrome.tabs.sendMessage(tabId, {'dwlBk' : dwlBk}, dwlBk.contentResponse);
            }

            d.resolve(show);
        });

        return d;

    },

    /* INIT */
    'init' : function (dwlDefault) {
        var _this = this;
        _this.config = dwlDefault;
        _this.icons = _this.config.icons;
        return _this;
    }

};
