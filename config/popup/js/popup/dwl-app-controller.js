dwlPopup.controller("dwlPopupCtrl", ['$scope', '$route','$location','$routeParams','$q','debugSer','bgSer','ajaxSer','TITLE','AUTHOR',
                                                 function ($scope, $route, $location, $routeParams, $q, debugSer, bgSer, ajaxSer, TITLE, AUTHOR) {

    $scope.name = 'common';

    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;

    $scope.title = TITLE;
    $scope.author = AUTHOR;
    $scope.dwlLoading = false;

    $scope.debug = debugSer;

    $scope.bg = bgSer;

    $scope.checkOptions = function(){
         if(!options['dwl.options.init']) {
             options['dwl.options.init'] = true;
             if('/'+options['dwl.options.route'].path !== $route.current.$$route.originalPath){
                 $location.path('/'+options['dwl.options.route'].path);
             }
         }
    };

    /* refactorize as $scope.init.common */
    $scope.bg.assign().then(function(o){
        $scope.bookmarker = o.bookmarker;
        $scope.dwlBk = o.dwlBk;
    });

    $scope.ajax = ajaxSer;

    $scope.query = '';
    $scope.queryType = 'query';

    $scope.edit = false;
    $scope.switchEditing = function (check) {
        if(typeof(check) === 'undefined') {
            check = false;
        }
        if(check) {
            if(!$scope.edit) {
                $scope.edit = !$scope.edit;
            }
        } else {
            $scope.edit = !$scope.edit;
        }
    };

    $scope.getLiveHtml = function (bookmark) {
        var deferred = $q.defer();

        $scope.ajax.getLiveHtml(bookmark).then(function(bookmark){
            deferred.resolve();
        });

        return deferred.promise;
    };

    $scope.openTab = function (url) {
        $scope.bookmarker.openTab(url);
    };

    $scope.refresh = {};
    $scope.refresh.common = function() {
        $scope.dwlLoading = true;
        $scope.bg.reload().then(function(){
            $scope.refresh[$scope.$route.current.locals.$scope.name]();
            $scope.edit = false;
        });
    };

    $scope.createBookmark = function(bookmark,scope) {
        $scope.dwlLoading = true;
        $scope.bookmarker.createChromeBookmarks(bookmark).then(function(bk){
            $scope.refresh.common();
        });
    }

    $scope.removeBookmark = function(id) {
        $scope.dwlLoading = true;
        $scope.bookmarker.removeChromeBookmarks(id).then(function(){
            $scope.refresh.common();
        }, function(){
            $scope.refresh.common();
        });
    }

    $scope.updateBookmark = function(newBookmark, oldBookmark) {
        if(
          oldBookmark.id === newBookmark.id
           && (
               oldBookmark.title !== newBookmark.title
               ||
               oldBookmark.url !== newBookmark.url
           )
        ) {
            $scope.dwlLoading = true;
            var b = {
                'id' : newBookmark.id,
                'title' : newBookmark.title,
                'url' : newBookmark.url
            };
            $scope.bookmarker.updateChromeBookmark(b).then(function(bk){
                $scope.refresh.common();
            });
        }
    };

}]);

dwlPopup.controller("dwlIndexCtrl", ['$scope',
                                                 function ($scope) {

    $scope.name = 'index';

    $scope.refresh.index = function() {
        $scope.dwlLoading = false;
    };

    $scope.checkOptions();

}]);

/* -------------------------------------- */
/* -----------PAGE ----------------- */
/* -------------------------------------- */
dwlPopup.controller("dwlPageCtrl", ['$scope','$timeout','$q','$location', function ($scope,$timeout,$q,$location) {

    $scope.name = 'page';

    $scope.page = {};

    $scope.refresh.page = function() {
        $scope.init().then(function(){
            $scope.dwlLoading = false;
        });
    };

    $scope.init = function() {
        var deferred = $q.defer();

        $scope.bg.assign().then(function(o){
            $scope.dwlBk = o.dwlBk;
            angular.copy(o.dwlBk, $scope.page);
            $scope.query = '';
            if(o.dwlBk.similar.length > 0) {
                $scope.query = o.dwlBk.tab.parsedUrl.tld;
            }
            deferred.resolve();
        });

        return deferred.promise;
    };

    /* refactorize as $scope.watch.common */
    $scope.$watch(function(){
        return $scope.edit;
    },function(newValue, oldValue){
        if(!newValue && typeof ($scope.dwlBk.bookmarks) !== "undefined" && typeof ($scope.page.bookmarks) !== "undefined") {
            for (var i = 0; i < $scope.dwlBk.bookmarks.length; i++) {
                if(typeof ($scope.page.bookmarks[i]) !== 'undefined') {
                    $scope.page.bookmarks[i] = $scope.bookmarker.updateTitle($scope.page.bookmarks[i]);
                    $scope.updateBookmark($scope.page.bookmarks[i], $scope.dwlBk.bookmarks[i]);
                }
            };
        }
    });

    $scope.checkOptions();
    $scope.refresh.common();

}]);

/* -------------------------------------- */
/* -----------SEARCH ------------ */
/* -------------------------------------- */
dwlPopup.controller("dwlSearchCtrl", ['$scope','$routeParams','$q','$filter',function ($scope, $routeParams, $q, $filter) {

    $scope.name = 'search';

    $scope.search = {
        'results' : [],
        'live' : []
    };

    $scope.pageSize = 5;
    $scope.currentPage = 0;
    $scope.nbPages = 1;
    $scope.filteredBookmarks = [];
    $scope.numberOfPages = function(){
        $scope.nbPages = Math.ceil($scope.filteredBookmarks.length/$scope.pageSize);
    };

    $scope.refresh.search = function() {
        $scope.searchBookmark();
    };

    $scope.init = function() {
        var deferred = $q.defer();

        $scope.bg.assign().then(function(o){
            $scope.dwlBk = o.dwlBk;
            $scope.query = '';

            if(typeof($routeParams.query) !== 'undefined') {
                $scope.query = $filter('atob')($routeParams.query);
            }
            if(typeof($routeParams.queryType) !== 'undefined') {
                $scope.queryType = $routeParams.queryType;
            }

            if($scope.query === '') {
                $scope.query = o.dwlBk.query;
                $scope.queryType = 'query';
            }

            $scope.searchBookmark();

            deferred.resolve();
        });

        return deferred.promise;
    };

    $scope.searchBookmark = function() {
        $scope.dwlLoading = true;

        $scope.search = {
            'results' : [],
            'live' : []
        };

        $scope.bookmarker.searchChromeBookmark($scope.query, $scope.queryType).then(function(bk){
            for (var i = 0; i < bk.length; i++) {
                bk[i] = $scope.bg.upgradeBookmark(bk[i],'bookmark');
                $scope.search.results.push(bk[i]);
            };
            angular.copy($scope.search.results,$scope.search.live);
            $scope.dwlLoading = false;
            $scope.$apply();
        });
    }

    $scope.$watch(function(){
        return $scope.edit;
    },function(newValue, oldValue){
        if(!newValue && typeof ($scope.search.results) !== "undefined" && typeof ($scope.search.live) !== "undefined") {
            for (var i = 0; i < $scope.search.results.length; i++) {
                if(typeof ($scope.search.live[i]) !== 'undefined') {
                    $scope.search.live[i] = $scope.bookmarker.updateTitle($scope.search.live[i]);
                    $scope.updateBookmark($scope.search.live[i], $scope.search.results[i]);
                }
            };
        }
    });

    $scope.checkOptions();
    $scope.init();

}]);

/* -------------------------------------- */
/* -----------TAGS ----------------- */
/* -------------------------------------- */
dwlPopup.controller("dwlTagsCtrl", ['$scope','$q',function ($scope,$q) {

    $scope.name = 'tags';

    $scope.refresh.tags = function() {
    };

    $scope.pageSize = 200;
    $scope.currentPage = 0;
    $scope.nbPages = 0;
    $scope.tagsFiltered = [];
    $scope.numberOfPages = function(){
        $scope.nbPages = Math.ceil($scope.tagsFiltered.length/$scope.pageSize);
    };

    $scope.init = function() {
        var deferred = $q.defer();

        $scope.bg.assign().then(function(o){
            $scope.dwlBk = o.dwlBk;
            deferred.resolve();
        });

        return deferred.promise;
    };

    $scope.$watch(function(){
        return $scope.tagsFiltered.length;
    },function(newValue, oldValue){
        $scope.numberOfPages();
    });

    $scope.init();

}]);

/* --------------------------------------- */
/* -----------TIMER ----------------- */
/* --------------------------------------- */
dwlPopup.controller("dwlTimerCtrl", ['$scope',function ($scope) {

    var _this = this;
     _this.timer = {
        'start': '',
        'pause': {'start' : '', 'stop' : ''},
        'stop': '',
        'inPause': false
    };

    $scope.init = true;
    $scope.timerStatus = 'stop';
    $scope.timerIndex = null;
    $scope.timerAutoStart = false;
    $scope.timerPauseTime = new Date().getTime();
    _this.timers = {
        'lastIndex' : null,
        'records' : {}
    };
    $scope.timers = angular.copy(_this.timers);
    $scope.timer = {};

    $scope.name = "timer";

    $scope.refresh.timer = function() {
    };

    $scope.timerRunning = false;

    $scope.startTimer = function (){
        $scope.timerStatus = 'start';
        $scope.timerRunning = true;
        $scope.$broadcast('timer-start');
    };

    $scope.resumeTimer = function (){
        $scope.timerStatus = 'resume';
        $scope.timerRunning = true;
        $scope.$broadcast('timer-resume');
    };

    $scope.pauseTimer = function (){
        $scope.timerStatus = 'pause';
        $scope.timerRunning = false;
        $scope.$broadcast('timer-stop');
    };

    $scope.stopTimer = function (){
        $scope.timerStatus = 'stop';
        $scope.timerRunning = false;
        $scope.$broadcast('timer-stop');
    };

    $scope.bookmarker.restore_options('timers').then(function(timers){

        if(timers !== null && typeof(timers.records) != 'undefined' && typeof(timers.lastIndex) != 'undefined') {
            $scope.timers.records = timers.records;
            $scope.timers.lastIndex = timers.lastIndex;
        }

        var timerIndexes = Object.keys($scope.timers.records).length - 1;
        if(timerIndexes > -1) {
            $scope.timer = $scope.timers.records[$scope.timers.lastIndex];
        } else {
            $scope.timer = _this.timer;
        }

        if($scope.timer.stop === '' && $scope.timer.start !== '') {
            var startTime = new Date().getTime();
            $scope.timerIndex = angular.copy($scope.timers.lastIndex);

            if($scope.timer.pause.start !== '') {
                if($scope.timer.pause.stop !== '') {
                    $scope.resumeTimer();
                } else {
                    $scope.pauseTimer();
                }
            } else {
                $scope.resumeTimer();
            }
        }
        $scope.init = false;

    });

    var broadcastTimerStart = function() {
        var startTime = new Date().getTime();

        $scope.timerPauseTime = angular.copy(startTime);
        $scope.timers = angular.copy(_this.timers);
        $scope.timers.lastIndex = angular.copy(startTime);
        $scope.timerIndex = angular.copy(startTime);

        $scope.timers.records[$scope.timerIndex] = angular.copy(_this.timer);
        $scope.timer = $scope.timers.records[$scope.timerIndex];
        $scope.timer.start = angular.copy(startTime);
        $scope.timer.inPause = false;

        $scope.bookmarker.save_options('timers', $scope.timers).then(function(){
            console.log('timer-'+$scope.timerStatus+' = saved');
        });
    };

    var broadcastTimerResume = function() {

        if(!$scope.init) {
            var startTime = new Date().getTime();

            $scope.timer.pause.stop = angular.copy(startTime);
            var passedTime = angular.copy($scope.timer.pause.start) - angular.copy($scope.timer.start);
            $scope.timerPauseTime = angular.copy(startTime) - angular.copy(passedTime);
            $scope.timer.pause.start = angular.copy($scope.timerPauseTime);
            $scope.timer.start = angular.copy($scope.timer.pause.start);
            $scope.timer.inPause = false;

            $scope.bookmarker.save_options('timers', $scope.timers).then(function(){
                console.log('timer-'+$scope.timerStatus+' = saved');
            });
        } else {
            $scope.timerPauseTime = angular.copy($scope.timer.start);
            $scope.timer.inPause = false;
            $scope.$apply();
        }
    };

    var broadcastTimerPause = function(init) {

        if(!$scope.init) {
            var stopTime = new Date().getTime();
            $scope.timer.pause.stop = '';
            $scope.timer.pause.start = angular.copy(stopTime);
            $scope.timer.inPause = true;

            $scope.bookmarker.save_options('timers', $scope.timers).then(function(){
                console.log('timer-'+$scope.timerStatus+' = saved');
            });
        } else {
            $scope.$apply();
        }
    };

    var broadcastTimerStop = function() {
        var stopTime = new Date().getTime();

        $scope.timer.stop = angular.copy(stopTime);
        if($scope.timer.inPause) {
            $scope.timer.pause.stop = angular.copy(stopTime);
        }
        $scope.timer.inPause = true;

        $scope.bookmarker.save_options('timers', $scope.timers).then(function(){
            console.log('timer-'+$scope.timerStatus+' = saved');
        });
    };

    $scope.$on('timer-start', function (event, args) {
        broadcastTimerStart();
    });

    $scope.$on('timer-resume', function (event, args) {
        if($scope.timerStatus == 'resume') {
            broadcastTimerResume();
        }
    });

    $scope.$on('timer-stopped', function (event, args) {
        if($scope.timerStatus == 'pause') {
            broadcastTimerPause();
        } else {
            broadcastTimerStop();
        }
    });

    $scope.$on('timer-tick', function (event, args) {
        $scope.timerConsole += $scope.timerType  + ' - event.name = '+ event.name + ', timeoutId = ' + args.timeoutId + ', millis = ' + args.millis +'\n';
    });

}]);

/* --------------------------------------- */
/* -----------TIMER ----------------- */
/* --------------------------------------- */
dwlPopup.controller("dwlTodosCtrl", ['$scope', '$routeParams', '$filter', 'store', function ($scope, $routeParams, $filter, store) {

    'use strict';

    $scope.name = 'todos';

    $scope.refresh.index = function() {
        $scope.dwlLoading = false;
    };

    var todos = $scope.todos = store.todos;

    $scope.newTodo = '';
    $scope.editedTodo = null;

    $scope.addTodo = function () {
        var newTodo = {
            title: $scope.newTodo.trim(),
            completed: false
        };

        if (!newTodo.title) {
            return;
        }

        $scope.saving = true;
        store.insert(newTodo)
            .then(function success() {
                $scope.newTodo = '';
            })
            .finally(function () {
                $scope.saving = false;
            });
    };

    $scope.editTodo = function (todo) {
        $scope.editedTodo = todo;
        // Clone the original todo to restore it on demand.
        $scope.originalTodo = angular.extend({}, todo);
    };

    $scope.saveEdits = function (todo, event) {
        // Blur events are automatically triggered after the form submit event.
        // This does some unfortunate logic handling to prevent saving twice.
        if (event === 'blur' && $scope.saveEvent === 'submit') {
            $scope.saveEvent = null;
            return;
        }

        $scope.saveEvent = event;

        if ($scope.reverted) {
            // Todo edits were reverted-- don't save.
            $scope.reverted = null;
            return;
        }

        todo.title = todo.title.trim();

        if (todo.title === $scope.originalTodo.title) {
            $scope.editedTodo = null;
            return;
        }

        store[todo.title ? 'put' : 'delete'](todo)
            .then(function success() {}, function error() {
                todo.title = $scope.originalTodo.title;
            })
            .finally(function () {
                $scope.editedTodo = null;
            });
    };

    $scope.revertEdits = function (todo) {
        todos[todos.indexOf(todo)] = $scope.originalTodo;
        $scope.editedTodo = null;
        $scope.originalTodo = null;
        $scope.reverted = true;
    };

    $scope.removeTodo = function (todo) {
        store.delete(todo);
    };

    $scope.saveTodo = function (todo) {
        store.put(todo);
    };

    $scope.toggleCompleted = function (todo, completed) {
        if (angular.isDefined(completed)) {
            todo.completed = completed;
        }
        store.put(todo, todos.indexOf(todo))
            .then(function success() {}, function error() {
                todo.completed = !todo.completed;
            });
    };

    $scope.clearCompletedTodos = function () {
        store.clearCompleted();
    };

    $scope.markAll = function (completed) {
        todos.forEach(function (todo) {
            if (todo.completed !== completed) {
                $scope.toggleCompleted(todo, completed);
            }
        });
    };

    $scope.$watch('todos', function () {
        $scope.remainingCount = $filter('filter')(todos, { completed: false }).length;
        $scope.completedCount = todos.length - $scope.remainingCount;
        $scope.allChecked = !$scope.remainingCount;
    }, true);

    // Monitor the current route for changes and adjust the filter accordingly.
    $scope.$on('$routeChangeSuccess', function () {
        var status = $scope.status = $routeParams.status || '';
        $scope.statusFilter = (status === 'active') ?
            { completed: false } : (status === 'completed') ?
            { completed: true } : {};
    });

    $scope.checkOptions();

}]);

/*
dwlPopup.controller("dwlAlarmCtrl", ['$scope', '$timeout', 'dwlAlarmFactory',
                                                 function ($scope, $timeout, dwlAlarmFactory) {

    $scope.name = 'alarm';

    /* ACTIVATE IT IN background.js * /
    /* nested route see http://www.funnyant.com/angularjs-ui-router/ * /
    /* nested route see http://www.bennadel.com/blog/2420-mapping-angularjs-routes-onto-url-parameters-and-client-side-events.htm * /
    /* nested route see https://angular-ui.github.io/ui-router/site/#/api/ui.router * /
    // Initialize the current time immediately
    $scope.time = dwlAlarmFactory.time;

    $scope.refresh.alarm = function() {
        $scope.dwlLoading = false;
    };

    // Keep the time in sync
    dwlAlarmFactory.on("second", function() {
        $scope.time = dwlAlarmFactory.time;
    });

    $scope.checkOptions();

}]);
*/
