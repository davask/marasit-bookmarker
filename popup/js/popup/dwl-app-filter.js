// dwlPopup.filter('parseURL', function() {
//     return parseURL
// });

// dwlPopup.filter('length', function() {
//     return getLength
// });

// dwlPopup.filter('startFrom', function () {

//     return function (input, start) {

//         if (input && input.length > 0) {
//             start = +start;
//             return input.slice(start);
//         }

//         return [];

//     };

// });

// dwlPopup.filter('bkType', function() {

//     return function (input, type) {

//         var out = [];

//         if (typeof(type) != "undefined" && type =="folder") {

//             for (var i = 0; i < input.length; i++){
//                 if (typeof(input[i].url) == "undefined" || input[i].url == "") {
//                     out.push(input[i]);
//                 }
//             }

//         } else if (typeof(type) != "undefined" && type =="bookmark") {

//             for (var i = 0; i < input.length; i++){
//                 if (typeof(input[i].url) != "undefined" && input[i].url != "") {
//                     out.push(input[i]);
//                 }
//             }

//         } else {
//             out = input;
//         }

//         return out;

//     };

// });

// dwlPopup.filter('noTag', function() {

//     return function (input, string) {

//         var out = [];

//         if (typeof(string) != "undefined" && string == "no-tag") {

//             for (var i = 0; i < input.length; i++){
//                 if (typeof(input[i].tags) == "undefined" || input[i].tags.length == 0) {
//                     out.push(input[i]);
//                 }
//             }

//         } else {
//             out = input;
//         }

//         return out;

//     };

// });

// dwlPopup.filter('list', function () {

//     return function(input, ids) {

//         var idsArray = [];
//         var out = [];

//         if(typeof(ids) != "undefined" && ids != '') {
//             idsArray = ids.split(',');

//             for (var i = 0; i < input.length; i++){
//                 if(idsArray.indexOf(input[i].id) > -1) {
//                     out.push(input[i]);
//                 }
//             }

//         } else {

//             out = input;

//         }

//         return out;

//     };

// });

// dwlPopup.filter('reverse', function() {
//   return function(items) {
//     return items.slice().reverse();
//   };
// });

// dwlPopup.filter('space2dash',function() {
//     return function(input) {
//         if (input) {
//             return input.replace(/\s+/g, '_');
//         }
//     }
// });

// dwlPopup.filter('dash2space',function() {
//     return function(input) {
//         if (input) {
//             return input.replace(/_+/g, ' ');
//         }
//     }
// });