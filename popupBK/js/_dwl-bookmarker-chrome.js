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

console.log('dwl-bookmarker-chrome.js loaded');