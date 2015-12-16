/**
 * Regular Expresion IndexOf for Arrays
 * This little addition to the Array prototype will iterate over array
 * and return the index of the first element which matches the provided
 * regular expresion.
 * Note: This will not match on objects.
 * @param  {RegEx}   rx The regular expression to test with. E.g. /-ba/gim
 * @return {Numeric} -1 means not found
 */
if (typeof Array.prototype.regexIndexOf === 'undefined') {
    Array.prototype.regexIndexOf = function (rx) {
        for (var i in this) {
            if (this[i].toString().match(rx)) {
                return i;
            }
        }
        return -1;
    };
}

Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};

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