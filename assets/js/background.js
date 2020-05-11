chrome.tabs.onActivated.addListener(function(activeInfo) {
    // page_process();
});

chrome.tabs.onCreated.addListener(function(tab) {
    // page_process();
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
      page_process();
    }
});
