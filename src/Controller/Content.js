import { bkSearchDisplay } from '$Src/Library/Content'; 

var goodHost = window.location.host.match(/google\.[a-z]{2,3}$/);
var goodPathname = window.location.pathname.match(/^\/(search|webhp)/);
var goodTab = new URL(window.location.href).searchParams.get('tbm');

chrome.runtime.onMessage.addListener(function(bgMsg, sender, sendResponse) {

    if ( bgMsg.status == 'result' ) {
      if ( document.getElementById('srg') == null ) {
        dwlTpl.g.init(bgMsg.bookmarks);
      }
    }

    var params = {
      'q': ''
    };
    var $ginput = jQuery(document.querySelector('[name="q"]'));

    if ( goodHost != null && goodPathname != null && goodTab == null && $ginput != null ) {
      params.q = $ginput.val();
    }

    if ( goodTab == null ) {
      bkSearchDisplay(params);
    }

    console.log('searching for: '+ params.q);
    sendResponse(params);

});

