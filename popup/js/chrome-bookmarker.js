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

        _this.storage = _this.getStorage();

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

        if(typeof(_this.storage['chromeBookmarksIds']) == "undefined") {

            _this.reInitAllBookmarksAsArray().then(function() {
                d.resolve();
            });

        } else {

            _this.reLoadAllBookmarksAsArray().then(function(){
                d.resolve();
            });

        }

        return d;
    }


    getStorage () {
        return localStorage;
    };

    // CLEAR ALL BOOKMARKS

    clearStorage () {

        var _this = this;

        _this.storage.clear();
        console.log('chromeNativeBookmarker storage cleared');

    }

    clearAllBookmarks () {

        var _this = this;

        _this.chromeBookmarks = {};
        _this.chromeBookmarksOriginal = {};
        _this.chromeBookmarksIds = [];
        _this.chromeBookmarksFolders = [];
        _this.chromeBookmarksDuplicate = [];
        _this.chromeBookmarksUrls = {};

        console.log('chromeNativeBookmarker object cleared');

    }

    // LOAD ALL STORAGE BOOKMARKS
    reLoadAllBookmarksAsArray () {

        var _this = this;
        var d = $.Deferred();

        if(typeof(_this.storage['chromeBookmarksIds']) != "undefined") {

            _this.badge.text = 'load';

            if (typeof(chrome.browserAction) != 'undefined') {
                chrome.browserAction.setBadgeText({text:""+_this.badge.text});
            }

            _this.chromeBookmarksIds = JSON.parse(_this.storage['chromeBookmarksIds']);
            _this.chromeBookmarksFolders = JSON.parse(_this.storage['chromeBookmarksFolders']);
            _this.chromeBookmarksDuplicate = JSON.parse(_this.storage['chromeBookmarksDuplicate']);
            _this.chromeBookmarksUrls = JSON.parse(_this.storage['chromeBookmarksUrls']);

            var refresh = false;
            for (var i = 0; i < _this.chromeBookmarksIds.length; i++) {
                var id = _this.chromeBookmarksIds[i];

                if(typeof(_this.storage['chromeBookmarks_'+id]) == "undefined") {
                    refresh = true;
                } else {
                    _this.chromeBookmarks[id] = JSON.parse(_this.storage['chromeBookmarks_'+id]);
                }
                if(i == _this.chromeBookmarksIds.length-1) {
                    _this.saveAllBookmarksData();
                    if (typeof(chrome.browserAction) != 'undefined') {
                        chrome.browserAction.setBadgeText({text:""+Object.keys(_this.chromeBookmarksUrls).length});
                    }
                    console.log('chromeNativeBookmarker initialized');
                    d.resolve();
                }
            };

        } else {

            console.log('chromeNativeBookmarker no storage available');
            d.resolve();

        }

        return d;

    }
    // RESET ALL BOOKMARKS
    reInitAllBookmarksAsArray () {

        var _this = this;
        var d = $.Deferred();

        chrome.browserAction.setIcon({path: 'img/icon-white16.png'})

        _this.clearStorage();
        _this.clearAllBookmarks();

        if (typeof(chrome.browserAction) != 'undefined') {
            chrome.browserAction.setBadgeText({text:""+_this.badge.text});
        }

        _this.resetAllBookmarksAsArray().then(function() {
            if (typeof(chrome.browserAction) != 'undefined') {
                chrome.browserAction.setBadgeText({text:""+Object.keys(_this.chromeBookmarksUrls).length});
            }

            chrome.browserAction.setIcon({path: 'img/icon16.png'})
            console.log('chromeNativeBookmarker initialized');

            d.resolve();
        });

        return d;

    }

    resetAllBookmarksAsArray () {

        var _this = this;
        var d = $.Deferred();

        _this.getAllChromeBookmarksAsArray().then(function() {
            _this.getAlternativePathsForAllBookmarks().then(function() {
                _this.saveAllChromeBookmarksAsArray().then(function() {
                    if (typeof(chrome.browserAction) != 'undefined') {
                        chrome.browserAction.setBadgeText({text:""+Object.keys(_this.chromeBookmarks).length});
                    }
                    console.log('chromeNativeBookmarker reset');
                    d.resolve();
                });
            });
        });

        return d;

    }

    getAllChromeBookmarksAsArray () {

        var _this = this;
        var d = $.Deferred();

        _this.getAllChromeBookmarks().then(function(){
            _this.addBookmarkToObject(_this.chromeBookmarksOriginal).then(function(){
                console.log('chromeNativeBookmarker all bookmarks retrieved');
                d.resolve();
            });
        });

        return d;
    }

    // SAVING RELATED FUNCTIONS
    saveAllChromeBookmarksAsArray () {

        var _this = this;
        var d = $.Deferred();

        var i = 0;
        for(var id in _this.chromeBookmarks) {
            i++;
            if (typeof(chrome.browserAction) != 'undefined') {
                chrome.browserAction.setBadgeText({text:""+i});
            }

            _this.saveStorageBookmark(id);
            if (i == Object.keys(_this.chromeBookmarks).length) {
                _this.saveAllBookmarksData();
                console.log('chromeNativeBookmarker all bookmarks saved');
                d.resolve();
            }
        }

        return d;
    }

    // OBJECT RELATED FUNCTIONS
    removeObjectBookmark (id) {
        var _this = this;
        var d = $.Deferred();

        var url = _this.chromeBookmarks[id].url;
        if (typeof(url) != 'undefined' && url != '' && typeof(_this.chromeBookmarksUrls[url]) != 'undefined') {
            _this.chromeBookmarksUrls[url].clean(id);
        }
        if(typeof(_this.chromeBookmarksUrls[url]) != 'undefined' && _this.chromeBookmarksUrls[url].length == 0) {
            delete _this.chromeBookmarksUrls[url];
        }

        delete _this.chromeBookmarks[id];

        _this.chromeBookmarksIds.clean(id);
        _this.chromeBookmarksFolders.clean(id);

        _this.chromeBookmarksDuplicate.clean(id);

        _this.saveAllBookmarksData();

        d.resolve();

        return d;
    }

    // STORAGE RELATED FUNCTIONS
    saveStorageBookmark (id) {

        var _this = this;
        var d = $.Deferred();

        _this.storage.setItem('chromeBookmarks_'+id, JSON.stringify(_this.chromeBookmarks[id]));
        d.resolve();

        return d;
    }

    // saveChromeBookmark (id) {

    //     var _this = this;
    //     var d = $.Deferred();

    //     _this.saveStorageBookmark(id);
    //     d.resolve();

    //     return d;
    // }

    removeStorageBookmark (id) {
        var _this = this;
        var d = $.Deferred();

        _this.storage.removeItem('chromeBookmarks_'+id);

        return d;
    }

    saveAllBookmarksData () {

        var _this = this;
        var d = $.Deferred();

        _this.storage.setItem('chromeBookmarksIds', JSON.stringify(_this.chromeBookmarksIds));
        _this.storage.setItem('chromeBookmarksFolders', JSON.stringify(_this.chromeBookmarksFolders));
        _this.storage.setItem('chromeBookmarksDuplicate', JSON.stringify(_this.chromeBookmarksDuplicate));
        _this.storage.setItem('chromeBookmarksUrls', JSON.stringify(_this.chromeBookmarksUrls));

        return d;
    }

    // CHROME RELATED FUNCTIONS
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

    createChromeBookmarks (bookmark) {
        var _this = this;
        var d = $.Deferred();

        // bookmark.parentId
        // bookmark.index
        // bookmark.title
        // bookmark.url

        chrome.bookmarks.create(bookmark, function (chromeBk){

            // dateAdded: 1450866936952
            // id: "173442"
            // index: 101
            // parentId: "2"
            // title: "New Tab"
            // url: "chrome://newtab/"

            _this.addBookmarkToObject(chromeBk).then(function(){
                _this.saveStorageBookmark(chromeBk.id).then(function(){
                    chrome.browserAction.setBadgeText({text:""+Object.keys(_this.chromeBookmarksUrls).length});
                    d.resolve();
                });
            });
        });

        return d;
    }

    removeChromeBookmarks (id) {
        var _this = this;
        var d = $.Deferred();

        chrome.bookmarks.remove(id, function (){
            _this.removeObjectBookmark(id);
            _this.removeStorageBookmark(id);

            chrome.browserAction.setBadgeText({text:""+Object.keys(_this.chromeBookmarksUrls).length});

            d.resolve();
        });

        return d;
    }

    // BOOKMARKS OBJECT RELATED FUNCTIONS
    addBookmarkToObject (bookmark) {

        var _this = this;
        var d = $.Deferred();
        var children = [];

        if (typeof(chrome.browserAction) != 'undefined') {
            chrome.browserAction.setBadgeText({text:""+Object.keys(_this.chromeBookmarks).length});
        }

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
                _this.addBookmarkToObject(child).then(function(){
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

    // ALTERNATIVES PATH RELATED FUNCTIONS
    getAlternativePathsForAllBookmarks () {

        var _this = this;
        var d = $.Deferred();

        var i = 0;
        for(var id in _this.chromeBookmarks) {
            i++;
            if (typeof(chrome.browserAction) != 'undefined') {
                chrome.browserAction.setBadgeText({text:""+i});
            }

            _this.getAlternativePathsForUniqueBookmark(id);

            if (i == Object.keys(_this.chromeBookmarks).length) {
                console.log('chromeNativeBookmarker all bookmarks paths generated');
                d.resolve();
            }

        };

        return d;
    }

    getAlternativePathsForUniqueBookmark (id) {

        var _this = this;
        var d = $.Deferred();

        var paths = _this.getAlternativesTree(id).reverse();
        _this.chromeBookmarks[id].paths = paths;

        return d;
    }

    getBkPath (id) {

        var _this = this;
        var path = '';

        if(typeof(_this.chromeBookmarks[id]) != "undefined" && _this.chromeBookmarks[id].title != '') {
            path = _this.chromeBookmarks[id].title;
        } else if (typeof(_this.chromeBookmarks[id]) != "undefined" && _this.chromeBookmarks[id].id == 0) {
            path = 'root';
        } else if (typeof(_this.chromeBookmarks[id]) != "undefined") {
            path = 'bk_'+_this.chromeBookmarks[id].id;
        }

        return path;

    }

    getParentTree (id) {

        var _this = this;
        var path = '/';
        var parentId = _this.chromeBookmarks[id].parentId;

        path = path + _this.getBkPath(parentId);

        if(typeof(_this.chromeBookmarks[parentId]) != 'undefined' && _this.chromeBookmarks[parentId].parentId) {
            path = _this.getParentTree(parentId) + path;
        }

        return path;

    }

    getTreeLeeves (id) {

        var _this = this;
        var paths = [];

        paths.push(_this.getBkPath(id));

        if(typeof(_this.chromeBookmarks[id]) != 'undefined' && _this.chromeBookmarks[id].parentId) {
            paths = paths.concat(_this.getTreeLeeves(_this.chromeBookmarks[id].parentId));
        }

        return paths;

    }

    getAlternativesTree (id) {

        var _this = this;
        var paths = [];
        var allPaths = [];
        var parentId = _this.chromeBookmarks[id].parentId;

        if(typeof(_this.chromeBookmarks[parentId]) != 'undefined' && _this.chromeBookmarks[parentId].parentId) {
            paths = _this.getTreeLeeves(parentId);
        }

        // allPaths = permutate.getPermutations(paths);

        return paths;

    }


}

console.log('dwl-bookmarker-storage.js loaded');