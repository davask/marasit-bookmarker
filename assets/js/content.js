var dwlPopup = dwl_Popup.init();

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
            '<h2><a href="https://www.davaskweblimited.com/" target="_blank"><img width="16" height="16" style="vertical-align:bottom;" title="davask web limited - votre agence web" alt="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NzY5MkU3MkY1MzE2MTFFNUFCMERGNzJFNTQyNUZDMEMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NzY5MkU3MzA1MzE2MTFFNUFCMERGNzJFNTQyNUZDMEMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3NjkyRTcyRDUzMTYxMUU1QUIwREY3MkU1NDI1RkMwQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3NjkyRTcyRTUzMTYxMUU1QUIwREY3MkU1NDI1RkMwQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pl9qgHcAAAMGSURBVHjaZFNLSFRRGP7Oua8Zxxk137doJrXUjChLKKFQDKZ20aZVUUS1iYgWQS2SiqhoFURQ0MaFFYJtCqIkWhRBD3uXJI6Z46jjNDrN+z7O7dw7IlMd+O/lPP7v/7/vfIdYloXiwbIjzXrs/iEz+WKn6PL7L38+RsfnUuF2f/lQcF3d7TV13vfF58kSgGVAm7l5SosNnIKRqgRhkL2bceHjCQz/jEMggFsSkhzk+r5O/1lJoIadRgvJGnITZ27mp29cActVgio2tr0BG54SAlmk0Bnz3ns9efrSw5F7eYNJSwB6tP+4sfDsCJVVEMELQkt4eECIAolSuMRClEgCqksVvP0R3zPwavKcnSta+dAKI/GyV/LtshVYpGNHDlLNbgTXqhA0DYpEF7viX/77PDF/crSpsp/q80/2m9mPy2wNCJF4CA4CUfxA6RZ0NPqgVrjBmOVQEShxCozFM8rQ19nD1Ey92WlxDUxtrMDIFtUyIVX28LnAE4DtbXVg9rJlgwCRVB55vvAt8ruHMv3XSkJkMD0MZs7zQyaopxWkpHXpqprqvVhd74NhMmR0kwNoXBuC31m9nuMTh7idaOZG+FTg1YP4d3Stq4MiCphI5KBxILKoFqVyTchumdgaGFFIvo2AXPsfQJVPQVugFlMJ5ujBOJ0Kjzwpit6tD1jieY9U2oFUWSdCRhhKtJ9zFVDsUgsG1NoFHO3uwONPyzAyE8f6FeWPCMuNV6Vigx+mRJcaTr+BrkdRLrfAI6m8imM2DiYiY8xgIf8VZe4yuIUuDIc2pbpamjdQogRi0ZLG06PxQc4kCZGbKGvO8oomvwEZnKPjxywHEPheMq8hkryDHeu/nG+o9ow5TgyUB/uW+7ovGma60CzLIq1HnGslPDLGNLdxxunGNDOoKd12S/XuufrXY2LcC9/n+g5MJZ72GiwTsA1V5Wp3AGK5YZh8X6SuGdXXdbm55uA1gbj+eY2LI61NVs+l3+2Npd8GKaQG3gU1rMxElWfDULVn012vsipcfP6PAAMA3tJVy255m2QAAAAASUVORK5CYII="></a> '+gbkn+' bookmark(s)</h2>'+
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
