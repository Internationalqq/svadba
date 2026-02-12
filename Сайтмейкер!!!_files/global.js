var inp;

var cursect = 0;
var sections = [];
var offsections = [];
let template_val = {};
let template_data = {};
var data_value = {};
var iframe = $('iframe');
var tplwrapper = $('.ct-template_wrapper');
var ifh = iframe.height();
var ifw = iframe.width();
var checkCook;
var cursort_template = 0;
var grayscales = {};
var psending = false;
var pres_timer;
var pre_sect = 0;
var current_own = -1;
var pers_block_available = 0;
var dweeks = constr_terms['ln-dweeks'];
var dweeks_short = constr_terms['ln-dweeks-short'];
var tmonths = constr_terms['ln-months'];
var tmonthsr = constr_terms['ln-months-rod'];
var tmonths_ln = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var template_config = {};

var image_fields = ['COVER_PHOTO', 'BRIDE_PHOTO', 'GROOM_PHOTO', 'TIMING_PHOTO', 'SPLASH', 'STORY_PHOTO', 'HELLO_PHOTO_ONE', 'LOCATION_PHOTO', 'PHOTO_ONE', 'TIMING_PHOTO', 'DATETIME_PHOTO_ONE', 'WISH_PHOTO_ONE', 'HELLO_PHOTO', 'TIMER_PHOTO_ONE', 'CONTACTS_PHOTO_ONE', 'ANKETA_PHOTO_ONE', 'BYE_PHOTO_ONE', 'BYE_PHOTO2_ONE'];  //Одно фото
var galleries = ['MAIN_GALLERY', 'DRESSCODE_GIRLS_GALLERY', 'DRESSCODE_GUYS_GALLERY', 'LOCATION_GALLERY', 'CONTACT_PHOTO'];  // галлереи в сетки
var gallery_items = ['MAIN_GALLERY_ITEMS', 'DRESSCODE_GIRLS_GALLERY_ITEMS', 'DRESSCODE_GUYS_GALLERY_ITEMS', 'LOCATION_GALLERY_ITEMS', 'HELLO_PHOTO_ITEMS', 'CONTACT_PHOTO_ITEMS', 'LOCATION_PHOTO_ITEMS', 'COVER_PHOTO_ITEMS', 'STORY_PHOTO_ITEMS', 'ANKETA_PHOTO_ITEMS', 'OWN_IMAGES', 'NEW_OWN_IMAGES'];  //Одиночные в галлереи
var text_items = ['WISH_TEXT_ITEMS', 'TIMING_1', 'TIMING_2', 'TIMING_3', 'TIMING_4', 'TIMING_DESC', 'ANKETA_DRINKS', 'LOCATION_TIMING'];

var bltpl = '';
var questfilled = false;
var dweeks_short_init = false;

var tmonths_de = [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember"
];
$(document).on('input', '.ct-phone_check', function () {
    this.value = this.value.replace(/[^0-9()+\-]/gi, '');
    //var phone = this.value;
})

$('.ct-switch_template').click(function () {
    $('.ct-panel_settings-page').removeClass('active')
    $('#mainPanel').toggleClass('active', true);
    $('#selectTpl').toggleClass('active', true);
})

$(window).on('resize', function () {
    ifresize()
})

function ifresize() {
    tplwrapper.css('transform', 'scale(1)')
    iframe.css('transform', 'scale(1)').css('height', '100%').css('width', '100%').css('margin-top', 0).css('margin-left', 0);
    var ifh = 875;
    var ifw = 425;
    var mw = 390;

    if (!tplwrapper.hasClass('ct-iphone-wrapper')) {
        if ($(window).innerWidth() > 768) {
            mw = 1920;
        }
        ifw = iframe.width();
        ifh = iframe.height();
    }

    var is1 = $('.ct-template_container').innerWidth() / mw
    var nifw = ifw / is1;
    var nifh = ifh / is1;
    var mt = (ifh - nifh) / 2
    var ml = (ifw - nifw) / 2
    if (!tplwrapper.hasClass('ct-iphone-wrapper')) {
        if ($(window).innerWidth() <= 768) {
            nifw = mw;
            nifh = Math.ceil(ifh / is1);
            mt = Math.ceil((ifh - nifh) / 2)
            ml = Math.ceil((ifw - nifw) / 2)
        }

        iframe.css('transform', 'scale(' + is1 + ')').css('height', nifh).css('width', mw).css('transform-origin', 'top, left').css('margin-top', mt).css('margin-left', ml)
    } else {
        is1 = $(window).innerHeight() / (885 * 1.25);
        $('.ct-iphone-wrapper').css('transform', 'scale(' + is1 + ')').css('transform-origin', 'center');
    }

    if (typeof ($('[name="contact_link"]')) != 'undefined' && $('[name="contact_link"]').parents('.ct-panel_settings-page.active').length > 0) {
        if ((data_value['CONTACTS_LINK'].value == '' || data_value['CONTACTS_LINK'].value == 'wedwed_russia') && data_value['CONTACTS_LINK'].type != '5') {
            $('[name="contact_link"]').val('');
            $('.ct-panel_settings-page.active .submit_current').toggleClass('active', true);
        }
    }

    if ($('.ct-image_uploader-info_alt[data-for="OWN_IMAGES_5"] .ct-image_uploader-preview_examples.slick-initialized').length > 0) {
        $('.ct-image_uploader-info_alt[data-for="OWN_IMAGES_5"] .ct-image_uploader-preview_examples').slick('setPosition');
    }

    if ($('.ct-image_uploader-info_alt[data-for="NEW_OWN_IMAGES_5"] .ct-image_uploader-preview_examples.slick-initialized').length > 0) {
        $('.ct-image_uploader-info_alt[data-for="NEW_OWN_IMAGES_5"] .ct-image_uploader-preview_examples').slick('setPosition');
    }

    // setTimeout(function () {
    setFontSize();
    autoResizeText();
    // }, 200);
}

$('.ct-edit_template').click(function () {
    if ($(this).hasClass('ct-mob-menu-icon')) {
        if ($('#secondPanel.active').length > 0) {
            $('#secondPanel').removeClass('active')
            $('.ct-panel_sub').removeClass('active');
        } else {
            $('#mainPanel').toggleClass('active', true);
            $('#mainPanel .ct-panel_settings-page').toggleClass('active', false);
            $('#mainSettings').toggleClass('active', true);
        }
        $('#mainPanel').scrollTop(0);
    } else {
        $('#mainPanel').toggleClass('active', true);
        $('#secondPanel').toggleClass('active', false);
        $('.ct-panel_settings-page').removeClass('active');
        $('#mainSettings').toggleClass('active', true);
        ifresize();
    }
})

$(document).on('click', '.ct-panel_close', function () {
    if ($(this).parents('.ct-pleasepay').length > 0) {
        $('.ct-pleasepay').removeClass('active');
    } else {
        $(this).parents('.ct-panel:first').removeClass('active');
        $('.ct-panel_sub').removeClass('active');
        ifresize();
    }
})


$(document).on('click', '.ct-color-wrapper .ct-color-remove', function () {
    var p = $(this).parents('.ct-color-wrapper');
    var parent = $(this).parents('.ct-colors-wrapper');
    if (parent.find('.ct-color-wrapper').length > 1) {
        p.remove();
        $('.ct-panel_settings-page.active .submit_current').toggleClass('active', true);
    }
    parent.find('.ct-color-remove').toggleClass('ct-hidden', parent.find('.ct-color-wrapper').length <= 1)
})

$(document).on('click', '.ct-color-wrapper .ct-color-add', function () {
    $(this).parents('.ct-colors-wrapper').append($(this).parent().clone())
    var parent = $(this).parents('.ct-colors_wrapper');
    parent.find('.ct-color-remove').toggleClass('ct-hidden', parent.find('.ct-color_wrapper').length <= 1)
    $('.ct-panel_settings-page.active .submit_current').toggleClass('active', true);
})

$(document).on('input', 'input[type="color"]', function (event) {
    $(this).parent().find('span.ct-color').removeClass('empty').css('background-color', $(this).val());
});

$('input[name="ct-device"]').on('change', function () {
    tplwrapper.toggleClass('ct-iphone-wrapper', $(this).val() > 0)
    ifresize();
})
var seo_timer
$('input[name="seo_description"], input[name="seo_title"]').on('input', function () {

    clearTimeout(seo_timer);
    seo_timer = setTimeout(function () {
        var set = $('input[name="seo_title"]').val();
        var des = $('input[name="seo_description"]').val();
        $.post(ajax_url, {project: project, action: 'setseo', set: set, des: des}, function () {

        })
    })

})

ifresize();

$('#setupBlock').click(function () {
    $('#secondPanel').toggleClass('active', true);
    $('#secondPanel .ct-panel_settings-page').removeClass('active')
    //console.log('close-panel-4');
    $('#secondPanel .ct-panel_settings-page[data-section="' + (cursect + 1) + '"]').addClass('active')
    $('#mainPanel').toggleClass('active', false);
    ifresize();
})

$(document).on('input', '.ct-input', function () {
    var p = $(this).parents('.ct-panel_settings-page[data-section]')
    if (p.length > 0) {
        p.find('.submit_current').toggleClass('active', true);
    }
})

$('.ct-button_ask').click(function () {
    $('#mainPanel .ct-panel_settings-page').removeClass('active')
    $('#askSupport').toggleClass('active', true);
    $('#mainPanel').scrollTop(0);
})


$('.ct-menu li').click(function () {
    if ($(this).hasClass('ct-menu-icon_active')) {
        $(this).removeClass('ct-menu-icon_active')
    }
    var sect = $(this).data('item');
    $('#mainPanel .ct-panel_settings-page').removeClass('active');
    $('#' + sect).toggleClass('active', true)
    if (sect == 'customizeView') {
        if ($('.ct-hello_wrapper').length > 0 && !$('.ct-hello_items').hasClass('swiper-initialized')) {
            var h = $('.ct-hello_items').attr('data-current');
            h = (h == '') ? 0 : h;
            // var helloInit = $('.ct-hello_item[data-id="' + h + '"]').index();
            var helloInit = $('.swiper-slide:has(.ct-hello_item[data-id="' + h + '"])').index();

            // $('.ct-hello_items').slick({
            //     slidesToShow: 3,
            //     variableWidth: true,
            //     infinite: false,
            //     swipeToSlide: true,
            //     touchMove: false,
            //     initialSlide: helloInit,
            //     centerMode: true,
            // }).on('setPosition', function () {
            //     var did = $('.ct-hello_items .slick-current .ct-hello_item').attr('data-id');
            //     $('.ct-hello_edit').toggleClass('ct-hidden', did == '0');
            //     if (h != did) {
            //         h = did;
            //         resetIntro()
            //         checkIntroData();
            //     }
            // });

            const swiper = new Swiper('.ct-hello_items', {
                // Количество слайдов
                slidesPerView: 2.5,
                direction: 'horizontal',
                loop: false,
                centeredSlides: true,
                initialSlide: helloInit,
                navigation: {
                    nextEl: '.hello-swiper-but-next',
                    prevEl: '.hello-swiper-but-prev',
                },
                on: {
                    // Срабатывает при каждой смене слайда (после анимации)
                    slideChangeTransitionEnd: function () {
                        var did = $('.ct-hello_items .swiper-slide-active .ct-hello_item').attr('data-id');
                        $('.ct-hello_edit').toggleClass('ct-hidden', did == '0');
                        if (h != did) {
                            h = did;
                            resetIntro()
                            checkIntroData();
                        }
                    },
                    init: function () {
                        var activeSlide = $('.ct-hello_items .swiper-slide-active .ct-hello_item');
                        var hwrapper = $('.ct-hello_items');
                        // Добавляем data-атрибуты к активному слайду
                        console.log(hwrapper.attr('data-current-str1'));
                        activeSlide.attr('data-current-string-1',hwrapper.attr('data-current-str1'));
                        activeSlide.attr('data-current-string-2',hwrapper.attr('data-current-str2'));
                        if(hwrapper.attr('data-current-str3')!='' && hwrapper.attr('data-current-str3')!=null){
                            activeSlide.attr('data-current-string-3',hwrapper.attr('data-current-str3'));
                        }
                        activeSlide.attr('data-current-dark',hwrapper.attr('data-current-dark'));
                        activeSlide.attr('data-current-blur',hwrapper.attr('data-current-blur'));
                    }
                }
            });
        }
    }
})

$('.ct-hello_edit').click(function (e) {
    e.preventDefault();
    $(this).toggleClass('active');
    if ($(this).hasClass('active')) {
        checkIntroData();
    } else {
        $('.ct-hello_data').toggleClass('active', false);
    }
    return false;
})

$('#intro_reset').click(function () {
    clearIntroInfo();
    resetIntro()
    checkIntroData();
})

$('#intro_save').click(function () {
    saveIntro(true);
})

$('.ct-hello_submit').click(function (e) {
    e.preventDefault();
    resetIntro()
    checkIntroData();
    saveIntro(true);
    return false;
})

$('.ct-panel_back').click(function () {
    if ($(this).parents('#filterTpl').length > 0) {
        $('#filterTpl').toggleClass('active', false);
        $('#selectTpl').toggleClass('active', true)
    } else {
        $('#mainPanel .ct-panel_settings-page').removeClass('active');
        $('#mainSettings').toggleClass('active', true)
    }
})


$(document).on('click', '.ct-input_select', function () {
    $(this).toggleClass('active');
    if (($(this).attr('id') == 'hfont' || $(this).attr('id') == 'tfont') && !$(this).hasClass('inited')) {
        $(this).addClass('inited')
        $.each($(this).find('li'), function () {
            var svg = $(this).attr('data-file');
            $(this).append('<img src="/sitemaker/css/fontcss/' + svg + '.svg">');
        })
    }
})

$(document).on('click', '.ct-input_select li', function () {
    $(this).parents('ul').find('li').removeClass('ct-input_select-current');
    $(this).addClass('ct-input_select-current');
    $(this).parents('.ct-input_select').find('span').text($(this).text());

    if ($(this).parents('.ct-input_select').prop('id') == 'introd') {
        var did = $(this).attr('data-id');
        console.log('ct-input-select click');
        $.post(ajax_url, {action: 'setintro', iid: did, project: project}, function (data) {

        })
    }

    if ($(this).parents('.ct-input_select').prop('id') == 'music') {
        var did = $(this).attr('data-id');
        $.post(ajax_url, {action: 'setmus', mid: did, project: project}, function (data) {

        })
    }

    if ($(this).parents('.ct-input_select').attr('data-type') == 'question') {
        var dtype = $(this).attr('data-type');
        var did = $(this).parents('.ct-input_select').attr('data-id');
        switchQuestionType(dtype, did);
    }

    if ($.inArray($(this).parents('.ct-input_select').prop('id'), ['hfont', 'tfont', 'anim_speed', 'anim_type']) !== -1) {
        var key = '';

        if ($(this).parents('.ct-input_select').prop('id') == 'hfont') {
            key = 'headerStyle';
        } else if ($(this).parents('.ct-input_select').prop('id') == 'tfont') {
            key = 'textStyle'
        }

        if (key != '') {
            iframe.contents().find('#' + key).remove();
            var css = $(this).attr('data-file');
            const linkElement = document.createElement('link');
            linkElement.setAttribute('rel', 'stylesheet');
            linkElement.setAttribute('id', key)
            linkElement.setAttribute('href', '/sitemaker/css/fontcss/' + css + '.min.css');
            iframe.contents().find('head').append(linkElement);
        }
        saveSettings();
    }


    if ($(this).parents('.ct-own_block-setting_select').length > 0) {
        if ($('.ct-own_block-setting[data-sect]').length > 0) {
            if ($(this).parents('.ct-own_block-setting').attr('data-sect')) {
                rebuildStructure($(this).attr('data-id'), $(this).parents('.ct-own_block-setting').attr('data-sect'));
            } else {
                rebuildStructure($(this).attr('data-id'), $(this).parents('.ct-panel_settings-page').attr('data-section'));

            }
        } else {
            rebuildStructure($(this).attr('data-id'));
        }

    } else if ($(this).parents('.ct-input_select').attr('id') == 'own_align') {
        $('[name="own_align"]').val($(this).attr('data-id')).trigger('input', typeof data_value['OWN_ALIGN'] == 'undefined' || data_value['OWN_ALIGN'] != $(this).attr('data-id'));
    } else if ($(this).parents('.ct-input_select').attr('id') == 'new_own_align') {
        $('[name="new_own_align"]').val($(this).attr('data-id')).trigger('input', typeof data_value['NEW_OWN_ALIGN'] == 'undefined' || data_value['NEW_OWN_ALIGN'] != $(this).attr('data-id'));
    }
})

$(document).on('input', '#secondPanel [name="location_map"]', function () {
    checkUrl($(this).next('span'), $(this).val())
})

$(document).on('click', '.ct-image_preview i', function () {
    $(this).toggleClass('active')
    $(this).parents('.ct-image_preview').attr('data-filter', ($(this).hasClass('active') ? 'black' : ''));
    var cat = $(this).parents('.ct-image_uploader-info').attr('data-for');
    var ind = $(this).parents('.ct-image_preview').index();
    var objindex = grayscales.findIndex((obj => obj.name == cat));
    if (objindex === -1) {
        grayscales.push({name: cat, data: []});
    }

    objindex = grayscales.findIndex((obj => obj.name == cat));
    if ($(this).hasClass('active')) {
        grayscales[objindex].data.push(ind)
    } else {
        var index = grayscales[objindex].data.indexOf(ind);
        if (index !== -1) {
            grayscales[objindex].data.splice(index, 1);
        }
    }

    $.post(ajax_url, {action: 'grayscales', data: JSON.stringify(grayscales), project: project}, function (data) {
        doGrayscales();
    });
})

$(document).on('click', '.ct-image_uploader', function () {
    $(this).closest('input[type="file"]').click();
})

$(document).on('change', 'input[type="file"]:not(.ct-music_file):not(.ct-video_file)', function () {
    var data = new FormData();
    var that = $(this);
    var cont = that.parents('.ct-image_uploader')
    var upinfo = that.parents('.ct-image_uploader-info')
    data.append('action', 'images');
    data.append('project', project)
    var name = $(this).attr('name').toUpperCase();
    if (typeof cropInit !== "undefined" && iframe.contents().find('.ct-photo_cropper').length === 0) {
        preCrop(that[0].files[0], cont, upinfo);
    } else {
        $.each(that[0].files, function (i, file) {
            data.append(name, file);
        });

        cont.find('.ct-image_upload-status div').css('width', 0);
        cont.find('.ct-image_upload-status').toggleClass('active', true);
        $.ajax({
            xhr: function () {
                var xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener("progress", function (evt) {
                    if (evt.lengthComputable) {
                        var percentComplete = evt.loaded / evt.total;
                        percentComplete = parseInt(percentComplete * 100);
                        cont.find('.ct-image_upload-status div').css('width', percentComplete);

                        if (percentComplete === 100) {
                            cont.find('.ct-image_upload-status').toggleClass('active', false);
                        }
                    }
                }, false);
                return xhr;
            },
            type: 'POST',
            url: ajax_url,
            cache: false,
            contentType: false,
            processData: false,
            data: data,
            success: function (result) {
                if (result != '' && result != 'ok') {
                    var res = JSON.parse(result);

                    if (typeof (that.attr('multiple')) == 'undefined' && cont.hasClass('ct-image_uploader-single')) {
                        if (res[0] && res[0] != '') {
                            upinfo.find('.ct-image_preview:not(.ct-image_uploader)').css('background-image', 'url(' + res[0] + ')').attr('data-url', res[0].split('/sitemaker/').join('/'));
                        }
                    } else {
                        var ko = upinfo.find('.ct-image_preview:not(.ct-image_uploader)').length;
                        var rlen = res.length;
                        var cnt = that.data('count');
                        if (cnt > 0) {
                            if (rlen >= cnt) {
                                ko = 0;
                                upinfo.find('.ct-image_preview:not(.ct-image_uploader-origin)').remove();
                            } else if (rlen > cnt - ko) {
                                ko = cnt - rlen;
                                $.each(upinfo.find('.ct-image_preview:not(.ct-image_uploader-origin)'), function (ki, vi) {
                                    if (ki >= ko) {
                                        $(this).remove();
                                    }
                                })
                            }
                        }

                        if (res.length == 1 && !cont.hasClass('ct-image_uploader-origin')) {
                            cont.replaceWith('<li class="ct-image_preview" data-url="' + res[0].split('/sitemaker/').join('/') + '" style="background-image: url(' + res[0] + ')"><span></span><i></i></li>');
                        } else {
                            $.each(res, function (k, v) {
                                if (upinfo.find('.ct-image_preview:not(.ct-image_uploader-origin)').length < cnt) {
                                    that.parents('.ct-image_uploader').before('<li class="ct-image_preview" data-photos="tmp" data-photos-k="' + (Number(ko) + Number(k)) + '" data-url="' + v.split('/sitemaker/').join('/') + '" style="background-image: url(' + v + ')"><span></span></li>')
                                }
                            })
                        }


                    }

                    if (!upinfo.parents('.ct-panel_settings-page').hasClass('active') && !$('#secondPanel').hasClass('active')) {
                        upinfo.parents('.ct-panel_settings-page').find('.submit_current').click();
                    }
                }

                checkUploader(upinfo)
            },
            error: function (err) {
                console.log(err);
            }
        })
    }
});

$(document).on('mouseover', '[data-hint]', function () {
    $(this).append('<div class="ct-input_helper">' + $(this).data('hint') + '</div>')
})
$(document).on('mouseout', '[data-hint]', function () {
    $('.ct-input_helper').remove();
})

$('.ct-send').click(function () {
    var uname = $('input[name="uname"]').val();
    var uemail = $('input[name="uemail"]').val();
    var utext = $('[name="utext"]').val();

    if (uname != '' && uemail != '' && utext != '') {
        $.post(ajax_url, {
            action: 'support',
            uname: uname,
            uemail: uemail,
            utext: utext,
            project: project
        }, function (data) {
            $('input[name="uname"]').val('');
            $('input[name="uemail"]').val('');
            $('[name="utext"]').val('');
            alert(constr_terms['ln-notify-support'])
            $('#askSupport').removeClass('active');
            $('#mainPanel').removeClass('active');
            ifresize();
        })
    }
})

$(document).on('click', '.ct-image_preview span', function () {
    if (confirm(constr_terms['ln-notify-image-remove'])) {
        // var p = $(this).parents('.ct-image_uploader-info');
        // $(this).parent().remove();
        // checkUploader(p)
        if ($(this).parents('.ct-image_uploader-info_alt').length > 0) {
            var v = ($(this).parents('.ct-panel_settings-page').attr('data-section') == '211') ? 'NEW_' : '';

            data_value[v + 'OWN_GALLERY_TYPE'] = 0;
            data_value[v + 'OWN_IMAGES'] = [];

            data_value[v + 'OWN_VIDEO'] = '';
            deleteOwnVideo(v == 'NEW_' ? 3 : 2);

            $('[data-for="' + v + 'OWN_IMAGES"] .ct-image_cropper').remove();

            setActiveOwnGalleryItem(0, true, v);
        }

        var p = $(this).parents('.ct-image_uploader-info');
        var pt = $(this).parent();
        if (p.find('.ct-image_uploader-origin').find('.ct-input').data('slider') != 1) {
            var iu = p.find('.ct-image_uploader-origin').clone()
            iu.find('input').removeAttr('multiple')
            pt.replaceWith(iu.removeClass('ct-image_uploader-origin').removeClass('ct-hidden'));

            if (iu.find('input').attr('name') === 'own_images[]' || iu.find('input').attr('name') === 'new_own_images[]') {
                $('.ct-panel_settings-page.active .submit_current').toggleClass('active', true);
            }
        } else {
            pt.remove();
            $('.ct-panel_settings-page.active .submit_current').toggleClass('active', true);
        }

        checkUploader(p)
    }
})

$(document).on('click', '.ct-input-dynamic_multiplier', function () {
    var toclone = $(this).prev();
    if (toclone.hasClass('ct-toclone')) {
        toclone.removeClass('ct-toclone').show()
    } else {
        var tcl = toclone.clone()
        if (toclone.find('.ct-input_answer').length > 0 && project != '') {
            var tclname = toclone.parents('.ct-addquests-item').find('.ct-panel_header').attr('for');
            tcl.find('.ct-input_answer').attr('name', tclname + '_answer[]');
        }
        toclone.after(tcl)
    }
    var wrapper = $(this).parent();
    $(this).prev().find('input').val('');
    $(this).prev().find('.ct-input_label span').text(wrapper.find('.ct-input_wrapper.ct-input-dynamic').length)
})

$(document).on('click', '.ct-input_remover', function () {
    var wrapper = $(this).parents('.ct-input_wrapper').parent();
    var l = wrapper.find('.ct-input_wrapper.ct-input-dynamic').length;
    if (l > 1) {
        $(this).parents('.ct-input_wrapper').remove();
    } else {
        $(this).parents('.ct-input_wrapper').addClass('ct-toclone').hide();
    }


    $('.ct-panel_settings-page.active .submit_current').toggleClass('active', true);

    $.each(wrapper.find('.ct-input_wrapper.ct-input-dynamic'), function (k, v) {
        $(this).find('.ct-input_label span').text(k + 1);
    })
})
$(document).on('click', '.ct-examples_toggle', function () {
    var ex = $(this).data('example');
    $('.ct-panel_sub .ct-panel_settings-page').removeClass('active');
    $('.ct-panel_sub .ct-panel_settings-page[data-ex=' + ex + ']').attr('data-for', $(this).data('for')).addClass('active')
    $('.ct-panel_sub').toggleClass('active')
})

$(document).on('click', '.ct-ai_button', function () {
    var that = $(this);
    var fo = that.attr('data-for');
    var ty = that.attr('data-type');
    var pa = 0;
    if (typeof that.attr('data-part') != 'undefined') {
        pa = that.attr('data-part');
    }

    var fi = $('#secondPanel').find('[name="' + fo + '"]');
    var iw = fi.parents('.ct-input_wrapper');
    if (iw.find('textarea').length > 0) {
        iw.find('.ck-editor').toggleClass('ck-loader', true);
    }
    that.toggleClass('active', true)
    $.post(ajax_url, {action: 'gentext', type: ty, part: pa, project: project}, function (data) {
        that.toggleClass('active', false)
        if (data != '0') {
            if (iw.find('textarea').length > 0) {
                iw.find('.ck-editor').toggleClass('ck-loader', false);
                var ck = iw.find('.ck-editor').attr('aria-labelledby');
                const domEditableElement = document.querySelector('[aria-labelledby="' + ck + '"] .ck-editor__editable_inline');
                const editorInstance = domEditableElement.ckeditorInstance;
                editorInstance.setData(data);
            } else {
                iw.find('input[type="text"]').val(data);
            }
        } else {
            alert('Генерация не удалась. попробуйте снова');
            if (iw.find('textarea').length > 0) {
                iw.find('.ck-editor').toggleClass('ck-loader', false);
            }
        }
    })
})
$(document).on('change', '.ct-switcher:not(.ct-can-hide-swicher) input', function () {
    if ($(this).data('target')) {
        var _that = $(this).prop('checked');
        var _target = $(this).data('target');
        $('#' + _target).toggleClass('active', _that)
        if (_target == 'alco') {
            $.post(ajax_url, {action: 'setalco', alco: (_that ? 1 : 0), project: project}, function (data) {
                iframe.contents().find('[data-sm-anketa-toggle] > [data-sm-text="ANKETA_DRINKS_QUESTION"]:not([data-forq])').toggleClass('sm-hidden', !_that);
                iframe.contents().find('[data-sm-anketa-toggle] [data-sm-anketa="1"]').toggleClass('sm-hidden', !_that);
                iframe.contents().find('[data-sm-anketa-toggle] > [data-sm-anketa]:not([data-forq])').toggleClass('sm-hidden', !_that);
                d_alco = (_that ? 1 : 0);
            })
        } else if (_target == 'palette') {
            $.post(ajax_url, {action: 'setpalette', palette: (_that ? 1 : 0), project: project}, function (data) {
                var palette = iframe.contents().find('[data-sm-text="DRESSCODE_COLORS"]');
                palette.toggle(_that);
                d_palette = (_that ? 1 : 0);
            })
        } else if (_target == 'sput') {
            $.post(ajax_url, {action: 'setsput', sput: (_that ? 1 : 0), project: project}, function (data) {
                var sputnik = iframe.contents().find('[data-sm-anketa-company]');
                if (sputnik.parents('.sm-form__block').length > 0) {
                    sputnik = sputnik.parents('.sm-form__block');
                } else if (sputnik.parents('.sm-form__input-wrapp').length > 0) {
                    sputnik = sputnik.parents('.sm-form__input-wrapp');
                } else if (sputnik.parents('.sm-form__row').length > 0) {
                    sputnik = sputnik.parents('.sm-form__row');
                } else if (sputnik.parents('.sm-form-inner').length > 0) {
                    sputnik = sputnik.parents('.sm-form-inner');
                } else if (sputnik.prev('.sm-mgb40').length > 0) {
                    sputnik.prev('.sm-mgb40').toggle(_that)
                } else if (sputnik.prev('.text-20px').length > 0) {
                    sputnik.prev('.text-20px').toggle(_that)
                } else if (sputnik.parents('.sm-wrapper_block-anketa_question').length > 0) {
                    sputnik = sputnik.parents('.sm-wrapper_block-anketa_question');
                } else if (sputnik.parents('.sm-questionnaire__form-inner').length > 0) {
                    sputnik = sputnik.parents('.sm-questionnaire__form-inner');
                } else if (sputnik.parents('.sm-wrapper-input').length > 0) {
                    sputnik = sputnik.parents('.sm-company_wrapper');
                }
                sputnik.toggle(_that);
                d_sput = (_that ? 1 : 0);
            })
        } else if (_target == 'menu') {
            $.post(ajax_url, {action: 'setmenu', toggle: (_that ? 1 : 0), project: project}, function (data) {

            })
        }
    } else {
        if ($(this).parents('#secondPanel').length > 0) {
            var sect = $(this).parents('.ct-panel_settings-page').data('section') - 1;
            if (sect === 165) {
                if (!$(this).prop('checked')) {
                    pre_sect = data_value['OWN_AFTER'];
                    rebuildStructure(0);
                } else {
                    rebuildStructure(pre_sect);
                }
            } else if (sect === 210) {
                if (!$(this).prop('checked')) {
                    pre_sect = data_value['NEW_OWN_AFTER'];
                    rebuildStructure(0, 211);
                } else {
                    rebuildStructure(pre_sect, 211);
                }
            } else {
                if (!$(this).prop('checked')) {
                    offsections.push(sect)
                    $($('.ct-sections_setup li')[sect]).find('input').prop('checked', false);
                } else {
                    var removeItem = sect;
                    offsections = $.grep(offsections, function (value) {
                        return value != removeItem;
                    });

                    $($('.ct-sections_setup li')[sect]).find('input').prop('checked', true);
                }
                setSect();
                checkSect();
            }
        }

        if ($(this).parents('#editSections').length > 0) {
            var ind = $(this).parents('li').index();

            if (!$(this).prop('checked')) {
                offsections.push(ind)
                $('.ct-panel_settings-page[data-section="' + (ind + 1) + '"] .ct-switcher input').prop('checked', false)
            } else {
                var removeItem = ind;
                offsections = $.grep(offsections, function (value) {
                    return value != removeItem;
                });
                $('.ct-panel_settings-page[data-section="' + (ind + 1) + '"] .ct-switcher input').prop('checked', true)
            }
            setSect();
            checkSect();
        }
    }
})

$(document).on('change', '.ct-switcher.ct-can-hide-swicher input', function () {
    //если скрываем
    if($(this).is(':checked')) {
        //если показываем элемент, удаляем из hide
        let index = data_value['HIDE'].indexOf($(this).attr('data-for-value'));
        while(index !== -1) {
            data_value['HIDE'].splice(index, 1);
            let hideKey = $(this).attr('data-for-value');
            index = data_value['HIDE'].indexOf(hideKey);
            iframe.contents().find(template_config['HIDE'][hideKey]).toggleClass('sm-hidden',false);
        }
    }else{
        //может это и не надо, но если hide = null, объявляем пустой массив
        if (data_value['HIDE'] == null || data_value['HIDE'].length == 0) {
            data_value['HIDE'] = [];
            let hideKey = $(this).attr('data-for-value');
            data_value['HIDE'].push(hideKey);
            // console.log(template_config['HIDE'][hideKey]);
            iframe.contents().find(template_config['HIDE'][hideKey]).toggleClass('sm-hidden',true);
        } else {
            //проверка на дубли
            if (!data_value['HIDE'].includes($(this).attr('data-for-value'))) {
                let hideKey = $(this).attr('data-for-value');
                data_value['HIDE'].push($(this).attr('data-for-value'));
                // console.log(template_config['HIDE'][hideKey]);
                iframe.contents().find(template_config['HIDE'][hideKey]).toggleClass('sm-hidden',true);
            }
        }
    }

    $('.ct-panel_settings-page.active .submit_current').toggleClass('active', true);
})


$(document).on('click', '.ct-colors_switcher li', function () {
    $('.ct-colors_switcher li').removeClass('active');
    $('.ct-tpl_selector-item.active .ct-tpl_selector-item_footer-colors li').removeClass('active');
    var cin = $(this).index();
    $($('.ct-tpl_selector-item.active .ct-tpl_selector-item_footer-colors li')[cin]).toggleClass('active', true);
    $($('.ct-footer_colors li')[cin]).toggleClass('active', true);
    $($('.ct-header_colors li')[cin]).toggleClass('active', true);
    $($('#customizeView .ct-colors_switcher li')[cin]).toggleClass('active', true);
    saveSettings()
})

$(document).on('click', '.ct-panel_examples-item', function () {
    $('.ct-panel_examples-item').removeClass('active');
    $(this).addClass('active');
})

$('.ct-toconstr input').on('input', function () {
    $(this).removeClass('ct-input_error');
})

$(document).on('click', '.ct-icon_library-item_remove', function () {
    var inp = $(this).parent().next('.ct-input_wrapper').find('input');
    var da = inp.attr('name').toUpperCase();
    inp.val('');
    data_value[da] = '';
    $('.ct-panel_settings-page.active .submit_current').toggleClass('active', true);

    setIcons();
})

$(document).on('click', '.ct-icons_library-item', function () {
    var im = $(this).find('img').attr('src')
    var inp = $('.ct-icon_library-active').prev('.ct-input_wrapper').find('input');
    var da = inp.attr('name').toUpperCase();
    inp.val(im);
    data_value[da] = im;

    $('.ct-icon_library').toggleClass('.ct-icon_library-active', false);
    $('.ct-panel_settings-page.active .submit_current').toggleClass('active', true);
    $('[data-modal="modal_icons-library"] .ct-panel_close').click();

    setIcons();
})

$(document).on('click', '.ct-icon_library', function () {
    $('.ct-icon_library').toggleClass('ct-icon_library-active', false)
    $(this).toggleClass('ct-icon_library-active', true)
})

$(document).on('click', '.submit_current', function () {

    if ($(this).parents('.ct-panel_sub').length > 0) {
        if ($('.ct-panel_settings-page.active .ct-panel_examples-item.active').length > 0) {
            var ex = $('.ct-panel_sub .ct-panel_settings-page.active').attr('data-for')
            var d = $('.ct-panel_settings-page.active .ct-panel_examples-item.active').html();
            var dt = $('.ct-panel_settings-page.active .ct-panel_examples-item.active').text();
            var iw = $('.ct-examples_toggle[data-for="' + ex + '"]').prev('.ct-input_wrapper');
            if (iw.find('textarea').length > 0) {
                var ck = iw.find('.ck-editor').attr('aria-labelledby');
                const domEditableElement = document.querySelector('[aria-labelledby="' + ck + '"] .ck-editor__editable_inline');
                const editorInstance = domEditableElement.ckeditorInstance;
                editorInstance.setData(d);
            } else {
                iw.find('input[type="text"]').val(dt);
            }
            $('.ct-panel_sub').removeClass('active');
        }
    } else {
        var parwrap = $('.ct-panel_settings-page.active');
        var imwrap = parwrap.find('.ct-image_uploader-info');
        var problem = false;
        if (imwrap.length > 0) {
            $.each(imwrap, function (im, vm) {
                var inputup = $(vm).find('.ct-image_uploader-origin');
                var inputup_size = inputup.find('.ct-input').attr('data-count');
                var inputim = $(vm).find('li:not(.ct-image_uploader)').length;
                if (inputim < inputup_size) {
                    if (inputup.find('.ct-input').attr('name') != 'own_images[]' && inputup.find('.ct-input').attr('name') != 'new_own_images[]' && inputup.find('.ct-input').data('slider') != "1") {
                        problem = true;
                    }
                }
            })
        }

        $('.ct-error').removeClass('ct-error');

        var reqwrap = parwrap.find('.ct-required');
        if (reqwrap.length > 0) {
            $.each(reqwrap, function () {
                $(this).parents('.ct-input_wrapper').toggleClass('ct-error', $(this).val() == '')
            })
        }

        if (problem) {
            alert(constr_terms['ln-notify-photo-error'] + '!');
        } else if ($('.ct-error').length > 0) {
            // alert('');
        } else {
            $(this).removeClass('active');
            var par = $(this).parents('.ct-menu_wrapper');
            var inp = par.find('.ct-input_wrapper:not(.ct-switcher):not(.ct-ignore)');
            $.each(inp, function (k, v) {

                var ip = $(this).find('.ct-input:not(#own_align):not(#new_own_align)');

                var name = ip.prop('name');
                var nnm = name.split('[]')
                var pc = name.split('personal_color');
                if (pc.length > 1) {
                    var emp = $(this).find('.ct-empty').css('background-color');
                    if (emp === 'rgba(0, 0, 0, 0)' || emp === 'transparent') {
                        data_value[name.toUpperCase()] = '';
                    } else {
                        data_value[name.toUpperCase()] = ip.val();
                    }
                } else {
                    if ($.inArray(nnm[0].toUpperCase(), galleries) === -1 && $.inArray(nnm[0].toUpperCase(), gallery_items) === -1) {
                        var field = $(par).find('[name="' + name + '"]');
                        if (nnm.length > 1) {
                            var nm = name.split('[]').join('').toUpperCase();
                            data_value[nm] = [];
                            $.each(field, function (k, v) {
                                if ($(this).val() !== '') {
                                    data_value[nm].push($(this).val())
                                }
                            })
                        } else {
                            if (ip.attr('type') == 'file') {
                                var image = $('.ct-image_uploader-info[data-for="' + name.toUpperCase() + '"] .ct-image_preview:not(.ct-image_uploader)');
                                data_value[name.toUpperCase()] = image.attr('data-url');
                            } else {
                                data_value[name.toUpperCase()] = ip.val();
                            }
                        }
                    } else {
                        nm = name.split('[]').join('').toUpperCase();
                        data_value[nm] = [];
                        var images = $('.ct-image_uploader-info[data-for="' + nm + '"] .ct-image_preview:not(.ct-image_uploader)');

                        //если слайдер, пересобираем галерею
                        if ($('input[name*="' + nm.toLowerCase() + '"]').data('slider') == 1) {
                            var iframe = document.querySelector('iframe');
                            var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
                            var galleryItem = $(innerDoc).find('.slick-initialized').find('[data-sm-src*="' + nm.toUpperCase() + '_0"]');
                            var gallery = galleryItem.closest('.slick-initialized');
                            if (gallery.length) {
                                var slidesCount = gallery.slick('getSlick').slideCount;
                                var slideNum = 0;
                                //удаляем слайды кроме последнего
                                let c = 1;
                                while (c < slidesCount) {
                                    gallery.slick("slickRemove", 0);
                                    c++;
                                }

                                c = 1;

                                //перебираем все картинки по референсу последнего слайда добавляем слайды
                                var slideInner = gallery.find('.slick-slide').eq(0)[0].outerHTML;
                                var nmrep = nm.toUpperCase() + '_';
                                var regex = new RegExp(`(${nmrep})(\\d+)`);
                                while (c < images.length) {
                                    slideInner = slideInner.replace(regex, nmrep + slideNum);
                                    slideNum++;
                                    gallery.slick("slickAdd", slideInner);
                                    c++;
                                }

                                //пересоздаем последний слайд
                                gallery.slick("slickRemove", 0);
                                slideInner = slideInner.replace(regex, nmrep + slideNum);
                                gallery.slick("slickAdd", slideInner)
                            }
                        }

                        if (images.length > 0) {
                            $.each(images, function (k, v) {
                                data_value[nm].push($(this).attr('data-url'));
                            })
                        }
                    }
                }
            })

            //правки для опросов
            var aq = $('.ct-addquests_wrapper');
            inp = aq.find('.ct-input_wrapper:not(.ct-switcher):not(.ct-ignore)');

            $.each(inp, function (k, v) {
                var ip = $(this).find('.ct-input');
                var name = ip.prop('name');
                var nnm = name.split('[]')

                var field = $(aq).find('[name="' + name + '"]');
                if (nnm.length > 1) {
                    var nm = name.split('[]').join('').toUpperCase();
                    data_value[nm] = [];

                    $.each(field, function (k, v) {
                        if ($(this).val() !== '') {
                            data_value[nm].push($(this).val())
                        }
                    })
                } else {
                    data_value[name.toUpperCase()] = ip.val();
                }
            })
            saveTemp();
        }
    }
});
var tloaded = false;
$(iframe).on('load', function () {
    if ($(iframe).attr('src') != '' && typeof ($(iframe).attr('src')) != 'undefined' && !tloaded) {
        loadSections();
        loadColors();
        tloaded = true;
    }
})

$(function () {
    if (project != '') {
        console.log('global1');
        loadTemplateData()
    } else {
        if (d_groom != '' && d_bride != '' && d_email != '' && d_mdate != '') {
            console.log('global2');
            loadTemplateData()
        } else {
            console.log('global3');
            var splash_date = $('.ct-splash input[name="main_date"]')
            var cnt = splash_date.next('.ct-calcontainer')
            splash_date.Zebra_DatePicker({
                direction: 1,
                format: 'd.m.Y',
                show_clear_date: false,
                container: cnt,
                lang_clear_date: constr_terms["buttons_clean"],
                readonly_element: false,
                days_abbr: dweeks_short,
                months: tmonths,
                months_abbr: constr_terms['ln-months-short'],
                days: dweeks,
            });
            CheckConfirmChangeOperation();
        }
    }
})


$(document).on('click', '.ct-video_remove', function () {
    if (confirm(constr_terms['ln-video-remove'])) {
        var par = $(this).parents('.ct-input_wrapper');
        var video_type = (par.attr('id') == 'video_uploader' ? 0 : 1);
        var vid_name = $(this).parents('.ct-input_wrapper').find('[type="file"]').attr('name').split('_upload').join('');

        $.post(ajax_url, {action: 'remvideo', project: project, type: video_type}, function (e) {
            if (video_type == 0) {
                $('#secondPanel').toggleClass('active', false);
                ifresize();
                loadTemplateData();
            } else {
                par.find('.ct-video_remove').toggleClass('ct-hidden', true);
                par.find('.ct-video_uploader').toggleClass('ct-hidden', false);
            }
        });
    }
})

$(document).on('change', 'input[type="file"].ct-video_file', function (event) {
    var vid_name = $(this).attr('name').split('_upload').join('');
    var par = $(this).parents('.ct-input_wrapper');
    var video_type = par.attr('id') == 'video_uploader' ? 0 : 1;
    var that = $(this);

    if (that.attr('name') == 'own_video_upload') {
        video_type = 2; // personal #1
    }

    if (that.attr('name') == 'new_own_video_upload') {
        video_type = 3; // personal #2
    }
    var data = new FormData();

    var err = false;
    data.append('project', project);
    data.append('action', 'video');
    var maxSize = 30 * 1024 * 1024;
    $.each(that[0].files, function (i, file) {
        if (file.size > maxSize) {
            alert(constr_terms['ln-video-file-limit']);
            err = true;
        } else {
            data.append('video', file);
            data.append('type', video_type);
        }
    });
    if (!err) {
        $('body').toggleClass('ct-preloader', true)
        $('body').append('<div class="ct-preloader_row-wrapper"><div class="ct-preloader_row"></div><div class="ct-preloader_data"></div></div>')

        $.ajax({
            xhr: function () {
                var xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener("progress", function (evt) {
                    if (evt.lengthComputable) {
                        var percentComplete = evt.loaded / evt.total;
                        percentComplete = parseInt(percentComplete * 100);
                        $('.ct-preloader_row').css('width', 288 / 100 * percentComplete);
                        $('.ct-preloader_data').text(constr_terms['ln-video-uploading'] + ' ' + Math.ceil(percentComplete) + '%')
                        if (percentComplete >= 100) {
                            $('.ct-preloader_row').css('width', 288);
                            $('.ct-preloader_data').text(constr_terms['ln-video-upload-success'])
                        }
                    }
                }, false);
                return xhr;
            },
            type: 'POST',
            url: ajax_url,
            cache: false,
            contentType: false,
            processData: false,
            data: data,
            success: function (result) {
                $('.ct-preloader_row-wrapper').remove();
                $('body').toggleClass('ct-preloader', false);
                var r = $.parseJSON(result);
                if (r.error) {
                    alert(constr_terms['ln-notify-error'] + "\r\n" + r.error)
                } else {


                    par.find('.ct-video_remove').toggleClass('ct-hidden', false);
                    par.find('.ct-video_uploader').toggleClass('ct-hidden', true);
                    $('.ct-panel_settings-page.active .submit_current').toggleClass('active', true);

                    if (vid_name == 'head_video') {
                        $('.ct-video_uploader [name="' + vid_name + '"]').val(r.filePath)
                        $.each(iframe.contents().find('[data-sm-video]'), function () {
                            $(this).attr('src', r.filePath);
                            $(this).attr('poster', '');
                            $(this).parent().css('filter', 'none');
                            $(this).parents('video')[0].load();
                        });
                        $('.ct-panel_settings-page.active .submit_current').click();
                    }

                    if (vid_name == 'own_video' || vid_name == 'new_own_video') {
                        var vhold = vid_name.split('_video');
                        vhold = vhold[0].toUpperCase();
                        var v = vhold.replace('OWN', '');

                        $('[name="' + vhold.toLowerCase() + '_gallery_type"]').val(6)
                        $('[name="' + vid_name + '"]').val(r.filePath);

                        data_value[vid_name.toUpperCase()] = r.filePath;
                        data_value[vhold + '_GALLERY_TYPE'] = 6;
                        data_value[vhold + '_IMAGES'] = [];

                        $('[data-for="' + vhold + '_IMAGES"] .ct-image_cropper').remove();
                        iframe.contents().find('[data-type="' + ((v == '') ? '166' : '211') + '"] .sm-own_wrapper-img').remove();
                        setActiveOwnGalleryItem(6, true, v);
                    }
                    alert(constr_terms['ln-notify-upload-success']);

                }

            }
        })
    }
})