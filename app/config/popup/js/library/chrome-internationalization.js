var chromeInternationalization = {

    /* INSTANTIATE */
    'instantiate' : function() {
        _this = this;
        _this.initialized = true;
    },

     /* VAR */
    'initialized' : false,
    'name' : 'i18n',

    'logs' : {
        'logs.instantiate' : 'chromeI18n instantiated'
    },

    /* FUNCTIONS */
    'getMessage' : function (string) {
        var message = chrome.i18n.getMessage(string);
        return message;
    },

    /* INIT */
    'init' : function () {
        var _this = this;
        if (!_this.initialized) {
            _this.instantiate();
        }
        return _this;
    }

};