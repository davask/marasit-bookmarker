"use strict";
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

class chromeNativeBookmarker {

    constructor () {

        var _this = this;

        _this.chromeBookmarks = {};
        _this.chromeBookmarksOriginal = {};
        _this.chromeBookmarksIds = [];
        _this.chromeBookmarksFolders = [];
        _this.chromeBookmarksDuplicate = [];
        _this.chromeBookmarksUrls = {};

        _this.storage = function() {
            return localStorage;
        };

        _this.badge = {
            title : function() {
                var _this = this;
                return _this.text + " bookmarks";
            },
            text : "Init",
        };

        console.log('chromeNativeBookmarker instantiate');

    }

    init () {

        var _this = this;
        var d = $.Deferred();

        if(typeof(_this.storage()['chromeBookmarksIds']) == "undefined") {

            chrome.browserAction.setBadgeText({text:""+_this.badge.text});

            _this.resetAllBookmarksAsArray().then(function() {
                chrome.browserAction.setBadgeText({text:""+Object.keys(_this.chromeBookmarksUrls).length});
                console.log('chromeNativeBookmarker initialized');
                d.resolve();
            });

        } else {

            _this.badge.text = 'load';
            chrome.browserAction.setBadgeText({text:""+_this.badge.text});

            _this.chromeBookmarksIds = JSON.parse(_this.storage()['chromeBookmarksIds']);
            _this.chromeBookmarksFolders = JSON.parse(_this.storage()['chromeBookmarksFolders']);
            _this.chromeBookmarksDuplicate = JSON.parse(_this.storage()['chromeBookmarksDuplicate']);
            _this.chromeBookmarksUrls = JSON.parse(_this.storage()['chromeBookmarksUrls']);

            for (var i = 0; i < _this.chromeBookmarksIds.length; i++) {
                var id = _this.chromeBookmarksIds[i];
                _this.chromeBookmarks[id] = JSON.parse(_this.storage()['chromeBookmarks_'+id]);
                if(i == _this.chromeBookmarksIds.length-1) {
                    chrome.browserAction.setBadgeText({text:""+Object.keys(_this.chromeBookmarksUrls).length});
                    console.log('chromeNativeBookmarker initialized');
                    d.resolve();
                }
            };

        }

        return d;
    }

    resetAllBookmarksAsArray () {

        var _this = this;
        var d = $.Deferred();

        _this.getAllChromeBookmarksAsArray().then(function() {
            _this.saveAllChromeBookmarksAsArray().then(function() {
                chrome.browserAction.setBadgeText({text:""+Object.keys(_this.chromeBookmarks).length});
                console.log('chromeNativeBookmarker reset');
                d.resolve();
            });
        });

        return d;

    }

    getAllChromeBookmarksAsArray () {

        var _this = this;
        var d = $.Deferred();

        _this.getAllChromeBookmarks().then(function(){

            _this.addBookmarkToArray(_this.chromeBookmarksOriginal).then(function(){
                console.log('chromeNativeBookmarker all bookmarks retrieved');
                d.resolve();
            });

        });

        return d;
    }

    saveAllChromeBookmarksAsArray () {

        var _this = this;
        var d = $.Deferred();

        var i = 0;
        for(var id in _this.chromeBookmarks) {
            i++;
            chrome.browserAction.setBadgeText({text:""+i});

            _this.storage().setItem('chromeBookmarks_'+id, JSON.stringify(_this.chromeBookmarks[id]));
            if (i == Object.keys(_this.chromeBookmarks).length) {
                _this.storage().setItem('chromeBookmarksIds', JSON.stringify(_this.chromeBookmarksIds));
                _this.storage().setItem('chromeBookmarksFolders', JSON.stringify(_this.chromeBookmarksFolders));
                _this.storage().setItem('chromeBookmarksDuplicate', JSON.stringify(_this.chromeBookmarksDuplicate));
                _this.storage().setItem('chromeBookmarksUrls', JSON.stringify(_this.chromeBookmarksUrls));
                console.log('chromeNativeBookmarker all bookmarks saved');
                d.resolve();
            }
        }

        return d;
    }

    getAllChromeBookmarks () {
        var _this = this;
        var d = $.Deferred();

        chrome.bookmarks.getTree(function(bookmarksTree){
            bookmarksTree.forEach(function(bookmark){
                _this.chromeBookmarksOriginal = bookmark;
            });
            d.resolve();
        });

        return d;
    }

    addBookmarkToArray (bookmark) {

        var _this = this;
        var d = $.Deferred();
        var children = [];

        chrome.browserAction.setBadgeText({text:""+Object.keys(_this.chromeBookmarks).length});
        _this.chromeBookmarksIds.push(bookmark.id);
        if(typeof(bookmark.url) !== 'undefined' && bookmark.url != '') {
            if(typeof(_this.chromeBookmarksUrls[bookmark.url]) == 'undefined') {
                _this.chromeBookmarksUrls[bookmark.url] = [];
            }
            if (_this.chromeBookmarksUrls[bookmark.url].length > 0) {
                _this.chromeBookmarksDuplicate.push(bookmark.id);
            }
            _this.chromeBookmarksUrls[bookmark.url].push(bookmark.id);
        } else {
            _this.chromeBookmarksFolders.push(bookmark.id);
        }
        if(bookmark.children && bookmark.children.length > 0) {
            children = bookmark.children;
        }
        bookmark.children = [];

        // recursively process child bookmarks
        if(children && children.length > 0) {

            var child = {};
            for (var i = 0; i < children.length; i++) {
                child = children[i];
                bookmark.children.push(child.id);
                _this.addBookmarkToArray(child).then(function(){
                    if(i == children.length-1) {
                        _this.chromeBookmarks[bookmark.id] = bookmark;
                        d.resolve();
                    }
                });
            };

        } else {
            _this.chromeBookmarks[bookmark.id] = bookmark;
            d.resolve();
        }

        return d;
    }

}

console.log('dwl-bookmarker-storage.js loaded');