dwlApp.service('activityService', [function () {

    var _this = this;

    _this.defaultActivities = {
        'bookmark' : {
            'name':'bookmark'
        },
        'todo' : {
            'name':'todo'
        }
    };

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
            'all' : {
                'name':'all',
                'path':'/all'
            },

            'unique' : {
                'name':'unique',
                'path':'/unique',
                'selected' : true
            },
            'folder' : {
                'name':'folder',
                'path':'/folder'
            },
            'duplicate' : {
                'name':'duplicate',
                'path':'/duplicate'
            },
            'untagged' : {
                'name':'untagged',
                'path':'/untagged'
            }
        },
        'todo' : {
            'todo' : {
                'name':'todo',
                'path':'/todo'
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

    _this.getParentTree = function (bks, id) {

        var path = '/';
        var parentId = bks[id].parentId;

        if(typeof(bks[parentId]) != "undefined" && bks[parentId].title != '') {
            path = path + bks[parentId].title;
        } else if (bks[parentId].id == 0) {
            path = path + 'root';
        } else {
            path = path + 'bk_'+bks[parentId].id;
        }

        if(bks[parentId].parentId) {
            path = _this.getParentTree(bks, parentId) + path;
        }

        return path;

    };

    _this.search = function (search) {

        var _this = this;
        var d = $.Deferred();

        chrome.bookmarks.search(search, function(bookmarks){
            d.resolve(bookmarks.length);
        });

        return d;
    };

    return _this;

}]);