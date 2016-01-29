var dwlBookmarker = {

    /* INSTANTIATE */
    'instantiate' : function() {

        var _this = this;

        var instantiated = [];

        for (var i = 0; i < _this.requirements.length; i++) {
            var module = _this.requirements[i];
            var m = window[module];

            if(typeof(m) != "undefined") {
                _this.modules[module] = m.init();
                if (typeof(_this.modules['chromeLog']) != "undefined" && typeof(m.addLogs) != "undefined") {
                    for (var index in m.addLogs) {
                        _this.modules.chromeLog.logs[m.name+'.'+index] = '['+m.name+'.'+index+'] ' + m.addLogs[index];
                    }
                }
                _this.instantiated.push(module);
            }

        };

        if (typeof(_this.modules['chromeLog']) != "undefined") {
            _this.modules.chromeLog.logs[_this.name+'.instantiate'] = this.name+'dwlBookmarker has instantiated : ' + _this.instantiated.join(',');
            _this.initialized = true;
            _this.modules.chromeLog.log(_this.name+'.instantiate');
        } else {
            console.log('bookmarker instantiation error!');
        }

    },

    /* VAR */
   'initialized' : false,
   'name' : 'bookmarker',
    'requirements' : [
        'chromeLog',
        'chromeExtension',
        'chromeStorage',
        'chromeBookmarker',
        'dwlTagsManager',
    ],
    'instantiated' : [],
    'modules' : {},
    'object' : {},

    /* FUNCTION */


    /* INIT */
    'init' : function () {
        var _this = this;
        if (!_this.initialized) {
            _this.instantiate();
        }
        if (_this.initialized) {
            for (var m in _this.modules) {
                _this.object = merge(_this.object,_this.modules[m]);
            };
        }
        return _this.object;
    }

}
