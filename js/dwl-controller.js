var dwlApp = angular.module('dwlApp', ['ui.bootstrap']);

dwlApp.factory("bookMarker", ['$q', function($q) {

    var getBookmarkObject = function() {

        var deferred = $q.defer();
        deferred.resolve(chrome.extension.getBackgroundPage().dwlBk);

        return deferred.promise;
    };

    var getBookmarkTags = function () {

        var deferred = $q.defer();
        var b = chrome.extension.getBackgroundPage().dwlBk.allBookmarks;

        var tags = ['dwl-noTag'];
        var inputs = {'dwl-noTag':[]};
        var out = [];

        for (var i = 0; i < b.length; i++) {

            if (b[i].tags.length > 0) {

                for (var y = 0; y < b[i].tags.length; y++) {

                    b[i].tags[y] = b[i].tags[y].toLowerCase();

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


    return {
        getBookmarkObject: getBookmarkObject,
        getBookmarkTags: getBookmarkTags
    };

}]).directive("repeatComplete",function( $rootScope ) {
    // source : http://www.bennadel.com/blog/2592-hooking-into-the-complete-event-of-an-ngrepeat-loop-in-angularjs.htm
    var uuid = 0;
    function compile( tElement, tAttributes ) {
        var id = ++uuid;
        tElement.attr( "repeat-complete-id", id );
        tElement.removeAttr( "repeat-complete" );
        var completeExpression = tAttributes.repeatComplete;
        var parent = tElement.parent();
        var parentScope = ( parent.scope() || $rootScope );
        var unbindWatcher = parentScope.$watch(function() {
            console.info( "Digest running." );
            var lastItem = parent.children( "*[ repeat-complete-id = '" + id + "' ]:last" );
            if ( ! lastItem.length ) {
                return;
            }
            var itemScope = lastItem.scope();
            if ( itemScope.$last ) {
                unbindWatcher();
                itemScope.$eval( completeExpression );
            }
        });
    }
    return({
        compile: compile,
        priority: 1001,
        restrict: "A"
    });
}).filter('startFrom', function () {
    return function (input, start) {
        if (input) {
            start = +start;
            return input.slice(start);
        }
        return [];
    };
}).filter('regex', function() {
    return function(input, field, regex) {
        var patt = new RegExp(regex);
        var out = [];
        for (var i = 0; i < input.length; i++){
            if(patt.test(input[i][field])) {
                out.push(input[i]);
            }
        }
        return out;
    };
}).filter('list', function() {
    return function(input, ids) {

        var idsArray = [];
        var out = [];

        if(typeof(ids) != "undefined" && ids != '') {
            idsArray = ids.split(',');

            for (var i = 0; i < input.length; i++){
                if(idsArray.indexOf(input[i].id) > -1) {
                    out.push(input[i]);
                }
            }

        } else {
            out = input;
        }

        return out;

    };
}).controller("dwlCtrl", ['$scope', 'bookMarker', '$log', '$timeout', '$window', function ($scope, bookMarker, $log, $timeout, $window) {

    jQuery('.dwlLoading').show();

    var defaultMaxSize = 10;
    var defaultEntryLimit = "10";

    var setMaxsize = function () {
        if ($scope.numPages < $scope.maxSize) {
            $scope.maxSize = $scope.numPages;
        } else {
            $scope.maxSize = defaultMaxSize;
        }
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
            setMaxsize();
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

        if (jQuery(event.target).attr('readonly')) {

            jQuery(event.target).removeAttr('readonly');

        } else {

            $scope.idBatch = jQuery(event.target).attr('id').replace('tag-','');
            var idsWithTag = $scope.bookmarksTags[$scope.idBatch].ids;
            var value = jQuery(event.target).val();
            var dataValue = jQuery(event.target).attr('data-tag');

            if (value != dataValue) {

                bookMarker.getBookmarkObject().then(function(dwlBk) {

                    if (dwlBk.tagSep.indexOf(value.charAt(0)) < 0) {
                        value = ' '+value;
                    }

                    for (var i = 0; i < idsWithTag.length; i++) {

                        dwlBk.getBookmarkObject(idsWithTag[i]).done(function(){

                            var valueIndex = dwlBk.b.tags.indexOf(dataValue);
                            dwlBk.b.tags[valueIndex] = value;

                            dwlBk.b.tags = $scope.dwlBk.getBookmarkTags('['+dwlBk.b.tags.join('')+'] '+dwlBk.b.titleNoTag);

                            dwlBk.setBookmarkObject(dwlBk.b.id, '['+dwlBk.b.tags.join('')+'] '+dwlBk.b.titleNoTag).done(function(){
                                jQuery('.dwlLoading').show();
                                chrome.extension.getBackgroundPage().location.reload();
                            });

                        });

                    }

                });

            }

        }
    }
    $scope.editable = function(event) {

        if (jQuery(event.target).attr('readonly')) {

            jQuery(event.target).removeAttr('readonly');

        } else {

            $scope.idTags = jQuery(event.target).parents('.checkbox').attr('id');
            var tagIndex = parseInt(jQuery(event.target).attr('id').replace($scope.idTags+'-',''),10);
            var value = jQuery(event.target).val();
            var indexCreated = false;

            bookMarker.getBookmarkObject().then(function(dwlBk) {

                dwlBk.getBookmarkObject($scope.idTags).done(function(){

                    if (typeof(dwlBk.b.tags[tagIndex]) == 'undefined') {
                        dwlBk.b.tags[dwlBk.b.tags.length] = '';
                        indexCreated = true;
                    }

                    if (value != dwlBk.b.tags[tagIndex]) {

                        if(value == '') {

                            dwlBk.b.tags.splice(tagIndex, 1);

                        } else {

                            if (dwlBk.tagSep.indexOf(value.charAt(0)) < 0) {
                                value = ' '+value;
                            }

                            dwlBk.b.tags[tagIndex] = value;

                        }

                        dwlBk.b.tags = $scope.dwlBk.getBookmarkTags('['+dwlBk.b.tags.join('')+'] '+dwlBk.b.titleNoTag);

                        dwlBk.setBookmarkObject($scope.idTags, '['+dwlBk.b.tags.join('')+'] '+dwlBk.b.titleNoTag).done(function(){
                            jQuery('.dwlLoading').show();
                            chrome.extension.getBackgroundPage().location.reload();
                        });

                    } else if (indexCreated) {

                        dwlBk.b.tags.splice(tagIndex, 1);

                    }

                });

            });

        }

    };

    $scope.initBookmark = function () {
        $scope.currentPage = 1;
        $scope.totalItems = $scope.bookmarks.length;
        $scope.numPages = Math.ceil($scope.totalItems/parseInt($scope.entryLimit,10));
        setMaxsize();
        jQuery('.dwlLoading').hide();
    };

    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if (typeof(request.dwlBk) == "object") {

                bookMarker.getBookmarkObject().then(function(dwlBk) {
                    $scope.dwlBk = dwlBk;
                    $scope.bookmarks = $scope.dwlBk.allBookmarks;
                    bookMarker.getBookmarkTags().then(function(out) {
                        $scope.bookmarksTags = out;
                        $scope.initBookmark();

                        if($scope.idTags != '') {
                            var bid = jQuery('.tags', '#'+$scope.idTags).attr('id').hide();
                            // var bid = jQuery('.tags', '#'+$scope.idTags).attr('id').replace('bi-','');
                            // jQuery('li input', '#'+$scope.idTags+' #bi-'+bid).each(function(index){
                            //     jQuery(this).val($scope.bookmarks[bid].tags[index]);
                            // });
                            // jQuery('.newTag', '#'+$scope.idTags).val('');
                            $scope.idTags = '';
                        }

                    });
                });

            }
    });

    bookMarker.getBookmarkObject().then(function(dwlBk) {
        $scope.dwlBk = dwlBk;
        $scope.bookmarks = $scope.dwlBk.allBookmarks;
        bookMarker.getBookmarkTags().then(function(out) {
            $scope.bookmarksTags = out;
            $scope.initBookmark();
            document.getElementById("filterQuery").focus();
        });
    });

}]);

var initApp = function () {
    angular.element(document).ready(function() {
      angular.bootstrap(document, ['dwlApp']);
    });
};