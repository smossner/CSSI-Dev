(function ($) {
    Drupal.behaviors.rs = {
        attach: function (context, settings) {
            // If no revolution exist on this part of the page, work no further.
            if (!settings.rs || !settings.rs.render) {
                return;
            }
            $.each(settings.rs.render, function (key, value) {
                var data = $.extend(true, {}, value);
                
                $('#rs-wrapper-' + data.id, context).once('rs-render', function () {
                    $.each(data.options, function (k, v) {
                        if (k == 'parallaxLevels') {
                            // Do nothing
                        } else if (v === '') {
                            //delete options[k];
                        } else if (isNaN(v)) {
                            data.options[k] = v.trim();
                        } else {
                            data.options[k] = $.parseJSON(v);
                        }
                    });
                    if (data.options.timer == 'bottom') {
                        $('.tp-bannertimer', $(this)).addClass('tp-bottom');
                    }
                    var api = $('.rs-banner', $(this)).show().revolution(data.options);
                    $('.tp-caption[data-link]', $(this)).once('click', function(){
                      $(this).click(function(){
                        if($(this).data('link') == 'next'){
                          api.revnext();
                        }
                        else if($(this).data('link') == 'back'){
                          api.revprev();
                        }else{
                          window.location = $(this).data('link');
                        }
                      });
                    });
                });
            });
        }
    }
    //DOMSubtreeModified

    fixfullscreen = function(){
         jQuery('.fullscreenbanner').css('height',window.innerHeight);
    }
    fixfullscreen();
    var resize_throote;
    jQuery(window).on('resize',function(){
        clearTimeout(resize_throote);
        resize_throote = setTimeout(fixfullscreen,100);
    });
})(jQuery);
