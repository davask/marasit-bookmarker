chrome.runtime.getBackgroundPage(function(chromeBg){

    var mess = [{
        'index':'options_title',
        'position':'text',
        'attr':''
     },{
        'index':'manifest_description',
        'position':'attr',
        'attr':'content'
     },{
        'index':'options_default_page',
        'position':'text',
        'attr':''
     },{
        'index':'bookmark_page',
        'position':'text',
        'attr':''
    },{
        'index':'bookmark_search',
        'position':'text',
        'attr':''
    },{
        'index':'tags',
        'position':'text',
        'attr':''
    },{
        'index':'timer',
        'position':'text',
        'attr':''
    },{
        'index':'todos',
        'position':'text',
        'attr':''
    },{
        'index':'save',
        'position':'text',
        'attr':''
    },{
        'index':'guide_title',
        'position':'text',
        'attr':''
    },{
        'index':'guide',
        'position':'html',
        'attr':''
    },{
        'index':'tag_system_title',
        'position':'text',
        'attr':''
    },{
        'index':'tag_system',
        'position':'html',
        'attr':''
    },{
        'index':'flag_system_title',
        'position':'text',
        'attr':''
    },{
        'index':'flag_system',
        'position':'html',
        'attr':''
    }];

    for (var i = 0; i < mess.length; i++) {
        if(mess[i].position === 'attr') {
            jQuery('[data-'+mess[i].index+']').attr(mess[i].attr, chromeBg.bookmarker.getMessage(mess[i].index));
        } else if(mess[i].position === 'text') {
            jQuery('[data-'+mess[i].index+']').text(chromeBg.bookmarker.getMessage(mess[i].index));
        } else {
            jQuery('[data-'+mess[i].index+']').html(chromeBg.bookmarker.getMessage(mess[i].index));
        }
    };

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