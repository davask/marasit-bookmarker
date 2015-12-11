dwlApp.controller("appCtrl", [
      'TITLE','AUTHOR',
      function (
          TITLE,AUTHOR
) {

    var _this = this;

    _this.title = TITLE;
    _this.author = AUTHOR;

}]);

dwlApp.controller("dwlInitCtrl", [
    '$route', '$routeParams', '$location',
    '$scope',
    'tabsFactory',
    function (
        $route, $routeParams, $location,
        $scope,
        tabsFactory
) {

    var _this = this;

    _this.$route = $route;
    _this.$location = $location;
    _this.$routeParams = $routeParams;

    $scope.$watch(function () {
      return tabsFactory.getTabs();
    }, function (tabs) {
      $scope.tabs = tabs;
    });

}]);

dwlApp.controller("dwlAllCtrl", [
      '$route', '$routeParams', '$location',
      'tabsFactory',
      function (
          $route, $routeParams, $location,
          tabsFactory
) {

    var _this = this;

    _this.name = "All bookmark";
    _this.params = $routeParams;

    tabsFactory.setTab('all');

}]);

dwlApp.controller("dwlCtrl", [
    '$routeParams',
    '$scope', '$window',
    '$q', '$timeout',
    'tabsFactory', 'dwlBkObject',
    '$log',
    function (
        $routeParams,
        $scope, $window,
        $q, $timeout,
        tabsFactory, dwlBkObject,
        $log
    ) {

    var _this = this;

    _this.name = "dwlCtrl";
    _this.params = $routeParams;

    tabsFactory.setTab('unique');

    _this.dwlBk = {};
    jQuery('.dwlLoading').show();

    var defaultMaxSize = 8;
    var defaultEntryLimit = "8";

    _this.setMaxsize = function () {

        if ($scope.numPages < $scope.maxSize) {
            $scope.maxSize = $scope.numPages;
        } else {
            $scope.maxSize = defaultMaxSize;
        }

    };

    _this.getBookmarkTags = function () {

        var deferred = $q.defer();
        var b = _this.dwlBk.allBookmarks;
        if (b.length == 0) {
            _this.dwlBk = chrome.extension.getBackgroundPage().dwlBk;
            b = _this.dwlBk.allBookmarks;
        }

        var tags = ['dwl-noTag'];
        var inputs = {'dwl-noTag':[]};
        var out = [];

        for (var i = 0; i < b.length; i++) {

            if (b[i].tags.length > 0) {

                for (var y = 0; y < b[i].tags.length; y++) {

                    // b[i].tags[y] = b[i].tags[y].toLowerCase();
                    b[i].tags[y] = b[i].tags[y];

                    if (typeof(inputs[b[i].tags[y]]) == "undefined") {
                        inputs[b[i].tags[y]] = [];
                    }
                    inputs[b[i].tags[y]].push(b[i].id);

                }

                tags = tags.concat(b[i].tags);

            } else {
                inputs['dwl-noTag'].push(b[i].id);
            }

        }

        tags = tags.unique();

        for (var i = 0; i < tags.length; i++) {
            out.push({
                'index' : i,
                'tag' : tags[i],
                'data' : tags[i],
                'ids' :inputs[tags[i]]
            });
        }

        deferred.resolve(out);

        return deferred.promise;
    };

    $scope.maxSize = defaultMaxSize;
    $scope.entryLimit = defaultEntryLimit;

    $scope.filterType = 'titleNoTag';
    $scope.orderProp = 'titleNoTag';
    $scope.query = '.*';
    $scope.ids = '';
    $scope.idTags = '';
    $scope.idBatch = '';
    $scope.empty = '';

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
    };

    $scope.pageChanged = function() {
        $log.log('Page changed to: ' + $scope.currentPage);
    };

    $scope.showLoading = function () {
        jQuery('.dwlLoading').show();
    };

    $scope.filter = function() {

        $timeout(function() {

            $scope.totalItems = $scope.filtered.length;
            $scope.numPages = Math.ceil($scope.filtered.length/parseInt($scope.entryLimit,10));
            _this.setMaxsize();

        }, 10);

    };

    $scope.$watchGroup(['currentPage', 'entryLimit', 'filterQuery', 'filterType', 'ids'], function(newPage){

        $timeout(function() {

            jQuery('.glyphicon[data-lazy]').each(function(){
                var _this = this;
                if (jQuery(_this).attr('data-lazy') != '') {
                    jQuery(_this).css({
                        'background-image':'url("'+jQuery(_this).attr('data-lazy')+'"), url("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAQABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAIH/8QAHhAAAgICAwEBAAAAAAAAAAAAAgMBBgQFAAcRITH/xAAVAQEBAAAAAAAAAAAAAAAAAAABA//EABoRAAICAwAAAAAAAAAAAAAAAAABAhEDIUH/2gAMAwEAAhEDEQA/ANS64o1Sz+u6rkZNW0D8l2qxGNazWpIzMkhJERSPszMz7M8N2FSqtrKDa3Jq+gTkK1eWamq1qQNZwk5EhKB9iYn8niOubzU9f17VsfJtWgRkJ1WKtqm7FIGBikIISGS9iYmPscnsq61DZdf2hOPaNA/KbqspaVq2SSNhyk4EYGC9mZmfkcnjbTal0Jbqj//Z")'
                    });
                }
            });

            $window.jQuery('.checkbox input[type="checkbox"]:checked').removeAttr('checked');

        }, 0);

    });

    $scope.getBookmarksByTag = function(tag){

        var t = '';
        var q = [];
        var regex = '[^\\]]*'
        var qs = '^\\[';
        var qe = '';

        t = tag.split(/ \/ /g).clean("");
        q.push(qs);
        for (var i = 0; i < t.length; i++) {
            q.push(t[i]);
        };
        q.push(qe);

        $scope.query = q.join(regex);
        $scope.filter();

    };

    $scope.getBookmarksByIds = function(ids){

        $scope.ids = ids.join();
        $scope.filter();

    };

    $scope.openChecked = function () {
        var b = $window.jQuery('.checkbox input[type="checkbox"]:checked');
        if (b.length > 0 && b.length <= 10) {
            b.each(function(index, el) {
                var _this = this;
                var url = jQuery(_this).siblings('a[target="_blank"]').attr('href');
                if (url != '') {
                    chrome.tabs.create({'url': url});
                }
            });
        } else if (b.length <= 10) {
            console.log('You can t open more than 10 tabs at once.')
        }

        b.removeAttr('checked');
    };

    $scope.checkAll = function () {
        var b = $window.jQuery('.checkbox input[type="checkbox"]')
        b.removeAttr('checked');
        b.attr({'checked':'true'});
    };

    $scope.unCheckAll = function () {
        $window.jQuery('.checkbox input[type="checkbox"]:checked').removeAttr('checked');
    };

    $scope.batchTag = function(event) {

        var t = event.target;

        if (jQuery(event.target).attr('readonly')) {

            jQuery(event.target).removeAttr('readonly');

        } else {

            $scope.idBatch = jQuery(event.target).attr('id').replace('tag-','');
            var idsWithTag = $scope.bookmarksTags[$scope.idBatch].ids;
            var value = jQuery(event.target).val();
            var dataValue = jQuery(event.target).attr('data-tag');

            console.log(value, dataValue);

            if (value != dataValue) {

                jQuery('.dwlLoading').show();

                if (_this.dwlBk.tagSep.indexOf(value.charAt(0)) < 0) {
                    value = ' '+value;
                }

                var y = 0;
                for (var i = 0; i < idsWithTag.length; i++) {

                    _this.dwlBk.getBookmarkObject(idsWithTag[i]).done(function(){

                        var valueIndex = _this.dwlBk.b.tags.indexOf(dataValue);
                        if(valueIndex < 0) {
                            valueIndex = _this.dwlBk.b.tags.length;
                        }
                        _this.dwlBk.b.tags[valueIndex] = value;
                        _this.dwlBk.b.tags.unique();
                        _this.dwlBk.b.tags = _this.dwlBk.getBookmarkTags('['+_this.dwlBk.b.tags.join('')+'] '+_this.dwlBk.b.titleNoTag);

                        _this.dwlBk.setBookmarkObject(_this.dwlBk.b.id, '['+_this.dwlBk.b.tags.join('')+'] '+_this.dwlBk.b.titleNoTag).done(function(){
                            y++;
                            if(y == idsWithTag.length) {
                                $scope.resetBookmarker(function(){
                                    chrome.extension.getBackgroundPage().location.reload();
                                    if(typeof(t) != "undefined") {
                                        jQuery(t).val(jQuery(t).attr('data-tag'));
                                    }
                                });
                            }
                        });

                    });

                }

            }

        }
    }

    $scope.editable = function(event) {
        zone.fork({
            beforeTask: function () {
                console.log('before editable');
            },
            afterTask: function () {
                console.log('after editable');
                // $scope.$apply();
            },
        }).run(function(){

            if (jQuery(event.target).attr('readonly')) {

                jQuery(event.target).removeAttr('readonly');

            } else {

                $scope.idTags = jQuery(event.target).parents('.checkbox').attr('id');
                var tagIndex = parseInt(jQuery(event.target).attr('id').replace($scope.idTags+'-',''),10);
                var value = jQuery(event.target).val();
                var indexCreated = false;

                _this.dwlBk.getBookmarkObject($scope.idTags).done(function() {

                    if (typeof(_this.dwlBk.b.tags[tagIndex]) == 'undefined') {
                        _this.dwlBk.b.tags[_this.dwlBk.b.tags.length] = '';
                        indexCreated = true;
                    }

                    if (value != _this.dwlBk.b.tags[tagIndex]) {

                        if(value == '') {

                            _this.dwlBk.b.tags.splice(tagIndex, 1);

                        } else {

                            if (_this.dwlBk.tagSep.indexOf(value.charAt(0)) < 0) {
                                value = ' '+value;
                            }

                            _this.dwlBk.b.tags[tagIndex] = value;

                        }

                        _this.dwlBk.b.tags = _this.dwlBk.getBookmarkTags('['+_this.dwlBk.b.tags.join('')+'] '+_this.dwlBk.b.titleNoTag);

                        _this.dwlBk.setBookmarkObject($scope.idTags, '['+_this.dwlBk.b.tags.join('')+'] '+_this.dwlBk.b.titleNoTag).done(function(){
                            jQuery('.dwlLoading').show();

                            $scope.resetBookmarker(function() {
                                if($scope.idTags != '') {
                                    var bid = jQuery('.tags', '#'+$scope.idTags).attr('id');
                                    var id = bid.replace('bi-','');
                                    jQuery('li input', '#'+$scope.idTags+' #bi-'+id).each(function(index){
                                        jQuery(this).val($scope.allBookmarksById[$scope.idTags].tags[index]);
                                    });
                                    jQuery('.newTag', '#'+$scope.idTags).val('');
                                    $scope.idTags = '';
                                }
                            });
                            // chrome.extension.getBackgroundPage().location.reload();

                        });

                    } else if (indexCreated) {

                        // _this.dwlBk.b.tags.splice(tagIndex, 1);
                        _this.dwlBk.b = {}

                    }

                });

            }

        });

    };

    $scope.initBookmark = function () {
        $scope.currentPage = 1;
        $scope.totalItems = $scope.bookmarks.length;
        $scope.numPages = Math.ceil($scope.totalItems/parseInt($scope.entryLimit,10));
        _this.setMaxsize();
        jQuery('.dwlLoading').hide();
    };

    $scope.getAscendingParents = function(bookmark) {
        var parents = [];
        var parent = null, greatParent = null, ggreatParent = null;
        parent = $scope.allOriginalBookmarksById[bookmark.parentId];
        parents.push(parent);

        if (parent != null && typeof(parent) != "undefined" && parseInt(parent.parentId,10) > 0) {
            greatParent = $scope.allOriginalBookmarksById[parent.parentId];
            parents.push(greatParent);

            if (greatParent != null && typeof(greatParent) != "undefined" && parseInt(greatParent.parentId,10) > 0) {
                ggreatParent = $scope.allOriginalBookmarksById[greatParent.parentId];
                parents.push(ggreatParent);
            }

                if (ggreatParent != null && typeof(ggreatParent) != "undefined" && parseInt(ggreatParent.parentId,10) > 0) {
                    // gggreatParent = $scope.allOriginalBookmarksById[ggreatParent.parentId];
                    parents.push({'title':'[...]'});
                }

        }

        return parents;

    };

    $scope.resetBookmarker = function(callBack) {

        dwlBkObject().then(function(dwlBk){
            _this.dwlBk = dwlBk;
            _this.getBookmarkTags().then(function(out) {

                $scope.bookmarks = _this.dwlBk.allBookmarks;
                $scope.allBookmarksById = _this.dwlBk.allBookmarksById;
                $scope.allOriginalBookmarksById = _this.dwlBk.allOriginalBookmarksById;
                $scope.bookmarksTags = out;
                $scope.initBookmark();

                if(typeof(callBack) != "undefined") {
                    callBack();
                }

                console.log('bookamerker reset');

            });
        });

    };

    $scope.resetBookmarker(function(){
        document.getElementById("filterQuery").focus();
    });

}]);