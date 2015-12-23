dwlApp.controller("dwlCtrl", ['TITLE','AUTHOR',
                                  function (TITLE,AUTHOR) {
    var _this = this;

    _this.title = TITLE;
    _this.author = AUTHOR;
}]);

dwlApp.controller("dwlInitCtrl", ['$scope','$window','$log',
                                      function ($scope,$window,$log) {
    var _this = this;

    _this.tagBk = chrome.extension.getBackgroundPage().tagBk;
    _this.chromeBk = chrome.extension.getBackgroundPage().chromeBk;

    $scope.inObject = false;
    $scope.inStorage = false;

    $scope.createBookmark = function(bookmark){
        _this.chromeBk.createChromeBookmarks(bookmark).then(function(){
            _this.generateBookmark();
        });
    }
    $scope.removeBookmark = function(id){
        _this.chromeBk.removeChromeBookmarks(id).then(function(){
            _this.generateBookmark();
        });
    }
    _this.generateBookmark = function() {

        $scope.bookmarks = [];
        $scope.tab = null;

        chrome.tabs.getSelected(null,function(tab){

            tab['tags'] = _this.tagBk.getBookmarkTags(tab.title);
            tab['titleNoTag'] = _this.tagBk.getTitleNoTag(tab.title);

            chrome.bookmarks.search(tab.url, function(bookmarks){

                for (var i = 0; i < bookmarks.length; i++) {
                    bookmarks[i]['tags'] = _this.tagBk.getBookmarkTags(bookmarks[i].title);
                    bookmarks[i]['titleNoTag'] = _this.tagBk.getTitleNoTag(bookmarks[i].title);
                    if (typeof(localStorage['chromeBookmarks_'+bookmarks[i].id]) != 'undefined') {
                       bookmarks[i]['storage'] = JSON.parse(localStorage['chromeBookmarks_'+bookmarks[i].id]);
                    }
                };

                $scope.$apply(function(){

                    if (bookmarks.length > 0 && tab.titleNoTag == bookmarks[0].titleNoTag) {

                        bookmarks[0]['tab'] = {};
                        bookmarks[0].tab['id'] = tab.id;
                        bookmarks[0].tab['index'] = tab.index;
                        bookmarks[0].tab['height'] = tab.height;
                        bookmarks[0].tab['width'] = tab.width;
                        bookmarks[0].tab['incognito'] = tab.incognito;
                        bookmarks[0].tab['status'] = tab.status;
                        bookmarks[0].tab['active'] = tab.active;
                        bookmarks[0].tab['audible'] = tab.audible;
                        bookmarks[0].tab['highlighted'] = tab.highlighted;
                        bookmarks[0].tab['mutedInfo'] = tab.mutedInfo;
                        bookmarks[0].tab['pinned'] = tab.pinned;
                        bookmarks[0].tab['selected'] = tab.selected;

                    } else {
                        $scope.tab = tab;
                    }

                    $scope.bookmarks = bookmarks;

                });
            });
        });

    };

    _this.generateBookmark();

}]);
