/* custom made or copied function to speed up dev */

var dwlDefault = {
    'icons' : {
        'dwl' : 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAQABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABAIH/8QAHhAAAgICAwEBAAAAAAAAAAAAAgMBBgQFAAcRITH/xAAVAQEBAAAAAAAAAAAAAAAAAAABA//EABoRAAICAwAAAAAAAAAAAAAAAAABAhEDIUH/2gAMAwEAAhEDEQA/ANS64o1Sz+u6rkZNW0D8l2qxGNazWpIzMkhJERSPszMz7M8N2FSqtrKDa3Jq+gTkK1eWamq1qQNZwk5EhKB9iYn8niOubzU9f17VsfJtWgRkJ1WKtqm7FIGBikIISGS9iYmPscnsq61DZdf2hOPaNA/KbqspaVq2SSNhyk4EYGC9mZmfkcnjbTal0Jbqj//Z',
        'valid' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAGrSURBVDjLvZPZLkNhFIV75zjvYm7VGFNCqoZUJ+roKUUpjRuqp61Wq0NKDMelGGqOxBSUIBKXWtWGZxAvobr8lWjChRgSF//dv9be+9trCwAI/vIE/26gXmviW5bqnb8yUK028qZjPfoPWEj4Ku5HBspgAz941IXZeze8N1bottSo8BTZviVWrEh546EO03EXpuJOdG63otJbjBKHkEp/Ml6yNYYzpuezWL4s5VMtT8acCMQcb5XL3eJE8VgBlR7BeMGW9Z4yT9y1CeyucuhdTGDxfftaBO7G4L+zg91UocxVmCiy51NpiP3n2treUPujL8xhOjYOzZYsQWANyRYlU4Y9Br6oHd5bDh0bCpSOixJiWx71YY09J5pM/WEbzFcDmHvwwBu2wnikg+lEj4mwBe5bC5h1OUqcwpdC60dxegRmR06TyjCF9G9z+qM2uCJmuMJmaNZaUrCSIi6X+jJIBBYtW5Cge7cd7sgoHDfDaAvKQGAlRZYc6ltJlMxX03UzlaRlBdQrzSCwksLRbOpHUSb7pcsnxCCwngvM2Rm/ugUCi84fycr4l2t8Bb6iqTxSCgNIAAAAAElFTkSuQmCC',
        'warning' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAPCAMAAADarb8dAAAAA3NCSVQICAjb4U/gAAAAb1BMVEX////m4t7/69bm4t7MzMz/5c3mz77jx7T/z6rksZX/tYf7o3XomXf/mWb/fFDwflr/dD7/bUT/zlj/xJr/w1X/slD7o3X/pEz/oEv/kkf/jEX/f0L/fFD/dD72cEv/bUT+az36aEL6ZEH9YzyZAAAajZ7FAAAAJXRSTlMAESIiIjNERFVmd4iImaqqu7v/////////////////////////86oppAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNAay06AAAAAWdEVYdENyZWF0aW9uIFRpbWUAMDgvMTMvMTAb/B4YAAAAd0lEQVQImVXN2xKCMAxF0aiogPdDA7QYjcr/f6O05VLOU/eazJQorqpotZNInfZWjdFDAtcWaF9L54K+hxQzPNgDfzdjlw4e4M4jKEfg3y70xSIC7M33Xs0ERo8DPBvMa4av8y48wwXQFfTmFPhDitWU6G7dMsn+EKkNYAgqGr0AAAAASUVORK5CYII=',
        'http' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAMAAAAMCGV4AAAAA3NCSVQICAjb4U/gAAABX1BMVEX///8AGW4AACQAM5kNHSEBFiIAQqZDfL8mSFkaP1YfPVUILFNdiMUkS2EARZwLPnQDNX6QrdNmmcxakMoja7oNWqYFPYgALXNmmcwjaa4NWqYfUH0FU6MCOnmbt9t6otGMrd55pNRDe6QzZpkncry2zOVnos270emUud9nos1dl8lDkdX////2+fzm+v/g+f/t9Pnm7vbO8v7g7Pbc5/TV6fjX4/HH5/zM4/W16f+/5f7O3/Cs5f/A4PfJ3PDA3fO13v/D2e271u+n3Piw2PW80+qW2/+10+2l1veU2f+00e2s0e+M1v+S0/ulzfGoyuqrx+WC0P+dyO6jxuZ/zv6VwuiKxfCExfCZwOiMwex2w/ZvxPmKu+SUud+Pt+NxvvRnvfWCtt9qufF/st5+suaMrd5jtfdjs+yArN1usORlr+Zarupsp9xspdlUp+RKltZPkshClN5Jkc86hsw9hMP8Ns4QAAAAdXRSTlMAEREiIiIzRERERERVVVVVVWZmZmZmZmZ3d3d3d3eIiLu7u7vM3d3u7u7u7v////////////////////////////////////////////////////////////////////////////////////////////////+XEIMzAAAACXBIWXMAAABkAAAAZAF4kfVLAAAAJXRFWHRTb2Z0d2FyZQBNYWNyb21lZGlhIEZpcmV3b3JrcyBNWCAyMDA0h3aszwAAAMlJREFUeJxjYAABNmEJETYGGOBRUHd1DNBQZIdw5Qx1zByt7awNzORBXEFdXbtgdycvEzNrMyEGBmY164BgP29vex0dXV1VRgbR3JhgEwu/IH87Qx2dWD4GyfzMSKCUX1yGv45hkRSDZGFetreOaVhqSoSOY44Mg1h+epqVcZinb2BUaJa2AAOTSny0i4eNpY1bSEKSChMDg3ixj6+zkb6Rg2dgET/IAbIl4R62euZ+4QXSEAdyK2slxyRqKnHBfcDKycvBwoANAACQeyY78zgQlwAAAABJRU5ErkJggg==',
        'file' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAMZJREFUeNpi/P//PwMlgAWXRFdXFz6Tg8vKytbhNACm2cPDg0FPTw+b/FogxQhiM2HTDNIIA9+/f2f4+vUrw+fPnxk+fPiAYRgTNs1AW7fAxP7+/YuCcYYBzNk7duwAYR9paemXQK44SNO/f/8YYDTeQER2OkizgoICw58/f+CaCRoACjCQX2GKf//+jaIZrxeQ/YysAZ1NtAG4DCLKAFyaiTIAFGi4NJPtBZINwKYZlOmIMgAU9+TmRj9gatxEpD4/GAMgwAAmB/m2aUdLLwAAAABJRU5ErkJggg==',
        'folder' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAOCAMAAAAR8Wy4AAAAA3NCSVQICAjb4U/gAAAAPFBMVEX////W1tb29vbf39/Fki3//////5n/95H/9I7/64X/4Hvf39/W1tb/1G//zGbms07Fki2Hh4dsbGxLS0vxznl1AAAAFHRSTlMAESIiu////////////////////w6FHE8AAAAJcEhZcwAACxIAAAsSAdLdfvwAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzQGstOgAAAAFnRFWHRDcmVhdGlvbiBUaW1lADA4LzEyLzEwo0B5fQAAAF9JREFUCJlNzlkOgCAMRdEik0XAB+5/r1LCdP64aUqJyADQtME2UOttrGssjOgD/ha2zxUJzDi0EPqSjmUGCW7KDpWQ4fzwzsDDCmFYIQ2QoM9P8bVLVKlbiXJs3J7rB0k/CJOj2tYHAAAAAElFTkSuQmCC'
    }
}

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

if (typeof convertToDate != 'function') {
    var convertToDate = function (unix_timestamp) {
        // Create a new JavaScript Date object based on the timestamp
        // multiplied by 1000 so that the argument is in milliseconds, not seconds.
        var date = new Date(unix_timestamp*1000);
        // Hours part from the timestamp
        var hours = date.getHours();
        // Minutes part from the timestamp
        var minutes = "0" + date.getMinutes();
        // Seconds part from the timestamp
        var seconds = "0" + date.getSeconds();

        // Will display time in 10:30:23 format
        var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
        return date;
    };
};

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
    (function() {
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
    })();
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