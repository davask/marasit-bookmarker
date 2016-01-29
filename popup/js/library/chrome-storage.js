var chromeStorage = {

    /* INSTANTIATE */
    'instantiate' : function() {
        var _this = this;
        _this.initialized = true;
    },

    /* VAR */
   'initialized' : false,
   'name' : 'storage',

   'addLogs' : {
        'instantiate' : 'chromeStorage instantiated',
        'saved' : 'options saved',
        'restore' : 'options restored'
   },

    save_options : function (id, value) {

        var d = $.Deferred();

        var s = {};
        s['dwl.options.'+id] = JSON.stringify(value);

        chrome.storage.sync.set(s, function() {
            d.resolve(true);
        });

        return d;
    },

    // Restores select box and checkbox state using the preferences
    // stored in chrome.storage.
    restore_options : function (id, defaultValue) {

        var d = $.Deferred();

        var s = {};
        s['dwl.options.'+id] = null;
        if (typeof(defaultValue) !== 'undefined' && defaultValue != '') {
            s['dwl.options.'+id] = defaultValue;
        }

        chrome.storage.sync.get(s, function(options) {
            d.resolve(JSON.parse(options['dwl.options.'+id]));
        });

        return d;
    },

    /* INIT */
    'init' : function () {
        var _this = this;
        if (!_this.initialized) {
            _this.instantiate();
        }
        return _this;
    }

}

