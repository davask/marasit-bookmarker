const bookmarks_process = (bookmarks) => {
    if (dwlBk == null) {
        var dwlBk = new dwl_Bk.init();
    }
    // dwlBk.updateSearchResults(bookmarks);
    return bookmarks;

};

const page_process = () => {

    // Do NOT forget that the method is ASYNCHRONOUS
    chrome.tabs.query({
        active: true
    }, function (tabs) {
        // Since there can only be one active tab in one active window,
        //  the array has only one element
        var tab = tabs[0];
        var goodPage = tab.url.match(/google\.[a-z]{2,3}\/(search|webhp)/);

        if (goodPage != null) {

            // ... show the page action.
            chrome.pageAction.show(tab.id);

            chrome.tabs.sendMessage(tab.id, {
                'status': 'complete'
            }, function (contentMsg) {

                console.log('Searching "' + contentMsg.q + '" in user bookmarks');

                if (contentMsg.q != '') {

                    chromeBookmarker.searchChromeBookmark(contentMsg.q).then(function (bookmarks) {

                        bookmarks = bookmarks_process(bookmarks);
                        chromeExtension.setIcon(tab.id, bookmarks.length);
                        chrome.tabs.sendMessage(tab.id, {
                            'status': 'result',
                            'bookmarks': bookmarks
                        });

                    });

                } else {

                    chromeExtension.setIcon(-1, 'error');
                    console.log('Something went wrong with this tab', tab);

                }

            });

        }

    });

}

export { bookmarks_process, page_process }