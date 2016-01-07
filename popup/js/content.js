var _this = this;

_this.r = false;

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {

    _this.r = false;

    if (typeof(msg.nb) != 'undefined') {
        _this.r = jQuery('<div></div>');
        _this.r.attr('id','dwl-bk');
        _this.r.text('[dwl] '+msg.nb);
        _this.r.appendTo('body');
        _this.r =true;
    }

    sendResponse(_this.r);

});