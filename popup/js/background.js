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

var dwlTags = {
    'tags' : [],
    'tagsToDisplay' : [],
    'grps' : [],
    'categories' : [],
    'chromeTree' : [],
    'trees' : {},
    'folders' : [],
    'rules' : {},

    'getTags' : function(tree, params){
        var _this = this;

        if(typeof(params) === 'undefined') {
            params = {};
        }

        if(typeof(params.depth) === 'undefined' || params.depth == null) {
            params.depth = -1;
        }
        params.depth++;

        if(typeof(params.limit) !== 'undefined') {
            level = params.limit;
        }

        tags = [];
        _.each(tree, function(element, index, list) {
            tags = tags.concat(bookmarker.getBookmarkTags(element.title));
             if(typeof(element.children) !== 'undefined' && element.children.length > 0 && (typeof(level) === 'undefined' || level > depth)) {
                 tags = tags.concat(_this.getTags(element.children, params));
             }
        },tags);

        return tags.unique();

    },

    'addTree' : function(tree){
        var _this = this;
        _this.trees[tree.title] = {
            'id' : tree.id,
            'title' : tree.title,
            'children' : tree.children.length
        };
    },

    'init' : function() {
        var _this = this;
        var d = $.Deferred();


        if(typeof(bookmarker) !== 'undefined' && bookmarker.initialized) {

            _this.rules = bookmarker.rules;
            bookmarker.getChromeTrees().then(function(trees){
                _this.chromeTree = trees;
                var root = _this.chromeTree[0];
                root.title = 'root';
                _this.addTree(root);

                for (var i = 0; i < root.children.length; i++) {
                    _this.addTree(root.children[i]);
                    _this.folders.push({title : root.children[i].title});
                };
                _this.tags = _this.getTags(_this.chromeTree);
                var tagsToDisplayDetails = bookmarker.getTagsToDisplay(_this.tags);
                _this.tagsToDisplay = tagsToDisplayDetails.tagsToDisplay
                _this.grps = tagsToDisplayDetails.grps
                _this.categories = tagsToDisplayDetails.categories
                d.resolve(true);
            });

        } else {
            d.resolve(true);
        }

        return d;
    }
};

var dwlBk = {
    'tab' : {},
    'bookmarks' : [],
    'similar' : [],
    'query' : '',
    'isLoaded' : false,
    'icons' : dwlDefault.icons,

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
dwlTags.init();

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
    // console.log(command);
    if(command === 'Ctrl+D' && !isPopupOpen()) {
        console.log('opening');
    }
    if(command === 'Ctrl+D' && isPopupOpen()) {
        console.log(popup.window.close());
    }
});

