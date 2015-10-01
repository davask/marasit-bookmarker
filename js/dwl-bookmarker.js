"use strict";
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

Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};

Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};

// Author
class storageBookmarker {

    constructor () {

        var _this = this;

        _this.localStorage = true; // false to store with chrome.storage / true to store in localStorage

        _this.bookmark = {};
        _this.allBookmarks = [];

        _this.bookmarks = {

            unique_count : 0,
            unique_urls_id : [],
            unique_urls : [],

            unique_bookmarks : [],

            folders : [],
            duplicate : []

        };

        _this.b = {};
        _this.tagRegexSep = [
            '\\s',
            '!',
            '\\/',
            '#',
            '@'
        ];
        _this.tagSep = [
            ' ',
            '!',
            '/',
            '#',
            '@'
        ];

    }

    refreshBookmarksStorage () {

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

    }

    resetBookmarksStorage () {

        var _this = this;
        var b = _this.bookmarks;
        var d = $.Deferred();

        _this.resetBookmarksObject();

        _this.setBookmarksToStorage().done(function() {
            d.resolve();
        });

        return d;

    }

    resetBookmarksObject () {

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

    }

    getBookmarkObject (id) {

        var _this = this;
        _this.b = {};
        var d = $.Deferred();

        chrome.bookmarks.get(id, function(bookmarks){
            _this.b = _this.setSpecificBookmarksData (bookmarks[0]);
            d.resolve();
        });

        return d;

    }

    setBookmarkObject (id, title) {

        var _this = this;
        _this.b = {};
        var d = $.Deferred();

        chrome.bookmarks.update(id, { 'title': title }, function (){
            d.resolve();
        });

        return d;

    }

    rebuildBookmarksObject () {

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

    }

    processBookmark (bookmark) {

        var _this = this;

        // recursively process child bookmarks
        if(bookmark.children && bookmark.children.length > 0) {
            bookmark.children.forEach(function(child) {
                _this.processBookmark(child);
            });
        }

        _this.dispatchbookmarkInObject(bookmark);

    }

    dispatchbookmarkInObject (bookmark) {

        var _this = this;
        var b = _this.bookmarks;

        if (typeof (bookmark.url) == "undefined") {

            _this.setBookmarkFolderInObject(bookmark);

        } else if (b.unique_urls.indexOf(bookmark.url) == -1) {

            _this.setUniqueUrlsInObject(bookmark);

        } else {

            _this.setDuplicateUrlsInObject(bookmark);

        }
    }

    setBookmarkFolderInObject (bookmark) {

        var _this = this;
        var b = _this.bookmarks;

        b.unique_bookmarks[b.unique_bookmarks.length] = "folder_"+bookmark.id;
        b.folders[b.folders.length] = bookmark.id;

    }

    setSpecificBookmarksData (bookmark) {

        var _this = this;

        bookmark.safeUrl = _this.getSafeUrl(bookmark.url);
        bookmark.favicon = _this.getFavicon(bookmark.safeUrl);
        bookmark.tags = _this.getBookmarkTags(bookmark.title);
        bookmark.titleNoTag = _this.getTitleNoTag(bookmark.title);

        return bookmark;

    }

    setUniqueUrlsInObject (bookmark) {

        var _this = this;
        var b = _this.bookmarks;

        b.unique_bookmarks[b.unique_bookmarks.length] = "url_"+bookmark.id+"_"+bookmark.url;
        b.unique_urls_id[b.unique_urls_id.length] = bookmark.id;
        b.unique_urls[b.unique_urls.length] = bookmark.url;

        var b = _this.setSpecificBookmarksData(bookmark);

        _this.allBookmarks[_this.allBookmarks.length] = b;

    }

    setDuplicateUrlsInObject (bookmark) {

        var _this = this;
        var b = _this.bookmarks;

        b.unique_bookmarks[b.unique_bookmarks.length] = "duplicate_"+bookmark.id+"_"+bookmark.url;
        b.duplicate[b.duplicate.length] = bookmark.id;

    }

    getFavicon (url) {

        var _this = this;

        var favicon = '';
        var faviconArray = [];
        var regex = '^https?:\\/\\/?[\\da-z\\.-]+\\.[a-z\\.]{2,6}';

        faviconArray = url.match(regex);

        if (faviconArray != null && faviconArray.length > 0) {
            favicon = faviconArray[0]+'/favicon.ico';
        }

        return favicon;

    }

    getSafeUrl (url) {

        var _this = this;

        var safeUrl = '';
        var safeUrlArray = [];
        var regex = '^https?:\\/\\/?[\\da-z\\.-]+\\.[a-z\\.]{2,6}.*$';

        safeUrlArray = url.match(regex);

        if (safeUrlArray != null && safeUrlArray.length > 0) {
            safeUrl = url;
        }

        return safeUrl;

    }

    getBookmarkTags (title){

        var _this = this;
        var s = _this.tagRegexSep.join('');

        var tags = [];
        var tagsArray = [];
        var allTags = '';

        var regexAllTags = '^\\[((?:['+s+']?[^\\]'+s+')]*)*)\\]\\s?';
        var regexEachTags = '\\s?['+s+']?[^\\]\\s'+s+']*';

        allTags = title.match(regexAllTags);
        if (allTags != null && allTags.length > 0) {
            tagsArray = allTags[1].match(new RegExp(regexEachTags,'g')).clean("");
        }

        if (tagsArray != null && tagsArray.length > 0) {
            for (var i = 0; i < tagsArray.length; i++) {
                tags.push(tagsArray[i].trim());
            }
        }

        return tags;

    }

    getTitleNoTag (title){

        var _this = this;
        var s = _this.tagRegexSep.join('');

        var titleNoTag = "";
        var titleNoTagArray = [];

        var regex = '^(?:\\[(?:(?:['+s+']?[^\\]'+s+')]*)*)\\]\\s?)(.*)$';
        titleNoTagArray = title.match(regex);

        if (titleNoTagArray != null && titleNoTagArray.length > 0) {
            titleNoTag = titleNoTagArray[1];
        }

        return titleNoTag;

    }



}

class chromeBookmarker extends storageBookmarker {

    constructor (options) {

        super();
        var _this = this;

        _this.settings = {
            limit : 10,
            page : 0,
            init : false,
            pages : 0
        }

        if(typeof(options) == 'undefined') {
            options = {};
        }

        jQuery.extend( _this.settings, options );

        if(_this.settings.init == true) {
            _this.retrieve().done(function(){
                _this.initPagination();
                // console.log('chromeBookmarker instantiate');
            });
        } else {
            // console.log('chromeBookmarker instantiate');
        }

    }

    retrieve () {

        var _this = this;
        var d = $.Deferred();

        _this.getBookmarksFromStorage().done(function(){
            // console.log('bookmarks retrieved');
            d.resolve();
        });

        return d;

    }

    initPagination () {

        var _this = this;

        _this.settings.pages = Math.ceil(_this.bookmarks.unique_count / _this.settings.limit);
        // console.log('pagination instantiate');

    }

    searchChromeBookmark (search){

        var _this = this;
        var b = _this.bookmarks;
        var d = $.Deferred();

        chrome.bookmarks.search(search, function(bookmarks){
            // console.log(bookmarks);
            d.resolve();
        });

        return d;
    }

    getRootChromeBookmark (){

        var _this = this;
        var b = _this.bookmarks;
        var d = $.Deferred();

        chrome.bookmarks.get("0", function(bookmarks){
            // console.log(bookmarks[0]);
        });

        d.resolve();

        return d;
    }

    setBookmarksToStorage () {

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

    }

    getBookmarksFromStorage () {

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

    }

    setToLocalStorage (key, value) {

        var d = $.Deferred();

        localStorage[key] = JSON.stringify(value);

        d.resolve();
        return d;
    }

    getFromLocalStorage (key) {

        return JSON.parse(localStorage[key]);

    }

    setToChromeStorage (key, value) {

        var _this = this;
        var d = $.Deferred();

        // console.log(key + ' unsaved to storage');
        // chrome.storage.sync.set({ key : JSON.stringify(value) }, function() {
        //     d.resolve();
        // });
        d.resolve();

        return d;
    }

    getFromChromeStorage (key) {

        var _this = this;

        // Save it using the Chrome extension storage API.
        chrome.storage.sync.get(key, function(result) {
            // console.log('getFromChromeStorage', result);
            return result[0];
        });
    }

    setToStorage () {

        var _this = this;

        if (_this.localStorage) {
            return _this.setToLocalStorage;
        } else {
            return _this.setToChromeStorage;
        }

    }

    getFromStorage () {

        var _this = this;

        if (_this.localStorage) {
            return _this.getFromLocalStorage;
        } else {
            return _this.getFromChromeStorage;
        }

    }

}

class dwlBookmarker extends chromeBookmarker {

    constructor () {
        super();
        var _this = this;

        _this.badge = {
            title : function() {
                var _this = this;
                return _this.text + " bookmarks";
            },
            text : "load",
        };

        console.log('dwlBookmarker instantiate');

    }

    init () {

        var _this = this;
        var d = $.Deferred();

        chrome.browserAction.setBadgeText({text:_this.badge.text});

        _this.refreshBookmarksStorage().done(function() {
            _this.initPagination();
            _this.setBadgeDisplay();
            console.log('bookmarks initialized');
            d.resolve();
        });

        return d;
    }

    setBadgeDisplay () {

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

console.log('dwl-bookmarker.js loaded');