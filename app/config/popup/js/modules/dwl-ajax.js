var dwlDebug = angular.module('dwlAjax', []);
dwlDebug.service("ajaxSer", ['$http', '$q', function ($http, $q) {

    var _this = this;

    name = 'ajax';

    _this.setLiveData = function (bookmark, response) {

      if(typeof(response) !== 'undefined' && response.data !== null) {

          var titleData = response.data.match(/<title>(.*)<\/title>/);
          if(titleData !== null && titleData.length > 1){
              bookmark.liveTitle = titleData[1];
          }

          /* todo : check favicon url status if 200 leave it */
          /* blank file */
          bookmark.favicon = dwlDefault.icons.http;
          //  var faviconData = response.data.match(/href=["|']([^"']*\.ico[^"']*)["|']/);
          //  if(faviconData !== null && faviconData.length > 1){
          //      bookmark.favicon = parseURL(bookmark.url).protocol+parseURL(faviconData[1]).hostname+parseURL(faviconData[1]).pathname;
          //  }

          bookmark.status = response.status;

      } else {

          /* folder logo */
          bookmark.type = 'folder';
          bookmark.liveTitle = bookmark.title;
          bookmark.favicon = dwlDefault.icons.folder;
          bookmark.status = null;
      }



        return bookmark;
    }

    _this.getLiveHtml = function(bookmark) {

        var _this = this;
        var deferred = $q.defer();

        var req = {};
        req['url'] = bookmark.url;

        if (typeof(bookmark.url) !== 'undefined' && bookmark.url != '') {
          $http(req).then(function(response) {
              deferred.resolve(_this.setLiveData(bookmark, response));
          }, function(rejection) {
              deferred.resolve(_this.setLiveData(bookmark, rejection));
          });
        } else {
            deferred.resolve(_this.setLiveData(bookmark));
        }

        return deferred.promise;
    };

    debug['ajax'] = false;
    // _this.active('ajax');

    return _this;

}]);