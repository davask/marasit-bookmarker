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
            '@'
        ];
        _this.tagSep = [
            ' ',
            '!',
            '/',
            '#',
            '@'
        ];

        console.log('tagManagerBookmarker initialized');

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

        tags = tags.unique();

        // if(tags.length == 0) {
        //     tags = null;
        // }

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
        } else {
            titleNoTag = title;
        }

        return titleNoTag;

    }

    setSpecificTagData (bookmark) {

        var _this = this;

        bookmark['safeUrl'] = _this.getSafeUrl(bookmark.url);
        bookmark['favicon'] = _this.getFavicon(bookmark.safeUrl);
        bookmark['tags'] = _this.getBookmarkTags(bookmark.title);
        bookmark['titleNoTag'] = _this.getTitleNoTag(bookmark.title);

        return bookmark;

    }

}