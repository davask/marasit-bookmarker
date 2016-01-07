dwlApp.config(['$routeProvider', '$locationProvider', function config($routeProvider, $locationProvider) {
    $routeProvider
        /* bookmarks */
        .when('/all', {
            templateUrl: '../templates/views/all.html',
            controller: 'dwlAllCtrl',
            controllerAs: 'dwlAll'
        })
        /* bookmark */
        .when('/page', {
            templateUrl: '../templates/views/page.html',
            controller: 'dwlPageCtrl',
            controllerAs: 'dwlPage'
        })
        .when('/unique', {
            templateUrl: '../templates/views/unique.html',
            controller: 'dwlUniqueCtrl',
            controllerAs: 'dwlUnique'
        })
        .when('/folder', {
            templateUrl: '../templates/views/folder.html',
            controller: 'dwlFolderCtrl',
            controllerAs: 'dwlFolder'
        })
        .when('/duplicate', {
            templateUrl: '../templates/views/duplicate.html',
            controller: 'dwlDuplicateCtrl',
            controllerAs: 'dwlDuplicate'
        })
        .when('/untagged', {
            templateUrl: '../templates/views/app.html',
            controller: 'dwlUntaggedCtrl',
            controllerAs: 'dwlUntagged'
        })
        /* todos */
        .when('/todo', {
            templateUrl: '../templates/views/todo.html',
            controller: 'dwlTodoCtrl',
            controllerAs: 'dwlTodo'
        })
        /* timer */
        .when('/timer', {
            templateUrl: '../templates/views/timer.html',
            controller: 'dwlTimerCtrl',
            controllerAs: 'dwlTimer'
        })

        .otherwise({
            redirectTo: '/unique'
        });
        $locationProvider.html5Mode(true);
}]);