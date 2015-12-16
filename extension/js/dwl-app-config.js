dwlApp.config(['$routeProvider', '$locationProvider', function config($routeProvider, $locationProvider) {
    $routeProvider
        .when('/all', {
            templateUrl: '../templates/views/all.html',
            controller: 'dwlAllCtrl',
            controllerAs: 'dwlAll'
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
        .otherwise({
            redirectTo: '/unique'
        });
        $locationProvider.html5Mode(true);
}]);