dwlPopup.config(['$compileProvider',function($compileProvider){
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|chrome.*):/);
}]);

dwlPopup.config(['$routeProvider', '$locationProvider', function config($routeProvider, $locationProvider) {

    /* index */
    $routeProvider.when('/', {
        templateUrl: '../templates/views/index.html',
        controller: 'dwlIndexCtrl',
        bodyClass: 'index'
    });

    /* bookmark */
    $routeProvider.when('/page', {
        templateUrl: '../templates/views/page.html',
        controller: 'dwlPageCtrl',
        bodyClass: 'page'
    });

    /* bookmark search */
    $routeProvider.when('/search', {
        templateUrl: '../templates/views/search.html',
        controller: 'dwlSearchCtrl',
        bodyClass: 'search'
    });
    $routeProvider.when('/search/:type/:query', {
        templateUrl: '../templates/views/search.html',
        controller: 'dwlSearchCtrl',
        bodyClass: 'search'
    });

    /* bookmark tags */
    $routeProvider.when('/tags', {
        templateUrl: '../templates/views/tags.html',
        controller: 'dwlTagsCtrl',
        bodyClass: 'tags'
    });

    /* timer */
    $routeProvider.when('/timer', {
        templateUrl: '../templates/views/timer.html',
        controller: 'dwlTimerCtrl',
        bodyClass: 'timer'
    })

    $routeProvider.otherwise({
        redirectTo: '/page'
    });
    $locationProvider.html5Mode(true);
}]);

dwlPopup.run(function($rootScope) {
   $rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {
      console.log(event, current, previous, rejection)
   });
   // $rootScope.$on('$routeChangeStart', function(event, current, previous, rejection) {
   //    console.log(event, current, previous, rejection)
   // });
});
