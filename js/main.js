
var wait = false;
var wHeight, wWidth, mMedia, oldMMedia;        // matchMedia small or big




/*function toggleFullScreen() {
  var doc = window.document;
  var docEl = doc.documentElement;

  var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
  var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

  if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
    requestFullScreen.call(docEl);
  }
  else {
    cancelFullScreen.call(doc);
  }
}*/

function defMatchMedia() {
    if (window.matchMedia("(min-width:769px)").matches)
        return 'big';
    else
        return 'small';    
}
function defHeightArticlesContainer() {

    if (mMedia == 'big') {
        var heightNav  = $('#navigation-container').outerHeight(true);
        console.info('height navigation: '+heightNav);

        $('#content-container, #content-container>.wrapper').height(wHeight-heightNav-25);
        $('.articles-container').each(function() {
            $(this).height(wHeight-heightNav-25);
        });
    }
    /*else {
        $('#content-container, #content-container>.wrapper').height('auto');
        $('.articles-container').each(function() {
            $(this).height('auto');
        });
    }*/
}

function defHeightMainContainer() {
    if (mMedia == 'big') {
        $('#main-container').height(wHeight);
    } 
    /*else {
        $('#main-container').height('auto');
    }*/
}

function defHorizontalNavigation(hash) {
    if (hash === null) {                                                        // si aucun parametre
        hash = $('#navigation-container li.active a').first().attr('href');     // récupération de la navigation active
        console.info('hash:',hash);
       if (typeof hash === "undefined") {                                       // si toujours rien
           hash = $('#navigation-container li a').first().attr('href');         // prends le premier
           console.info('premier hash:',hash);
       }
    }
    
    $('#navigation-container li').removeClass('active');                        // activation du bon menu
    $('#navigation-container li a[href="'+hash+'"]').parent('li').addClass('active');
    
    var width = $('#content-container').width();                                // récupération de la largeur du container
    var index = $('.articles-container').index($(hash));                        // récupération de la position dans le dom (commence par 0)
    console.info('width:',width,'index:',index);
    
    scrollToRight();
    $('#content-container').animate({scrollLeft: width*index}, 800);     
}

function defVerticalNavigation(hash) {
    $('#navigation-container li').removeClass('active');
    
    if (typeof hash === "undefined"
    || hash === null) {
        $('html, body').animate({scrollTop: 0}, 800);                         // repositionnement en mode vertical    
    } else {
        var offset = $(hash).offset();
        console.info('offset:',offset);
        $('html, body').animate({scrollTop: offset.top}, 800);    
    }    
}

function bounceAsideLeft() {
    $('aside#left').animate({height: '160px', width: '160px'}, 500, function(){
        $('aside#left').animate({height: '60px', width: '60px'},  500);
    });
}

function bounceAsideRight() {
    $('aside#right').animate({height: '160px', width: '160px'},  500, function(){
        $('aside#right').animate({height: '60px', width: '60px'},  500);
    });
}
function scrollToLeft() {
    if ($('aside#left').width() != 0) {
        $('aside#left').animate({width: 0}, {duration: 500, queue: false});
        $('aside#right').animate({width: '40%'}, {duration: 500, queue: false});
    }
}
function scrollToRight() {
    if ($('aside#right').width() != 0) {
        $('aside#left').animate({width: '40%'}, {duration: 500, queue: false});
        $('aside#right').animate({width: 0}, {duration: 500, queue: false});
        $('aside#right>div, aside#right>a').fadeOut(500);
    }
}

// ************************ on document ready ************************
$(function() {
    // ************************ define global variable ************************
    wHeight = $(window).height();
    wWidth = $(window).width();
    console.info('window w/h: ', wWidth, '/', wHeight);
    oldMMedia = mMedia = defMatchMedia();
    console.info('matchMedia: ', mMedia);
    
    // ************************ start ************************
    if (mMedia == 'big') {
        defHeightMainContainer();
        defHeightArticlesContainer();
        defHorizontalNavigation(null);
    } else {
        bounceAsideLeft();
        defVerticalNavigation(null);
    }

    // ************************ fermeture de aside right ************************
    $('aside#right .k-close').click(function(e){
        e.preventDefault();
        if (mMedia == 'big') {
            scrollToRight();
        } else {
            $('aside#right').animate({height: 0, width: 0}, 150, function() {
                $('aside#right .k-close, aside#right .link').fadeOut(150);
                $('aside#right .plus').fadeIn(300);
            });       
        }
    });
    
    // ************************ fermeture de aside left XS ************************
    $('aside#left .k-close').click(function(e) {
        e.preventDefault();
        if (mMedia == 'small') {
            $('aside#left').animate({'height': 60, 'width': 60}, 150, function() {
                $('aside#left .k-close').fadeOut(150);
                $('aside#left .plus').fadeIn(300);
            });            
        }
    });
    
    // ************************ open de aside left XS ************************
    $('aside#left .plus').click(function(e) {
        e.preventDefault();
        if (mMedia == 'small') {
            $('aside#left').animate({height: wHeight, width: wWidth}, 300, function() {
                $('aside#left .k-close').fadeIn(300);
                $('aside#left .plus').fadeOut(150);
            });
        }
    });
    
    // ************************ open de aside left XS ************************
    $('aside#right .plus').click(function(e) {
        e.preventDefault();
        if (mMedia == 'small') {
            $('aside#right').animate({height: '100%', width: wWidth}, 300, function() {
                $('aside#right .k-close, aside#right .link').fadeIn(300);
                $('aside#right .plus').fadeOut(150);
            });
        }
    });
    
    // ************************ ouverture de aside right ************************
    $('.articles-container a:not(.unstyled)').click(function(e) {
        e.preventDefault();
        var hash = $(this).attr('href').replace('site-', 'img-');               console.info('hash:', hash);
        
        if (mMedia == 'big') {
            $('aside#right>div, aside#right a').fadeOut(150).promise().done(function() {
                scrollToLeft();
                $(hash+', aside#right a:not(.plus)').fadeIn(500);    
            });
        } else {
            $('aside#right>div, aside#right a:not(.plus)').fadeOut(150).promise().done(function() {
                $(hash).show(); 
                bounceAsideRight();
            });
        }
    });
        
    // ************************ navigate ************************
    $('#navigation-container a').click(function(e) {
        e.preventDefault();
        if (mMedia == 'big') {
            defHorizontalNavigation($(this).attr('href'));
        } else {
            defVerticalNavigation($(this).attr('href'));
        }
    });
});

// ************************ resize ************************
$(window).resize(function() {
    clearTimeout(wait);
    wait = setTimeout(function() {
        // ************************ define global variable ************************
        wHeight = $(window).height();
        wWidth = $(window).width();
        console.info('window w/h: ', wWidth, '/', wHeight);
        mMedia = defMatchMedia();
        console.info('matchMedia: ', mMedia);
        if (mMedia == 'big') {
            $('*').removeAttr('style');         // reset all jquery effects
            defHeightMainContainer();
            defHeightArticlesContainer();
            defHorizontalNavigation(null);
            oldMMedia = mMedia;
        } else if (mMedia != oldMMedia) {
            $('*').removeAttr('style');         // reset all jquery effects
            bounceAsideLeft();
            defVerticalNavigation(null);
            oldMMedia = mMedia;
        }
    }, 850);
});