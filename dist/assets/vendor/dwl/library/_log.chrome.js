var chromeLog = {

    /* INSTANTIATE */
    'instantiate' : function() {
        _this = this;
        _this.initialized = true;
    },

     /* VAR */
    'initialized' : false,
    'name' : 'logs',

    'logs' : {
        'logs.default' : 'empty message, check your code',
        'logs.instantiate' : 'chromeLogsBookmarker instantiated'
    },

    /* FUNCTIONS */
    'log' : function (index) {

        var mess = this.logs['logs.default']+' - index used : \''+index+'\'';

        if(typeof index != 'undefined' && typeof this.logs[index] != 'undefined') {
            mess = this.logs[index];
        }

        console.log(mess);
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
