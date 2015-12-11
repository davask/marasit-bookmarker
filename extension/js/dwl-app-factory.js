dwlApp.factory('tabsFactory', [function () {

    var _this = this;

    var tabs = {
        'all' : false,
        'unique' : false,
        'untagged' : false
    };

    _this.tabs = tabs;

    _this.setTab = function(tab) {
        if (typeof(tab) == "undefined" || typeof(_this.tabs[tab]) == "undefined") {
            tab = 'all';
        }
        _this.initTab();
        console.log(tab, _this.initTab(), _this.tabs);
        _this.tabs[tab] = true;
        console.log(tab, _this.initTab(), _this.tabs);

    };

    _this.getTabs = function() {
        return _this.tabs;
    };

    _this.initTab = function() {
        _this.tabs = tabs;
    };

    return _this;

}]);

dwlApp.factory('dwlBkObject', function dwlBkObject($q){

    return function(){

        var deferred = $q.defer();
        var dwlBk = new dwlBookmarker();

        dwlBk.init().done(function(){
            deferred.resolve(dwlBk);
        });

        return deferred.promise;

    }

});