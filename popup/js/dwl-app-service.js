dwlApp.service('tagService', [function () {

    var _this = this;

    return _this;

}]);

dwlApp.service('activityService', [function () {

    var _this = this;

    _this.defaultActivities = {};
    _this.defaultActivities['bookmark'] = {
        'name':'bookmark'
    };
    // _this.defaultActivities['todo'] = {
    //     'name':'todo'
    // };
    // _this.defaultActivities['timer'] = {
    //     'name':'timer'
    // };

    _this.getActivitiesOptions = function () {

        var options = [];

        for(var option in _this.defaultActivities) {
            options.push(_this.defaultActivities[option]);
        }

        return options;
    }

    _this.activities = _this.getActivitiesOptions();

    return _this;

}]);

dwlApp.service('routesService', [function () {

    var _this = this;

    _this.defaultRoutes = {
        'bookmark' : {
            'page' : {
                'name':'page',
                'path':'/page',
                'selected' : true
            },
            // 'all' : {
            //     'name':'all',
            //     'path':'/all',
            //     'selected' : true
            // },

            'unique' : {
                'name':'unique',
                'path':'/unique',
                'selected' : false
            },
            // 'folder' : {
            //     'name':'folder',
            //     'path':'/folder',
            //     'selected' : false
            // },
            'duplicate' : {
                'name':'duplicate',
                'path':'/duplicate',
                'selected' : false
            // },
            // 'untagged' : {
            //     'name':'untagged',
            //     'path':'/untagged',
            //     'selected' : false
            }
        },
        'todo' : {
            'todo' : {
                'name':'todo',
                'path':'/todo',
                'selected' : false
            }
        },
        'timer' : {
            'timer' : {
                'name':'timer',
                'path':'/timer',
                'selected' : false
            }
        }
    };

    _this.getRoutesOptions = function (route) {

        var options = [];

        for(var option in _this.defaultRoutes[route]) {
            options.push(_this.defaultRoutes[route][option]);
        }

        return options;
    }

    _this.routes = _this.getRoutesOptions;

    return _this;

}]);

dwlApp.service('bookmarkService', [function () {

    var _this = this;
    var path = '';

    _this.getBkPath = function (bks, id) {

        if(typeof(bks[id]) != "undefined" && bks[id].title != '') {
            path = bks[id].title;
        } else if (typeof(bks[id]) != "undefined" && bks[id].id == 0) {
            path = 'root';
        } else if (typeof(bks[id]) != "undefined") {
            path = 'bk_'+bks[id].id;
        }

        return path;

    };

    _this.getParentTree = function (bks, id) {

        var path = '/';
        var parentId = bks[id].parentId;

        path = path + _this.getBkPath(bks, parentId);

        if(typeof(bks[parentId]) != 'undefined' && bks[parentId].parentId) {
            path = _this.getParentTree(bks, parentId) + path;
        }

        return path;

    };

    _this.getTreeLeeves = function (bks, id) {


        var paths = [];

        paths.push(_this.getBkPath(bks, id));

        if(typeof(bks[id]) != 'undefined' && bks[id].parentId) {
            paths = paths.concat(_this.getTreeLeeves(bks, bks[id].parentId));
        }

        return paths;

    };

    _this.getAlternativesTree = function (bks, id) {

        var paths = [];
        var allPaths = [];

        allPaths = permutate.getPermutations(bks[id].paths);

        return allPaths;

    };

    return _this;

}]);