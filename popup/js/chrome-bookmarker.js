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
var chromeMixedBookmarker = {

    /* INSTANTIATE */
    'instantiate' : function() {

        var _this = this;

        _this = merge(_this, chromeLog.init());
        _this.logs[_this.name+'.instantiate'] = 'chromeMixedBookmarker instantiated';
        _this.logs[_this.name+'.reLoadAllBookmarksAsArray'] = 'All bookmarks reloaded as array';
        _this.logs['storage'+'.reLoadAllBookmarksAsArray'] = 'chromeNativeBookmarker no storage available';
        _this.logs[_this.name+'.reInitAllBookmarksAsArray'] = 'All bookmarks reinitialized as array';

        _this = merge(_this, chromeBookmarksBookmarker.init());
        _this = merge(_this, chromeStorageBookmarker.init());
        _this = merge(_this, chromeBookmarker.init());
        if (typeof _this.tagBk['tagSep'] == 'undefined') {
            _this.tagBk = new tagManagerBookmarker();
        }

        _this.initialized = true;
        _this.log(_this.name+'.instantiate');

    },

    /* VAR */
   'initialized' : false,
   'name' : 'mixed',

    /* FUNCTIONS */
    // LOAD ALL STORAGE BOOKMARKS
    'reLoadAllBookmarksAsArray' : function () {

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
            _this.chromeBookmarksTags = JSON.parse(_this.storage['chromeBookmarksTags']);
            _this.chromeBookmarksTagsIds = JSON.parse(_this.storage['chromeBookmarksTagsIds']);

            var refresh = false;
            for (var i = 0; i < _this.chromeBookmarksIds.length; i++) {
                var id = _this.chromeBookmarksIds[i];

                if(typeof(_this.storage['chromeBookmarks_'+id]) == "undefined") {
                    refresh = true;
                } else {
                    _this.chromeBookmarks[id] = JSON.parse(_this.storage['chromeBookmarks_'+id]);
                }
                _this.chromeBookmarks[id] = _this.tagBk.setSpecificTagData(_this.chromeBookmarks[id]);
                if(i == _this.chromeBookmarksIds.length-1) {
                    _this.saveAllBookmarksData();
                    if (typeof(chrome.browserAction) != 'undefined') {
                        chrome.browserAction.setBadgeText({text:""+Object.keys(_this.chromeBookmarksUrls).length});
                    }
                    _this.log(_this.name+'.reLoadAllBookmarksAsArray')
                    d.resolve(_this);
                }
            };

        } else {

            _this.log('storage'+'.reLoadAllBookmarksAsArray')
            d.resolve(_this);

        }

        return d;

    },

    // RESET ALL BOOKMARKS
    'reInitAllBookmarksAsArray' : function () {

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

            chrome.browserAction.setIcon({path: 'img/icon16.png'});
            _this.log(_this.name+'.reInitAllBookmarksAsArray')

            d.resolve(_this);
        });

        return d;

    },

    'resetAllBookmarksAsArray' : function () {

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

    },

    'getAllChromeBookmarksAsArray' : function () {

        var _this = this;
        var d = $.Deferred();

        _this.getAllChromeBookmarks().then(function(){
            _this.addBookmarkToObject(_this.chromeBookmarksOriginal).then(function(){
                console.log('chromeNativeBookmarker all bookmarks retrieved');
                d.resolve();
            });
        });

        return d;
    },

    'clearAllBookmarks' : function () {

        var _this = this;

        _this.clearBookmarks();
        _this.clearBookmarksOriginal();

        _this.log(_this.name+'.clearAllBookmarks');
    },

    'removeObjectBookmark' : function (id) {
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
    },

    'addBookmarkToObject' : function (bookmark) {

        var _this = this;
        var d = $.Deferred();
        var children = [];
        var thisTags = [];

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

        if(typeof(bookmark.title) && bookmark.title.trim() != '') {

            thisTags = _this.tagBk.getBookmarkTags(bookmark.title);

            for (var i = 0; i < thisTags.length; i++) {
                _this.addTags(thisTags[i], bookmark.id);
            };

            if(thisTags.length == 0) {
                _this.addTags('no-tag', bookmark.id);
            }

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
    },

    'getAlternativePathsForAllBookmarks' : function () {

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
    },

    'searchObjectBookmark' : function (search, type) {

        var _this = this;
        var d = $.Deferred();

        _this.chromeBookmarksIds = JSON.parse(_this.storage['chromeBookmarksIds']);

        if (typeof(type) == "undefined") {
            type = "unique";
        }

        if (type == "unique") {
            var bks = {};
            var bkType = 'url';
            var bkObject = 'chromeBookmarksUrls';
        }

        _this.searchChromeBookmark(search).then(function(bookmarks){
            for (var i = 0; i < bookmarks.length; i++) {

                if (typeof(bookmarks[i][bkType]) != "undefined" && jQuery.inArray(bookmarks[i].id,_this.chromeBookmarksIds)) {
                    bks[bookmarks[i][bkType]] = _this[bkObject][bookmarks[i][bkType]];
                }

            };

            d.resolve(bks);
        });

        return d;
    },

    /* INIT */
    'init' : function () {
        var _this = this;
        if (!_this.initialized) {
            _this.instantiate();
        }
        return _this;
    }

};

var chromeObjectBookmarker = {

    /* INSTANTIATE */
    'instantiate' : function() {

        var _this = this;

        _this = merge(_this, chromeLog.init());
        _this.logs[_this.name+'.instantiate'] = 'chromeObjectBookmarker instantiated';

        _this.initialized = true;
        _this.log(_this.name+'.instantiate');

    },

    /* VAR */
   'initialized' : false,
   'name' : 'object',

    /* FUNCTIONS */
    'setUpBookmark' : function(bookmark){

        var _this = this;

        bookmark = _this.tagBk.setSpecificTagData(bookmark);

        bookmark['storage'] = {};
        if (typeof(_this.storage['chromeBookmarks_'+bookmark.id]) != 'undefined') {
           bookmark['storage'] = JSON.parse(_this.storage['chromeBookmarks_'+bookmark.id]);
        }

        bookmark.storage['tagsBasedPaths'] = [];
        if (typeof(bookmark.storage.paths) != "undefined") {
            bookmark.storage['tagsBasedPaths'] = _this.tagBk.setTagsBasedOnPaths(bookmark.storage.paths);
        }

        _this.chromeBookmarks[bookmark.id] = bookmark;

        return bookmark;

    },

    /* INIT */
    'init' : function () {
        var _this = this;
        if (!_this.initialized) {
            _this.instantiate();
        }
        return _this;
    }

};

var chromeTagsBookmarker = {

    /* INSTANTIATE */
    'instantiate' : function() {

        var _this = this;

        _this = merge(_this, chromeLog.init());
        _this.logs[_this.name+'.instantiate'] = 'chromeTagsBookmarker instantiated';

        _this.initialized = true;
        _this.log(_this.name+'.instantiate');

    },

    /* VAR */
   'initialized' : false,
   'name' : 'tags',

    /* FUNCTIONS */
    'cleanTags' : function (tagValue, bkId) {

        var _this = this;
        var d = $.Deferred();

        _this.chromeBookmarksTagsIds[tagValue].clean(bkId);
        if(_this.chromeBookmarksTagsIds[tagValue].length == 0) {
            delete _this.chromeBookmarksTagsIds[tagValue];
            _this.chromeBookmarksTags.clean(tagValue.trim());
        }
        d.resolve();

        return d;

    },

    'addTags' : function (tagValue, bkId) {

        var _this = this;
        var d = $.Deferred();

        tagValue = tagValue.trim();

        if(typeof(_this.chromeBookmarksTagsIds[tagValue]) == 'undefined') {
            _this.chromeBookmarksTagsIds[tagValue] = [];
        }
        _this.chromeBookmarksTagsIds[tagValue].push(bkId);
        _this.chromeBookmarksTagsIds[tagValue] = _this.chromeBookmarksTagsIds[tagValue].unique();

        _this.chromeBookmarksTags.push(tagValue);
        _this.chromeBookmarksTags = _this.chromeBookmarksTags.unique();

        d.resolve();

        return d;

    },

    /* INIT */
    'init' : function () {
        var _this = this;
        if (!_this.initialized) {
            _this.instantiate();
        }
        return _this;
    }

};

// var chromeNativeBookmarker = {

//     /* INSTANTIATE */
//     'instantiate' : function() {
//         this.initialized = true;
//         this.log('logs.instantiate');
//     },

//     /* VAR */
//    'initialized' : false,
//    'name' : 'native',

//     /* FUNCTIONS */

//     /* INIT */
//     'init' : function () {
//         if (!this.initialized) {
//             this.instantiate();
//         }
//         return this;
//     }

// };

var chromeBadgeBookmarker = {

    /* INSTANTIATE */
    'instantiate' : function() {
        var _this = this;
        _this = merge(_this, chromeLog.init());
        _this.logs[_this.name+'.instantiate'] = 'chromeBadgeBookmarker instantiated';

        _this.initialized = true;
        _this.log(_this.name+'.instantiate');

    },

    /* VAR */
    'initialized' : false,
    'name' : 'badge',

    'badge' : {
        title : function() {
            var _this = this;
            return _this.text + " bookmarks";
        },
        text : "Init",
    },

    /* INIT */
    'init' : function () {
        var _this = this;
        if (!_this.initialized) {
            _this.instantiate();
        }
        return _this;
    }

};

var chromeStorageBookmarker = {

    /* INSTANTIATE */
    'instantiate' : function () {

        var _this = this;
        _this.storage = _this.getStorage();

        _this = merge(_this, chromeLog.init());
        _this.logs[_this.name+'.allBkSaved'] = 'chromeNativeBookmarker all bookmarks saved';
        _this.logs[_this.name+'.clearStorage'] = 'chromeStorageBookmarker storage cleared';
        _this.logs[_this.name+'.instantiate'] = 'chromeStorageBookmarker instantiated';

        _this.initialized = true;
        _this.log(_this.name+'.instantiate');
    },

    /* VAR */
    'initialized' : false,
    'name' : 'storage',

    'storage' : {},

    /* FUNCTIONS */
    'getStorage' : function () {
        return localStorage;
    },

    // clear all bookmarks
    'clearStorage' : function () {
        var _this = this;
        _this.storage.clear();

        _this.log(_this.name+'.clearStorage');
    },

    'saveStorageBookmark' : function (id) {

        var _this = this;
        var d = $.Deferred();

        _this.storage.setItem('chromeBookmarks_'+id, JSON.stringify(_this.chromeBookmarks[id]));
        d.resolve();

        return d;
    },

    'removeStorageBookmark' : function (id) {
        var _this = this;
        var d = $.Deferred();

        _this.storage.removeItem('chromeBookmarks_'+id);

        return d;
    },

    'saveAllBookmarksData' : function () {

        var _this = this;
        var d = $.Deferred();

        _this.storage.setItem('chromeBookmarksIds', JSON.stringify(_this.chromeBookmarksIds));
        _this.storage.setItem('chromeBookmarksFolders', JSON.stringify(_this.chromeBookmarksFolders));
        _this.storage.setItem('chromeBookmarksDuplicate', JSON.stringify(_this.chromeBookmarksDuplicate));
        _this.storage.setItem('chromeBookmarksUrls', JSON.stringify(_this.chromeBookmarksUrls));
        _this.storage.setItem('chromeBookmarksTags', JSON.stringify(_this.chromeBookmarksTags));
        _this.storage.setItem('chromeBookmarksTagsIds', JSON.stringify(_this.chromeBookmarksTagsIds));

        return d;
    },

    'saveAllChromeBookmarksAsArray' : function () {

        var _this = this;
        var d = $.Deferred();

        var i = 0;
        for(var id in _this.chromeBookmarks) {
            i++;
            if (typeof(chrome.browserAction) != 'undefined') {
                chrome.browserAction.setBadgeText({text:""+i});
            }

            _this.chromeBookmarks[id] = _this.tagBk.setSpecificTagData(_this.chromeBookmarks[id]);

            _this.saveStorageBookmark(id);
            if (i == Object.keys(_this.chromeBookmarks).length) {
                _this.saveAllBookmarksData();
                _this.log(_this.name+'.allBkSaved');
                d.resolve();
            }
        }

        return d;
    },

    /* INIT */
    'init' : function () {
        var _this = this;
        if (!_this.initialized) {
            _this.instantiate();
        }
        return _this;
    }

};

var chromeBookmarksBookmarker = {

    /* INSTANTIATE */
    'instantiate' : function() {

        var _this = this;

        _this = merge(_this, chromeLog.init());
        _this.logs[_this.name+'.instantiate'] = 'chromeBookmarksBookmarker instantiate';
        _this.logs[_this.name+'.clearBookmarks'] = 'chromeBookmarksBookmarker object cleared';

        _this.initialized = true;
        _this.log(_this.name+'.instantiate');

    },

    /* VAR */
    'initialized' : false,
    'name' : 'bookmarks',

    'chromeBookmarks' : {},
    'chromeBookmarksIds' : [],
    'chromeBookmarksFolders' : [],
    'chromeBookmarksDuplicate' : [],
    'chromeBookmarksUrls' : {},
    'chromeBookmarksTags' : [],
    'chromeBookmarksTagsIds' : {},

    /* FUNCTIONS */
    'clearBookmarks' : function () {

        this.chromeBookmarks = {};
        this.chromeBookmarksIds = [];
        this.chromeBookmarksFolders = [];
        this.chromeBookmarksDuplicate = [];
        this.chromeBookmarksUrls = {};
        this.chromeBookmarksTags = [];
        this.chromeBookmarksTagsIds = {};

        this.log(this.name+'.clearBookmarks');

    },

    /* INIT */
    'init' : function () {

        var _this = this;

        if (!_this.initialized) {
            _this.instantiate();
        }
        return _this;
    }

};

var chromeBookmarker = {

    /* INSTANTIATE */
    'instantiate' : function() {

        var _this = this;
        var d = $.Deferred();

        _this = merge(_this, chromeLog.init());
        _this.logs[_this.name+'.instantiate'] = 'chromeBookmarker instantiate';
        _this.logs[this.name+'.clearAllBookmarks'] = 'chromeBookmarker object cleared';

        if (typeof _this.tagBk['tagSep'] == 'undefined') {
            _this.tagBk = new tagManagerBookmarker();
        }

        _this = merge(_this, chromeBadgeBookmarker.init());
        _this = merge(_this, chromeStorageBookmarker.init());
        _this = merge(_this, chromeBookmarksBookmarker.init());
        _this = merge(_this, chromeObjectBookmarker.init());
        _this = merge(_this, chromeExtensionBookmarker.init());
        _this = merge(_this, chromeNativeBookmarker.init());
        _this = merge(_this, chromeMixedBookmarker.init());
        _this = merge(_this, chromeTagsBookmarker.init());

        if(typeof(_this.storage['chromeBookmarksIds']) == "undefined") {

            _this.reInitAllBookmarksAsArray().then(function() {
                d.resolve(_this);
            });

        } else {

            _this.reLoadAllBookmarksAsArray().then(function(){
                d.resolve(_this);
            });

        }

        _this.log(_this.name+'.instantiate');

        return d;

    },

    /* VAR */
    'initialized' : false,
    'name' : 'bookmarker',

    'tagBk' : {},

    /* FUNCTIONS */
    'updateBookmarkObjectTitle' : function (bookmark) {

        var _this = this;
        var d = $.Deferred();

        _this.chromeBookmarks[bookmark.id].title = bookmark.title;
        d.resolve();

        return d;
    },

    'updateBookmarkObjectUrl' : function (bookmark) {

        var _this = this;
        var d = $.Deferred();

        _this.chromeBookmarks[bookmark.id].url = bookmark.url;
        d.resolve();

        return d;
    },

    'getAlternativePathsForUniqueBookmark' : function (id) {

        var _this = this;
        var d = $.Deferred();

        var paths = _this.getAlternativesTree(id).reverse();
        _this.chromeBookmarks[id].paths = paths;

        return d;
    },

    'getBkPath' : function (id) {

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

    },

    'getParentTree' : function (id) {

        var _this = this;
        var path = '/';
        var parentId = _this.chromeBookmarks[id].parentId;

        path = path + _this.getBkPath(parentId);

        if(typeof(_this.chromeBookmarks[parentId]) != 'undefined' && _this.chromeBookmarks[parentId].parentId) {
            path = _this.getParentTree(parentId) + path;
        }

        return path;

    },

    'getTreeLeeves' : function (id) {

        var _this = this;
        var paths = [];

        paths.push(_this.getBkPath(id));

        if(typeof(_this.chromeBookmarks[id]) != 'undefined' && _this.chromeBookmarks[id].parentId) {
            paths = paths.concat(_this.getTreeLeeves(_this.chromeBookmarks[id].parentId));
        }

        return paths;

    },

    'getAlternativesTree' : function (id) {

        var _this = this;
        var paths = [];
        var allPaths = [];
        var parentId = _this.chromeBookmarks[id].parentId;

        if(typeof(_this.chromeBookmarks[parentId]) != 'undefined' && _this.chromeBookmarks[parentId].parentId) {
            paths = _this.getTreeLeeves(parentId);
        }

        // allPaths = permutate.getPermutations(paths);

        return paths;

    },

    /* INIT */
    'init' : function () {

        var _this = this;
        var d = $.Deferred();

        if (!_this.initialized) {
            _this.instantiate().then(function(){
                d.resolve(_this);
            });
        }
        return d;
    }

};
console.log('chrome-bookmarker.js loaded');