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

// Author

var dwlBookmarker = {

    storage : {

        bookmarks_unique_count : 0,

        bookmarks_unique_urls : [],

        bookmarks_folders : {},
        bookmarks_unique : {},
        bookmarks_duplicate : {}

    },

    badge : {
        title : function() {

            var _this = this;

            return _this.text + " bookmarks";
        },
        text : "*",
    },

    init : function() {

        var _this = this;

        chrome.browserAction.setBadgeText({text:_this.badge.text});
        _this.setBadgeDisplay();

    },

    refreshBookmarksStorage : function () {

        var _this = this;
        var d = $.Deferred();

        chrome.browserAction.setBadgeText({text:"Load"});

        _this.storage.bookmarks_unique_count = 0;
        _this.storage.bookmarks_unique_urls = [];
        _this.storage.bookmarks_folders = {};
        _this.storage.bookmarks_unique = {};
        _this.storage.bookmarks_duplicate = {};

        chrome.bookmarks.getTree(function(bookmarksTree){
            bookmarksTree.forEach(function(bookmark){
                _this.processBookmark(bookmark);
            });
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

        _this.dispatchbookmarkInStorage(bookmark);

    },

    dispatchbookmarkInStorage : function (bookmark) {

        var _this = this;

        if (typeof (bookmark.url) == "undefined") {

            var bookmarkId = bookmark.id+"_"+bookmark.title;

            if (typeof (bookmark.children) != "undefined") {
                delete bookmark.children;
            }

            if (typeof (_this.storage.bookmarks_folders[bookmarkId]) == "undefined"){
                _this.storage.bookmarks_folders[bookmarkId] = [];
            }

            _this.storage.bookmarks_folders[bookmarkId][_this.storage.bookmarks_folders[bookmarkId].length] = bookmark;

        } else if (_this.storage.bookmarks_unique_urls.indexOf(bookmark.url) == -1) {

            var uniqueId = _this.storage.bookmarks_unique_urls.length;
            _this.storage.bookmarks_unique_count = uniqueId+1;
            _this.storage.bookmarks_unique_urls[uniqueId] = bookmark.url;
            _this.storage.bookmarks_unique[uniqueId] = bookmark;

        } else {

            if (typeof (_this.storage.bookmarks_duplicate[bookmark.url]) == "undefined"){
                _this.storage.bookmarks_duplicate[bookmark.url] = [];
            }
            _this.storage.bookmarks_duplicate[bookmark.url][_this.storage.bookmarks_duplicate[bookmark.url].length] = bookmark;

        }
    },

    setBadgeDisplay : function () {

        var _this = this;
        var d = $.Deferred();

        _this.refreshBookmarksStorage().done(function() {

            _this.badge.text = ""+_this.storage.bookmarks_unique_count;
            if (_this.storage.bookmarks_unique_count > 9999) {
                _this.badge.text = _this.storage.bookmarks_unique_count(0,2)+"k"+_this.storage.bookmarks_unique_count.substring(2,3);
            }

            chrome.browserAction.setBadgeText({text:""+_this.badge.text});
            chrome.browserAction.setTitle({title:_this.badge.title() });

            d.resolve();
            return d;

        });

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