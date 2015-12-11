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

console.log('dwl-bookmarker.js loaded');