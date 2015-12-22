dwlApp.controller("dwlCtrl", ['TITLE','AUTHOR',
                                  function (TITLE,AUTHOR) {
    var _this = this;

    _this.title = TITLE;
    _this.author = AUTHOR;
}]);

dwlApp.controller("dwlInitCtrl", ['$scope','$log',
                                      function ($scope,$log) {
    var _this = this;

    $scope.bookmarks = [];

    chrome.tabs.getSelected(null,function(tab){
        chrome.bookmarks.search(tab.url, function(bookmarks){
            for (var i = bookmarks.length - 1; i >= 0; i--) {
                if (typeof(localStorage['chromeBookmarks_'+bookmarks[i].id]) != 'undefined') {
                   bookmarks[i]['storage'] = JSON.parse(localStorage['chromeBookmarks_'+bookmarks[i].id]);
                }
            };
            $scope.$apply(function(){
                $scope.bookmarks = bookmarks;
            });
        });
    });

}]);
