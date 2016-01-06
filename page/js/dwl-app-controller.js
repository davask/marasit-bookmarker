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
    };

    $scope.removeBookmark = function(id){
        _this.chromeBk.removeChromeBookmarks(id).then(function(){
            _this.generateBookmark();
        });
    };

    _this.generateBookmark = function() {

        $scope.bookmarks = [];
        $scope.tab = null;

        chrome.tabs.getSelected(null,function(tab){

            tab = _this.tagBk.setSpecificTagData(tab);

            chrome.bookmarks.search(tab.url, function(bookmarks){

                for (var i = 0; i < bookmarks.length; i++) {

                    bookmarks[i] = _this.tagBk.setSpecificTagData(bookmarks[i]);

                    if (typeof(localStorage['chromeBookmarks_'+bookmarks[i].id]) != 'undefined') {
                       bookmarks[i]['storage'] = JSON.parse(localStorage['chromeBookmarks_'+bookmarks[i].id]);
                    }

                    _this.chromeBk.chromeBookmarks[bookmarks[i].id] = bookmarks[i];
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

                    jQuery('.glyphicon[data-lazy]').each(function(){
                        var _this = this;
                        if (jQuery(_this).attr('data-lazy') != '') {
                            jQuery(_this).css({
                                'background-image':'url("'+jQuery(_this).attr('data-lazy')+'"), url("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAQABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAIH/8QAHhAAAgICAwEBAAAAAAAAAAAAAgMBBgQFAAcRITH/xAAVAQEBAAAAAAAAAAAAAAAAAAABA//EABoRAAICAwAAAAAAAAAAAAAAAAABAhEDIUH/2gAMAwEAAhEDEQA/ANS64o1Sz+u6rkZNW0D8l2qxGNazWpIzMkhJERSPszMz7M8N2FSqtrKDa3Jq+gTkK1eWamq1qQNZwk5EhKB9iYn8niOubzU9f17VsfJtWgRkJ1WKtqm7FIGBikIISGS9iYmPscnsq61DZdf2hOPaNA/KbqspaVq2SSNhyk4EYGC9mZmfkcnjbTal0Jbqj//Z")'
                            });
                        }
                    });

                });
            });
        });

    };

    $scope.editable = function(event) {

        if (jQuery(event.target).attr('readonly')) {

            jQuery(event.target).removeAttr('readonly');

        } else {

            var id = jQuery(event.target).parents('ul').attr('id');
            var value = jQuery(event.target).val();
            console.log(id, value);
            var tagIndex = parseInt(jQuery(event.target).attr('id').replace(id+'-',''),10);
            var indexCreated = false;

            console.log(_this.chromeBk.chromeBookmarks[id]);
            var b = _this.chromeBk.chromeBookmarks[id];

            if (typeof(b.tags[tagIndex]) == 'undefined') {
                b.tags[b.tags.length] = '';
                indexCreated = true;
            }

            if (value != b.tags[tagIndex]) {

                if(value == '') {

                    b.tags.splice(tagIndex, 1);

                } else {

                    if (_this.tagBk.tagSep.indexOf(value.charAt(0)) < 0) {
                        value = ' '+value;
                    }

                    b.tags[tagIndex] = value;

                }

                b.tags = _this.tagBk.getBookmarkTags('['+b.tags.join('')+'] '+b.titleNoTag);

                _this.chromeBk.chromeBookmarks[id] = b;

                // to finsih

            } else if (indexCreated && value == '') {

                    b.tags.splice(tagIndex, 1);

            }

        }

        console.log(id, _this.chromeBk.chromeBookmarks[id]);
        // clean latest tag input

    };

    _this.generateBookmark();

}]);
