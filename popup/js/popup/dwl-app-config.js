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

    var routeSearchConfig = {
        templateUrl: '../templates/views/search.html',
        controller: 'dwlSearchCtrl',
        bodyClass: 'search'
    };

    /* bookmark search */
    $routeProvider.when('/search', routeSearchConfig);
    $routeProvider.when('/search/:type/:query', routeSearchConfig);

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

    /* todos */
    var routeTodosConfig = {
        templateUrl: '../templates/views/todos.html',
        controller: 'dwlTodosCtrl',
        bodyClass: 'todos',
        resolve: {
            store: function (todoStorage) {
                // Get the correct module (API or localStorage).
                return todoStorage.then(function (module) {
                    module.get(); // Fetch the todo records in the background.
                    return module;
                });
            }
        }
    };
    $routeProvider.when('/todos', routeTodosConfig);
    $routeProvider.when('/todos/:status', routeTodosConfig);

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
