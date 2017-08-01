/* ARRAY */
/**
 * Regular Expresion IndexOf for Arrays
 * This little addition to the Array prototype will iterate over array
 * and return the index of the first element which matches the provided
 * regular expresion.
 * Note: This will not match on objects.
 * @param  {RegEx}   rx The regular expression to test with. E.g. /-ba/gim
 * @return {Numeric} -1 means not found
 */
if (typeof(Array.prototype.regexIndexOf) != 'function') {
    Array.prototype.regexIndexOf = function (rx) {
        for (var i in this) {
            if (this[i].toString().match(rx)) {
                return i;
            }
        }
        return -1;
    };
};

if (typeof(Array.prototype.clean) != 'function') {
    Array.prototype.clean = function(deleteValue) {
      for (var i = 0; i < this.length; i++) {
        if (this[i] == deleteValue) {
          this.splice(i, 1);
          i--;
        }
      }
      return this;
    };
};

if (typeof(Array.prototype.unique) != 'function') {
    Array.prototype.unique = function() {
        var a = this.concat();
        for(var i=0; i<a.length; ++i) {
            for(var j=i+1; j<a.length; ++j) {
                if(a[i] === a[j]){
                    a.splice(j--, 1);
                }
            }
        }

        return a;
    };
};

// if (typeof(Array.prototype.insert) != 'function') {
//     Array.prototype.insert = function (index, item) {
//       return this.splice(index, 0, item);
//     };
// };

/* REGEX */
if (typeof RegExp.escape != 'function') {
    RegExp.escape = function(text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    };
};

/* MISC */

if (typeof getLength != 'function') {
    var getLength = function(input) {
        var ct = 0
        if(typeof(input) == "object") {
            if(!Array.isArray(input)) {
                if(typeof(Object.keys(input).length) === "number") {
                    ct = Object.keys(input).length;
                }
            } else {
                ct = input.length;
            }
        } else if (typeof(input) == "string") {
            ct = input.length;
        }
        return ct;
    };
};

/* inspired by : http://www.abeautifulsite.net/parsing-urls-in-javascript/ */
if (typeof parseURL != 'function') {
    var parseURL = function parseURL(url) {

        var parsedUrl = {
            tld: '',
            safe: '',
            protocol: '',
            host: '',
            hostname: '',
            dns: '',
            port: '',
            pathname: '',
            search: '',
            searchObject: '',
            hash: '',
            length: 0
        };

        if(typeof(url) !== 'undefined' && url !== '') {

            var parser = document.createElement('a'),
                searchObject = {},
                dns = '',
                queries, split, i;

            // Let the browser do the work
            parser.href = url;

            // Convert query string to object
            queries = parser.search.replace(/^\?/, '').split('&');

            for( i = 0; i < queries.length; i++ ) {
                split = queries[i].split('=');
                searchObject[split[0]] = split[1];
            };
            var matches = parser.hostname.match(/[^\.]+\.?[^\.]+$/);
            if(matches !== null && matches.length > 0) {
                dns = matches[0];
            };
            parsedUrl = {
                tld: parser.protocol + '//' + parser.hostname,
                safe: parser.protocol + '//' + parser.hostname + parser.pathname,
                protocol: parser.protocol,
                host: parser.host,
                hostname: parser.hostname,
                dns: dns,
                port: parser.port,
                pathname: parser.pathname,
                search: parser.search,
                searchObject: searchObject,
                hash: parser.hash,
                length:url.length
            };
        }

        return parsedUrl;
    };
};

if (typeof clone != 'function') {
    var clone = function (obj) {
        if (null == obj || "object" != typeof obj) return obj;
        var copy = obj.constructor();
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        return copy;
    }
};

if (typeof merge != 'function') {
    var merge = function (to, from) {
        for (var key in from) {
            if (from.hasOwnProperty(key)) {
                to[key] = from[key];
            }
        };
        return to;
    };
};

if (typeof extractHostname != 'function') {

    var extractHostname = function(url) {
        var hostname;
        //find & remove protocol (http, ftp, etc.) and get hostname

        if (url.indexOf("://") > -1) {
            hostname = url.split('/')[2];
        }
        else {
            hostname = url.split('/')[0];
        }

        //find & remove port number
        hostname = hostname.split(':')[0];
        //find & remove "?"
        hostname = hostname.split('?')[0];

        return hostname;
    }

};

if (typeof extractRootDomain != 'function') {

    var extractRootDomain = function (url) {
        var domain = extractHostname(url),
            splitArr = domain.split('.'),
            arrLen = splitArr.length;

        //extracting the root domain here
        if (arrLen > 2) {
            domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
        }
        return domain;
    }

};

if (typeof isUrl != 'function') {
    var isUrl = function(string) {
        var r = false;
        var regexUrl = '^https?:\\/\\/?[\\da-z\\.-]+\\.[a-z\\.]{2,6}.*$';
        url = string.match(regexUrl);

        if (url != null && url.length > 0) {
            r = true;
        }

        return r;

    };

};

if (typeof diffFilter != 'function') {
    var diffFilter = function (obj1,obj2) {
        var result = {};
        if(typeof(obj1) == 'undefined') {
            obj1 = {};
        }
        if(typeof(obj2) == 'undefined') {
            obj2 = {};
        }
        for(key in obj1) {
            if(typeof(obj2[key]) != 'undefined' && obj2[key] != obj1[key]) {
                result[key] = obj2[key];
            }
            if(typeof obj2[key] == 'array' && typeof obj1[key] == 'array') {
                result[key] = arguments.callee(obj1[key], obj2[key]);
            }
            if(typeof obj2[key] == 'object' && typeof obj1[key] == 'object'){
                result[key] = arguments.callee(obj1[key], obj2[key]);
            }
        }
        return result;
    };
};

if (typeof JSON2CSV != 'function') {

    var JSON2CSV = function (objArray, debug) {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        if (debug) console.log(array[0]);

        var str = '';
        var line = '';

        var head = array[0];
        for (var index in array[0]) {
            var value = index + "";
            line += '"' + value.replace(/"/g, '""') + '",';
        }

        line = line.slice(0, -1);
        str += line + '\r\n';

        for (var i = 0; i < array.length; i++) {
            var line = '';

            for (var index in array[i]) {
                var value = array[i][index] + "";
                line += '"' + value.replace(/"/g, '""') + '",';
            }

            line = line.slice(0, -1);
            str += line + '\r\n';
        }
        return str;

    };
};

if (typeof permutate != 'object') {
    var permutate = (function() {

        var results = [];

        function doPermute(input, output, used, size, level) {

            if (size == level) {
                var sep = '/';
                var paths = sep+output.join(sep);
                paths = paths.replace('/root','');
                if(paths != sep && paths != '') {
                    results.push(paths.toLowerCase());
                }
                return;
            }

            level++;

            for (var i = 0; i < input.length; i++) {

                if (used[i] === true) {
                    continue;
                }

                used[i] = true;
                output.push(input[i]);

                doPermute(input, output, used, size, level);

                used[i] = false;
                output.pop();

            }

        }

        return {

            getPermutations: function(input, size) {

                results = [];

                // var chars = input.split('');
                var chars = input;
                var output = [];
                var used = new Array(chars.length);

                if(typeof(size) == 'undefined') {
                    size = chars.length;
                }

                doPermute(chars, output, used, size, 0);

                return results.unique();

            }

        }

    })();

};

window.onerror = function(message, url, lineNumber) {
    //save error and send to server for example.
    console.log(message, url, lineNumber);
};
