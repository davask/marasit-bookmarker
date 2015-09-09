// helper
/* BOOKMARKS OBJECT

{
    children: Array[3]
    dateAdded: 1413110592991
    dateGroupModified: 1441606663159
    id: "1"
    index: 0
    parentId: "0"
    title: "Bookmarks bar"
    url: "http://www.sitepoint.com/php-streaming-output-buffering-explained/"
}

*/

// Author

var dwl = {};

dwl["bookmarks_unique_count"] = 0;
dwl["bookmarks_unique_urls"] = [];
dwl["bookmarks_folders"] = {};
dwl["bookmarks_unique"] = {};
dwl["bookmarks_duplicate"] = {};


var refreshBookmarksStorage = function () {

    chrome.browserAction.setBadgeText({text:"Load"});

    var r = $.Deferred();

    dwl["bookmarks_unique_count"] = 0;
    dwl["bookmarks_unique_urls"] = [];
    dwl["bookmarks_folders"] = {};
    dwl["bookmarks_unique"] = {};
    dwl["bookmarks_duplicate"] = {};

    chrome.bookmarks.getTree(function(itemTree){
        itemTree.forEach(function(item){
            processNode(item);
        });
        r.resolve();
    });

    return r;

};


var processNode = function (node) {

    // recursively process child nodes
    if(node.children && node.children.length > 0) {
        node.children.forEach(function(child) {
            processNode(child);
        });
    }

    if (typeof (node.url) == "undefined") {

        var nodeId = node.id+"_"+node.title;

        if (typeof (node.children) != "undefined") {
            delete node.children;
        }

        if (typeof (dwl.bookmarks_folders[nodeId]) == "undefined"){
            dwl.bookmarks_folders[nodeId] = [];
        }

        dwl.bookmarks_folders[nodeId][dwl.bookmarks_folders[nodeId].length] = node;

    } else if (dwl.bookmarks_unique_urls.indexOf(node.url) == -1) {

        var uniqueId = dwl.bookmarks_unique_urls.length;
        dwl.bookmarks_unique_count = uniqueId+1;
        dwl.bookmarks_unique_urls[uniqueId] = node.url;
        dwl.bookmarks_unique[uniqueId] = node;

    } else {

        if (typeof (dwl.bookmarks_duplicate[node.url]) == "undefined"){
            dwl.bookmarks_duplicate[node.url] = [];
        }
        dwl.bookmarks_duplicate[node.url][dwl.bookmarks_duplicate[node.url].length] = node;

    }

};

var setBadgeDisplay = function () {

    var r = $.Deferred();

    txt_count = "...";
    chrome.browserAction.setBadgeText({text:""+txt_count});

    txt_count = dwl.bookmarks_unique_count;
    if (txt_count > 9999) {
        txt_count = txt_count(0,2)+"k"+txt_count.substring(2,3);
    }

    chrome.browserAction.setBadgeText({text:""+txt_count});
    chrome.browserAction.setTitle({title:"" + txt_count + " bookmarks (click to refresh)"});

    r.resolve();
    return r;

};

chrome.browserAction.onClicked.addListener(refreshBookmarksStorage);
// refreshBookmarksStorage().done(setBadgeDisplay);
refreshBookmarksStorage().done(function() {
    setBadgeDisplay().done(initApp);
});
