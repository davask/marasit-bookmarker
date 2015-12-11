dwlApp.config(['$routeProvider', '$locationProvider', function config($routeProvider, $locationProvider) {
    $routeProvider
        .when('/all', {
            templateUrl: '../templates/views/all.html',
            controller: 'dwlAllCtrl',
            controllerAs: 'dwlAll'
        })
        .when('/unique', {
            templateUrl: '../templates/views/app.html',
            controller: 'dwlCtrl',
            controllerAs: 'dwl'
        })
        .when('/untagged', {
            templateUrl: '../templates/views/app.html',
            controller: 'dwlAllCtrl',
            controllerAs: 'dwlAll'
        })
        .otherwise({
            redirectTo: '/all'
        });
        $locationProvider.html5Mode(true);
}]);