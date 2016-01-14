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

class storageBookmarker {

    constructor () {

        var _this = this;

        _this.localStorage = true; // false to store with chrome.storage / true to store in localStorage

        _this.bookmark = {};
        _this.allBookmarks = [];
        _this.allBookmarksById = {};
        _this.allOriginalBookmarksById = {};

        _this.bookmarks = {

            unique_count : 0,
            unique_urls_id : [],
            unique_urls : [],

            unique_bookmarks : [],

            folders : [],
            duplicate : []

        };

        _this.b = {};
        _this.t = [];
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

        _this.allOriginalBookmarksById[bookmark.id] = bookmark;

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
        _this.allBookmarksById[bookmark.id] = b;

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

    getBookmarksTags () {

        var _this = this;
        var d = $.Deferred();
        var b = _this.allBookmarks;

        var tags = ['dwl-noTag'];
        var inputs = {'dwl-noTag':[]};

        // console.log(Array.isArray(b), b.length, b);

        for (var i = 0; i < b.length; i++) {

            if (b[i].tags.length > 0) {

                for (var y = 0; y < b[i].tags.length; y++) {

                    // b[i].tags[y] = b[i].tags[y].toLowerCase();
                    b[i].tags[y] = b[i].tags[y];

                    if (typeof(inputs[b[i].tags[y]]) == "undefined") {
                        inputs[b[i].tags[y]] = [];
                    }
                    inputs[b[i].tags[y]].push(b[i].id);

                }

                tags = tags.concat(b[i].tags);

            } else {

                inputs['dwl-noTag'].push(b[i].id);

            }

        }

        tags = tags.unique();

        for (var i = 0; i < tags.length; i++) {
            _this.t.push({
                'index' : i,
                'tag' : tags[i],
                'data' : tags[i],
                'ids' :inputs[tags[i]]
            });
            if (i == tags.length-1) {
                d.resolve();
            }
        }

        return d;
    }

    getBookmarkTags (title){

        var _this = this;
        var s = _this.tagRegexSep.join('');

        var tags = [];
        var tagsArray = [];
        var allTags = [];

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

        return tags.unique();

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

console.log('dwl-bookmarker-storage.js loaded');