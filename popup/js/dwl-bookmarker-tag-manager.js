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

class tagManagerBookmarker {

    constructor () {

        var _this = this;

        _this.t = [];
        _this.tagRegexSep = [
            '\\s',
            '!',
            '\\/',
            '#',
            '@',
            '$',
            '§'
        ];
        _this.tagRegexCleaner = [
            '\\s',
            ','
        ];
        _this.tagSep = [
            ' ',
            '!',
            '/',
            '#',
            '@',
            '$',
            '§'
        ];

        _this.regex = '^https?:\\/\\/?[\\da-z\\.-]+\\.[a-z\\.]{2,6}';
        _this.regexUrl = '^https?:\\/\\/?[\\da-z\\.-]+\\.[a-z\\.]{2,6}.*$';
        _this.regexTitle = function(s) {
            return '^(?:\\[(?:(?:['+s+']?[^\\]'+s+')]*)*)\\]\\s?)(.*)$';
        };
        _this.regexAllTags = function(s) {
            return '^\\[((?:['+s+']?[^\\]'+s+')]*)*)\\]\\s?';
        };
        _this.regexEachTags = function(s) {
            return '\\s?['+s+']?[^\\]\\s'+s+']*';
        };
        _this.regexCleanTag = '\\s|,';

        console.log('tagManagerBookmarker initialized');

    }

    getFavicon (url) {

        var _this = this;

        var favicon = '';
        var faviconArray = [];

        faviconArray = url.match(_this.regex);

        if (faviconArray != null && faviconArray.length > 0) {
            favicon = faviconArray[0]+'/favicon.ico';
        }

        return favicon;

    }

    getSafeUrl (url) {

        var _this = this;

        var safeUrl = '';
        var safeUrlArray = [];

        safeUrlArray = url.match(_this.regexUrl);

        if (safeUrlArray != null && safeUrlArray.length > 0) {
            safeUrl = url;
        }

        return safeUrl;

    }

    getBookmarkTags (title){

        var _this = this;
        var s = _this.tagRegexSep.join('');
        var c = _this.tagRegexCleaner.join('');

        var tags = [];
        var tagsArray = [];
        var allTags = [];

        allTags = title.match(_this.regexAllTags(s));
        if (allTags != null && allTags.length > 0) {
            tagsArray = allTags[1].match(new RegExp(_this.regexEachTags(s),'g'));
            tagsArray.clean("");
        }

        if (tagsArray != null && tagsArray.length > 0) {
            for (var i = 0; i < tagsArray.length; i++) {
                tags.push((tagsArray[i].trim().replace(new RegExp(_this.regexCleanTag,'g'),'_')));
            }
        }

        tags = tags.unique();

        return tags;

    }

    getTitleNoTag (title){

        var _this = this;
        var s = _this.tagRegexSep.join('');

        var titleNoTag = "";
        var titleNoTagArray = [];

        titleNoTagArray = title.match(_this.regexTitle(s));

        if (titleNoTagArray != null && titleNoTagArray.length > 0) {
            titleNoTag = titleNoTagArray[1];
        } else {
            titleNoTag = title;
        }

        return titleNoTag;

    }

    setTagsBasedOnPaths (paths) {

        var _this = this;

        var tagsBasedPaths = paths;

        if(tagsBasedPaths.length > 0) {

            tagsBasedPaths.forEach(function(element, index, array){
                array[index] = '§'+(element.replace(/\s|,/,'_'));
            });

        }

        return tagsBasedPaths;

    }

    setSpecificTagData (bookmark) {

        var _this = this;

        bookmark['safeUrl'] = '';
        bookmark['favicon'] = '';
        bookmark['tags'] = [];
        bookmark['tagsToDisplay'] = [];
        bookmark['titleNoTag'] = '';

        if(typeof(bookmark.url) != 'undefined' && bookmark.url != '') {
            bookmark['safeUrl'] = _this.getSafeUrl(bookmark.url);
            bookmark['favicon'] = _this.getFavicon(bookmark.safeUrl);
        }

        if(typeof(bookmark.title) != 'undefined' && bookmark.title != '') {
            bookmark['tags'] = _this.getBookmarkTags(bookmark.title);
            for (var i = 0; i < bookmark.tags.length; i++) {
                bookmark['tagsToDisplay'].push({ 'tag': bookmark.tags[i] });
            };
            bookmark['titleNoTag'] = _this.getTitleNoTag(bookmark.title);
        }

        return bookmark;

    }

    setTitleBasedOnTag (bookmark) {
        var _this = this;

        if(bookmark.tags.length > 0) {
            bookmark.title = '['+bookmark.tags.join(' ')+'] '+_this.getTitleNoTag(bookmark.title);
        } else {
            bookmark.title =_this.getTitleNoTag(bookmark.title)
        }
        return bookmark;

    }

    setTitleBasedTitleNoTag (bookmark) {
        var _this = this;

        if(bookmark.tags.length > 0) {
            bookmark.title = '['+bookmark.tags.join(' ')+'] '+ bookmark.titleNoTag;
        } else {
            bookmark.title =bookmark.titleNoTag;
        }
        return bookmark;

    }

}