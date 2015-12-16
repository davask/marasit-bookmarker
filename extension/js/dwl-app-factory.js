dwlApp.factory('chromeBkFactory', ['$q', function ($q){

    return function(){

        var deferred = $q.defer();
        var chromeBk = new chromeNativeBookmarker();

        chromeBk.init().then(function(){
            deferred.resolve(chromeBk);
        });

        return deferred.promise;

    }

}]);

dwlApp.factory('dwlBkFactory', ['$q', function ($q){

    return function(){

        var deferred = $q.defer();
        var dwlBk = new dwlBookmarker();

        dwlBk.init().then(function(){
            deferred.resolve(dwlBk);
        });

        return deferred.promise;

    }

}]);

dwlApp.factory('dwlBKManipFactory', ['$q', function ($q){

    return function(){

        var deferred = $q.defer();
        var dwlBk = new dwlBookmarker();

        dwlBk.init().then(function(){
            deferred.resolve(dwlBk);
        });

        return deferred.promise;

    }

}]);