/* custom made or copied function to speed up dev */

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