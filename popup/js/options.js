var bookmarks = [];

var bkIndexes = [
    'id',
    'title',
    'url',
    'parentId',
    'children',
    'dateAdded',
    'index',
    'dateGroupModified',
];


var updateBookmarks = function (bookmark) {
    var d = $.Deferred();

    var bk2update = {};

    for (var i = 0; i < bkIndexes.length; i++) {
        if (typeof(bookmark[bkIndexes[i]]) === 'undefined') {
            bk2update[bkIndexes[i]] = '';
        } else {
            bk2update[bkIndexes[i]] = bookmark[bkIndexes[i]];
        }
    }

    bookmark = bk2update;

    if (typeof(bookmark.children) != 'undefined' && bookmark.children.length > 0) {
        parseBookmarkTree(bookmark.children).then(function(childrenList){
            bookmark.children = childrenList;
            bookmarks.push(bookmark);
            d.resolve();
        });
    } else {
        bookmarks.push(bookmark);
        d.resolve();
    }
    return d;
};

var parseBookmarkTree = function (bookmarksTree) {
    var d = $.Deferred();
    var childrenList = [];
    bookmarksTree.forEach(function(bookmark){
        childrenList.push(bookmark.id);
        updateBookmarks(bookmark).then(function(){
            d.resolve(childrenList);
        });
    });
    return d;
};


chrome.runtime.getBackgroundPage(function(chromeBg){

    var mess = [{
        'index':'options_title',
        'position':'text',
        'attr':''
     },{
        'index':'manifest_description',
        'position':'attr',
        'attr':'content'
     },{
        'index':'options_default_page',
        'position':'text',
        'attr':''
     },{
        'index':'options_export',
        'position':'text',
        'attr':''
     },{
        'index':'bookmark_page',
        'position':'text',
        'attr':''
    },{
        'index':'bookmark_search',
        'position':'text',
        'attr':''
    },{
        'index':'tags',
        'position':'text',
        'attr':''
    },{
        'index':'timer',
        'position':'text',
        'attr':''
    },{
        'index':'todos',
        'position':'text',
        'attr':''
    },{
        'index':'save',
        'position':'text',
        'attr':''
    },{
        'index':'export',
        'position':'text',
        'attr':''
    },{
        'index':'guide_title',
        'position':'text',
        'attr':''
    },{
        'index':'guide',
        'position':'html',
        'attr':''
    },{
        'index':'tag_system_title',
        'position':'text',
        'attr':''
    },{
        'index':'tag_system',
        'position':'html',
        'attr':''
    },{
        'index':'flag_system_title',
        'position':'text',
        'attr':''
    },{
        'index':'flag_system',
        'position':'html',
        'attr':''
    }];

    for (var i = 0; i < mess.length; i++) {
        if(mess[i].position === 'attr') {
            jQuery('[data-'+mess[i].index+']').attr(mess[i].attr, chromeBg.bookmarker.getMessage(mess[i].index));
        } else if(mess[i].position === 'text') {
            jQuery('[data-'+mess[i].index+']').text(chromeBg.bookmarker.getMessage(mess[i].index));
        } else {
            jQuery('[data-'+mess[i].index+']').html(chromeBg.bookmarker.getMessage(mess[i].index));
        }
    };

    chromeBg.bookmarker.restore_options('route', 'page').then(function(options){

        jQuery('#route').val(options.path);
        jQuery('#status').text('Options restored.');
        setTimeout(function() {
            jQuery('#status').text('');
        }, 750);

    });

    document.getElementById('save').addEventListener('click', function(){

        chromeBg.bookmarker.save_options('route',{'path':jQuery('#route').val()}).then(function(r){

            jQuery('#status').text('Options saved.');
            setTimeout(function() {
                jQuery('#status').text('');
            }, 750);

        });

    });

    document.getElementById('export').addEventListener('click', function(){

        var list = jQuery("#jsonExport");
        list.html('');

        bookmarks = [];

        chrome.bookmarks.getTree(function(bookmarksTree){
            parseBookmarkTree(bookmarksTree).then(function(childrenList){
            });
        });

        var type = jQuery('#exportType').val();
        if(!type == 'csv') {
            jQuery('#exportType').val('json');
            type == 'json';
        }

        var dataContentHeader = "data:text/"+type+";charset=utf-8,";
        var dataContent = "";
        var title = '';
        var link = jQuery('<a></a>');
        var eList = jQuery('<li></li>');

        var outputLimit = 10000;

        if(type == 'csv') {
            var bookmarksCsv = [];
        }

        bookmarks.forEach(function(bookmark, index){
            var isNewFile = ((index+1) % outputLimit) === 0;

            if(isNewFile) {

                if(type == 'csv') {
                    dataContent += JSON2CSV(bookmarksCsv);
                } else {
                    dataContent += '['+JSON.stringify(bookmark)+']';
                }

                title = "chrome_bookmarks_"+jQuery("#jsonExport li").length+"."+type;
                link.attr({
                    "href": dataContentHeader+encodeURIComponent(dataContent),
                    "download": title
                }).text(title);
                eList.append(link).appendTo("#jsonExport");

                dataContent = '';
                title = '';
                link = jQuery('<a></a>');
                eList = jQuery('<li></li>');

                if(type == 'csv') {
                    bookmarksCsv = [];
                }

            }

            if(type == 'csv') {

                bookmarksCsv.push(bookmark);

            } else {

                if(index > 0 && !isNewFile) {
                    dataContent += ",\n";
                }

                dataContent += JSON.stringify(bookmark);

            }

        });

        if(type == 'csv') {
            dataContent += JSON2CSV(bookmarksCsv);
        } else {
            dataContent += '['+JSON.stringify(bookmark)+']';
        }

        title = "chrome_bookmarks_"+jQuery("#jsonExport li").length+"."+type;
        link.attr({
            "href": dataContentHeader+encodeURIComponent(dataContent),
            "download": title
        }).text(title);
        eList.append(link).appendTo("#jsonExport");

    });

});
