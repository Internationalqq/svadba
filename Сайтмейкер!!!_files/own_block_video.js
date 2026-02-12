
var ownBlockTemplate = '<section class="sm-own sm-edit" data-type="166" data-jsscroll="" data-jsscroll-slide-top=""><div class="sm-container"><div class="sm-own_wrapper"><div class="sm-own_wrapper-img"></div><h2 data-sm-text="OWN_TITLE" title=""></h2><div data-sm-text="OWN_TEXT" title="">{%OWN_TEXT%}</div><a data-sm-href="OWN_BUTTON_LINK" title="" class="sm-own_button" target="_blank"></a></div></div></section>';

var ownBlockTemplate2 = '<section class="sm-own sm-edit" data-type="211" data-jsscroll="" data-jsscroll-slide-top=""><div class="sm-container"><div class="sm-own_wrapper"><div class="sm-own_wrapper-img"></div><h2 data-sm-text="NEW_OWN_TITLE" title=""></h2><div data-sm-text="NEW_OWN_TEXT" title="">{%NEW_OWN_TEXT%}</div><a data-sm-href="NEW_OWN_BUTTON_LINK" title="" class="sm-own_button" target="_blank"></a></div></div></section>';

//для шаблонов перечисленных id шаблонов в temlatesOwnResize заголовок сверстан так, чтобы динамически изменять размер шрифта (класс sm-needtoresize)
var temlatesOwnResize = [110]
var ownBlockTemplateResize = '<section class="sm-own sm-edit" data-type="166" data-jsscroll="" data-jsscroll-slide-top=""><div class="sm-container"><div class="sm-own_wrapper"><div class="sm-own_wrapper-img"></div><div class="sm-title-resize-helper"><h2 class="sm-needtoresize" data-sm-text="OWN_TITLE" title=""></h2></div><div data-sm-text="OWN_TEXT" title="">{%OWN_TEXT%}</div><a data-sm-href="OWN_BUTTON_LINK" title="" class="sm-own_button" target="_blank"></a></div></div></section>';
var ownBlockTemplate2Resize = '<section class="sm-own sm-edit" data-type="211" data-jsscroll="" data-jsscroll-slide-top=""><div class="sm-container"><div class="sm-own_wrapper"><div class="sm-own_wrapper-img"></div><div class="sm-title-resize-helper"><h2 class="sm-needtoresize" data-sm-text="NEW_OWN_TITLE" title=""></h2></div><div data-sm-text="NEW_OWN_TEXT" title="">{%NEW_OWN_TEXT%}</div><a data-sm-href="NEW_OWN_BUTTON_LINK" title="" class="sm-own_button" target="_blank"></a></div></div></section>';

var own_images = '';
$(document).on('input', '#secondPanel [name="own_colors[]"], #secondPanel [name="new_own_colors[]"]', function () {
    var n = $(this).parents('.ct-panel_settings-page').attr('data-section');
    var add = '';
    if (n == '211') {
        add = 'NEW_';
    }
    var c = $(this).val();
    var b = $(this).parents('.ct-color-wrapper').index();
    if (b == 0) {
        iframe.contents().find('.sm-own[data-type="' + n + '"]').css('background-color', c)
        paintBlock('.sm-own[data-type="' + n + '"]',c,1);
    } else {
        iframe.contents().find('[data-sm-text="' + add + 'OWN_TITLE"]').css('color', c);
        iframe.contents().find('[data-sm-text="' + add + 'OWN_TEXT"]').css('color', c);
        //iframe.contents().find('[data-sm-href="'+add+'OWN_BUTTON_LINK"]').css({'color':c,'border-color':c});
    }
})


$(document).on('click', '#setupAddBlock', function (e) {
    e.preventDefault();
    $('#secondPanel').toggleClass('active', true);
    $('#secondPanel .ct-panel_settings-page').removeClass('active');
    var s = 166;
    if (data_value['OWN_AFTER'] == '0') {
        $('#secondPanel .ct-panel_settings-page[data-section="166"]').toggleClass('active', true)
    } else if (data_value['NEW_OWN_AFTER'] == '0') {
        $('#secondPanel .ct-panel_settings-page[data-section="211"]').toggleClass('active', true)
        s = 211;
    }

    if ($('.ct-image_uploader-info_alt[data-for="OWN_IMAGES_5"]').length > 0) {
        $('.ct-image_uploader-info_alt[data-for="OWN_IMAGES_5"] .ct-image_uploader-preview_examples').slick('setPosition');
    }


    rebuildStructure(cursect + 1, s);
    //tplwrapper.
    setTimeout(function () {
        scrollToBlock(s)
    }, 500)

    closeMain();
    ifresize();
    return false;
})

function scrollToBlock(sect) {
    var sc = iframe.contents().find('.sm-edit[data-type="' + sect + '"]').position().top;
    console.log(sc);
    iframe.contents().find('html,body').animate({scrollTop: sc}, 500);
}

function rebuildSelectors() {


    var ownsel = data_value['OWN_AFTER'];
    var ownsel2 = data_value['NEW_OWN_AFTER'];

    $('.ct-own_block-setting_select ul li[data-id="211"]').remove();
    $('.ct-own_block-setting_select ul li[data-id="166"]').remove();

    $('#secondPanel [data-section="166"] .ct-own_block-setting_select').parents('.ct-input_wrapper').remove();
    $('#secondPanel [data-section="211"] .ct-own_block-setting_select').parents('.ct-input_wrapper').remove();

    if (ownsel != '0' && ownsel != '211') {
        $('.ct-own_block-setting[data-sect="211"] .ct-own_block-setting_select ul').append('<li data-id="166">' + constr_terms['ln-own-label'] + ' №1</li>');
    }

    if (ownsel2 != '0' && ownsel2 != '166') {
        $('.ct-own_block-setting[data-sect="166"] .ct-own_block-setting_select ul').append('<li data-id="211">' + constr_terms['ln-own-label'] + ' №2</li>');
    }

    $('#secondPanel [data-section="166"] .ct-menu_wrapper').prepend($('.ct-own_block-setting[data-sect="166"] .ct-input_wrapper').clone());

    var s = $('#secondPanel [data-section="166"] .ct-menu_wrapper .ct-own_block-setting_select');
    var so = $('#editSections [data-sect="166"] .ct-own_block-setting_select');
    s.removeClass('ct-input_select-top');
    s.parents('.ct-input_wrapper').find('.ct-subtitle:not(.ct-icon_item)').remove();
    s.parents('.ct-input_wrapper').toggleClass('ct-ignore', true);

    so.find('li').removeClass('ct-input_select-current');
    so.find('li[data-id="' + ownsel + '"]').toggleClass('ct-input_select-current', true)
    so.find('span').html(so.find('li.ct-input_select-current').html())

    s.find('li').removeClass('ct-input_select-current');
    s.find('li[data-id="' + ownsel + '"]').toggleClass('ct-input_select-current', true)
    s.find('span').html(s.find('li.ct-input_select-current').html())

    $('#secondPanel [data-section="211"] .ct-menu_wrapper').prepend($('.ct-own_block-setting[data-sect="211"] .ct-input_wrapper').clone());

    s = $('#secondPanel [data-section="211"] .ct-menu_wrapper .ct-own_block-setting_select');
    so = $('#editSections [data-sect="211"] .ct-own_block-setting_select');

    s.removeClass('ct-input_select-top');
    s.parents('.ct-input_wrapper').find('.ct-subtitle:not(.ct-icon_item)').remove();
    s.parents('.ct-input_wrapper').toggleClass('ct-ignore', true);

    so.find('li').removeClass('ct-input_select-current');
    so.find('li[data-id="' + ownsel2 + '"]').toggleClass('ct-input_select-current', true)
    so.find('span').html(so.find('li.ct-input_select-current').html())

    s.find('li').removeClass('ct-input_select-current');
    s.find('li[data-id="' + ownsel2 + '"]').toggleClass('ct-input_select-current', true)
    s.find('span').html(s.find('li.ct-input_select-current').html())
    setTimeout(function () {
        $('.ct-own_block-setting_select').removeClass('active');
    }, 500)

}

$(document).on('click', '.ct-small_edit-button', function () {
    var s = $(this).parents('.ct-own_block-setting').attr('data-sect');

    $('#secondPanel').toggleClass('active', true);
    $('#secondPanel .ct-panel_settings-page').removeClass('active');
    $('.ct-panel_settings-page[data-section="' + s + '"]').toggleClass('active', true);
    closeMain();
    ifresize();
})
function initOwnBlock() {
    //убираем все свитчеры
    //$('[data-section="166"] .ct-switcher').remove();
    var ik;
    var sphotos;
    var inph;
    if (typeof data_value['OWN_IMAGES'] == 'undefined') {
        data_value['OWN_IMAGES'] = [];

        ik = 'OWN_IMAGES';

        sphotos = '<li class="ct-image_preview ct-image_uploader ct-image_uploader-origin"><img src="/sitemaker/images/constr/ct-image-plus.svg">' + constr_terms['ln-image-add'] + '<div class="ct-image_upload-status"><div></div></div></li>';

        inph = $('#secondPanel [name="' + ik.toLowerCase() + '[]"]:not(#ct-uploader_' + ik + ')').clone();
        inph.attr('id', 'ct-uploader_' + ik);

        $('#secondPanel [name="' + ik.toLowerCase() + '[]"]').before('<div class="ct-image_uploader-info" data-for="' + ik + '" >' + sphotos + '</div>');

        $('.ct-image_uploader-info[data-for="' + ik + '"] .ct-image_uploader').append(inph);

        $('#secondPanel [name="' + ik.toLowerCase() + '[]"]:not(#ct-uploader_' + ik + ')').remove();
    }

    if (typeof data_value['NEW_OWN_IMAGES'] == 'undefined') {
        data_value['NEW_OWN_IMAGES'] = [];

        ik = 'NEW_OWN_IMAGES';

        sphotos = '<li class="ct-image_preview ct-image_uploader ct-image_uploader-origin"><img src="/sitemaker/images/constr/ct-image-plus.svg">' + constr_terms['ln-image-add'] + '<div class="ct-image_upload-status"><div></div></div></li>';

        inph = $('#secondPanel [name="' + ik.toLowerCase() + '[]"]:not(#ct-uploader_' + ik + ')').clone();
        inph.attr('id', 'ct-uploader_' + ik);

        $('#secondPanel [name="' + ik.toLowerCase() + '[]"]').before('<div class="ct-image_uploader-info" data-for="' + ik + '" >' + sphotos + '</div>');

        $('.ct-image_uploader-info[data-for="' + ik + '"] .ct-image_uploader').append(inph);

        $('#secondPanel [name="' + ik.toLowerCase() + '[]"]:not(#ct-uploader_' + ik + ')').remove();
    }

    if (typeof data_value['OWN_TITLE'] == 'undefined') {
        data_value['OWN_TITLE'] = constr_terms['ln-own-title'];
    }


    //если блок с текстурой, то цвет фона по умолчанию прозрачный
    var sectionTexture = (iframe.find('.sm-section').css('background-image')!=null && iframe.find('.sm-section').css('background-image')!='none' );

    if (typeof data_value['OWN_COLORS'] == 'undefined') {
        // data_value['OWN_COLORS'] = ['#ffffff', '#000000'];
        data_value['OWN_COLORS'] = ['transparent', '#000000'];
    }

    if (typeof data_value['OWN_TEXT'] == 'undefined') {
        data_value['OWN_TEXT'] = constr_terms['ln-own-text'];
    }

    if (typeof data_value['NEW_OWN_TITLE'] == 'undefined') {
        data_value['NEW_OWN_TITLE'] = constr_terms['ln-own-title'];
    }

    if (typeof data_value['NEW_OWN_COLORS'] == 'undefined') {
        // data_value['NEW_OWN_COLORS'] = ['#ffffff', '#000000'];
        data_value['NEW_OWN_COLORS'] = ['transparent', '#000000'];
    }

    if (typeof data_value['NEW_OWN_TEXT'] == 'undefined') {
        data_value['NEW_OWN_TEXT'] = constr_terms['ln-own-text'];
    }

    // if(typeof data_value['OWN_ALIGN'] == 'undefined')
    // {
    data_value['OWN_ALIGN'] = 1;
    data_value['NEW_OWN_ALIGN'] = 1;
    //}


    if (typeof data_value['OWN_AFTER'] == 'undefined') {
        data_value['OWN_AFTER'] = 0;
    }


    if (typeof data_value['NEW_OWN_AFTER'] == 'undefined') {
        data_value['NEW_OWN_AFTER'] = 0;
    }

    if (data_value['NEW_OWN_AFTER'] == '166' && data_value['OWN_AFTER'] == '0') {
        data_value['NEW_OWN_AFTER'] = 0;
    }
    if (data_value['NEW_OWN_AFTER'] == '0' && data_value['OWN_AFTER'] == '211') {
        data_value['OWN_AFTER'] = 0;
    }


    $('#secondPanel [name="own_title"]').val(data_value['OWN_TITLE']);
    $('#secondPanel [name="own_text"]').val(data_value['OWN_TEXT']);
    $('#secondPanel [name="own_after"]').val(data_value['OWN_AFTER']);


    $('#secondPanel [name="new_own_title"]').val(data_value['NEW_OWN_TITLE']);
    $('#secondPanel [name="new_own_text"]').val(data_value['NEW_OWN_TEXT']);
    $('#secondPanel [name="new_own_after"]').val(data_value['NEW_OWN_AFTER']);



    //Цвета персонального блока
    var own_colors_block = $('#secondPanel [name="own_colors[]"]').parents('.ct-input_wrapper');

    own_colors_block.find('.ct-panel_header').remove();
    own_colors_block.find('.ct-color-add').remove();
    own_colors_block.find('.ct-color-remove').remove();
    own_colors_block.toggleClass('ct-shadow', true);
    $.each(data_value['OWN_COLORS'], function (k, v) {
        var kk = own_colors_block.find('.ct-color-wrapper')[k];
        $(kk).find('input').attr('value', v);
        $(kk).find('span.ct-color').css('background-color', v);
        if (k < 1) {
            $(kk).after($(kk).clone());
        }
    })

    var nown_colors_block = $('#secondPanel [name="new_own_colors[]"]').parents('.ct-input_wrapper');
    nown_colors_block.find('.ct-panel_header').remove();
    nown_colors_block.find('.ct-color-add').remove();
    nown_colors_block.find('.ct-color-remove').remove();
    nown_colors_block.toggleClass('ct-shadow', true);
    $.each(data_value['NEW_OWN_COLORS'], function (k, v) {
        var kk = nown_colors_block.find('.ct-color-wrapper')[k];
        $(kk).find('input').attr('value', v);
        $(kk).find('span.ct-color').css('background-color', v);
        if (k < 1) {
            $(kk).after($(kk).clone());
        }
    })

    if ($('#setupAddBlock').length === 0 && $('.ct-demonstration').length == 0) {
        var sb = $('#setupBlock').clone();
        sb.attr('id', 'setupAddBlock');
        $('#setupBlock').before(sb);
        sb.toggleClass('ct-hidden', Number(data_value['OWN_AFTER']) !== 0 && Number(data_value['NEW_OWN_AFTER']) !== 0);

        $('#switcher-166').prop('checked', Number(data_value['OWN_AFTER']) !== 0);
        $('#switcher-166').parents('.ct-switcher').toggleClass('active', Number(data_value['OWN_AFTER']) !== 0);

        $('#switcher-211').prop('checked', Number(data_value['NEW_OWN_AFTER']) !== 0);
        $('#switcher-211').parents('.ct-switcher').toggleClass('active', Number(data_value['NEW_OWN_AFTER']) !== 0);
    }

    // выбор вариантов дизайна пока отключили
    if ($('#secondPanel #own_align').length == 0) {
        //    $('#secondPanel [name="own_align"]').parents('.ct-input_wrapper').append(alignSelector)
    }


    // $('#secondPanel #own_align li').removeClass('ct-input_select-current');
    // $('#secondPanel #own_align li[data-id="'+data_value['OWN_ALIGN']+'"]').toggleClass('ct-input_select-current',true);
    // $('#secondPanel #own_align span').text($('#secondPanel #own_align li[data-id="'+data_value['OWN_ALIGN']+'"]').text());

    $('#secondPanel [name="own_after"]').parents('.ct-input_wrapper').hide();
    $('#secondPanel [name="own_align"]').parents('.ct-input_wrapper').hide();
    $('#secondPanel [name="new_own_after"]').parents('.ct-input_wrapper').hide();
    $('#secondPanel [name="new_own_align"]').parents('.ct-input_wrapper').hide();


    $('.ct-own_block-setting').toggle(pers_block_available == 1)

    if (pers_block_available == 0) {
        $('#setupAddBlock').remove();
        iframe.contents().find('.sm-own').remove();
    } else {
        rebuildStructure(data_value['OWN_AFTER']);
    }

    // rebuildSelectors();

    // $('[data-sect="166"] .ct-own_block-setting_select li[data-id="' + data_value['OWN_AFTER'] + '"]').click();
    // $('[data-sect="211"] .ct-own_block-setting_select li[data-id="' + data_value['NEW_OWN_AFTER'] + '"]').click();
    $('[data-for="OWN_IMAGES"], [data-for="NEW_OWN_IMAGES"]').prev('.ct-input_label').toggleClass('ct-title ct-subtitle ct-icon_item ct-icon_item--owngallery', true).removeClass('ct-input_label');
    rebuildColors()
    reInitOwnBlock();
    reInitOwnBlock('NEW_');
}

function rebuildColors() {
    $('.button_title').remove();
    var buts = {};
    buts['location_map'] = constr_terms['ln-route'];
    buts['wish_wishlist'] = constr_terms['ln-wishlist'];
    buts['contact_link'] = constr_terms['ln_contact'];

    console.log(constr_terms)

    $.each(buts, function (k, v) {

        var val = '';
        if (data_value[k.toUpperCase() + '_BUTTON_TITLE'] && data_value[k.toUpperCase() + '_BUTTON_TITLE'] != '') {
            val = data_value[k.toUpperCase() + '_BUTTON_TITLE'];
            iframe.contents().find('[data-sm-href="' + k.toUpperCase() + '"]').text(val)
        } else {
            iframe.contents().find('[data-sm-href="' + k.toUpperCase() + '"]').text(v)
        }
        $('#secondPanel').find('[name="' + k + '"]').parents('.ct-input_wrapper').after('<div class="ct-input_wrapper button_title"><label class="ct-input_label">' + constr_terms['ln-own-button-text'] + '</label><input class="ct-input" name="' + k + '_button_title" type="text" value="' + val + '" placeholder="' + constr_terms['ln-own-button-text'] + '"></div>')
    })

    perscolored = false;
    $.each($('#secondPanel .ct-panel_settings-page:not([data-section=166]):not([data-section=211]):not([data-ex])'), function (k, v) {

        var sect = $(this).attr('data-section');
        $(this).find('.personal_colors').remove();

        var val1 = '';
        var val2 = '';
        if (data_value['PERSONAL_COLORS[' + sect + ']'] && data_value['PERSONAL_COLORS[' + sect + ']'] != '') {
            val1 = data_value['PERSONAL_COLORS[' + sect + ']'];
        }

        if (data_value['PERSONAL_COLORS_FONT[' + sect + ']'] && data_value['PERSONAL_COLORS_FONT[' + sect + ']'] != '') {
            val2 = data_value['PERSONAL_COLORS_FONT[' + sect + ']'];
        }

        $(this).find('.submit_current').before('<div class="personal_colors"><div class="ct-panel_header"><div class="ct-flex ct-flex-space_between ct-flex-align-center"><div class="ct-title ct-input_label">' + constr_terms['ln-own-background'] + '</div></div></div><div class="ct-input_wrapper"><div class="ct-color-wrapper ' + ((val1 == '') ? 'personal_empty' : '') + '" data-type="1"><input type="color" class="ct-input personal_color" name="personal_colors[' + sect + ']" value="' + val1 + '"><span class="ct-color ct-empty"></span><span class="ct-color-add"></span><span class="ct-color-remove"></span></div></div><div class="ct-input_wrapper"><div class="ct-color-wrapper ' + ((val2 == '') ? 'personal_empty' : '') + '" data-type="2" ><input type="color" class="ct-input personal_color" name="personal_colors_font[' + sect + ']" value="' + val2 + '"><span class="ct-color ct-empty"></span><span class="ct-color-add"></span><span class="ct-color-remove"></span></div></div></div>')

        if (val1 != '') {
            $('[name="personal_colors[' + sect + ']"]').trigger('input');
            perscolored = true;
        }

        if (val2 != '') {
            $('[name="personal_colors_font[' + sect + ']"]').trigger('input');
            perscolored = true;
        }

    })

    if (!perscolored && (typeof template_val['color_mode'] == 'undefined' || template_val['color_mode'] == '0')) {
        $('.personal_colors').remove();
    }

}

function updateStyleRule(styleTag, selector, newProperties, only=false) {

    var $style = styleTag;
    var currentCSS = (styleTag.hasClass('colors-styles')) ? $style.html() : $style.html().slice(0,-1);

    currentCSS = currentCSS.replace('@media (max-width:500px){', '');
    currentCSS = currentCSS.replace('@media (min-width:500px){', '');

    var escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    var regex = new RegExp(escapedSelector + '\\s*\\{[^}]*\\}', 'g');
    var newRule = selector + ' { ' + newProperties + ' }';

    var testRegex = new RegExp(escapedSelector + '\\s*\\{[^}]*\\}', 'g');
    var ruleExists = testRegex.test(currentCSS);

    if (ruleExists) {
        currentCSS = currentCSS.replace(regex, newRule);
        currentCSS = ($style.hasClass('colors-styles')) ?  ' ' + currentCSS : ' ' + currentCSS + ' }';
        currentCSS = ($style.hasClass('colors-styles-desktop')) ? '@media (min-width:500px){' + currentCSS : currentCSS;
        currentCSS = ($style.hasClass('colors-styles-mobile')) ? '@media (max-width:500px){' + currentCSS : currentCSS;
    } else {
        if (currentCSS.trim() !== '' && currentCSS.trim() !== ' ') {
            currentCSS += ($style.hasClass('colors-styles')) ?  ' ' + newRule : ' ' + newRule + ' }';
            currentCSS = ($style.hasClass('colors-styles-desktop')) ? '@media (min-width:500px){' + currentCSS : currentCSS;
            currentCSS = ($style.hasClass('colors-styles-mobile')) ? '@media (max-width:500px){' + currentCSS : currentCSS;
        } else {
            currentCSS += ($style.hasClass('colors-styles')) ? newRule : newRule  + ' }';
            currentCSS = ($style.hasClass('colors-styles-desktop')) ? '@media (min-width:500px){' + currentCSS : currentCSS;
            currentCSS = ($style.hasClass('colors-styles-mobile')) ? '@media (max-width:500px){' + currentCSS : currentCSS;
        }
    }

    $style.html(currentCSS);

}

// function removeStyleRule(styleTag, selector) {
//     var $style = styleTag;
//     var currentCSS = $style.html();
//
//     var escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
//
//     var regex = new RegExp('\\s*' + escapedSelector + '\\s*\\{[^}]*\\}\\s*', 'g');
//
//     currentCSS = currentCSS.replace(regex, '');
//
//     currentCSS = currentCSS.replace(/\n\s*\n/g, '\n').trim();
//
//     $style.html(currentCSS);
// }

function removeStyleRule(styleTag, selector) {
    var $style = styleTag;
    var currentCSS = $style.html();

    var escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    var regex = new RegExp(
        '(' + escapedSelector + ')\\s*\\{[^}]*\\}',
        'g'
    );

    currentCSS = currentCSS.replace(regex, '$1');
    currentCSS = currentCSS.replace(/\n\s*\n/g, '').replace(/^\n+|\n+$/g, '').trim();

    currentCSS = currentCSS.replace(selector, '').trim();
    currentCSS = ($style.hasClass('colors-styles')) ?  ' ' + currentCSS : ' ' + currentCSS + ' }';
    currentCSS = ($style.hasClass('colors-styles-desktop')) ? '@media (min-width:500px){' + currentCSS : currentCSS;
    currentCSS = ($style.hasClass('colors-styles-mobile')) ? '@media (max-width:500px){' + currentCSS : currentCSS;


    $style.html(currentCSS);
}


function updateStyleForm(styleTag, prefix, color){
    console.log('updating modal: '+prefix);
    updateStyleRule(styleTag, prefix+' ::-webkit-input-placeholder', 'color:' + color + '!important');
    updateStyleRule(styleTag, prefix+' ::-moz-placeholder', 'color:' + color + '!important');
    updateStyleRule(styleTag, prefix+' :-ms-input-placeholder', 'color:' + color + '!important');
    updateStyleRule(styleTag, prefix+' :-moz-placeholder', 'color:' + color + '!important');
    updateStyleRule(styleTag, prefix+' ::placeholder', 'color:' + color + '!important');
    updateStyleRule(styleTag, prefix+' input', 'border-color:' + color + '!important');
    updateStyleRule(styleTag, prefix+' textarea', 'border-color:' + color + '!important');
    updateStyleRule(styleTag, prefix+' input[type=radio]+label:before', 'border-color:' + color + '!important');
    updateStyleRule(styleTag, prefix+' input[type=radio]:checked+label:before', 'background:' + color + '!important');
    updateStyleRule(styleTag, prefix+' input[type=checkbox]+label:before', 'border-color:' + color + '!important');
    updateStyleRule(styleTag, prefix+' input[type=checkbox]:checked+label:before', 'background:' + color + '!important');
    // if(!prefix.match('/^[data-type=d+]$/')){
    //     //красим svg внутри блока (искл. .text-no-paint)
    //     iframe.contents().find(prefix).find('svg:not(.text-no-paint) path').css('cssText', 'fill:' + color + ' !important;stroke:' + color + ' !important;');
    //     iframe.contents().find(prefix).find('svg:not(.text-no-paint)').toggleClass('sm-painted_icon', true);
    //
    //     //принудительно красим блоки, которым проставлен класс принудительной покраски (раннее в исключения попадали слайдеры, которые покраска ломала)
    //     iframe.contents().find(prefix+' .text-paint-color').css('color', color);
    //     //раскрашиваем :after, :before, чекбоксы, рамки и пр.
    //     if(iframe.contents().find(prefix+' .text-paint-background-after').length>0){
    //         updateStyleRule(iframe.contents().find('head').find('.colors-styles'), prefix+' .text-paint-background-after:after', 'background:' + color + '!important');
    //     }
    //     if(iframe.contents().find(prefix+' .text-paint-background-before').length>0){
    //         updateStyleRule(iframe.contents().find('head').find('.colors-styles'), prefix+' .text-paint-background-before:before', 'background:' + color + '!important');
    //     }
    //     if(iframe.contents().find(prefix+' .text-paint-border').length>0){
    //         updateStyleRule(iframe.contents().find('head').find('.colors-styles'), prefix+' .text-paint-border', 'border-color:' + color + '!important');
    //     }
    //     if(iframe.contents().find(prefix+' .text-paint-background').length>0){
    //         updateStyleRule(iframe.contents().find('head').find('.colors-styles'), prefix+' .text-paint-background', 'background:' + color + '!important');
    //     }
    //     if(iframe.contents().find(prefix+' .text-paint-border-before').length>0){
    //         updateStyleRule(iframe.contents().find('head').find('.colors-styles'), prefix+' .text-paint-border-before:before', 'border-color:' + color + '!important');
    //     }
    //     if(iframe.contents().find(prefix+' .text-paint-border-after').length>0){
    //         updateStyleRule(iframe.contents().find('head').find('.colors-styles'), prefix+' .text-paint-border-after:after', 'border-color:' + color + '!important');
    //     }
    // }
}

function updateStyleFormBackground(styleTag, prefix, color){
    if(iframe.contents().find(prefix+' .background-paint-background').length>0){
        updateStyleRule(styleTag, prefix+' .background-paint-background', 'background-color:' + color + '!important');
        console.log('here1');
        console.log('background-image: '+ iframe.contents().find(prefix+' .background-paint-background').css('background-image'));
        console.log(prefix+' .background-paint-background');
        if(iframe.contents().find(prefix+' .background-paint-background').css('background-image')!=null && iframe.contents().find(prefix+' .background-paint-background').css('background-image')!='none') {
            // если есть изображение, проверяем является ли оно текстурой
            // Если да, накладываем цвет на изображение. Если нет, ставим цвет вместо изображения
            if (!$(prefix + ' .background-paint-background').hasClass('texture__bg')) {
                updateStyleRule(styleTag, prefix + ' .background-paint-background', 'background-image:' + iframe.contents().find(prefix + ' .background-paint-background').css('background-image') + '!important;-webkit-background-blend-mode:color-burn!important;background-blend-mode:color-burn!important;background-color:' + color + '!important');
            } else {
                // updateStyleRule(styleTag, prefix + ' .background-paint-background', 'background-image:' + iframe.contents().find(prefix + ' .background-paint-background').css('background-image'));
                updateStyleRule(styleTag, prefix + ' .background-paint-background', 'background-image:' + iframe.contents().find(prefix + ' .background-paint-background').css('background-image') + ';background-color:' + color + '!important');
            }
        }
    }
    if(iframe.contents().find(prefix+' .background-paint-background-after').length>0){
        updateStyleRule(styleTag, prefix+' .background-paint-background-after:after', 'background:' + color + '!important');
        if($(prefix+' .background-paint-background-after:after').css('background-image')!=null && $(prefix+' .background-paint-background-after:after').css('background-image')!='none') {
            // если есть изображение, проверяем является ли оно текстурой
            // Если да, накладываем цвет на изображение. Если нет, ставим цвет вместо изображения
            if (!$(prefix + ' .background-paint-background-after:after').hasClass('texture__bg')) {
                updateStyleRule(styleTag, prefix + ' .background-paint-background-after:after', 'background-image:' + iframe.contents().find(prefix + ' .background-paint-background').css('background-image') + '!important;-webkit-background-blend-mode:color-burn!important;background-blend-mode:color-burn!important;background-color:' + color + '!important');
            } else {
                // elsupdateStyleRule(styleTag, prefix + ' .background-paint-background-after:after', 'background-image:' + $(prefix + ' .background-paint-background').css('background-image'));
                updateStyleRule(styleTag, prefix + ' .background-paint-background-after:after', 'background-image:' + iframe.contents().find(prefix + ' .background-paint-background').css('background-image') + ';background-color:' + color + '!important');
            }
        }
    }
    if(iframe.contents().find(prefix+' .background-paint-background-before').length>0){
        updateStyleRule(styleTag, prefix+' .background-paint-background-before:before', 'background:' + color + '!important');
        if($(prefix+' .background-paint-background-before:before').css('background-image')!=null && $(prefix+' .background-paint-background-before:before').css('background-image')!='none') {
            // если есть изображение, проверяем является ли оно текстурой
            // Если да, накладываем цвет на изображение. Если нет, ставим цвет вместо изображения
            if (!$(prefix + ' .background-paint-background-before:before').hasClass('texture__bg')) {
                updateStyleRule(styleTag, prefix + ' .background-paint-background-before:before', 'background-image:' + iframe.contents().find(prefix + ' .background-paint-background').css('background-image') + '!important;-webkit-background-blend-mode:color-burn!important;background-blend-mode:color-burn!important;background-color:' + color + '!important');
            } else {
                updateStyleRule(styleTag, prefix + ' .background-paint-background-before:before', 'background-image:' + iframe.contents().find(prefix + ' .background-paint-background').css('background-image') + ';background-color:' + color + '!important');
            }
        }
    }
}

function removeStyleForm(styleTag, prefix){
    removeStyleRule(styleTag, prefix+' ::-webkit-input-placeholder');
    removeStyleRule(styleTag, prefix+' ::-moz-placeholder');
    removeStyleRule(styleTag, prefix+' :-ms-input-placeholder');
    removeStyleRule(styleTag, prefix+' :-moz-placeholder');
    removeStyleRule(styleTag, prefix+' ::placeholder');
    removeStyleRule(styleTag, prefix+' input');
    removeStyleRule(styleTag, prefix+' textarea');
    removeStyleRule(styleTag, prefix+' input[type=radio]+label:before');
    removeStyleRule(styleTag, prefix+' input[type=radio]:checked+label:before');
    removeStyleRule(styleTag, prefix+' input[type=checkbox]+label:before');
    removeStyleRule(styleTag, prefix+' input[type=checkbox]:checked+label:before');
    // if(!prefix.match('/^[data-type=d+]$/')){
    //     // убираем цвет с svg
    //     // iframe.contents().find('[data-type="' + sid + '"]').find('svg:not(.text-no-paint) path').css('cssText', '');
    //     // iframe.contents().find('[data-type="' + sid + '"]').find('svg:not(.text-no-paint)').toggleClass('sm-painted_icon', false);
    //
    //     //принудительно красим блоки, которым проставлен класс принудительной покраски (раннее в исключения попадали слайдеры, которые покраска ломала)
    //     iframe.contents().find(prefix+' .text-paint-color').css('color', '');
    //     //раскрашиваем :after, :before, чекбоксы, рамки и пр.
    //     if(iframe.contents().find(prefix+' .text-paint-background-after').length>0){
    //         removeStyleRule(iframe.contents().find('head').find('.colors-styles'), prefix+' .text-paint-background-after:after');
    //     }
    //     if(iframe.contents().find(prefix+' .text-paint-background-before').length>0){
    //         removeStyleRule(iframe.contents().find('head').find('.colors-styles'), prefix+' .text-paint-background-before:before');
    //     }
    //     if(iframe.contents().find(prefix+' .text-paint-border').length>0){
    //         removeStyleRule(iframe.contents().find('head').find('.colors-styles'), prefix+' .text-paint-border');
    //     }
    //     if(iframe.contents().find(prefix+' .text-paint-background').length>0){
    //         removeStyleRule(iframe.contents().find('head').find('.colors-styles'), prefix+' .text-paint-background');
    //     }
    //     if(iframe.contents().find(prefix+' .text-paint-border-before').length>0){
    //         removeStyleRule(iframe.contents().find('head').find('.colors-styles'), prefix+' .text-paint-border-before:before');
    //     }
    //     if(iframe.contents().find(prefix+' .text-paint-border-after').length>0){
    //         removeStyleRule(iframe.contents().find('head').find('.colors-styles'), prefix+' .text-paint-border-after:after');
    //     }
    // }
}

function removeStyleFormBackground(styleTag, prefix){
    if(iframe.contents().find(prefix+' .background-paint-background').length>0){
        removeStyleRule(iframe.contents().find('head').find('.colors-styles'), prefix+' .background-paint-background');
    }
    if(iframe.contents().find(prefix+' .background-paint-background-after').length>0){
        removeStyleRule(iframe.contents().find('head').find('.colors-styles'), prefix+' .background-paint-background-after:after');
    }
    if(iframe.contents().find(prefix+' .background-paint-background-before').length>0){
        removeStyleRule(iframe.contents().find('head').find('.colors-styles'), prefix+' .background-paint-background-before:before');
    }
    if(iframe.contents().find(prefix+'.background-paint-background').length>0){
        removeStyleRule(iframe.contents().find('head').find('.colors-styles'), prefix+'.background-paint-background');
    }
    if(iframe.contents().find(prefix+'.background-paint-background-after').length>0){
        removeStyleRule(iframe.contents().find('head').find('.colors-styles'), prefix+'.background-paint-background-after:after');
    }
    if(iframe.contents().find(prefix+'.background-paint-background-before').length>0){
        removeStyleRule(iframe.contents().find('head').find('.colors-styles'), prefix+'.background-paint-background-before:before');
    }
    var pseudo = iframe.contents().find(prefix).find('[class*="__bg"]:not(.background-no-paint)');
    if (pseudo.length > 0) {
        //если есть, проверяем не содержит ли он изображение
        if(pseudo.css('background-image')!=null && pseudo.css('background-image')!='none') {
            // если есть изображение, проверяем является ли оно текстурой
            // Если да, накладываем цвет на изображение. Если нет, ставим цвет вместо изображения
            if(!pseudo.hasClass('texture__bg')) {
                pseudo.css('cssText', 'background-image:' + pseudo.css('background-image') + ';-webkit-background-blend-mode:normal!important;background-blend-mode:normal!important;');
            }else{
                pseudo.css('cssText', 'background-image:' + pseudo.css('background-image') + ';');
                console.log('len1: '+iframe.contents().find(prefix).length);
                iframe.contents().find(prefix).css('background','none');
            }
        }else{
            //если изображение не содержится, просто ставим новый цвет
            pseudo.css('cssText', '');
        }
    }
}


function paintBlock(blockSelector,color,type) {

    console.log(blockSelector+' | '+color+' | '+type);

    //В блоке, который редактируем проставляем новое свойство background или color
    iframe.contents().find(blockSelector).each(function(){
        //если на фоне изображение
        if($(this).css('background-image')!=null && $(this).css('background-image')!='none' && type==1 ){
            $(this).css('background-image',$(this).css('background-image'));
            if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
                if(parseInt(template_val.id, 10)!=112) { //костыль! В 112 шаблоне background-size все ломает
                    $(this).css('background-size', 'auto'); //safari fix??
                }
            }
            if(!$(this).hasClass('texture__bg')) {
                //если текстура, оставляем изображение и накладываем на него цвет
                $(this).css('-webkit-background-blend-mode', 'color-burn');
                $(this).css('background-blend-mode', 'color-burn');
            }else{
                //если нет убираем изображение
                console.log('len: '+iframe.contents().find(blockSelector).length);
                iframe.contents().find(blockSelector).css('background','none');
            }
            //ставим новый цвет
            $(this).css('background-color',color);
        }else{
            //если на фоне нет изображения ставим новый цвет на текст или фон
            if(type==1 && !$(this).hasClass('background-no-paint')){
                $(this).css('background', color);
            }
            if(type==2 && !$(this).hasClass('text-no-paint')){
                $(this).css('color', color);
            }
            // $(this).css(((type == '1') ? 'background' : 'color'), color);
        }
    });

    if(type==1) {
        //ищем блок фона
        var pseudo = iframe.contents().find(blockSelector).find('[class*="__bg"]:not(.background-no-paint)');
        if (pseudo.length > 0) {
            //если есть, проверяем не содержит ли он изображение
            if(pseudo.css('background-image')!=null && pseudo.css('background-image')!='none') {
                // если есть изображение, проверяем является ли оно текстурой
                // Если да, накладываем цвет на изображение. Если нет, ставим цвет вместо изображения
                if(!pseudo.hasClass('texture__bg')) {
                    pseudo.css('cssText', 'background-image:' + pseudo.css('background-image') + ';-webkit-background-blend-mode:color-burn!important;background-blend-mode:color-burn!important;background-color:' + color + '!important');
                }else{
                    pseudo.css('cssText', 'background-image:' + pseudo.css('background-image') + ';background-color:' + color + '!important');
                    console.log('len1: '+iframe.contents().find(blockSelector).length);
                    if(!iframe.contents().find(blockSelector).hasClass('background-paint-background')){
                        iframe.contents().find(blockSelector).css('background', 'none');
                    }
                }
            }else{
                //если изображение не содержится, просто ставим новый цвет
                pseudo.css('cssText', 'background:' + color + ' !important');
            }
        }
        //проставляем в дополнительные стили правила для псевдоклассов и.т.п
        if(iframe.contents().find(blockSelector+' .background-paint-background').length>0) {

            if (iframe.contents().find(blockSelector + ' .background-paint-background').css('background-image') != null && iframe.contents().find(blockSelector + ' .background-paint-background').css('background-image') != 'none') {
                // если есть изображение, проверяем является ли оно текстурой
                // Если да, накладываем цвет на изображение. Если нет, ставим цвет вместо изображения
                if (!$(blockSelector + ' .background-paint-background').hasClass('texture__bg')) {
                    updateStyleRule(iframe.contents().find('head').find('.colors-styles'), blockSelector + ' .background-paint-background', 'background-image:' + iframe.contents().find(blockSelector + ' .background-paint-background').css('background-image') + '!important;-webkit-background-blend-mode:color-burn!important;background-blend-mode:color-burn!important;background-color:' + color + '!important');
                } else {
                    // updateStyleRule(styleTag, prefix + ' .background-paint-background', 'background-image:' + iframe.contents().find(prefix + ' .background-paint-background').css('background-image'));
                    updateStyleRule(iframe.contents().find('head').find('.colors-styles'), blockSelector + ' .background-paint-background', 'background-image:' + iframe.contents().find(blockSelector + ' .background-paint-background').css('background-image') + ';background-color:' + color + '!important');
                }
            } else {
                updateStyleRule(iframe.contents().find('head').find('.colors-styles'), blockSelector + ' .background-paint-background', 'background:' + color + '!important');
            }
        }
        if(iframe.contents().find(blockSelector+'.background-paint-background').length>0){
            if (iframe.contents().find(blockSelector + '.background-paint-background').hasClass('texture__bg')) {
                console.log('block has texture');
                updateStyleRule(iframe.contents().find('head').find('.colors-styles'), blockSelector + '.background-paint-background', 'background-image:' + iframe.contents().find(blockSelector + '.background-paint-background').css('background-image') + '!important;-webkit-background-blend-mode:color-burn!important;background-blend-mode:color-burn!important;background-color:' + color + '!important');
            } else {
                console.log('block has not texture');
                // updateStyleRule(styleTag, prefix + ' .background-paint-background', 'background-image:' + iframe.contents().find(prefix + ' .background-paint-background').css('background-image'));
                updateStyleRule(iframe.contents().find('head').find('.colors-styles'), blockSelector + '.background-paint-background', 'background-image:' + iframe.contents().find(blockSelector + '.background-paint-background').css('background-image') + ';background-color:' + color + '!important');
            }
            //updateStyleRule(iframe.contents().find('head').find('.colors-styles'), blockSelector+'.background-paint-background', 'background:' + color + '!important');
        }
        if(iframe.contents().find(blockSelector+' .background-paint-background-after').length>0){
            updateStyleRule(iframe.contents().find('head').find('.colors-styles'), blockSelector+' .background-paint-background-after:after', 'background:' + color + '!important');
        }
        if(iframe.contents().find(blockSelector+' .background-paint-background-before').length>0){
            updateStyleRule(iframe.contents().find('head').find('.colors-styles'), blockSelector+' .background-paint-background-before:before', 'background:' + color + '!important');
        }
        if(iframe.contents().find(blockSelector+'.background-paint-background-after').length>0){
            updateStyleRule(iframe.contents().find('head').find('.colors-styles'), blockSelector+'.background-paint-background-after:after', 'background:' + color + '!important');
        }
        if(iframe.contents().find(blockSelector+'.background-paint-background-before').length>0){
            updateStyleRule(iframe.contents().find('head').find('.colors-styles'), blockSelector+'.background-paint-background-before:before', 'background:' + color + '!important');
        }
        if(iframe.contents().find(blockSelector+'.background-paint-text').length>0){
            updateStyleRule(iframe.contents().find('head').find('.colors-styles'), blockSelector+'.background-paint-text', 'color:' + color + '!important');
        }
        if(iframe.contents().find(blockSelector+' .background-paint-text').length>0){
            updateStyleRule(iframe.contents().find('head').find('.colors-styles'), blockSelector+' .background-paint-text', 'color:' + color + '!important');
        }
        if(iframe.contents().find(blockSelector+'.background-hide').length>0){
            updateStyleRule(iframe.contents().find('head').find('.colors-styles'), blockSelector+'.background-hide', 'opacity:0!important');
        }
        iframe.contents().find(blockSelector).find('svg.background-paint-fill path').css('cssText', 'fill:' + color + ' !important;stroke:' + color + ' !important;');
        iframe.contents().find(blockSelector).find('svg.background-paint-fill').toggleClass('sm-painted_icon', true);

        iframe.contents().find(blockSelector).find('.background-paint-box-shadow').each(function(){
            let shadow = $(this).css('box-shadow');
            if (shadow === 'none') return;
            // Регулярное выражение для поиска цвета в box-shadow
            const colorRegex = /(#([a-fA-F0-9]{3}|[a-fA-F0-9]{6}|[a-fA-F0-9]{8})|rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(?:\s*,\s*[\d.]+)?\s*\)|hsl\(\s*\d+\s*,\s*[\d.]+%?\s*,\s*[\d.]+%?\s*\)|hsla\(\s*\d+\s*,\s*[\d.]+%?\s*,\s*[\d.]+%?\s*,\s*[\d.]+\s*\)|[a-zA-Z]+)/;
            // Заменяем цвет на новый
            shadow = shadow.replace(colorRegex, color);
            $(this).css('cssText','box-shadow:'+ shadow);
        });


        // проставляем класс покрашенного фона
        iframe.contents().find(blockSelector).toggleClass('sm-painted', true);
    }



    if (type == 2) {

        console.log('painting text');
        // Проставляем новый цвет текста у всех необходимых блоков, учитывая исключения, и снимаем фильтры

        iframe.contents().find(blockSelector+' *:not(.sm_colors):not(.sm_color > div):not(.sm-btn):not(.sm-button):not(.sm-button-center):not(.sm_colors *):not(.slick-initialized.slick-slider *):not([class*="__bg"]):not(video):not(.text-no-paint):not(img)').css('cssText', 'color:' + color + ' !important;filter:none;-webkit-filter: none;');
        // устанавливаем на блок класс окрашенного текста
        iframe.contents().find(blockSelector).toggleClass('sm-painted_text', true);

        //красим svg внутри блока (искл. .text-no-paint)
        iframe.contents().find(blockSelector).find('svg:not(.text-no-paint):not(.text-no-paint-fill):not(.text-no-paint-stroke) path').css('cssText', 'fill:' + color + ' !important;stroke:' + color + ' !important;');
        iframe.contents().find(blockSelector).find('svg:not(.text-no-paint):not(.text-no-paint-fill):not(.text-no-paint-stroke) circle').css('cssText', 'stroke:' + color + ' !important;');
        iframe.contents().find(blockSelector).find('svg:not(.text-no-paint):not(.text-no-paint-fill).text-no-paint-stroke path').css('cssText', 'fill:' + color + ' !important;');
        iframe.contents().find(blockSelector).find('svg.text-paint-stroke:not(.desktop-text-paint-svg):not(.mobile-text-paint-svg) path').css('cssText', 'stroke:' + color + ' !important;');
        iframe.contents().find(blockSelector).find('svg:not(.text-no-paint):not(.text-no-paint-fill)').toggleClass('sm-painted_icon', true);

        //принудительно красим блоки, которым проставлен класс принудительной покраски (раннее в исключения попадали слайдеры, которые покраска ломала)
        iframe.contents().find(blockSelector).find('.text-paint-color').css('color', color);
        //красим тексты пожеланий (часто они в слайдерах, которые не красим по общим правилам)
        if(iframe.contents().find(blockSelector).find('.sm-wishes__content-slide').length>0){
            updateStyleRule(iframe.contents().find('head').find('.colors-styles'), blockSelector+' .sm-wishes__content-slide', 'color:' + color + '!important');
        }
        //раскрашиваем :after, :before, чекбоксы, рамки и пр.
        console.log('selector: '+blockSelector+' .text-paint-background-after');
        if(iframe.contents().find(blockSelector+' .text-paint-background-after').length>0){
            console.log('updatingRule');
            updateStyleRule(iframe.contents().find('head').find('.colors-styles'), blockSelector+' .text-paint-background-after:after', 'background:' + color + '!important');
        }
        if(iframe.contents().find(blockSelector+' .text-paint-background-before').length>0){
            updateStyleRule(iframe.contents().find('head').find('.colors-styles'), blockSelector+' .text-paint-background-before:before', 'background:' + color + '!important');
        }
        if(iframe.contents().find(blockSelector+' .text-paint-border').length>0){
            updateStyleRule(iframe.contents().find('head').find('.colors-styles'), blockSelector+' .text-paint-border', 'border-color:' + color + '!important');
        }
        if(iframe.contents().find(blockSelector+' .text-paint-background').length>0){
            updateStyleRule(iframe.contents().find('head').find('.colors-styles'), blockSelector+' .text-paint-background', 'background:' + color + '!important');
        }
        if(iframe.contents().find(blockSelector+' .text-paint-border-before').length>0){
            updateStyleRule(iframe.contents().find('head').find('.colors-styles'), blockSelector+' .text-paint-border-before:before', 'border-color:' + color + '!important');
        }
        if(iframe.contents().find(blockSelector+' .text-paint-border-after').length>0){
            updateStyleRule(iframe.contents().find('head').find('.colors-styles'), blockSelector+' .text-paint-border-after:after', 'border-color:' + color + '!important');
        }
        if(iframe.contents().find(blockSelector+' .text-paint-text').length>0){
            updateStyleRule(iframe.contents().find('head').find('.colors-styles'), blockSelector+' .text-paint-text', 'color:' + color + '!important');
        }
        if(iframe.contents().find(blockSelector+' .desktop-text-paint-text').length>0){
            updateStyleRule(iframe.contents().find('head').find('.colors-styles-desktop'), blockSelector+' .desktop-text-paint-text', 'color:' + color + '!important');
        }
        if(iframe.contents().find(blockSelector+' .desktop-text-paint-svg').length>0){
            updateStyleRule(iframe.contents().find('head').find('.colors-styles-desktop'), blockSelector+' .desktop-text-paint-svg:not(.text-no-paint-fill) path', 'fill:' + color + ' !important;stroke:' + color + ' !important;');
            updateStyleRule(iframe.contents().find('head').find('.colors-styles-desktop'), blockSelector+' .desktop-text-paint-svg:not(.text-no-paint-fill) circle', 'stroke:' + color + ' !important;');
            updateStyleRule(iframe.contents().find('head').find('.colors-styles-desktop'), blockSelector+' .desktop-text-paint-svg.text-paint-stroke path', 'stroke:' + color + ' !important;');
        }


        //если находим в блоке чекбоксы
        if(iframe.contents().find(blockSelector).find('.sm-form_checkbox_box').length>0) {
            console.log('found checkbox');

            if (iframe.contents().find(blockSelector).find('.sm-form_checkbox_box').css('mask') != null && iframe.contents().find(blockSelector).find('.sm-form_checkbox_box').css('mask') != 'none') {
                console.log('checkbox type 51');
                // если чекбоксы сделаны svg-изображениями (напр. шаблон 51 Kids), проставляем в дополнительные свойства новые цвета чекбоксов
                updateStyleRule(iframe.contents().find('head').find('.colors-styles'), '.sm-form_checkbox_box', 'background:'+color+'!important');
                updateStyleRule(iframe.contents().find('head').find('.colors-styles'), '.sm-form_checkbox_input:checked+.sm-form_checkbox_box', 'background:'+color+'!important');
                updateStyleRule(iframe.contents().find('head').find('.colors-styles'), 'input[type=radio]:checked', 'mix-blend-mode:normal!important;filter:none!important;background-image:none!important;background: '+color+'!important;opacity: 0.5;');
                updateStyleRule(iframe.contents().find('head').find('.colors-styles'), 'input[type=radio]', 'mix-blend-mode:normal!important;filter:none!important;background-image:none!important;background: transparent!important');
                if(iframe.contents().find(blockSelector).find('.sm-form-radio-fake').length > 0) {
                    updateStyleRule(iframe.contents().find('head').find('.colors-styles'), '.sm-form-radio-fake', 'border-radius: 30px;border: solid 1px '+color+';');
                }
            }else{
                console.log('checkbox type 81');
                // если чекбокс - рамка с цветным фоном (напр. шаблон 81 I love you), проставляем цвета чекбоксов для них
                updateStyleRule(iframe.contents().find('head').find('.colors-styles'), '.sm-form_checkbox_box', 'border-color:'+color+'!important');
                updateStyleRule(iframe.contents().find('head').find('.colors-styles'), '.sm-form_checkbox_input:checked+.sm-form_checkbox_box', 'background-color:'+color+'!important');
            }
        }




    }

}


$(document).on('input', '.personal_color', function () {

    //создание блока для дополнительных стилей, если он еще не был создан
    if(iframe.contents().find('head').find('.colors-styles').length==0){
        iframe.contents().find('head').append('<style class="colors-styles"></style>');
    }
    if(iframe.contents().find('head').find('.colors-styles-desktop').length==0){
        iframe.contents().find('head').append('<style class="colors-styles-desktop">@media (min-width:500px){}</style>');
    }
    if(iframe.contents().find('head').find('.colors-styles-mobile').length==0){
        iframe.contents().find('head').append('<style class="colors-styles-mobile">@media (max-width:500px){}</style>');
    }
    //поведение поля с выбором цвета
    $(this).parents('.ct-color-wrapper').removeClass('personal_empty');
    var sid = $(this).parents('.ct-panel_settings-page').attr('data-section');
    var type = $(this).parents('.ct-color-wrapper').attr('data-type');
    var color = $(this).val();

    paintBlock('[data-type="' + sid + '"]',color,type);

    //переменная для записи текущего сssText
    let currentCssText = '';

    //если покрашен блок анкеты, красим модалки
    if (iframe.contents().find('[data-type="' + sid + '"]').hasClass('sm-questionnaire') || iframe.contents().find('[data-type="' + sid + '"]').hasClass('sm-form') || iframe.contents().find('[data-type="' + sid + '"]').hasClass('sm-feedback')) {


        if(iframe.contents().find('.sm-modal').length > 0){
            paintBlock('.sm-modal',color,type);
            if(type==2) {
                updateStyleForm(iframe.contents().find('head').find('.colors-styles'), '.sm-modal', color);
            }
        }
        if(iframe.contents().find('.sm-quest-modal').length > 0){
            paintBlock('.sm-quest-modal',color,type);
            if(type==2) {
                updateStyleForm(iframe.contents().find('head').find('.colors-styles'), '.sm-quest-modal', color);
            }
        }
        if(iframe.contents().find('div#sm-mod').length > 0){
            paintBlock('div#sm-mod',color,type);
            if(type==2) {
                updateStyleForm(iframe.contents().find('head').find('.colors-styles'), 'div#sm-mod', color);
            }
        }
        if(iframe.contents().find('.sm-feedback').length > 0){
            paintBlock('.sm-feedback',color,type);
            if(type==2) {
                updateStyleForm(iframe.contents().find('head').find('.colors-styles'), '.sm-feedback', color);
            }
        }

        if(type==2) {
            updateStyleForm(iframe.contents().find('head').find('.colors-styles'), '[data-type="' + sid + '"]', color);
        }

    }

})


function removeColorBlock(blockSelector, type){

    console.log('remove color from: '+blockSelector+' | '+type);


    // проставляем цвет самому блоку
    iframe.contents().find(blockSelector).css(((type == '1') ? 'background' : 'color'), '');

    //если изменен фон, и он был установлен
    if(iframe.contents().find(blockSelector+'.sm-painted').length && type==1) {

        // по-идее здесь снимаем blend-mode с фонового изображения, но все ломается, поэтому пока без него

        // console.log('cssText: '+iframe.contents().find('[data-type="' + sid + '"].sm-painted').css('cssText'));
        // console.log('newCssText: '+iframe.contents().find('[data-type="' + sid + '"].sm-painted').css('cssText').replace('background-blend-mode: color-burn;', ''));
        let currentCssTextBackground = iframe.contents().find(blockSelector+'.sm-painted').css('cssText');
        let newCssTextBackground = currentCssTextBackground.replace('background-blend-mode: color-burn;', '');
        console.log(currentCssTextBackground);
        console.log(newCssTextBackground);
        iframe.contents().find(blockSelector+'.sm-painted').css('cssText', newCssTextBackground);
    }

    //снимаем класс покрашенного фона или текста
    iframe.contents().find(blockSelector).toggleClass((type == '1') ? 'sm-painted' : 'sm-painted_text',false);
    // iframe.contents().find('[data-type="' + sid + '"]').toggleClass('sm-painted_text',false);

    //если убрали цвет текста
    if (type == 2) {
        // убираем цвет с текстов
        iframe.contents().find(blockSelector+' *:not(.sm_colors):not(.sm_colors *):not(.sm_color > div):not(.sm-btn):not(.sm-button):not(.sm-button-center):not(.slick-initialized.slick-slider *):not([class*="__bg"]):not(video):not(.text-no-paint)').css('color', '');
        // убираем цвет с svg
        iframe.contents().find(blockSelector).find('svg:not(.text-no-paint) path').css('cssText', '');
        iframe.contents().find(blockSelector).find('svg:not(.text-no-paint) circle').css('cssText', '');
        iframe.contents().find(blockSelector).find('svg.text-paint-stroke path').css('cssText', '');
        iframe.contents().find(blockSelector).find('svg:not(.text-no-paint)').toggleClass('sm-painted_icon', false);


    }

    // если убрали цвет с формы
    // if ((iframe.contents().find(blockSelector).hasClass('sm-questionnaire') || iframe.contents().find(blockSelector).hasClass('sm-form'))  && type==2) {
    //     // снимаем цвета с формы
    //     iframe.contents().find('.sm-modal *:not(.sm_colors):not(.sm_color > div):not(.sm-btn):not(.sm-button):not(.sm-button-center):not(.sm_colors *), .sm-modal').css('color', '');
    //     iframe.contents().find('.sm-quest-modal *:not(.sm_colors):not(.sm_color > div):not(.sm-btn):not(.sm-button):not(.sm-button-center):not(.sm_colors *), .sm-quest-modal').css('color', '');
    //     iframe.contents().find('div#sm-mod *:not(.sm_colors):not(.sm_color > div):not(.sm-btn):not(.sm-button):not(.sm-button-center):not(.sm_colors *), div#sm-mod').css('color', '');
    // }
    // if ((iframe.contents().find(blockSelector).hasClass('sm-questionnaire') || iframe.contents().find(blockSelector).hasClass('sm-form')) && type==1) {
    //     // снимаем цвета с формы
    //     iframe.contents().find('.sm-modal').css('background' ,'');
    //     iframe.contents().find('.sm-quest-modal').css('background' ,'');
    //     iframe.contents().find('div#sm-mod').css('background' ,'');
    // }

    //убираем цвет с пожеланий
    if(iframe.contents().find(blockSelector).find('.sm-wishes__content-slide').length>0 && type==2){
        removeStyleRule(iframe.contents().find('head').find('.colors-styles'), blockSelector+' .sm-wishes__content-slide');
    }


    //удаляем правила из дополнительных стилей
    if(type == 1) {
        if (iframe.contents().find(blockSelector+' .background-paint-background').length > 0) {
            removeStyleRule(iframe.contents().find('head').find('.colors-styles'), blockSelector+' .background-paint-background');
        }
        if (iframe.contents().find(blockSelector+'.background-paint-background').length > 0) {
            removeStyleRule(iframe.contents().find('head').find('.colors-styles'), blockSelector+'.background-paint-background');
        }
        if (iframe.contents().find(blockSelector+' .background-paint-background-after').length > 0) {
            removeStyleRule(iframe.contents().find('head').find('.colors-styles'), blockSelector+' .background-paint-background-after:after');
        }
        if (iframe.contents().find(blockSelector+' .background-paint-background-before').length > 0) {
            removeStyleRule(iframe.contents().find('head').find('.colors-styles'), blockSelector+' .background-paint-background-before:before');
        }
        if (iframe.contents().find(blockSelector+'.background-paint-background-after').length > 0) {
            removeStyleRule(iframe.contents().find('head').find('.colors-styles'), blockSelector+'.background-paint-background-after:after');
        }
        if (iframe.contents().find(blockSelector+'.background-paint-background-before').length > 0) {
            removeStyleRule(iframe.contents().find('head').find('.colors-styles'), blockSelector+'.background-paint-background-before:before');
        }
        if (iframe.contents().find(blockSelector+'.background-paint-text').length > 0) {
            removeStyleRule(iframe.contents().find('head').find('.colors-styles'), blockSelector+'.background-paint-text');
        }
        if (iframe.contents().find(blockSelector+' .background-paint-text').length > 0) {
            removeStyleRule(iframe.contents().find('head').find('.colors-styles'), blockSelector+' .background-paint-text');
        }
        if (iframe.contents().find(blockSelector+' .background-hide').length > 0) {
            removeStyleRule(iframe.contents().find('head').find('.colors-styles'), blockSelector+' .background-hide');
        }
        iframe.contents().find(blockSelector+' svg.background-paint-fill path').css('cssText', '');
        iframe.contents().find(blockSelector+' svg.background-paint-fill').toggleClass('sm-painted_icon', false);

        // if (iframe.contents().find(blockSelector).hasClass('sm-questionnaire') || iframe.contents().find(blockSelector).hasClass('sm-form') || iframe.contents().find('[data-type="' + sid + '"]').hasClass('sm-feedback')) {
        //
        //     console.log('removing modal style');
        //
        //     if(iframe.contents().find('.sm-modal').length) {
        //         console.log('here10');
        //         removeStyleFormBackground(iframe.contents().find('head').find('.colors-styles'), '.sm-modal');
        //     }
        //     if(iframe.contents().find('.sm-quest-modal').length) {
        //         removeStyleFormBackground(iframe.contents().find('head').find('.colors-styles'), '.sm-quest-modal');
        //     }
        //     if(iframe.contents().find('div#sm-mod').length){
        //         console.log('here20');
        //         removeStyleFormBackground(iframe.contents().find('head').find('.colors-styles'), 'div#sm-mod');
        //     }
        //     if(iframe.contents().find('.sm-feedback').length){
        //         removeStyleFormBackground(iframe.contents().find('head').find('.colors-styles'), '.sm-feedback');
        //     }
        // }

        var pseudo = iframe.contents().find(blockSelector).find('[class*="__bg"]');
        if (pseudo.length > 0) {
            pseudo.css('cssText', '');
        }
        iframe.contents().find(blockSelector).find('.background-paint-box-shadow').each(function(){
            $(this).css('cssText','');
        });

    }
    if(type == 2){
        if(iframe.contents().find(blockSelector+' .text-paint-background-after').length>0){
            removeStyleRule(iframe.contents().find('head').find('.colors-styles'), blockSelector+' .text-paint-background-after:after');
        }
        if(iframe.contents().find(blockSelector+' .text-paint-background-before').length>0){
            removeStyleRule(iframe.contents().find('head').find('.colors-styles'), blockSelector+' .text-paint-background-before:before');
        }
        if(iframe.contents().find(blockSelector+' .text-paint-border').length>0){
            removeStyleRule(iframe.contents().find('head').find('.colors-styles'), blockSelector+' .text-paint-border');
        }
        if(iframe.contents().find(blockSelector+' .text-paint-background').length>0){
            removeStyleRule(iframe.contents().find('head').find('.colors-styles'), blockSelector+' .text-paint-background');
        }
        if(iframe.contents().find(blockSelector+' .text-paint-border-before').length>0){
            removeStyleRule(iframe.contents().find('head').find('.colors-styles'), blockSelector+' .text-paint-border-before:before');
        }
        if(iframe.contents().find(blockSelector+' .text-paint-border-after').length>0){
            removeStyleRule(iframe.contents().find('head').find('.colors-styles'), blockSelector+' .text-paint-border-after:after');
        }
        if(iframe.contents().find(blockSelector+' .text-paint-text').length>0){
            removeStyleRule(iframe.contents().find('head').find('.colors-styles'), blockSelector+' .text-paint-text');
        }
        if(iframe.contents().find(blockSelector+' .desktop-text-paint-text').length>0){
            removeStyleRule(iframe.contents().find('head').find('.colors-styles-desktop'), blockSelector+' .desktop-text-paint-text');
        }
        if(iframe.contents().find(blockSelector+' .desktop-text-paint-svg').length>0){
            removeStyleRule(iframe.contents().find('head').find('.colors-styles-desktop'), blockSelector+' .desktop-text-paint-svg:not(.text-no-paint-fill) path');
            removeStyleRule(iframe.contents().find('head').find('.colors-styles-desktop'), blockSelector+' .desktop-text-paint-svg:not(.text-no-paint-fill) circle');
            removeStyleRule(iframe.contents().find('head').find('.colors-styles-desktop'), blockSelector+' .desktop-text-paint-svg.text-paint-stroke path');
        }
        if(iframe.contents().find(blockSelector).find('.sm-form_checkbox_box').length>0) {
            if (iframe.contents().find(blockSelector).find('.sm-form_checkbox_box').css('mask') != null && iframe.contents().find(blockSelector).find('.sm-form_checkbox_box').css('mask') != 'none') {
                removeStyleRule(iframe.contents().find('head').find('.colors-styles'), '.sm-form_checkbox_box');
                removeStyleRule(iframe.contents().find('head').find('.colors-styles'), '.sm-form_checkbox_input:checked+.sm-form_checkbox_box');
                removeStyleRule(iframe.contents().find('head').find('.colors-styles'), 'input[type=radio]:checked');
                removeStyleRule(iframe.contents().find('head').find('.colors-styles'), 'input[type=radio]');
                if(iframe.contents().find(blockSelector).find('.sm-form-radio-fake').length > 0) {
                    updateStyleRule(iframe.contents().find('head').find('.colors-styles'), '.sm-form-radio-fake');
                }
            }else{
                removeStyleRule(iframe.contents().find('head').find('.colors-styles'), '.sm-form_checkbox_box');
                removeStyleRule(iframe.contents().find('head').find('.colors-styles'), '.sm-form_checkbox_input:checked+.sm-form_checkbox_box');
            }
        }
        // if ((iframe.contents().find(blockSelector).hasClass('sm-questionnaire') || iframe.contents().find(blockSelector).hasClass('sm-form') || iframe.contents().find(blockSelector).hasClass('sm-feedback')) && type==2) {
        //     removeStyleForm(iframe.contents().find('head').find('.colors-styles'),'[data-type="' + sid + '"]');
        //     if(iframe.contents().find('.sm-modal').length) {
        //         removeStyleForm(iframe.contents().find('head').find('.colors-styles'), '.sm-modal');
        //     }
        //     if(iframe.contents().find('.sm-quest-modal').length) {
        //         removeStyleForm(iframe.contents().find('head').find('.colors-styles'), '.sm-quest-modal');
        //     }
        //     if(iframe.contents().find('div#sm-mod').length){
        //         removeStyleForm(iframe.contents().find('head').find('.colors-styles'), 'div#sm-mod');
        //     }
        //     if(iframe.contents().find('.sm-feedback').length){
        //         removeStyleForm(iframe.contents().find('head').find('.colors-styles'), '.sm-feedback');
        //     }
        // }
    }
}

$(document).on('click', '.personal_colors .ct-color-remove', function () {
    //поведение поля выбора цвета
    $(this).parents('.ct-color-wrapper').toggleClass('personal_empty', true);
    $(this).parents('.ct-color-wrapper').find('input').val('');
    $(this).parents('.ct-color-wrapper').find('.ct-color').css('cssText', '');

    // номер блока
    var sid = $(this).parents('.ct-panel_settings-page').attr('data-section');
    // тип выбранного цвета 1-фон, 2-текст
    var type = $(this).parents('.ct-color-wrapper').attr('data-type');


    removeColorBlock('[data-type="' + sid + '"]',type);

    //переменная для записи текущего сssText
    let currentCssText = '';

    //если покрашен блок анкеты, красим модалки
    if (iframe.contents().find('[data-type="' + sid + '"]').hasClass('sm-questionnaire') || iframe.contents().find('[data-type="' + sid + '"]').hasClass('sm-form') || iframe.contents().find('[data-type="' + sid + '"]').hasClass('sm-feedback')) {


        if(iframe.contents().find('.sm-modal').length > 0){
            removeColorBlock('.sm-modal',type);
            if(type==2) {
                removeStyleForm(iframe.contents().find('head').find('.colors-styles'),'.sm-modal');
            }
        }
        if(iframe.contents().find('.sm-quest-modal').length > 0){
            removeColorBlock('.sm-quest-modal',type);
            if(type==2) {
                removeStyleForm(iframe.contents().find('head').find('.colors-styles'), '.sm-quest-modal');
            }
        }
        if(iframe.contents().find('div#sm-mod').length > 0){
            removeColorBlock('div#sm-mod',type);
            if(type==2) {
                removeStyleForm(iframe.contents().find('head').find('.colors-styles'), 'div#sm-mod');
            }
        }
        if(iframe.contents().find('.sm-feedback').length > 0){
            removeColorBlock('.sm-feedback',type);
            if(type==2) {
                removeStyleForm(iframe.contents().find('head').find('.colors-styles'), '.sm-feedback');
            }
        }

        if(type==2) {
            removeStyleForm(iframe.contents().find('head').find('.colors-styles'), '[data-type="' + sid + '"]' );
        }

    }
})




function rebuildStructure(that, sect = 166)//ПЕРЕПИСЫВАЕМ!!!!!
{
    var id = Number(that);
    iframe.contents().find('.sm-own[data-type="211"]').remove();
    iframe.contents().find('.sm-own[data-type="166"]').remove();

    if (sect == '211') {
        data_value['NEW_OWN_AFTER'] = id;
    } else {
        data_value['OWN_AFTER'] = id;
    }

    if (data_value['OWN_AFTER'] == '166') {
        data_value['OWN_AFTER'] = '0';
    }
    if (data_value['NEW_OWN_AFTER'] == '211') {
        data_value['NEW_OWN_AFTER'] = '0';
    }
    rebuildSelectors();

    var newowned = false;
    if (data_value['OWN_AFTER'] > 0) {
        let ownTemplate = '';
        if (data_value['NEW_OWN_AFTER'] > 0 && data_value['OWN_AFTER'] == '211') {
            ownTemplate = (jQuery.inArray(parseInt(template_val.id, 10), temlatesOwnResize )!=-1) ? ownBlockTemplate2Resize : ownBlockTemplate2;
            iframe.contents().find('[data-type="' + data_value['NEW_OWN_AFTER'] + '"]').after(ownTemplate);
            $('#secondPanel [name="new_own_after"]').val(data_value['NEW_OWN_AFTER']);
            newowned = true;
        }
        ownTemplate = (jQuery.inArray(parseInt(template_val.id, 10), temlatesOwnResize )!=-1) ? ownBlockTemplateResize : ownBlockTemplate;
        iframe.contents().find('[data-type="' + data_value['OWN_AFTER'] + '"]').after(ownTemplate);
        $('#secondPanel [name="own_after"]').val(data_value['OWN_AFTER']);
    }

    if (!newowned && data_value['NEW_OWN_AFTER'] > 0) {
        let ownTemplate = (jQuery.inArray(parseInt(template_val.id, 10), temlatesOwnResize )!=-1) ? ownBlockTemplate2Resize : ownBlockTemplate2;
        iframe.contents().find('[data-type="' + data_value['NEW_OWN_AFTER'] + '"]').after(ownTemplate);
        $('#secondPanel [name="new_own_after"]').val(data_value['NEW_OWN_AFTER']);
    }

    //checkPaintedBlock();

    autoResizeText();

    $('#switcher-166').prop('checked', data_value['OWN_AFTER'] != '0');
    $('#switcher-166').parents('.ct-switcher').toggleClass('active', data_value['OWN_AFTER'] != '0');

    $('#switcher-211').prop('checked', data_value['NEW_OWN_AFTER'] != '0');
    $('#switcher-211').parents('.ct-switcher').toggleClass('active', data_value['NEW_OWN_AFTER'] != '0');

    $('#setupAddBlock').toggleClass('ct-hidden', data_value['OWN_AFTER'] != '0' && data_value['NEW_OWN_AFTER'] != '0');
    $('#mob-menu-add').toggleClass('ct-hidden', data_value['OWN_AFTER'] != '0' && data_value['NEW_OWN_AFTER'] != '0');

    console.log(data_value['OWN_AFTER'])
    insertOwnData();

    $.post(ajax_url, {
        action: 'setown',
        NEW_OWN_AFTER: data_value['NEW_OWN_AFTER'],
        OWN_AFTER: data_value['OWN_AFTER'],
        project: project
    }, function (data) {
        if (data == '0') {


            if (current_own != id) {
                current_own = id;
                // saveTemp('1');
            }
        }
    })


}


function insertOwnData(n) {
    var ownblocks = [166, 211];
    $.each(ownblocks, function (k, v) {
        var add = '';
        var addb = '';
        var n = v;
        if (n == '211') {
            add = 'NEW_';
            addb = 'new_';
        }

        if (typeof data_value[add + 'OWN_GALLERY_TYPE'] == 'undefined' || data_value[add + 'OWN_GALLERY_TYPE'] == '') {
            data_value[add + 'OWN_GALLERY_TYPE'] = 0;
        }

        iframe.contents().find('[data-type="' + v + '"] .sm-own_wrapper-img').attr('data-asp', data_value[add + 'OWN_GALLERY_TYPE']);

        iframe.contents().find('[data-sm-text="' + add + 'OWN_TITLE"]').text(data_value[add + 'OWN_TITLE']).toggleClass('sm-hidden', (data_value[add + 'OWN_TITLE'] === '')).css('color', data_value[add + 'OWN_COLORS'][1]);
        iframe.contents().find('[data-sm-text="' + add + 'OWN_TEXT"]').html(parseLinks(data_value[add + 'OWN_TEXT'])).toggleClass('sm-hidden', (data_value[add + 'OWN_TEXT'] === '')).css('color', data_value[add + 'OWN_COLORS'][1]);
        iframe.contents().find('.sm-own[data-type="' + n + '"]').attr('data-position', data_value[add + 'OWN_ALIGN']).css('background-color', data_value[add + 'OWN_COLORS'][0]);
        paintBlock('.sm-own[data-type="' + n + '"]',data_value[add + 'OWN_COLORS'][0],1);
        // iframe.contents().find('a[data-sm-href="' + add + 'OWN_BUTTON_LINK"]').css({
        //     'color': data_value[add + 'OWN_COLORS'][1],
        //     'border-color': data_value[add + 'OWN_COLORS'][1]
        // });
        own_images = '';

        if (data_value[add + 'OWN_IMAGES'].length > 0) {
            $.each(data_value[add + 'OWN_IMAGES'], function (key, val) {
                own_images += '<img src="/sitemaker/' + val + '" data-sm-src="' + add + 'OWN_IMAGES_' + key + '">';
            })
        }

        if (typeof (data_value[add + 'OWN_BUTTON_LINK']) != 'undefined' && data_value[add + 'OWN_BUTTON_LINK'] != '') {
            var cl = iframe.contents().find('[data-sm-href="LOCATION_MAP"]').attr('class');
            iframe.contents().find('[data-sm-href="' + add + 'OWN_BUTTON_LINK"]').attr('href', data_value[add + 'OWN_BUTTON_LINK']).attr('class', cl).html(data_value[add + 'OWN_BUTTON_TITLE']);
        }

        iframe.contents().find('[data-sm-href="' + add + 'OWN_BUTTON_LINK"]').toggleClass('sm-hidden', typeof (data_value[add + 'OWN_BUTTON_LINK']) == 'undefined' || data_value[add + 'OWN_BUTTON_LINK'] == '')

        iframe.contents().find('.sm-own[data-type="' + n + '"] .sm-own_wrapper-img').html(own_images).toggleClass('sm-hidden', (data_value[add + 'OWN_IMAGES'].length === 0));



        // iframe.contents().find('.sm-own[data-type="' + n + '"] img[data-sm-src]').toggleClass('ct-photo_editor', true).off().on('click', function () {
        //     var sc = $(this).attr('data-sm-src');
        //     var sc1 = sc.slice(0, -2);
        //     if ($.inArray(sc, image_fields) != -1) {
        //         var u = sc;
        //     } else if ($.inArray(sc1, gallery_items) != -1) {
        //         var sc2 = sc.substring(sc.length - 1);
        //         var p = $('.ct-image_uploader-info[data-for="' + sc1 + '"]');
        //         var pt = p.find('.ct-image_preview[data-photos-k="' + sc2 + '"]');
        //         var iu = p.find('.ct-image_uploader-origin').clone()
        //         u = sc1;
        //         iu.find('input').removeAttr('multiple')
        //         pt.replaceWith(iu.removeClass('ct-image_uploader-origin').removeClass('ct-hidden'));
        //     }
        //
        //     $('#ct-uploader_' + u).click();
        // })


        setActiveOwnGalleryItem(data_value[add + 'OWN_GALLERY_TYPE'], false, add);

    })

    // iframe.contents().find('.sm-own [data-sm-text]').off().on('click', function () {
    //     if ($(this).parents('.sm-edit').length > 0) {
    //         var sect = $(this).parents('.sm-edit').attr('data-type');
    //         $('#secondPanel .ct-panel_settings-page').toggleClass('active', false)
    //         $('#secondPanel [data-section=' + sect + ']').toggleClass('active', true)
    //         $('#secondPanel').toggleClass('active', true)
    //     } else {
    //         $('#secondPanel .ct-panel_settings-page').toggleClass('active', false)
    //         $('#secondPanel input[name="' + $(this).data('sm-text').toLowerCase() + '"]').parents('.ct-panel_settings-page').toggleClass('active', true);
    //         $('#secondPanel').toggleClass('active', true);
    //     }
    //
    //
    //     closeMain();
    //     ifresize();
    // })

    iframe.contents().find('.sm-own [data-sm-text], .sm-own [data-sm-src]').off().on('click', function () {
        if ($('.ct-demonstration').length == 0) {
            if ($(this).parents('.sm-edit').length > 0) {
                var sect = $(this).parents('.sm-edit').attr('data-type');
                $('#secondPanel .ct-panel_settings-page').toggleClass('active', false)
                $('#secondPanel [data-section=' + sect + ']').toggleClass('active', true)
                $('#secondPanel').toggleClass('active', true)
            } else {
                $('#secondPanel .ct-panel_settings-page').toggleClass('active', false)
                $('#secondPanel input[name="' + $(this).data('sm-text').toLowerCase() + '"]').parents('.ct-panel_settings-page').toggleClass('active', true);
                $('#secondPanel').toggleClass('active', true);
            }

            closeMain();
            ifresize();
        }
    })

    setFontSize();
}

function reInitOwnBlock(v = '') {


    var inp_titles = constr_terms['ln-own-image-sizes'];
    var initOwnGal = $('[data-for="' + v + 'OWN_IMAGES"]');
    var pinito = initOwnGal.parent();
    initOwnGal.before('<div class="own_galleries-wrapper"></div>');
    var smv = v.toLowerCase();

    if (typeof data_value[v + 'OWN_GALLERY_TYPE'] == 'undefined' || data_value[v + 'OWN_GALLERY_TYPE'] == '') {
        data_value[v + 'OWN_GALLERY_TYPE'] = 0;
    }

    if ($('[name="' + smv + 'own_gallery_type"]').length == 0) {
        initOwnGal.parents('.ct-input_wrapper').after('<div class="ct-input_wrapper ct-hidden" ><input name="' + smv + 'own_gallery_type" class="ct-input" placeholder="" value="' + data_value[v + 'OWN_GALLERY_TYPE'] + '" type="number"></div>')
    }

    var pinown = pinito.find('.own_galleries-wrapper');
    pinown.append(initOwnGal)

    for (var ingal = 1; ingal <= 5; ingal++) {
        var tingal = initOwnGal.clone();
        tingal.toggleClass('ct-image_uploader-info_alt', true);
        tingal.find('.ct-image_preview').toggleClass('ct-hidden', false);
        tingal.attr('data-for', v + 'OWN_IMAGES_' + ingal);
        tingal.find('li:not(.ct-image_uploader-origin)').remove();
        tingal.find('.ct-image_preview').html('<span></span>');
        if (ingal <= 3) {
            tingal.find('.ct-image_preview').append('<div class="ct-image_uploader-preview_examples"><div class="ct-image_uploader-preview_examples-item"></div></div>');
        } else if (ingal == 4 || ingal == 5) {
            tingal.find('.ct-image_preview').append('<div class="ct-image_uploader-preview_examples"><div class="ct-image_uploader-preview_examples-item"></div><div class="ct-image_uploader-preview_examples-item"></div></div>');
        }
        tingal.append('<div class="ct-image_uploader-subtitle">' + inp_titles[(ingal - 1)] + '</div>');
        tingal.find('.ct-input').remove();
        pinown.append(tingal);
    }


    if (typeof data_value[v + 'OWN_VIDEO'] == 'undefined' || data_value[v + 'OWN_GALLERY_TYPE'] != 6) {
        data_value[v + 'OWN_VIDEO'] = '';
    }
    /* Это видео */
    var tingal = initOwnGal.clone();
    tingal.toggleClass('ct-image_uploader-info_alt', true);
    tingal.toggleClass('ct-image_uploader-info_alt-video', true);
    tingal.find('.ct-image_preview').toggleClass('ct-hidden', false);
    tingal.attr('data-for', v + 'OWN_VIDEO_UPLOAD');
    tingal.find('li:not(.ct-image_uploader-origin)').remove();
    tingal.find('.ct-image_preview').html('<span></span>');
    tingal.find('.ct-image_preview').append('<div class="ct-image_uploader-preview_examples"><div class="ct-image_uploader-preview_examples-item"><input type="text" name="' + smv + 'own_video" value="' + data_value[v + 'OWN_VIDEO'] + '" class="ct-hidden"><input type="file" name="' + smv + 'own_video_upload" value="" accept=".mp4,webm,video/*" class="ct-video_file"></div></div>');

    tingal.append('<div class="ct-image_uploader-subtitle">' + inp_titles[5] + '</div>');
    pinown.append(tingal);


    if (typeof data_value[v + 'OWN_COLORS'][2] == 'undefined') {
        data_value[v + 'OWN_COLORS'][2] = '#ffffff'; //button text
        data_value[v + 'OWN_COLORS'][3] = '#000000'; //button back
        data_value[v + 'OWN_COLORS'][4] = '#000000'; //button bord
    }

    $('[name="' + smv + 'own_text"]').prev('.ct-input_label').toggleClass('ct-title ct-subtitle ct-icon_item ct-icon_item--owntext', true).removeClass('ct-input_label');
    $('[name="' + smv + 'own_title"]').prev('.ct-input_label').toggleClass('ct-title ct-subtitle ct-icon_item ct-icon_item--owntitle', true).removeClass('ct-input_label');
    $('[name="' + smv + 'own_button_link"]').parents('.ct-input_wrapper').prepend('<div class="ct-subtitle ct-title ct-icon_item ct-icon_item--ownbutton">' + constr_terms['ln-own-button-label'] + '</div>');

    slickOwn(v);
    setActiveOwnGalleryItem(data_value[v + 'OWN_GALLERY_TYPE'], false, v);

    initOwnGal.find('.ct-image_uploader-origin input').attr('data-count', 100);
    initOwnGal.hide();
}



function slickOwn(v) {
    $('.ct-image_uploader-info_alt[data-for="' + v + 'OWN_IMAGES_5"] .ct-image_uploader-preview_examples').slick({
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        adaptiveHeight: false,
        nextArrow: '<div class="ct-button_nextOwn"></div>',
        prevArrow: '<div class="ct-button_prevOwn"></div>',
        variableWidth: false,
        arrows: true
    });
}


function setActiveOwnGalleryItem(t, save = false, v = '') {
    var smv = v.toLowerCase();

    iframe.contents().find('[data-type="' + ((v == '') ? '166' : '211') + '"] .sm-own_wrapper-img').attr('data-asp', data_value[v + 'OWN_GALLERY_TYPE']);


    if (data_value[v + 'OWN_IMAGES'].length > 1) {
        iframe[0].contentWindow.ownSlick();
    }
    $('[name="' + smv + 'own_gallery_type"]').val(t);

    var parin = $('[name="' + smv + 'own_gallery_type"]').parents('.ct-panel_settings-page');
    parin.find('.ct-panel_header').next('p').html(constr_terms['ln-own-description']);
    parin.find('.ct-image_uploader-info_alt').toggleClass('ct-image_uploader-info_alt_active', false);
    parin.find('.ct-image_uploader-info_alt .ct-image_uploader-preview_examples-item').css({
        'background-image': 'url(/sitemaker/images/constr/ct-image-plus.svg)',
        'background-size': 'initial'
    });
    parin.find('.ct-image_uploader-info_alt-video .ct-image_uploader-preview_examples-item').css({
        'background-image': 'url(/sitemaker/images/constr/ct-video-plus.svg)',
        'background-size': 'initial'
    });

    if (t == 6) {
        initOwnVideo(v + 'OWN');
    } else {
        data_value[v + 'OWN_VIDEO'] = '';
        deleteOwnVideo(v == 'NEW_' ? 3 : 2);
        if (t > 0) {
            if (t == 4) {

                $('[data-for="' + v + 'OWN_IMAGES_' + t + '"]').toggleClass('ct-image_uploader-info_alt_active', true);

                var curim = $($('[data-for="' + v + 'OWN_IMAGES"] .ct-image_preview:not(.ct-image_uploader-origin)')[0]).attr('data-url');

                if (typeof curim != 'undefined') {
                    $($('[data-for="' + v + 'OWN_IMAGES_' + t + '"] .ct-image_uploader-preview_examples-item')[0]).css({
                        'background-image': 'url(/sitemaker' + curim + ')',
                        'background-size': 'cover'
                    });
                }

                curim = $($('[data-for="' + v + 'OWN_IMAGES"] .ct-image_preview:not(.ct-image_uploader-origin)')[1]).attr('data-url')

                if (typeof curim != 'undefined') {
                    $($('[data-for="' + v + 'OWN_IMAGES_' + t + '"] .ct-image_uploader-preview_examples-item')[1]).css({
                        'background-image': 'url(/sitemaker' + curim + ')',
                        'background-size': 'cover'
                    });
                }

            } else if (t == 5) {

                $('.ct-image_uploader-info_alt[data-for="' + v + 'OWN_IMAGES_5"]').toggleClass('ct-image_uploader-info_alt_active', true);
                $('.ct-image_uploader-info_alt[data-for="' + v + 'OWN_IMAGES_5"] .ct-image_uploader-preview_examples').slick('unslick');
                $('.ct-image_uploader-info_alt[data-for="' + v + 'OWN_IMAGES_5"] .ct-image_uploader-preview_examples-item').remove();

                $.each($('[data-for="' + v + 'OWN_IMAGES"] .ct-image_preview:not(.ct-image_uploader-origin)'), function (ka, va) {
                    if (typeof $(this).attr('data-url') != 'undefined') {
                        $('[data-for="' + v + 'OWN_IMAGES_5"] .ct-image_uploader-preview_examples').append('<div class="ct-image_uploader-preview_examples-item" style="background-image:url(/sitemaker' + $(this).attr('data-url') + ');background-size:cover"></div>');
                    }
                })

                $('.ct-image_uploader-info_alt[data-for="' + v + 'OWN_IMAGES_5"] .ct-image_uploader-preview_examples').append('<div class="ct-image_uploader-preview_examples-item" style="background:url(/sitemaker/images/constr/ct-image-plus.svg) 50% 50% no-repeat #f9f9f9;"></div>');

                slickOwn(v);

            } else {
                $('[data-for="' + v + 'OWN_IMAGES_' + t + '"]').toggleClass('ct-image_uploader-info_alt_active', true);
                var curim = $('[data-for="' + v + 'OWN_IMAGES"] .ct-image_preview:not(.ct-image_uploader-origin)').attr('data-url')
                $('[data-for="' + v + 'OWN_IMAGES_' + t + '"] .ct-image_uploader-preview_examples-item').css({
                    'background-image': 'url(/sitemaker' + curim + ')',
                    'background-size': 'cover'
                });
            }
        }
    }


    if (save) {
        // if (t <= 5) {
            $('[name="' + smv + 'own_gallery_type"]').parents('.ct-panel_settings-page').find('.submit_current').click();
        // }
    }
}


function initOwnVideo(v) {

    var ic = iframe.contents();
    $('[name="' + v.toLowerCase() + '_video_upload"]').parent().find('video').remove();
    ic.find('[data-sm-text="' + v + '_TITLE"]').parents('.sm-own').find('.sm-video_wrapper').remove();

    if (typeof data_value[v + '_VIDEO'] != 'undefined' && data_value[v + '_VIDEO'] != '') {
        var vid = '<video playsInline class="sm-own_video" id="sm-' + v.toLowerCase() + '_video"><source type="video/mp4" src="' + data_value[v + '_VIDEO'] + '#t=0.1"/></video>';

        $('.ct-image_uploader-info_alt[data-for="' + v + '_VIDEO_UPLOAD"]').toggleClass('ct-image_uploader-info_alt_active', true);
        ic.find('[data-sm-text="' + v + '_TITLE"]').after('<div class="sm-video_wrapper">' + vid + '</div>')
        ic.find('.sm-video_wrapper').off('click').on('click', function () {
            var vid = $(this).find('video');
            if (vid[0].paused) {
                vid[0].play();
            } else {
                vid[0].pause();
            }
        });

        ic.find('#sm-' + v.toLowerCase() + '_video').off('play pause loadeddata').on('play pause loadeddata', function () {
            var that = $(this)
            setTimeout(function () {
                that.parent().toggleClass('paused', that.paused);
            }, 300)

        })
        $('[name="' + v.toLowerCase() + '_video_upload"]').after(vid);
    }
}

// $(document).on('click', '.ct-image_uploader-info_alt span', function (e) {
//     e.preventDefault()
//     var v = ($(this).parents('.ct-panel_settings-page').attr('data-section') == '211') ? 'NEW_' : '';
//
//     data_value[v + 'OWN_GALLERY_TYPE'] = 0;
//     data_value[v + 'OWN_IMAGES'] = [];
//
//     data_value[v + 'OWN_VIDEO'] = '';
//     deleteOwnVideo(v == 'NEW_' ? 3 : 2);
//
//     $('[data-for="' + v + 'OWN_IMAGES"] .ct-image_cropper').remove();
//
//     setActiveOwnGalleryItem(0, true, v);
//     return false;
// });

function deleteOwnVideo(v) {
    $.post(ajax_url, {action: 'remvideo', type: v, project: project}, function (data) {
        console.log(data);
    })
}
$(document).on('click', '.ct-image_uploader-info_alt:not([data-for="OWN_VIDEO_UPLOAD"]):not([data-for="NEW_OWN_VIDEO_UPLOAD"]) .ct-image_uploader-preview_examples-item', function (e) {
    e.preventDefault();
    var v = ($(this).parents('.ct-panel_settings-page').attr('data-section') == '211') ? 'NEW_' : '';
    var t = $(this).parents('.ct-image_uploader-info_alt').attr('data-for').replace(v + 'OWN_IMAGES_', '');
    $('[data-for="' + v + 'OWN_IMAGES"]').attr('data-asp', t);
    if (data_value[v + 'OWN_GALLERY_TYPE'] != t) {
        $('[data-for="' + v + 'OWN_IMAGES"] li:not(.ct-image_uploader-origin)').remove(); // делаем всегда одну картинку
        if (t == 5) {
            $('[data-for="' + v + 'OWN_IMAGES"] .ct-image_uploader.ct-image_uploader-origin input').click();
        } else {
            if (t == 4) {
                $('[data-for="' + v + 'OWN_IMAGES"] .ct-image_uploader.ct-image_uploader-origin input').click()
            } else {
                $('[data-for="' + v + 'OWN_IMAGES"] input').click();
            }
        }
    } else if (t == 4) {
        var imin = $(this).index();
        var upin = $('[data-for="' + v + 'OWN_IMAGES"] .ct-image_cropper').length;
        if (upin > 2) {
            $.each($('[data-for="' + v + 'OWN_IMAGES"] .ct-image_cropper'), function (k, v) {
                if (k > 1) {
                    $(this).remove();
                }
            })
        }

        if (upin > imin) {
            iframe.contents().find('[data-sm-src="' + v + 'OWN_IMAGES_' + imin + '"]').click();
        } else {
            $('[data-for="' + v + 'OWN_IMAGES"] .ct-image_uploader.ct-image_uploader-origin input').click();
        }
    } else if (t == 5) {
        $('[data-for="' + v + 'OWN_IMAGES"] .ct-image_uploader.ct-image_uploader-origin input').click()
    }
    return false;
})

$(document).on('click', '.ct-modal .ct-panel_close', function () {
    modalClose();
    if($(this).parent('.ct-modal').attr('data-modal')=='modal_endlogin'){
        window.location.href = '/invitations/';
    }
})
$(document).on('click', '.ct-modal_open', function () {
    var mtarget = $(this).data('target');
    modalOpen($('[data-modal="' + mtarget + '"]'));
})

function modalOpen(modal) {
    modalClose();
    modal.toggleClass('active', true);
}

function modalClose() {
    $('.ct-modal').removeClass('active');
}