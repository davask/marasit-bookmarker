// dwlPopup.service('activityService', [function () {

//     var _this = this;

//     _this.defaultActivities = {};
//     _this.defaultActivities['bookmark'] = {
//         'name':'bookmark'
//     };

//     _this.getActivitiesOptions = function () {

//         var options = [];

//         for(var option in _this.defaultActivities) {
//             options.push(_this.defaultActivities[option]);
//         }

//         return options;
//     }

//     _this.activities = _this.getActivitiesOptions();

//     return _this;

// }]);

// dwlPopup.service('routesService', [function () {

//     var _this = this;

//     _this.defaultRoutes = {
//         'bookmark' : {
//             'page' : {
//                 'name':'page',
//                 'path':'/page',
//                 'selected' : true
//             }
//         }
//     };

//     _this.getRoutesOptions = function (route) {

//         var options = [];

//         for(var option in _this.defaultRoutes[route]) {
//             options.push(_this.defaultRoutes[route][option]);
//         }

//         return options;
//     }

//     _this.routes = _this.getRoutesOptions;

//     return _this;

// }]);