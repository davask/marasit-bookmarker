window.jQuery || document.write('<script src="../vendor/jquery-2.0.3/js/jquery-2.0.3.min.js"><\/script>');

dwlPopup = {
    'dwlBk':{},
    'popup':null,
    'html' : ''
};

chrome.runtime.onMessage.addListener(function(bgJsMsg, sender, sendResponse) {

    dwlPopup.html = '';
    // see https://developer.chrome.com/extensions/content_scripts
    dwlPopup.dwlBk = {};
    if (typeof(bgJsMsg.dwlBk) != 'undefined') {
        dwlPopup.dwlBk = bgJsMsg.dwlBk;
    }

    console.log(dwlPopup.dwlBk);

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

    sendResponse(dwlPopup.html.length > 0 ? true : false);

});