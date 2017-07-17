window.jQuery || document.write('<script src="../vendor/jquery-2.0.3/js/jquery-2.0.3.min.js"><\/script>');
window.List || document.write('<script src="../vendor/list.js/dist/list.min.js"><\/script>');

dwlPopup = {
    'dwlBk':{},
    'popup':null,
    'page':null,
    'html' : ''
};

chrome.runtime.onMessage.addListener(function(bgJsMsg, sender, sendResponse) {

    dwlPopup.html = '';

    // see https://developer.chrome.com/extensions/content_scripts
    dwlPopup.dwlBk = {};
    if (typeof(bgJsMsg.dwlBk) != 'undefined') {
        dwlPopup.dwlBk = bgJsMsg.dwlBk;
    }

    if (typeof(bgJsMsg.gBk) != 'undefined') {
        dwlPopup.gBk = bgJsMsg.gBk;
    }

    if(dwlPopup.dwlBk.bookmarks.length > 0) {
        var b = dwlPopup.dwlBk.bookmarks[0];
    } else {
        var b = dwlPopup.dwlBk.tab;
    }

    dwlPopup.html += '<div class="row">';
    dwlPopup.html += '<div class="col-xs-12">';

    dwlPopup.html += 'type : ' + b.type + '<br/>';
    dwlPopup.html += 'title : ' + b.title + '<br/>';
    dwlPopup.html += 'url : ' + b.url + '<br/>';

    dwlPopup.html += '</div>';
    dwlPopup.html += '<div class="col-xs-12">';

     dwlPopup.html += ' (';
    if (typeof(b.dateAdded) != 'undefined') {
        dwlPopup.html += ' added : ' + convertToDate(b.dateAdded);
    } else {
        dwlPopup.html += ' not added';
    }
    if (typeof b.id != 'undefined') {
        dwlPopup.html += ' - id : ' + b.id;
    } else {
        dwlPopup.html += ' - no id';
    }
    dwlPopup.html += ' )';

    dwlPopup.html += '</div>';
    dwlPopup.html += '</div>';

    /* build the content popup */
    dwlPopup.popup = jQuery('#dwl-bk');
    if (dwlPopup.popup.length > 0) {
        dwlPopup.popup.remove();
    }

    dwlPopup.popup = jQuery('<div></div>');
    dwlPopup.popup.attr('id','dwl-bk');
    dwlPopup.popup.addClass('container');
    dwlPopup.popup.addClass('closed');
    dwlPopup.html += '<button class="open"><</button>';
    dwlPopup.html += '<button class="close">X</button>';

    dwlPopup.popup.html(dwlPopup.html);
    // dwlPopup.popup.hide();

    dwlPopup.popup.appendTo('body');

    jQuery('#dwl-bk button').click(function(){
        if(jQuery('#dwl-bk.closed').length > 0) {
            jQuery('#dwl-bk.closed').removeClass('closed');
        } else {
            jQuery('#dwl-bk').addClass('closed');
        }
    });

    if ( window.location.host == "www.google.com" && window.location.pathname == "/search" ) {
        /* build the content page */
        dwlPopup.page = jQuery('#dwl-bk-google');
        if (dwlPopup.page.length > 0) {
            dwlPopup.page.remove();
        }
        dwlPopup.page = jQuery('<div></div>');
        dwlPopup.page.attr('id','dwl-bk-google');
        dwlPopup.page.addClass('container');
        dwlPopup.page.appendTo('#res');

        var $ginput         = jQuery(document.querySelector('[aria-label="Search"]')),
            gbk             = '',
            gbkn            = 0,
            gtags           = [],
            _gtags          = [],
            gtagsstring     = '',
            gheaderlist     = '';

        if ( typeof(dwlPopup.gBk) != 'undefined' ) {
            gbkn = dwlPopup.gBk.length;
            for (var i = 0; i < gbkn; i++) {
                if (typeof(dwlPopup.gBk[i].url) != 'undefined') {
                    _gtags = dwlTagsManager.getBookmarkTags(dwlPopup.gBk[i].title);
                    gtags = gtags.concat(_gtags);

                    gbk += '<li class="g">';
                    gbk += '<h3 class="r"><a href="'+dwlPopup.gBk[i].url+'" target="_blank" class="title">'+dwlTagsManager.getTitleNoTag(dwlPopup.gBk[i].title)+'</a></h3>';
                    gbk += '<cite class="_Rm url">'+dwlPopup.gBk[i].url+'</cite><br/>';
                    gbk += '<span class="st tag">'+_gtags.join('</span> <span class="st tag">')+'</span>';
                    gbk += '</li>';

                }
            };
        }

        gtags = gtags.unique();
        for (var i = 0; i < gtags.length; i++) {
            gtags[i] = gtags[i].substring(1).toLowerCase();
        }
        gtags = gtags.unique();
        gtags = gtags.sort();
        if (gtags.length > 0) {
            gtagsstring = '<button onclick="document.getElementsByClassName(\'dwl-search\')[0].value = this.innerHTML;">'+gtags.join('</button><button onclick="document.getElementsByClassName(\'dwl-search\')[0].value = this.innerHTML;">')+'</button>';
        }
        if (gtags.length > 0) {
            gheaderlist = '&nbsp;<input class="dwl-search search" />&nbsp;<span class="sort" data-sort="title">Sort by title</span>&nbsp;<span class="sort" data-sort="tag">Sort by tag</span>&nbsp;<span class="sort" data-sort="url">Sort by url</span>';
        }
        if ( typeof(dwlPopup.gBk) == 'undefined' || dwlPopup.gBk.length == 0 ) {
            gbk += '<h3 class="r">0 Bookmark saved</h3>';
        }

        $("#dwl-bk-google").html('<h2>'+gbkn+' bookmark(s)'+gheaderlist+'</h2><ul class="list">'+gbk+'</ul><div class="tagbtn">'+gtagsstring+'</div>');

        var options = {
            valueNames: [ 'title', 'url', 'tag' ]
        };
        var dwlbkgooglelist = new List('dwl-bk-google', options);

        sendResponse({"tabId": dwlPopup.dwlBk.tab.id, "r": (dwlPopup.html.length > 0 ? "true" : "false"), "q": $ginput.val()});

    } else {
        sendResponse({"tabId": dwlPopup.dwlBk.tab.id, "r": (dwlPopup.html.length > 0 ? "true" : "false"), "q": ""});
    }


});
