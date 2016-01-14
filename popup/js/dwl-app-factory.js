dwlApp.factory('chromeBkFactory', ['$q', function ($q){

    return function(){

        var deferred = $q.defer();
        var chromeBk = new chromeBookmarker();

        chromeBk.init().then(function(){
            deferred.resolve(chromeBk);
        });

        return deferred.promise;

    }

}]);

dwlApp.factory('_dwlBkFactory', ['$q', function ($q){

    return function(){

        var deferred = $q.defer();
        var dwlBk = new dwlBookmarker();

        dwlBk.init().then(function(){
            deferred.resolve(dwlBk);
        });

        return deferred.promise;

    }

}]);