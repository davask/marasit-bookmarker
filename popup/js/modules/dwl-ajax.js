var dwlDebug = angular.module('dwlAjax', []);
dwlDebug.service("ajaxSer", ['$http', '$q', function ($http, $q) {

    var _this = this;

    name = 'ajax';

    _this.setLiveData = function (bookmark, response) {

       /* blank file */
        bookmark.favicon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAACXBIWXMAAABIAAAASABGyWs+AAAAe1BMVEUAAAB5eXmFhYWPj4+cnJyrq6usrKywsLCysrK0tLS3t7e5ubm7u7u8vLy9vb2+vr6/v7/ExMTX19fg39/g4ODy8PDz8fHz8vHz8vL08vL18/P19PT29PT29fX29vb39vX39vb49/b5+Pf6+fj6+vn7+/r8+/v8/Pv///9dXxrvAAAAAXRSTlMAQObYZgAAAAFiS0dEKL2wtbIAAABtSURBVBjThc7BCoJQFITh79q1QIla9f7v1y6QEPGcFpZZLZrlz8zPFGfPxA0ql5Ilue77AVWmlOg6A1W8AAfDpjGOFHbafgHHuW2naes4cf+QIqlybqIJmhVkZCSxgliOlXfj2/ED/kyKYpP0APiUTB6XxQGDAAAAAElFTkSuQmCC';
        /* dwl logo */
        bookmark.favicon = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAQABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAIH/8QAHhAAAgICAwEBAAAAAAAAAAAAAgMBBgQFAAcRITH/xAAVAQEBAAAAAAAAAAAAAAAAAAABA//EABoRAAICAwAAAAAAAAAAAAAAAAABAhEDIUH/2gAMAwEAAhEDEQA/ANS64o1Sz+u6rkZNW0D8l2qxGNazWpIzMkhJERSPszMz7M8N2FSqtrKDa3Jq+gTkK1eWamq1qQNZwk5EhKB9iYn8niOubzU9f17VsfJtWgRkJ1WKtqm7FIGBikIISGS9iYmPscnsq61DZdf2hOPaNA/KbqspaVq2SSNhyk4EYGC9mZmfkcnjbTal0Jbqj//Z';

        var titleData = response.data.match(/<title>(.*)<\/title>/);
        if(titleData !== null && titleData.length > 1){
            bookmark.liveTitle = titleData[1];
        }

        var faviconData = response.data.match(/href=["|']([^"']*\.ico[^"']*)["|']/);
        if(faviconData !== null && faviconData.length > 1){
            bookmark.favicon = parseURL(bookmark.url).protocol+parseURL(faviconData[1]).hostname+parseURL(faviconData[1]).pathname;
        }

        bookmark.status = response.status;

        return bookmark;
    }

    _this.getLiveHtml = function(bookmark) {

        var _this = this;
        var deferred = $q.defer();

        var req = {};
        req['url'] = bookmark.url;

        $http(req).then(function(response) {
            deferred.resolve(_this.setLiveData(bookmark, response));
        }, function(rejection) {
            deferred.resolve(_this.setLiveData(bookmark, rejection));
        });

        return deferred.promise;
    };

    debug['ajax'] = false;
    // _this.active('ajax');

    return _this;

}]);