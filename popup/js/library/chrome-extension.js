var chromeExtension = {

    /* INSTANTIATE */
    'instantiate' : function() {
        var _this = this;
        _this.initialized = true;
    },

    /* VAR */
   'initialized' : false,
   'name' : 'extension',
   'addLogs' : {
        'instantiate' : 'chromeExtension instantiated',
        'notab' : 'no tab have been selected...'
   },

   'icon' : {},
   'iconTitle' : {'text':''},

    'setIcon' : function (tabId, mess) {
        var _this = this;

        _this.icon = {};
        _this.icon['path'] = 'img/icon-white16.png';

        if(tabId != -1) {
            _this.icon['tabId'] = tabId;
            if (mess > 1) {
                _this.icon['path'] = 'img/icon-black16.png';
            } else if (mess == 1) {
                _this.icon['path'] = 'img/icon16.png';
            }
        } else {
            _this.log('extension.notab');
        }

        chrome.browserAction.setIcon(_this.icon);
        _this.setBadge(mess);

    },

    'setBadge' : function (text) {
        var _this = this;

        _this.iconTitle.text = '';
        if (text !== '') {
            _this.iconTitle.text = ''+text;
        }

        chrome.browserAction.setBadgeText(_this.iconTitle);
    },

    'getTab' : function(tabId) {
        var _this = this;
        var d = $.Deferred();

        if(tabId > -1) {
            chrome.tabs.get(tabId,function(tab){
                if (typeof(tab) === "undefined") {
                    tab = [];
                }
                d.resolve(tab);
            });
        } else {
            d.resolve([]);
        }
        return d;
    },

    'bgReload' : function() {
        var _this = this;
        var d = $.Deferred();

        chrome.extension.getBackgroundPage().reloadBg();
        _this.isBgReload().then(function(isReload){
            if(isReload) {
                d.resolve(true);
            } else {
                d.resolve(false);
            }
        });

        return d;
    },

    'isBgReload' : function() {
        var _this = this;
        var d = $.Deferred();
        var ct = 0;
        var checkIsLoaded = '';
        var isLoaded = function(){
            if(chrome.extension.getBackgroundPage().dwlBk.isLoaded) {
                clearInterval(checkIsLoaded);
                d.resolve(true);
            } else {
                ct++;
                if (ct >10) {
                    clearInterval(checkIsLoaded);
                    d.resolve(false);
                }
            }
        };
        checkIsLoaded = setInterval(isLoaded, 500);
        return d;
    },

    /* INIT */
    'init' : function () {
        var _this = this;

        // chrome.extension.onMessage.addListener(function(bg, sender, sendResponse) {
        //     console.log(bg);
        //     if(bg.refreshMe) {
        //         _this.refreshMe = true;
        //     }
        // });

        if (!_this.initialized) {
            _this.instantiate();
        }
        return _this;
    }

}
