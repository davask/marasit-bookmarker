import React, { Component } from 'react';
import { bkSearchDisplay } from '$Src/Library/Content';

class SearchListener extends Component {
  componentDidMount() {
    let goodHost = window.location.host.match(/google\.[a-z]{2,3}$/);
    let goodPathname = window.location.pathname.match(/^\/(search|webhp)/);
    let goodTab = new URL(window.location.href).searchParams.get('tbm');

    chrome.runtime.onMessage.addListener(this.handleMessage);

    console.log('SearchListener mounted.');
  }

  componentWillUnmount() {
    chrome.runtime.onMessage.removeListener(this.handleMessage);

    console.log('SearchListener unmounted.');
  }

  handleMessage = (bgMsg, sender, sendResponse) => {
    if (bgMsg.status == 'result') {
      if (document.getElementById('srg') == null) {
        dwlTpl.g.init(bgMsg.bookmarks);
      }
    }

    let params = { 'q': '' };
    let $ginput = jQuery(document.querySelector('[name="q"]'));

    let goodHost = window.location.host.match(/google\.[a-z]{2,3}$/);
    let goodTab = new URL(window.location.href).searchParams.get('tbm');

    if (goodHost != null && goodPathname != null && goodTab == null && $ginput != null) {
      params.q = $ginput.val();
    }

    if (goodTab == null) {
      bkSearchDisplay(params);
    }

    console.log('searching for: ' + params.q);
    sendResponse(params);
  }

  render() {
    return <div>testy</div>;
  }
}

export default SearchListener;
