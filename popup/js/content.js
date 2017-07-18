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
    dwlPopup.popup.addClass('container kp-blk');
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

    if ( window.location.host == "www.google.com" && (window.location.pathname == "/search" || window.location.pathname == "/webhp") ) {
        /* build the content page */
        dwlPopup.page = jQuery('#dwl-bk-google');
        if (dwlPopup.page.length > 0) {
            dwlPopup.page.remove();
        }
        dwlPopup.page = jQuery('<div></div>');
        dwlPopup.page.attr('id','dwl-bk-google');
        dwlPopup.page.addClass('container kp-blk');

        if ( document.getElementById('rhs') == null ) {
            dwlPopup.page.appendTo('#res');
        } else {
            dwlPopup.page.prependTo('#rhs');
        }

        var $ginput         = jQuery(document.querySelector('[aria-label="Search"]')),
            gbk             = '',
            gbktitle        = '',
            st              = 60,
            gbkn            = 0,
            gtags           = [],
            _gtags          = [],
            gtagsstring     = '',
            gheaderlist     = '',
            gtable     = '';

        if ( typeof(dwlPopup.gBk) != 'undefined' ) {
            gbkn = dwlPopup.gBk.length;
            for (var i = 0; i < gbkn; i++) {
                if (typeof(dwlPopup.gBk[i].url) != 'undefined') {
                    gbktitle = dwlTagsManager.getTitleNoTag(dwlPopup.gBk[i].title);
                    gbktitle = (gbktitle.trim() != '') ? gbktitle : dwlPopup.gBk[i].title;
                    gbk += '<tr>';
                    gbk += '<td>';
                    gbk += '<a href=\''+dwlTagsManager.getSafeUrl(dwlPopup.gBk[i].url)+'\' target"_blank">'+gbktitle.trim().substring(0,st).trim().replace(/\s/g, '&nbsp;')+(gbktitle.trim().length > st ? '&nbsp;[...]':'')+'</a><br/>';
                    gbk += '</td>';
                    _gtags = dwlTagsManager.getTagsToDisplay(dwlTagsManager.getBookmarkTags(dwlPopup.gBk[i].title)).tagsToDisplay;
                    gbk += '<td>';
                    if ( _gtags.length > 0 ) {
                        for (var y = 0; y < _gtags.length; y++) {
                            if ( y > 0 ) {
                                gbk += ',&nbsp;';
                            }
                            if ( _gtags[y].title != '' ) {
                                gbk += '<span class="tag" onclick="document.querySelector(\'input[aria-controls=dwl-bk-google-table]\').value = this.innerHTML;document.querySelector(\'input[aria-controls=dwl-bk-google-table]\').focus();">';
                                gbk += _gtags[y].title.toLowerCase().replace(/\s/g, '&nbsp;');
                                gbk += '</span>';
                            }
                        }
                    } else {
                        gbk += 'No tag';
                    }
                    gbk += '</td>';
                    gbk += '<td>'+convertToDate(dwlPopup.gBk[i].dateAdded)+'</td>';
                    gbk += '<td>'+extractRootDomain(dwlTagsManager.getSafeUrl(dwlPopup.gBk[i].url))+'</td>';
                    gbk += '</tr>';

                }
            };
        }

        gtags = gtags.unique().sort();
        if ( gbkn > 0 ) {
            gtable += '<table id="dwl-bk-google-table" class="display responsive compact stripe" cellspacing="0" width="100%">';
            gtable += '<thead>';
            gtable += '<tr>';
            gtable += '<th>title</th>';
            gtable += '<th>tag</th>';
            gtable += '<th>date</th>';
            gtable += '<th>dns</th>';
            gtable += '</tr>';
            gtable += '</thead>';
            gtable += '<tfoot>';
            gtable += '<tr>';
            gtable += '<th>title</th>';
            gtable += '<th>tag</th>';
            gtable += '<th>date</th>';
            gtable += '<th>dns</th>';
            gtable += '</tr>';
            gtable += '</tfoot>';
            gtable += '<tbody>';
            gtable += gbk;
            gtable += '</tbody>';
            gtable += '</table>';
        }
        if ( typeof(dwlPopup.gBk) == 'undefined' || dwlPopup.gBk.length == 0 ) {
            $("#dwl-bk-google").css({"border":"none"});
        }

        // $("#dwl-bk-google").html(
        //     '<h2>'+gbkn+' bookmark(s)'+ gheaderlist+'</h2>'+
        //     '<ul class="list">'+gbk+'</ul><hr/>'+
        //     '<div class="tagbtn">'+gtagsstring+'</div><hr/>'
        // );
        $("#dwl-bk-google").html(
            '<h2>'+gbkn+' bookmark(s)</h2>'+
            gtable
        );

        $(document).ready(function() {
            $('#dwl-bk-google-table').DataTable();
        } );

        sendResponse({"tabId": dwlPopup.dwlBk.tab.id, "r": (dwlPopup.html.length > 0 ? "true" : "false"), "q": $ginput.val()});

    } else {
        sendResponse({"tabId": dwlPopup.dwlBk.tab.id, "r": (dwlPopup.html.length > 0 ? "true" : "false"), "q": ""});
    }


});
