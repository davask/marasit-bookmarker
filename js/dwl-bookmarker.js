// helper
/* BOOKMARKS OBJECT

{
    children: Array[3]
    dateAdded: 1413110592991
    dateGroupModified: 1441606663159
    id: "1"
    index: 0
    parentId: "0"
    title: "Bookmarks bar"
    url: "http://www.sitepoint.com/php-streaming-output-buffering-explained/"
}

*/

/**
 * Regular Expresion IndexOf for Arrays
 * This little addition to the Array prototype will iterate over array
 * and return the index of the first element which matches the provided
 * regular expresion.
 * Note: This will not match on objects.
 * @param  {RegEx}   rx The regular expression to test with. E.g. /-ba/gim
 * @return {Numeric} -1 means not found
 */
if (typeof Array.prototype.regexIndexOf === 'undefined') {
    Array.prototype.regexIndexOf = function (rx) {
        for (var i in this) {
            if (this[i].toString().match(rx)) {
                return i;
            }
        }
        return -1;
    };
}

// Author

var dwlBookmarker = {

    bookmarks : {

        unique_count : 0,
        unique_urls_id : [],
        unique_urls : [],

        unique_bookmarks : [],

        folders : [],
        duplicate : []

    },

    bookmark : {},
    allBookmarks : [],

    badge : {
        title : function() {
            var _this = this;
            return _this.text + " bookmarks";
        },
        text : "load",
    },

    localStorage: true, // false to store with chrome.storage / true to store in localStorage

    init : function() {

        var _this = this;

        chrome.browserAction.setBadgeText({text:_this.badge.text});

        _this.refreshBookmarksStorage().done(function() {
            _this.setBadgeDisplay();
            console.log('initialized');
        });

    },

    retrieve : function() {

        var _this = this;

        _this.getBookmarksFromStorage();
        console.log('retrieved');

    },

    getAllUniqueBookmarksFromChromeBookmarks : function(){

        var _this = this;
        var b = _this.bookmarks;
        var d = $.Deferred();

        for (var i = b.unique_urls_id.length - 1; i >= 0; i--) {

            chrome.bookmarks.get(b.unique_urls_id[i], function (result) {
                _this.allBookmarks.push(result[0]);
                if ( b.unique_urls_id[0] == result[0].id) {
                    d.resolve();
                }
            });

        }

        return d;
    },

    getFromChromeBookmarks : function(id){

        var _this = this;
        var d = $.Deferred();

        chrome.bookmarks.get(id, function (result) {
            _this.bookmark = result[0];
            d.resolve();
        });

        return d;
    },

    getChromeBookmarkIdFromUrl : function (url) {

        var _this = this;
        var b = _this.bookmarks;

        var regexId = /^url_([0-9]+)_.*$/i;
        var index = b.unique_bookmarks.regexIndexOf(url);

        if (index > 0) {
            return b.unique_bookmarks[index].match(regexId)[1];
        } else {
            return null;
        }

    },

    setBadgeDisplay : function () {

        var _this = this;
        var b = _this.bookmarks;
        var d = $.Deferred();

        _this.getBookmarksFromStorage().done(function(){

            _this.badge.text = ""+b.unique_count;
            if (b.unique_count > 9999) {
                _this.badge.text = b.unique_count(0,2)+"k"+b.unique_count.substring(2,3);
            }

            chrome.browserAction.setBadgeText({text:""+_this.badge.text});
            chrome.browserAction.setTitle({title:_this.badge.title() });

            d.resolve();

        });

        return d;

    },

    refreshBookmarksStorage : function () {

        var _this = this;
        var b = _this.bookmarks;
        var d = $.Deferred();

        _this.badge.text = "...";

        _this.resetBookmarksStorage().done(function(){
            _this.rebuildBookmarksObject().done(function(){
                _this.setBookmarksToStorage().done(function() {
                    chrome.browserAction.setBadgeText({text:_this.badge.text});
                    d.resolve();
                });
            });
        });

        return d;

    },

    resetBookmarksStorage : function () {

        var _this = this;
        var b = _this.bookmarks;
        var d = $.Deferred();

        _this.resetBookmarksObject();

        _this.setBookmarksToStorage().done(function() {
            d.resolve();
        });

        return d;

    },

    resetBookmarksObject : function () {

        var _this = this;
        var b = _this.bookmarks;
        var d = $.Deferred();

        b.unique_count = 0;
        b.unique_urls_id = [];
        b.unique_urls = [];
        b.unique_bookmarks = [];
        b.folders = [];
        b.duplicate = [];

        d.resolve();
        return d;

    },

    rebuildBookmarksObject : function () {

        var _this = this;
        var b = _this.bookmarks;
        var d = $.Deferred();

        chrome.bookmarks.getTree(function(bookmarksTree){
            bookmarksTree.forEach(function(bookmark){
                _this.processBookmark(bookmark);
            });
            b.unique_count = b.unique_urls.length;
            d.resolve();
        });

        return d;

    },

    processBookmark : function (bookmark) {

        var _this = this;

        // recursively process child bookmarks
        if(bookmark.children && bookmark.children.length > 0) {
            bookmark.children.forEach(function(child) {
                _this.processBookmark(child);
            });
        }

        _this.dispatchbookmarkInObject(bookmark);

    },

    dispatchbookmarkInObject : function (bookmark) {

        var _this = this;
        var b = _this.bookmarks;

        if (typeof (bookmark.url) == "undefined") {

            _this.setBookmarkFolderInObject(bookmark);

        } else if (b.unique_urls.indexOf(bookmark.url) == -1) {

            _this.setUniqueUrlsInObject(bookmark);

        } else {

            _this.setDuplicateUrlsInObject(bookmark);

        }
    },

    setBookmarkFolderInObject : function (bookmark) {

        var _this = this;
        var b = _this.bookmarks;

        b.unique_bookmarks[b.unique_bookmarks.length] = "folder_"+bookmark.id;
        b.folders[b.folders.length] = bookmark.id;

    },

    setUniqueUrlsInObject : function (bookmark) {

        var _this = this;
        var b = _this.bookmarks;

        b.unique_bookmarks[b.unique_bookmarks.length] = "url_"+bookmark.id+"_"+bookmark.url;
        b.unique_urls_id[b.unique_urls_id.length] = bookmark.id;
        b.unique_urls[b.unique_urls.length] = bookmark.url;

    },

    setDuplicateUrlsInObject : function (bookmark) {

        var _this = this;
        var b = _this.bookmarks;

        b.unique_bookmarks[b.unique_bookmarks.length] = "duplicate_"+bookmark.id+"_"+bookmark.url;
        b.duplicate[b.duplicate.length] = bookmark.id;

    },

    setBookmarksToStorage : function () {

        var _this = this;
        var b = _this.bookmarks;
        var d = $.Deferred();

        _this.setToStorage()('bookmarks.unique_count', b.unique_count).done(function(){
            _this.setToStorage()('bookmarks.unique_urls', b.unique_urls).done(function(){
                _this.setToStorage()('bookmarks.unique_urls_id', b.unique_urls_id).done(function(){
                    _this.setToStorage()('bookmarks.folders', b.folders).done(function(){
                        _this.setToStorage()('bookmarks.duplicate', b.duplicate).done(function(){
                            _this.setToStorage()('bookmarks.unique_bookmarks', b.unique_bookmarks).done(function(){
                                d.resolve();
                            });
                        });
                    });
                });
            });
        });

        return d;

    },

    getBookmarksFromStorage : function () {

        var _this = this;
        var b = _this.bookmarks;
        var d = $.Deferred();

        _this.resetBookmarksObject().done(function(){

            b.unique_count = _this.getFromStorage()('bookmarks.unique_count');
            b.unique_urls = _this.getFromStorage()('bookmarks.unique_urls');
            b.unique_urls_id = _this.getFromStorage()('bookmarks.unique_urls_id');
            b.folders = _this.getFromStorage()('bookmarks.folders');
            b.duplicate = _this.getFromStorage()('bookmarks.duplicate');
            b.unique_bookmarks = _this.getFromStorage()('bookmarks.unique_bookmarks');

            d.resolve();
        })

        return d;

    },

    setToLocalStorage : function (key, value) {

        var d = $.Deferred();

        localStorage[key] = JSON.stringify(value);

        d.resolve();
        return d;
    },

    getFromLocalStorage : function (key) {

        return JSON.parse(localStorage[key]);

    },

    setToChromeStorage : function (key, value) {

        var _this = this;
        var d = $.Deferred();

        console.log(key + ' unsaved to storage');
        // chrome.storage.sync.set({ key : JSON.stringify(value) }, function() {
        //     d.resolve();
        // });
        d.resolve();

        return d;
    },

    getFromChromeStorage : function (key) {

        var _this = this;

        // Save it using the Chrome extension storage API.
        chrome.storage.sync.get(key, function(result) {
            console.log('getFromChromeStorage', result);
            return result[0];
        });
    },

    setToStorage : function() {

        var _this = this;

        if (_this.localStorage) {
            return _this.setToLocalStorage;
        } else {
            return _this.setToChromeStorage;
        }

    },

    getFromStorage : function() {

        var _this = this;

        if (_this.localStorage) {
            return _this.getFromLocalStorage;
        } else {
            return _this.getFromChromeStorage;
        }

    }

}

// chrome.browserAction.onClicked.addListener();

/* OMNIBOX */
chrome.omnibox.onInputChanged.addListener(function(text, suggest) {
    suggest([
      // {content: text + " one", description: "the first one"},
      // {content: text + " number two", description: "the second entry"}
    ]);
});
chrome.omnibox.onInputEntered.addListener(function(text) {
    // alert('You just typed "' + text + '"');
});