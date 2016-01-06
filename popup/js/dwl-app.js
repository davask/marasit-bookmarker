var dwlApp = angular.module('dwlApp', [
                            'ui.bootstrap', 'ngRoute', 'ngAnimate',
                            'timer'
                        ]);

dwlApp.run(function($rootScope) {
   $rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {
      console.log(event, current, previous, rejection)
   })
});

/*
All the providers are instantiated only once. That means that they are all singletons.
All the providers except constant can be decorated.
A constant is a value that can be injected everywhere. The value of a constant can never be changed.
A value is just a simple injectable value.
A service is an injectable constructor.
A factory is an injectable function.
A decorator can modify or encapsulate other providers except a constant.
A provider is a configurable factory.
*/