chrome.runtime.getBackgroundPage(function(chromeBg){

    chromeBg.bookmarker.restore_options('route', 'page').then(function(options){

        jQuery('#route').val(options.path);
        jQuery('#status').text('Options restored.');
        setTimeout(function() {
            jQuery('#status').text('');
        }, 750);

    });

    document.getElementById('save').addEventListener('click', function(){

        chromeBg.bookmarker.save_options('route',{'path':jQuery('#route').val()}).then(function(r){

            jQuery('#status').text('Options saved.');
            setTimeout(function() {
                jQuery('#status').text('');
            }, 750);

        });

    });

});