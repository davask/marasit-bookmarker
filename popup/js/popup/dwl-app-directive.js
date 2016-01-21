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