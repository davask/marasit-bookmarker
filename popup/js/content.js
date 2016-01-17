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
        _this.html += '<pre>';
        _this.html += JSON.stringify(_this.dwlBk.bookmarks);
        _this.html += '</pre>';
    } else {
        // _this.html += '<button onclick="createBookmark(chromeBk,{\'title\':'+tab.title+', \'url\':'+tab.url+'})">add to bookmarks</button>';
        _this.html += '<pre>';
        _this.html += JSON.stringify(_this.dwlBk.tab);
        _this.html += '</pre>';
    }

    _this.popup = jQuery('#dwl-bk');
    if (_this.popup.length > 0) {
        _this.popup.remove();
    }

    _this.popup = jQuery('<div></div>').attr('id','dwl-bk');

    _this.popup.html(_this.html);
    // _this.popup.hide();

    _this.popup.appendTo('body');

    sendResponse(_this.r);

});