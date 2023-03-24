const paginate = (array, page_size, page_number) => {
    --page_number; // because pages logically start with 1, but technically with 0
    return array.slice(page_number * page_size, (page_number + 1) * page_size);
  };
  
  var dwlTpl = {
    'g' : {
      'page': 1,
      'nbByPage': 5,
      'nbPageMax': 1,
      'isDwlGClosed': false,
      'bookmarks': [],
      'gbkn': 0,
      'show': function() {
  
        var b   = '',
        gbkbtn  = '<button class="display open">+</button><button class="display close">-</button>',
        gpagbtn = '<button class="pagination prev'+( this.page > 1 ? '' : ' hidden')+'"><</button><button class="pagination next'+( this.page < this.nbPageMax ? '' : ' hidden')+'">></button>';
  
        if (this.gbkn == 0) {
          gbkbtn = '';
          gpagbtn = '';
        }
  
        bookmarksToShow = paginate(this.bookmarks,this.nbByPage,this.page);
        for (var i = 0; i < bookmarksToShow.length; i++) {
              b += this.getBtpl(bookmarksToShow[i], i);
        }
  
        if (document.body.contains(document.getElementById('dwl-g'))) {
          document.getElementById('dwl-g').remove();
        }
  
        jQuery('<div \
          id="dwl-g" \
          class="container dwl-kp-blk'+ ( this.gbkn == 0 || this.isDwlGClosed && this.page == 1 ? ' closed' : '' ) + '" \
          data-page="'+this.page+'" \
          data-before="\
          '+this.gbkn+' \
          item' + ( this.gbkn > 1 ? 's' : '' ) +
          ' found in my bookmarks' +
          ( this.nbPageMax > 1 ? ' - '+this.page+'/'+this.nbPageMax : '' ) +
          '"\
          >'+
            b+
            gpagbtn+
            gbkbtn+
          '</div>').prependTo('#center_col');
  
        jQuery('#dwl-g button.display').click(function(){
          if(jQuery('#dwl-g.closed').length > 0) {
            jQuery('#dwl-g.closed').removeClass('closed');
          } else {
            jQuery('#dwl-g').addClass('closed');
          }
        });
        jQuery('#dwl-g button.pagination.next').click(function(){
          dwlTpl.g.next(jQuery('#dwl-g').data('page'));
        });
        jQuery('#dwl-g button.pagination.prev').click(function(){
          dwlTpl.g.prev(jQuery('#dwl-g').data('page'));
        });
  
      },
      'prev': function(page) {
        this.page = page;
        this.page > 0 ? this.page-- : null;
        this.show();
      },
      'next': function(page) {
        this.page = page;
        this.page++;
        this.show();
      },
      'getBtpl': function(bookmark, i) {
  
        var gbktags   = '',
            gbktitle  = '',
            st        = 60,
            gbkUrl    = '',
            gbktags   = '',
            gbkLink   = '';
  
        // console.log('bookmark['+(i+1)+'/'+this.gbkn+']');
        // if (typeof(bookmark.url) != 'undefined') {
  
          // gbktitle = dwlTagsManager.getTitleNoTag(bookmark.title);
          // gbktitle = (gbktitle.trim() != '') ? gbktitle : bookmark.title;
          // gbktags = dwlTagsManager.getBookmarkTags(bookmark.title).join(' &lrm; ');
          // gbkUrl = dwlTagsManager.getSafeUrl(bookmark.url)
          // gbkSafeUrl = dwlTagsManager.getSafeUrl(bookmark.url);
          gbktitle = bookmark.title;
          gbktags = '';
          gbkUrl = bookmark.url;
          gbkSafeUrl = gbkUrl;
          gbkLink = '<a href=\''+gbkUrl+'\' target"_blank">'+
                      gbktitle.trim().substring(0,st).trim().replace(/\s/g, '&nbsp;')+
                      (gbktitle.trim().length > st ? '&nbsp;[...]':'')+
                    '</a>';
  
          return this.btpl(gbkLink, gbkSafeUrl, gbktags, i);
  
        // }
      },
      'btpl': function(gbkLink, gbkSafeUrl, gbktags, i) {
        return '<div class="g">\
          <!--m-->\
          <div data-hveid="39" data-ved="0ahUKEwjn243rybrVAhVIL1AKHdRCAAIQFQgnKAAwAA">\
            <div class="rc">\
              <h3 class="r">\
                '+gbkLink+'\
              </h3>\
              <div class="s">\
                <div>\
                  <div class="f kv _SWb" style="width:100%; word-wrap:break-word; display:inline-block;">\
                    <span class="_mB" style="  background-color: #fff;border-radius: 3px;color: #006621;display: inline-block;font-size: 11px;border: 1px solid #006621;padding: 1px 3px 0 2px;line-height: 11px;vertical-align: baseline;">\
                      '+( ( ( this.page - 1 ) * this.nbByPage ) + i + 1 )+' <img width="8" height="8" title="davask web limited - votre agence web" alt="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NzY5MkU3MkY1MzE2MTFFNUFCMERGNzJFNTQyNUZDMEMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NzY5MkU3MzA1MzE2MTFFNUFCMERGNzJFNTQyNUZDMEMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3NjkyRTcyRDUzMTYxMUU1QUIwREY3MkU1NDI1RkMwQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3NjkyRTcyRTUzMTYxMUU1QUIwREY3MkU1NDI1RkMwQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pl9qgHcAAAMGSURBVHjaZFNLSFRRGP7Oua8Zxxk137doJrXUjChLKKFQDKZ20aZVUUS1iYgWQS2SiqhoFURQ0MaFFYJtCqIkWhRBD3uXJI6Z46jjNDrN+z7O7dw7IlMd+O/lPP7v/7/vfIdYloXiwbIjzXrs/iEz+WKn6PL7L38+RsfnUuF2f/lQcF3d7TV13vfF58kSgGVAm7l5SosNnIKRqgRhkL2bceHjCQz/jEMggFsSkhzk+r5O/1lJoIadRgvJGnITZ27mp29cActVgio2tr0BG54SAlmk0Bnz3ns9efrSw5F7eYNJSwB6tP+4sfDsCJVVEMELQkt4eECIAolSuMRClEgCqksVvP0R3zPwavKcnSta+dAKI/GyV/LtshVYpGNHDlLNbgTXqhA0DYpEF7viX/77PDF/crSpsp/q80/2m9mPy2wNCJF4CA4CUfxA6RZ0NPqgVrjBmOVQEShxCozFM8rQ19nD1Ey92WlxDUxtrMDIFtUyIVX28LnAE4DtbXVg9rJlgwCRVB55vvAt8ruHMv3XSkJkMD0MZs7zQyaopxWkpHXpqprqvVhd74NhMmR0kwNoXBuC31m9nuMTh7idaOZG+FTg1YP4d3Stq4MiCphI5KBxILKoFqVyTchumdgaGFFIvo2AXPsfQJVPQVugFlMJ5ujBOJ0Kjzwpit6tD1jieY9U2oFUWSdCRhhKtJ9zFVDsUgsG1NoFHO3uwONPyzAyE8f6FeWPCMuNV6Vigx+mRJcaTr+BrkdRLrfAI6m8imM2DiYiY8xgIf8VZe4yuIUuDIc2pbpamjdQogRi0ZLG06PxQc4kCZGbKGvO8oomvwEZnKPjxywHEPheMq8hkryDHeu/nG+o9ow5TgyUB/uW+7ovGma60CzLIq1HnGslPDLGNLdxxunGNDOoKd12S/XuufrXY2LcC9/n+g5MJZ72GiwTsA1V5Wp3AGK5YZh8X6SuGdXXdbm55uA1gbj+eY2LI61NVs+l3+2Npd8GKaQG3gU1rMxElWfDULVn012vsipcfP6PAAMA3tJVy255m2QAAAAASUVORK5CYII="> dwl\
                    </span>\
                    <cite class="_Rm">'+gbkSafeUrl+'</cite>\
                  </div>\
                  <span class="st">\
                    '+gbktags+'\
                  </span>\
                </div>\
              </div>\
            </div>\
          </div>\
          <!--n-->\
        </div>';
      },
      'init': function(bookmarks) {
  
        if ( typeof(bookmarks) != 'undefined' ) {
  
            this.bookmarks = bookmarks;
            this.gbkn = this.bookmarks.length;
            this.nbPageMax = Math.ceil(this.gbkn/this.nbByPage);
            this.show();
  
        }
  
      }
  
    }
  };
  
  const generateHtmlElement = (params) => {
  
    return jQuery('<div></div>')
      .attr('id','dwl-bk-google')
      .addClass('container kp-blk')
      .html('<h2><a href="https://www.davaskweblimited.com/" target="_blank"><img width="16" height="16" style="vertical-align:bottom;" title="davask web limited - votre agence web" alt="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NzY5MkU3MkY1MzE2MTFFNUFCMERGNzJFNTQyNUZDMEMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NzY5MkU3MzA1MzE2MTFFNUFCMERGNzJFNTQyNUZDMEMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3NjkyRTcyRDUzMTYxMUU1QUIwREY3MkU1NDI1RkMwQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3NjkyRTcyRTUzMTYxMUU1QUIwREY3MkU1NDI1RkMwQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pl9qgHcAAAMGSURBVHjaZFNLSFRRGP7Oua8Zxxk137doJrXUjChLKKFQDKZ20aZVUUS1iYgWQS2SiqhoFURQ0MaFFYJtCqIkWhRBD3uXJI6Z46jjNDrN+z7O7dw7IlMd+O/lPP7v/7/vfIdYloXiwbIjzXrs/iEz+WKn6PL7L38+RsfnUuF2f/lQcF3d7TV13vfF58kSgGVAm7l5SosNnIKRqgRhkL2bceHjCQz/jEMggFsSkhzk+r5O/1lJoIadRgvJGnITZ27mp29cActVgio2tr0BG54SAlmk0Bnz3ns9efrSw5F7eYNJSwB6tP+4sfDsCJVVEMELQkt4eECIAolSuMRClEgCqksVvP0R3zPwavKcnSta+dAKI/GyV/LtshVYpGNHDlLNbgTXqhA0DYpEF7viX/77PDF/crSpsp/q80/2m9mPy2wNCJF4CA4CUfxA6RZ0NPqgVrjBmOVQEShxCozFM8rQ19nD1Ey92WlxDUxtrMDIFtUyIVX28LnAE4DtbXVg9rJlgwCRVB55vvAt8ruHMv3XSkJkMD0MZs7zQyaopxWkpHXpqprqvVhd74NhMmR0kwNoXBuC31m9nuMTh7idaOZG+FTg1YP4d3Stq4MiCphI5KBxILKoFqVyTchumdgaGFFIvo2AXPsfQJVPQVugFlMJ5ujBOJ0Kjzwpit6tD1jieY9U2oFUWSdCRhhKtJ9zFVDsUgsG1NoFHO3uwONPyzAyE8f6FeWPCMuNV6Vigx+mRJcaTr+BrkdRLrfAI6m8imM2DiYiY8xgIf8VZe4yuIUuDIc2pbpamjdQogRi0ZLG06PxQc4kCZGbKGvO8oomvwEZnKPjxywHEPheMq8hkryDHeu/nG+o9ow5TgyUB/uW+7ovGma60CzLIq1HnGslPDLGNLdxxunGNDOoKd12S/XuufrXY2LcC9/n+g5MJZ72GiwTsA1V5Wp3AGK5YZh8X6SuGdXXdbm55uA1gbj+eY2LI61NVs+l3+2Npd8GKaQG3gU1rMxElWfDULVn012vsipcfP6PAAMA3tJVy255m2QAAAAASUVORK5CYII="></a> Searching '+params.q+'</h2>');
  
  };
  
  const bkSearchDisplay = (params) => {
  
    /* build the content page */
    var $dwlBkGoogle = jQuery("#dwl-bk-google");
  
    if ($dwlBkGoogle.length > 0) {
        $dwlBkGoogle.remove();
    }
  
    $dwlBkGoogle = generateHtmlElement({'q':params.q});
  
    if ( document.getElementById('rhs') == null ) {
        $dwlBkGoogle.appendTo('#res');
    } else {
        $dwlBkGoogle.prependTo('#rhs');
    }
  
  };
  
  export { paginate, generateHtmlElement, bkSearchDisplay }