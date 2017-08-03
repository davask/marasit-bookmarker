var dwlModules = [];
dwlModules.push('ui.bootstrap');
// dwlModules.push('ui.router');
dwlModules.push('ngRoute');
dwlModules.push('ngAnimate');
dwlModules.push('ngTagsInput');
dwlModules.push('timer');
dwlModules.push('dwlDebug');
dwlModules.push('dwlBg');
dwlModules.push('dwlAjax');

var dwlPopup = angular.module('dwlPopup', dwlModules);

/*
All the providers are instantiated only once. That means that they are all singletons.
All the providers except constant can be decorated.
A constant is a value that can be injected everywhere. The value of a constant can never be changed.
A value is just a simple injectable value.
A service is an injectable constructor.
A factory is an injectable function.
A decorator can modify or encapsulate other providers except a constant.
A provider is a configurable factory.
*/