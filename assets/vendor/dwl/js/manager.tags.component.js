var dwlTagsManager = {

    /* INSTANTIATE */
    'instantiate' : function() {
        _this = this;
        _this.initialized = true;
    },

     /* VAR */
    'initialized' : false,
    'name' : 'tags',
    'tagGlue' : '',
    'errorGrp' : '_',
    'browserFolderGrp' : '§',

    'rules' : {
        '/' : {
            'example' : '/<word>',
            'title' : 'folder',
            'title_canonical' : 'folder',
            'description' : ''
        },
        // '§' : {
        //     'example' : '/<word>',
        //     'title' : 'obsolete folder',
        //     'title_canonical' : 'folder',
        //     'description' : ''
        // },
        '#' : {
            'example' : '#<word>',
            'title' : 'tag',
            'title_canonical' : 'tag',
            'description' : ''
        },
        '@' : {
            'example' : '@<username>',
            'title' : 'person',
            'title_canonical' : 'person',
            'description' : 'person to share with'
        },
        '$' : {
            'example' : '$<word>',
            'title' : 'alias',
            'title_canonical' : 'alias',
            'description' : ''
        },
        // '' : {
        //     'example' : '<word>',
        //     'title' : 'obsolete alias',
        //     'title_canonical' : 'alias',
        //     'description' : ''
        // },
        '~' : {
            'example' : '~<word>',
            'title' : 'obsolete article',
            'title_canonical' : 'obsolete-article',
            'description' : ''
        },
        '!' : {
            'example' : '!<word>',
            'title' : 'article',
            'title_canonical' : 'article',
            'description' : ''
        },
        '()' : {
            'example' : '(<flag>)',
            'title' : 'bookmark flag',
            'title_canonical' : 'bookmark-flag',
            'description' : ''
        },
        'I' : {
            'example' : 'I',
            'title' : 'important',
            'title_canonical' : 'important',
            'description' : ''
        },
        'D' : {
            'example' : 'D',
            'title' : 'duplicated',
            'title_canonical' : 'duplicated',
            'description' : ''
        },
        'R' : {
            'example' : 'R',
            'title' : 'removed',
            'title_canonical' : 'removed',
            'description' : ''
        },
        'T' : {
            'example' : 'T',
            'title' : 'trash',
            'title_canonical' : 'trash',
            'description' : ''
        },
        'E' : {
            'example' : 'E',
            'title' : 'empty title',
            'title_canonical' : 'empty-title',
            'description' : 'empty title (except tag)'
        },
        'N' : {
            'example' : 'N',
            'title' : 'not tagged',
            'title_canonical' : 'not-tagged',
            'description' : ''
        },
        'S' : {
            'example' : 'S',
            'title' : 'stared',
            'title_canonical' : 'stared',
            'description' : ''
        }
    },

    'tagRegexSep' : ['\\s','\\~','\\/','\\#','\\!','\\@','\\$','\\§'],
    'tagSep' : [' ','~','/','#','!','@','$','§'],

    'tagRegexDisplay' : ['\\s',','],
    'tagDisplay' : ['_'],


    'regexUrl' : '^https?:\\/\\/?[\\da-z\\.-]+\\.[a-z\\.]{2,6}.*$',
    'regexFavicon' : '^https?:\\/\\/?[\\da-z\\.-]+\\.[a-z\\.]{2,6}',


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
    'tagRegexCleaner' : function(s){
        return '['+s+']';
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

        bookmark.tagsToDisplay = _this.getTagsToDisplay(bookmark.tags).tagsToDisplay;

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
        var c = _this.tagRegexDisplay.join('');

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
                tags.push((tagsArray[i].trim().replace(new RegExp(_this.tagRegexCleaner(c),'g'),'_')));
            }
        }

        tags = tags.unique().sort();

        return tags;

    },

    'getTagsToDisplay' : function(tags){

        var _this = this;
        var s = _this.tagRegexSep.join('');
        var c = _this.tagDisplay.join('');
        var tagsToDisplay = [];
        var grps = [];
        var categories = [];
        for (var i = 0; i < tags.length; i++) {

            var tag = tags[i].trim();

            var tagNoCat = tag.trim().replace(new RegExp(_this.tagRegexCleaner(s),'g'),'')
            var cat = tag.replace(tagNoCat,'');
            categories.push(cat);

            var title = tagNoCat.replace(new RegExp(_this.tagRegexCleaner(c),'g'),' ').toLowerCase();

            var grp = title.charAt(0);
            if(grp === '' || grp === '!') {
                grp = _this.errorGrp;
            }
            grps.push(grp);

            tagsToDisplay.push({
                tag : tag,
                title : title,
                grp : grp,
                cat : cat
            });
        };
        return {
            'tagsToDisplay' : tagsToDisplay,
            'grps' : grps.unique().sort(),
            'categories' : categories.unique().sort()
        };
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
            if ( bookmark.tagsToDisplay[i].tag.indexOf(' ') > -1 ) {
                bookmark.tagsToDisplay[i].tag = bookmark.tagsToDisplay[i].tag.replace(/\s/g, '_');
            }
            if ( _this.tagSep.indexOf(bookmark.tagsToDisplay[i].tag.substring(0,1)) === -1 ) {
                bookmark.tagsToDisplay[i].tag = '/'+bookmark.tagsToDisplay[i].tag;
            }
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
