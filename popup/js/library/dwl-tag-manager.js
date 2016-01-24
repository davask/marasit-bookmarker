var dwlTagsManager = {

    /* INSTANTIATE */
    'instantiate' : function() {
        _this = this;
        _this.initialized = true;
    },

     /* VAR */
    'initialized' : false,
    'name' : 'tags',

    'tagGlue' : ' ',

    'tagRegexSep' : ['\\s','!','\\/','#','@','$','§'],

    'tagRegexCleaner' : ['\\s',','],

    'tagSep' : [' ','!','/','#','@','$','§'],

    'regexFavicon' : '^https?:\\/\\/?[\\da-z\\.-]+\\.[a-z\\.]{2,6}',
    'regexUrl' : '^https?:\\/\\/?[\\da-z\\.-]+\\.[a-z\\.]{2,6}.*$',

    'regexCleanTag' : '\\s|,',

    'logs' : {
        'logs.instantiate' : 'dwlTagsManager instantiated'
    },

    /* FUNCTIONS */
    'regexTitle' : function(s) {
        return '^(?:\\[(?:(?:['+s+']?[^\\]'+s+')]*)*)\\]\\s?)(.*)$';
    },
    'regexAllTags' : function(s) {
        return '^\\[((?:['+s+']?[^\\]'+s+')]*)*)\\]\\s?';
    },
    'regexEachTags' : function(s) {
        return '\\s?['+s+']?[^\\]\\s'+s+']*';
    },

    'setSpecificTagData' : function(bookmark) {

        var _this = this;

        /* url based */
        bookmark.safeUrl = '';
        bookmark.favicon = '';
        if(typeof(bookmark.url) != 'undefined' && bookmark.url != '') {

            bookmark.safeUrl = _this.getSafeUrl(bookmark.url);
            bookmark.favicon = _this.getFavicon(bookmark.safeUrl);

        }

        /* title based */
        bookmark.titleNoTag = '';
        bookmark.tags = [];
        bookmark.tagsToDisplay = [];
        if(typeof(bookmark.title) != 'undefined' && bookmark.title != '') {

            bookmark.titleNoTag = _this.getTitleNoTag(bookmark.title);
            bookmark.tags = _this.getBookmarkTags(bookmark.title);

        }

        for (var i = 0; i < bookmark.tags.length; i++) {
            bookmark.tagsToDisplay.push({
                'tag' : bookmark.tags[i]
            });
        };

        return bookmark;

    },

    'getFavicon' : function(url) {

        var _this = this;

        var favicon = '';
        var faviconArray = [];

        faviconArray = url.match(_this.regexFavicon);

        if (faviconArray != null && faviconArray.length > 0) {
            favicon = faviconArray[0]+'/favicon.ico';
        }

        return favicon;

    },

    'getSafeUrl' : function(url) {

        var _this = this;

        var safeUrl = '';
        var safeUrlArray = [];

        safeUrlArray = url.match(_this.regexUrl);

        if (safeUrlArray != null && safeUrlArray.length > 0) {
            safeUrl = url;
        }

        return safeUrl;

    },

    'getBookmarkTags' : function(title){

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

    },

    'getTitleNoTag' : function(title){

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

    },

    'setTagsBasedOnPaths' : function(paths) {

        var _this = this;

        var tagsBasedPaths = paths;

        if(tagsBasedPaths.length > 0) {

            tagsBasedPaths.forEach(function(element, index, array){
                array[index] = '§'+(element.replace(/\s|,/,'_'));
            });

        }

        return tagsBasedPaths;

    },

    // 'setTitleBasedOnTag' : function(bookmark) {
    //     var _this = this;

    //     if(bookmark.tags.length > 0) {
    //         bookmark.title = '['+bookmark.tags.join(_this.tagGlue)+'] '+_this.getTitleNoTag(bookmark.title);
    //     } else {
    //         bookmark.title =_this.getTitleNoTag(bookmark.title)
    //     }
    //     return bookmark;

    // },

    'updateTitle' : function(bookmark, live) {
        var _this = this;

        if(typeof(live) === 'undefined') {
            live = false;
        }
        if(live) {
            bookmark.titleNoTag = bookmark.liveTitle;
        }

        bookmark = _this.updateTagsBasedOnDisplay(bookmark);
        if(bookmark.tags.length > 0) {
            bookmark.title = '['+bookmark.tags.join(_this.tagGlue)+'] '+ bookmark.titleNoTag;
        } else {
            bookmark.title =bookmark.titleNoTag;
        }
        return bookmark;

    },

    'updateTagsBasedOnDisplay' : function(bookmark){
        var _this = this;

        bookmark.tags = [];
        for (var i = 0; i < bookmark.tagsToDisplay.length; i++) {
            bookmark.tags.push(bookmark.tagsToDisplay[i].tag);
        };

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