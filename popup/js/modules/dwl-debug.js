var dwlDebug = angular.module('dwlDebug', []);
dwlDebug.service("debugSer", [function () {

    var _this = this;

    name = 'debug';

    debug = {};

    _this.active = function (index) {
        debug[index] = true;
    };
    _this.activeAll = function () {
        for (var index in debug) {
            _this.active(index);
        };
    };
    _this.deactive = function (index) {
        debug[index] = false;
    };
    _this.deactiveAll = function () {
        for (var index in debug) {
            _this.deactive(index);
        };
    };

    _this.merge = function (object) {
        debug = merge(debug,object);
    };

    _this.get = function () {
        return debug;
    };

    debug['debug'] = false;

    _this.merge({
        'bg':true,
        'bookmarker':false,
        'tab':false,
        'bookmark':false,
        'similar':false,
        'route':false,
        'ajax':false,
        'index':false,
        'page':false,
        'search':false
    });

    return _this;

}]);