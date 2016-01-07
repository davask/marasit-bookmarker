var _this = this;

_this.r = false;

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {

    _this.r = false;

    console.log(msg.text);

    if (msg.text && (msg.text == "report_back")) {
        _this.r = jQuery('<div></div>');
        _this.r.attr('id','dwl-bk');
        _this.r.css({
            "height": "20px",
            "width": "20px",
            "background": "#bada55",
            "position": "fixed",
            "bottom": "0",
            "right": "0"
        });
        _this.r.appendTo('body');
        _this.r =true;
    }

    sendResponse(_this.r);

});