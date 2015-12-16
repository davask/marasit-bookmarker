dwlApp.filter('startFrom', function startFrom() {

    return function (input, start) {

        if (input && input.length > 0) {
            start = +start;
            return input.slice(start);
        }

        return [];

    };

});

dwlApp.filter('bkType', function() {

    return function (input, type) {

        var out = [];

        if (typeof(type) != "undefined" && type =="folder") {

            for (var i = 0; i < input.length; i++){
                console.log();
                if (typeof(input[i].url) == "undefined" || input[i].url == "") {
                    out.push(input[i]);
                }
            }

        } else if (typeof(type) != "undefined" && type =="bookmark") {

            for (var i = 0; i < input.length; i++){
                if (typeof(input[i].url) != "undefined" && input[i].url != "") {
                    out.push(input[i]);
                }
            }

        } else {
            out = input;
        }

        return out;

    };

});

dwlApp.filter('regex', function regex() {

    return function(input, field, regex) {

        if (typeof(input) != "undefined" ) {

            var patt = new RegExp(regex);
            var out = [];

            for (var i = 0; i < input.length; i++){
                if(patt.test(input[i][field])) {
                    out.push(input[i]);
                }
            }

            return out;

        }

    };

});

dwlApp.filter('list', function list() {

    return function(input, ids) {

        var idsArray = [];
        var out = [];

        if(typeof(ids) != "undefined" && ids != '') {
            idsArray = ids.split(',');

            for (var i = 0; i < input.length; i++){
                if(idsArray.indexOf(input[i].id) > -1) {
                    out.push(input[i]);
                }
            }

        } else {

            out = input;

        }

        return out;

    };

});

dwlApp.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});

dwlApp.filter('space2dash',function() {
    return function(input) {
        if (input) {
            return input.replace(/\s+/g, '_');
        }
    }
});

dwlApp.filter('dash2space',function() {
    return function(input) {
        if (input) {
            return input.replace(/_+/g, ' ');
        }
    }
});