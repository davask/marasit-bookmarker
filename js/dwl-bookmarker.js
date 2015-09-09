// debug
var dwl = chrome.extension.getBackgroundPage();
dwl.console.log('extension active');
dwl.debug = [];

// helper
Array.prototype.getUnique = function(){
   var u = {}, a = [];
   for(var i = 0, l = this.length; i < l; ++i){
      if(u.hasOwnProperty(this[i])) {
         continue;
      }
      a.push(this[i]);
      u[this[i]] = 1;
   }
   return a;
}

// Author
dwl["bookmarks_folders"] = {};
dwl["bookmarks_unique"] = [];
dwl["bookmarks_duplicate"] = {};


// show number of bookamrks
function getCountAllBookmarks() {
    chrome.bookmarks.getTree(countAllBookmarks);
}

var setBadgeDisplay = function (num_count, txt_count) {
    if (num_count > 9999) {
        txt_count = txt_count.substring(0,2)+"k"+txt_count.substring(2,3);
    }
    return txt_count;
}

var countAllBookmarks = function (allBookmarksArray) {
    var num_count = countNode(allBookmarksArray);
    var txt_count = "" + num_count;

    txt_count = setBadgeDisplay(num_count, txt_count);
    console.log(txt_count,dwl["bookmarks_unique"].length,Object.keys(dwl["bookmarks_duplicate"]).length,Object.keys(dwl["bookmarks_folders"]).length);

    chrome.browserAction.setBadgeText({text:txt_count});
    chrome.browserAction.setTitle({title:"" + num_count + " bookmarks (click to refresh)"});
};

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

var countNode = function (allBookmarksArray) {

    var count = 0;

    if (allBookmarksArray instanceof Array) {

        for (var i=0; i<allBookmarksArray.length; i++) {

            count += countNode(allBookmarksArray[i]);

        }

    } else {

        node = allBookmarksArray;

        if (node.children && node.children.length > 0) {

            count = countNode(node.children);

        } else {

            if (typeof (node.url) == "undefined") {

                var nodeId = node.id+"_"+node.title;

                if (typeof (node.children) != "undefined") {
                    delete node.children;
                }

                if (typeof (dwl.bookmarks_folders[nodeId]) == "undefined"){
                    dwl.bookmarks_folders[nodeId] = [];
                }

                dwl.bookmarks_folders[nodeId][dwl.bookmarks_folders[nodeId].length] = node;

            } else if (dwl.bookmarks_unique.indexOf(node.url) == -1) {

                dwl.bookmarks_unique[dwl.bookmarks_unique.length] = node.url;

                count = count + 1;

            } else {

                if (typeof (dwl.bookmarks_duplicate[node.url]) == "undefined"){
                    dwl.bookmarks_duplicate[node.url] = [];
                }
                dwl.bookmarks_duplicate[node.url][dwl.bookmarks_duplicate[node.url].length] = node;

            }

        }

    }

    return (count);

};

chrome.browserAction.onClicked.addListener(getCountAllBookmarks);
chrome.browserAction.setBadgeText({text:"..."});
getCountAllBookmarks();
