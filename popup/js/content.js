window.jQuery || document.write('<script src="../vendor/jquery-2.0.3/js/jquery-2.0.3.min.js"><\/script>');

var _this = this;

_this.dwlBk = {};
_this.r = false;
_this.popup = null;

chrome.runtime.onMessage.addListener(function(bgJsMsg, sender, sendResponse) {

    _this.r = false;
    // see https://developer.chrome.com/extensions/content_scripts
    _this.dwlBk = {};
    if (typeof(bgJsMsg.dwlBk) != 'undefined') {
        _this.dwlBk = bgJsMsg.dwlBk;
        _this.r = true;
    }

    console.log(bgJsMsg, _this.dwlBk);

    _this.html = '';
    if(_this.dwlBk.bookmarks.length > 0) {
        var b = _this.dwlBk.bookmarks[0];
    } else {
        // _this.html += '<button onclick="createBookmark(chromeBk,{\'title\':'+tab.title+', \'url\':'+tab.url+'})">add to bookmarks</button>';
        var b = _this.dwlBk.tab;
    }

    _this.html += '<div class="row">';
    _this.html += '<div class="col-xs-6">';

    if (typeof b.titleNoTag != 'undefined' && b.titleNoTag != '') {
        _this.html += 'titleNoTag : ' + b.titleNoTag;
    } else {
        _this.html += 'title : ' + b.title;
    }
    _this.html += '<br/>';

   if (typeof b.safeUrl != 'undefined' && b.safeUrl != '') {
    _this.html += 'safeUrl : ' + b.safeUrl;
    } else {
        _this.html += 'url : ' + b.url;
    }
    _this.html += '<br/>';

    _this.html += '</div>';
    _this.html += '<div class="col-xs-6">';

    if (typeof b.tags != 'undefined') {
        _this.html += 'tags : ' + b.tags.join(', ');
    } else {
        _this.html += 'no tags.';
    }
    _this.html += '<br/>';

    if (typeof b.storage != 'undefined' && typeof b.storage.tagsBasedPaths != 'undefined') {
        _this.html += 'storage tagsBasedPaths : ' + b.storage.tagsBasedPaths.join(', ');
    } else {
        _this.html += 'no storage tagsBasedPaths.';
    }
    _this.html += '<br/>';

    _this.html += '</div>';
    _this.html += '<div class="col-xs-12">';

     _this.html += ' (';
    if (typeof b.dateAdded != 'undefined') {
        _this.html += ' added : ' + convertToDate(b.dateAdded);
    } else {
        _this.html += ' not added';
    }
    if (typeof b.id != 'undefined') {
        _this.html += ' - id : ' + b.id;
    } else {
        _this.html += ' - no id';
    }
    _this.html += ' )';

    _this.html += '</div>';
    _this.html += '</div>';

    _this.popup = jQuery('#dwl-bk');
    if (_this.popup.length > 0) {
        _this.popup.remove();
    }

    _this.popup = jQuery('<div></div>').attr('id','dwl-bk').addClass('container closed');
    _this.html += '<button>dwl</button>';

    _this.popup.html(_this.html);
    // _this.popup.hide();

    _this.popup.appendTo('body');

    jQuery('#dwl-bk button').click(function(){
        if(jQuery('#dwl-bk.closed').length > 0) {
            jQuery('#dwl-bk.closed').removeClass('closed');
        } else {
            jQuery('#dwl-bk').addClass('closed');
        }
    });

    sendResponse(_this.r);

});