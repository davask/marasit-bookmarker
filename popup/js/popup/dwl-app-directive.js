dwlPopup.directive('todoEscape', function () {
    'use strict';

    var ESCAPE_KEY = 27;

    return function (scope, elem, attrs) {
        elem.bind('keydown', function (event) {
            if (event.keyCode === ESCAPE_KEY) {
                scope.$apply(attrs.todoEscape);
            }
        });

        scope.$on('$destroy', function () {
            elem.unbind('keydown');
        });
    };
});

dwlPopup.directive('todoFocus', function todoFocus($timeout) {
    'use strict';

    return function (scope, elem, attrs) {
        scope.$watch(attrs.todoFocus, function (newVal) {
            if (newVal) {
                $timeout(function () {
                    elem[0].focus();
                }, 0, false);
            }
        });
    };
});
// dwlPopup.directive("repeatComplete",function repeatComplete( $rootScope ) {

//     // source : http://www.bennadel.com/blog/2592-hooking-into-the-complete-event-of-an-ngrepeat-loop-in-angularjs.htm
//     var _this = this;
//     var uuid = 0;

//     _this.compile = function ( tElement, tAttributes ) {

//         var id = ++uuid;

//         tElement.attr( "repeat-complete-id", id );
//         tElement.removeAttr( "repeat-complete" );

//         var completeExpression = tAttributes.repeatComplete;
//         var parent = tElement.parent();
//         var parentScope = ( parent.scope() || $rootScope );

//         var unbindWatcher = parentScope.$watch(function() {

//             console.info( "Digest running." );

//             var lastItem = parent.children( "*[ repeat-complete-id = '" + id + "' ]:last" );
//             if ( ! lastItem.length ) {
//                 return;
//             }

//             var itemScope = lastItem.scope();

//             if ( itemScope.$last ) {
//                 unbindWatcher();
//                 itemScope.$eval( completeExpression );
//             }

//         });

//     }

//     return({
//         compile: _this.compile,
//         priority: 1001,
//         restrict: "A"
//     });

// });
