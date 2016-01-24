dwlPopup.config(['$compileProvider',function($compileProvider){
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|chrome.*):/);
}]);

dwlPopup.config(['$routeProvider', '$locationProvider', function config($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: '../templates/views/index.html',
        controller: 'dwlIndexCtrl',
        bodyClass: 'index'
    });
    $routeProvider.when('/search/:type/:query', {
        templateUrl: '../templates/views/search.html',
        controller: 'dwlsearchCtrl',
        bodyClass: 'search'
    });
    $routeProvider.when('/search', {
        templateUrl: '../templates/views/search.html',
        controller: 'dwlsearchCtrl',
        bodyClass: 'search'
    });
        /* bookmark */
    $routeProvider.when('/page', {
        templateUrl: '../templates/views/page.html',
        controller: 'dwlPageCtrl',
        bodyClass: 'page'
    });
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
