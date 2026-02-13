function loadData() {
    //$('body').toggleClass('ct-loader',true);


    $.post(ajax_url, {action: 'loadData', tpl: template_val.id, project: project}, function (data) {
        if (data !== '') {
            var d = $.parseJSON(data);
            $.getJSON(d['data_file'], function (data) {
                if (data && data !== '') {
                    data_value = data;
                    data_value['GROOM'] = d_groom;
                    data_value['BRIDE'] = d_bride;
                    data_value['MAIN_DATE'] = d_mdate;
                    loadTemplate();
                }
            })
        } else {
            alert(constr_terms['ln-notify-error']);
        }
    })
}

$(document).on('change', 'input[type="file"].ct-music_file', function () {
    $('body').toggleClass('ct-preloader', true)
    $('body').append('<div class="ct-preloader_row-wrapper"><div class="ct-preloader_row"></div><div class="ct-preloader_data"></div></div>')
    var data = new FormData();
    var that = $(this);
    data.append('action', 'music');
    data.append('project', project);
    $.each(that[0].files, function (i, file) {
        data.append('music', file);
    });
    $.ajax({
        xhr: function () {
            var xhr = new window.XMLHttpRequest();
            xhr.upload.addEventListener("progress", function (evt) {
                if (evt.lengthComputable) {
                    var percentComplete = evt.loaded / evt.total;
                    percentComplete = parseInt(percentComplete * 100);
                    $('.ct-preloader_row').css('width', 288 / 100 * percentComplete);
                    $('.ct-preloader_data').text(constr_terms['ln-music-uploading'] + ' ' + Math.ceil(percentComplete) + '%')
                    if (percentComplete >= 100) {
                        $('.ct-preloader_row').css('width', 288);
                        $('.ct-preloader_data').text(constr_terms['ln-music-upload-success'])
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
                alert(constr_terms['ln-notify-upload-success']);
                $('.ct-music_remove').toggleClass('ct-hidden', false);
                $('.ct-music_uploader').toggleClass('ct-hidden', true);
                $('.ct-music_info').toggleClass('ct-hidden', false);
                $('.ct-music_helper').toggleClass('ct-hidden', true);
                $('.ct-music_info b').text(r.trackName);

            }
        }
    })
})

$('.ct-music_remove').click(function () {
    if (confirm(constr_terms['ln-notify-music-remove'])) {
        $.post(ajax_url, {action: 'remusic', project: project}, function (data) {
            if (data == '1') {
                alert(constr_terms['ln-notify-music-removed'])
                $('.ct-music_remove').toggleClass('ct-hidden', true);
                $('.ct-music_uploader').toggleClass('ct-hidden', false);
                $('.ct-music_info').toggleClass('ct-hidden', true);
                $('.ct-music_helper').toggleClass('ct-hidden', false);
            } else {
                alert(constr_terms['ln-notify-unknown-error'])
            }
        })
    }
})

$(document).on('cancel', 'input[type="file"]:not(.ct-music_file):not(.ct-video_file)', function () {
    if ($('.waitforupload').length > 0) {
        $(this).parents('.ct-image_uploader').replaceWith($('.tmp-photo > li'));
        $('body').removeClass('waitforupload');
        $('.tmp-photo').remove();
    }
})

function newInt() {

    iframe.contents().find('[data-fancybox]:not(#sm-bt):not(.sm-button)').attr('href', 'javascript:void(0)').unbind('click').removeAttr('data-fancybox').removeAttr('data-sm-href');
    iframe.contents().find('img[data-sm-src]').toggleClass('ct-photo_editor', true).click(function () {
        console.log('photo clicked');
        var sc = $(this).attr('data-sm-src');
        var sc1 = sc.slice(0, -2);

        if ($.inArray(sc, image_fields) != -1) {
            var u = sc;
        } else if ($.inArray(sc1, gallery_items) != -1) {
            var sc2 = sc.substring(sc.length - 1);
            var p = $('.ct-image_uploader-info[data-for="' + sc1 + '"]');
            var pt = p.find('.ct-image_preview[data-photos-k="' + sc2 + '"]');
            var iu = p.find('.ct-image_uploader-origin').clone()
            u = sc1;
            iu.find('input').removeAttr('multiple')
            pt.replaceWith(iu.removeClass('ct-image_uploader-origin').removeClass('ct-hidden'));
            $('body').toggleClass('waitforupload').append('<div class="tmp-photo" style="display:none"></div>');
            $('.tmp-photo').append(pt.clone());
        }

        $('#ct-uploader_' + u).click();
    })


    iframe.contents().find('[data-sm-text]').click(function () {
        if ($(this).parents('.sm-edit').length > 0) {
            var sect = $(this).parents('.sm-edit').attr('data-type');
            console.log('sect:' + sect)
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
    })

    // iframe.contents().find('.ct-photo_editor').wrap('<span class="ct-photo_editor-wrapper"></span>');
}

function closeMain() {
    $('#mainPanel').toggleClass('active', false);
    $('#mainPanel .ct-panel_settings-page').toggleClass('active', false);
}

function saveSettings() {
    var col = $('.ct-colors_switcher li.active').attr('data-style');
    var atype = $('#anim_type .ct-input_select-current').attr('data-id');
    var aspeed = $('#anim_speed .ct-input_select-current').attr('data-id');
    var hfont = $('#hfont .ct-input_select-current').attr('data-id');
    var tfont = $('#tfont .ct-input_select-current').attr('data-id');
    presaveTpl(template_val.id, col, atype, aspeed, hfont, tfont);
}

function presaveTpl(tpl, col, atype, aspeed, hfont, tfont) {
    if (tpl != template_val.id) {
        hfont = 0;
        tfont = 0;
    }

    iframe.contents().find('body').removeClass().toggleClass('sm-loader', true);

    $.post(ajax_url, {
        action: 'presavetpl',
        tpl: tpl,
        color: col,
        atype: atype,
        aspeed: aspeed,
        hfont: hfont,
        tfont: tfont,
        project: project
    }, function () {
        iframe.contents().find('body').removeClass().toggleClass('sm-color' + col, true);

        if (typeof setPrice != 'undefined') {
            loadTemplateData();
        }

        if ($(window).innerWidth() <= 768) {
            $('.ct-mob-menu').toggleClass('active', false);
            closeMain();
        }
    })
}

$(document).on('change', '[name="contact_type"]', function () {
    $('.ct-error').removeClass('ct-error');
    $('[name="contact_link"]').parents('.ct-input_wrapper').toggleClass('ct-hidden', $(this).val() == '5')
    $('[name="contact_link"]').toggleClass('ct-required', $(this).val() != '5')
    if ($(this).val() == '5' || data_value['CONTACTS_LINK'].type != $(this).val()) {
        $('[name="contact_link"]').val('');
    }
    $('[name="contact_link"]').attr('placeholder', (($(this).val() == '2') ? '+77777777777' : 'https://t.me/nickname'));
    $('[name="contact_link"]').toggleClass('ct-phone_check', ($(this).val() == '2'));
})

function loadTemplate() {
    if ($.isArray(data_value['LOCATION_TIMING_1'])) //странная заплатка
    {
        data_value['LOCATION_TIMING'] = []
        data_value['LOCATION_TIMING_0'] = data_value['LOCATION_TIMING_1'][0]
        data_value['LOCATION_TIMING_1'] = data_value['LOCATION_TIMING_1'][1]
    }

    $.each(data_value, function (ik, iv) {

        if (ik === 'CONTACTS_LINK') {
            $('#secondPanel [name="contact_link"]').val(iv.value);
            $('#secondPanel [name="contact_type"]').val(iv.type).trigger('change');

            var link = 'tel:' + iv.value;
            if (iv.type == '2' && iv.value.indexOf('chat.whatsapp') > -1) {
                link = iv.value;
            } else {
                switch (Number(iv.type)) {
                    case 2:
                        link = 'https://wa.me/' + iv.value;
                        break;
                    case 3:
                        link = 'https://t.me/' + iv.value;
                        break;
                    case 4:
                        link = 'mailto:' + iv.value;
                        break;
                    case 5:
                        link = '';
                        break;
                }
            }

            iframe.contents().find('[data-sm-contact-mes]').attr('href', link.replace(/\s/g, ''));
        }

        if (ik === 'DRESSCODE_COLORS' || ik === 'DRESSCODE_COLORS_GUYS') {
            var va = '';
            var col_par = $('[name="dresscode_colors[]"]').parents('.ct-colors-wrapper');
            var colcount = iv.length;
            $.each(iv, function (k, v) {
                var kk = col_par.find('.ct-color-wrapper')[k];
                $(kk).find('input').attr('value', v);
                if (k < colcount) {
                    va += '<div class="sm_colors"><div style="background: ' + v + '"></div></div>';
                }
                $(kk).find('span.ct-color').css('background-color', v);
                if (k < colcount - 1) {
                    $(kk).after($(kk).clone());
                }
            })

            // col_par.find('.ct-color-add').toggle($('.ct-color-wrapper').length < colcount);
            iv = va;
        }

        if (ik === 'ANKETA_DRINKS') {
            var drinks = iv;

            iframe.contents().find('div[data-sm-anketa] > *:not(.ct-alcotpl)').remove();

            var tpl = '';
            var dr = '';
            if (typeof template_val.type_id == 'undefined' || template_val.type_id == '1' || template_val.type_id == '5' || template_val.type_id == '2') {
                $('[name="anketa_drinks"]').parents('.ct-input_wrapper').before('<div class="ct-panel_header"><div class="ct-flex ct-flex-space_between ct-flex-align-center"><div class="ct-title">' + constr_terms['ln-questionnaire-companion'] + '</div><div class="ct-input_wrapper ct-switcher" ><input type="checkbox" id="switcher-88" data-target="sput" checked><label for="switcher-88"></label></div></div></div><div class="ct-panel_header"><div class="ct-flex ct-flex-space_between ct-flex-align-center"><div class="ct-title">' + constr_terms['ln-questionnaire-survey'] + ' №1</div><div class="ct-input_wrapper ct-switcher" ><input type="checkbox" id="switcher-2" data-target="alco" checked><label for="switcher-2"></label></div></div></div><div id="alco" class="ct-hidden_wrapper active"><div class="ct-input-dynamic_multiplier">' + constr_terms['ln-questionnaire-add-drink'] + '</div></div>');
            } else if (template_val.type_id == '3') {
                $('[name="anketa_drinks"]').parents('.ct-input_wrapper').before('<div class="ct-panel_header"><div class="ct-flex ct-flex-space_between ct-flex-align-center" id="quest_header"><div class="ct-title">' + constr_terms['ln-questionnaire-survey'] + ' №1</div><div class="ct-input_wrapper ct-switcher" ><input type="checkbox" id="switcher-2" data-target="alco" checked><label for="switcher-2"></label></div></div></div><div id="alco" class="ct-hidden_wrapper active"><div class="ct-input-dynamic_multiplier ct-hidden">' + constr_terms['ln-questionnaire-add-choice'] + '</div></div><div class="ct-panel_header"><div class="ct-flex ct-flex-space_between ct-flex-align-center"><div class="ct-title">' + constr_terms['ln-questionnaire-age'] + '</div><div class="ct-input_wrapper ct-switcher" ><input type="checkbox" id="switcher-88" data-target="sput" checked><label for="switcher-88"></label></div></div></div>');
                var q2 = $('[name="anketa_drinks_question"]').parents('.ct-input_wrapper')
                $('#alco').prepend(q2);
            }

            if (drinks.length > 0) {
                $.each(drinks, function (k, v) {
                    var smanketa = iframe.contents().find('div[data-sm-anketa]');
                    if (smanketa.length > 0) {
                        $.each(smanketa, function (ka, va) {
                            var tpl = $(this).find('.ct-alcotpl').clone();
                            tpl.removeClass('ct-alcotpl');
                            if (tpl.attr('tagName') === 'label') {
                                $(this).attr("for", 'alco' + (k + 1));
                            } else {
                                tpl.find('label').attr("for", 'alco' + (k + 1) + ka);
                            }

                            tpl.find('[data-sm-alcoitem]').text(v);
                            tpl.find('input').attr("id", 'alco' + (k + 1) + ka).attr("value", (k + 1));
                            $(this).append(tpl);
                        })

                    }

                    if (typeof template_val.type_id == 'undefined' || template_val.type_id == '1' || template_val.type_id == '5') {
                        dr += '<div class="ct-input_wrapper ct-input-dynamic"><div class="ct-input_wrapper-item"><label class="ct-input_label">' + constr_terms['ln-questionnaire-drink'] + ' <span>' + (k + 1) + '</span></label><input value="' + v + '" type="text" class="ct-input" placeholder="' + constr_terms['ln-questionnaire-drink-holder'] + '" name="anketa_drinks[]"></div><div class="ct-input_remover"></div></div>';
                    } else {
                        dr += '<div class="ct-input_wrapper ct-input-dynamic"><div class="ct-input_wrapper-item"><label class="ct-input_label">' + constr_terms['ln-questionnaire-answer'] + ' <span>' + (k + 1) + '</span></label><input value="' + v + '" type="text" class="ct-input" placeholder="' + constr_terms['ln-questionnaire-answer'] + '" name="anketa_drinks[]"></div><div class="ct-input_remover"></div></div>';
                    }

                })

            } else {
                dr = '<div class="ct-input_wrapper ct-input-dynamic"><div class="ct-input_wrapper-item"><label class="ct-input_label">' + constr_terms['ln-questionnaire-drink'] + ' <span>1</span></label><input type="text" class="ct-input" placeholder="' + constr_terms['ln-questionnaire-drink-holder'] + '"></div><div class="ct-input_remover"></div></div>';
            }
            $('[name="anketa_drinks"]').parents('.ct-input_wrapper').remove();
            $('#alco .ct-input-dynamic_multiplier').before(dr);
        }

        if ($.inArray(ik, image_fields) >= 0) {
            var ikphoto = '';
            var iksphoto = '';
            var ikinp = $('#secondPanel [name="' + ik.toLowerCase() + '"]:not(#ct-uploader_' + ik + ')').clone();
            ikinp.attr('id', 'ct-uploader_' + ik);

            iksphoto = '<li class="ct-image_preview" data-photos="tmp" data-photos-k="' + ik + '" style="background-image: url(/sitemaker' + iv + ')" data-url="' + iv + '"><i></i></li>';

            iksphoto += '<li class="ct-image_preview ct-image_uploader ct-image_uploader-single"><img src="/sitemaker/images/constr/ct-image-plus.svg">' + constr_terms['ln-image-replace'] + '<div class="ct-image_upload-status"><div></div></div></li>'
            iv = '/sitemaker' + iv;

            $('#secondPanel [name="' + ik.toLowerCase() + '"]').before('<div class="ct-image_uploader-info" data-for="' + ik + '" >' + iksphoto + '</div>');

            $('.ct-image_uploader-info[data-for="' + ik + '"] .ct-image_uploader').append(ikinp);
            $('#secondPanel [name="' + ik.toLowerCase() + '"]:not(#ct-uploader_' + ik + ')').remove();
        }

        if ($.inArray(ik, galleries) >= 0) { //Картинки
            var photos = '';
            var sphotos = '';
            var inph = $('#secondPanel [name="' + ik.toLowerCase() + '[]"]:not(#ct-uploader_' + ik + ')').clone();
            inph.attr('id', 'ct-uploader_' + ik);
            $.each(iv, function (ko, vo) {
                photos += '<img src="/sitemaker' + vo + '" data-fancybox="' + ik + '">';
                sphotos += '<li class="ct-image_preview" data-photos="tmp" data-photos-k="' + ko + '" style="background-image: url(/sitemaker' + vo + ')" data-url="' + vo + '"><i></i><span></span></li>';
            })

            sphotos += '<li class="ct-image_preview ct-image_uploader ct-image_uploader-origin"><img src="/sitemaker/images/constr/ct-image-plus.svg">' + constr_terms['ln-image-add'] + '<div class="ct-image_upload-status"><div></div></div></li>'

            iv = photos

            $('#secondPanel [name="' + ik.toLowerCase() + '[]"]').before('<div class="ct-image_uploader-info" data-for="' + ik + '" >' + sphotos + '</div>');
            $('.ct-image_uploader-info[data-for="' + ik + '"] .ct-image_uploader').append(inph);
            $('#secondPanel [name="' + ik.toLowerCase() + '[]"]:not(#ct-uploader_' + ik + ')').remove();
        }

        if ($.inArray(ik, gallery_items) >= 0) {photos = '';
            sphotos = '';
            inph = $('#secondPanel [name="' + ik.toLowerCase() + '[]"]:not(#ct-uploader_' + ik + ')').clone();
            inph.attr('id', 'ct-uploader_' + ik);
            var galleryItemReference = 0;
            if (ik.toUpperCase().indexOf('DRESSCODE') !== -1) {
                //пересобираем галерею дресс-кода если находим картинки и ни у одного родительского элемента не стоит класс sm-no-slider
                //на этом этапе находим референс слайда и удаляем все кроме первого
                if (iframe.contents().find('[data-sm-href="' + ik.toUpperCase() + '_' + 0 + '"]').length && !(iframe.contents().find('[data-sm-href="' + ik.toUpperCase() + '_' + 0 + '"]').closest('.sm-no-slider').length)) {
                    galleryItemReference = iframe.contents().find('[data-sm-href="' + ik.toUpperCase() + '_' + 0 + '"]')
                    if (galleryItemReference.closest('.js-sm-code-sliderOn').length || galleryItemReference.closest('.js-sm-code-sliderTw').length) {
                        galleryItemReference = galleryItemReference.closest('.sm-code__slider-al');
                        iframe.contents().find('[data-sm-href^="' + ik.toUpperCase() + '_"][data-sm-href!="' + ik.toUpperCase() + '_' + 0 + '"]').closest('.sm-code__slider-al').remove();
                    } else {
                        iframe.contents().find('[data-sm-href^="' + ik.toUpperCase() + '_"][data-sm-href!="' + ik.toUpperCase() + '_' + 0 + '"]').remove();
                    }
                }
            }
            // console.log('iv = '+iv.length+'; ik = '+ik);
            // console.log(iv);


            if(iv.length > 0) {
                $.each(iv, function (ko, vo) {
                    if (ik.toUpperCase().indexOf('DRESSCODE') !== -1) {
                        //если определен референс, добавляем остальные слайды
                        if (!(iframe.contents().find('[data-sm-href="' + ik.toUpperCase() + '_' + ko + '"]').length) && galleryItemReference != 0) {
                            if (galleryItemReference.hasClass('sm-code__slider-al')) {
                                galleryItemReference.clone().appendTo(galleryItemReference.parent()).children('a').attr('data-sm-href', ik.toUpperCase() + '_' + ko).children('[data-sm-src="' + ik.toUpperCase() + '_' + 0 + '"]').attr('data-sm-src', ik.toUpperCase() + '_' + ko);
                            } else {
                                galleryItemReference.clone().appendTo(galleryItemReference.parent()).attr('data-sm-href', ik.toUpperCase() + '_' + ko).find('[data-sm-src="' + ik.toUpperCase() + '_' + 0 + '"]').attr('data-sm-src', ik.toUpperCase() + '_' + ko);
                            }
                            galleryItemReference.closest('.js-sm-code-sliderOn').css('display','block');
                            galleryItemReference.closest('.js-sm-code-sliderTw').css('display','block');
                            galleryItemReference.closest('.gallery-slider-container').css('opacity','1');
                        }
                    }


                    sphotos += '<li class="ct-image_preview" data-photos="tmp" data-photos-k="' + ko + '" style="background-image: url(/sitemaker' + vo + ')" data-url="' + vo + '"><i></i><span></span></li>';
                    iframe.contents().find('[data-sm-src="' + ik.toUpperCase() + '_' + ko + '"]').prop('src', '/sitemaker' + vo);
                    iframe.contents().find('[data-sm-href="' + ik.toUpperCase() + '_' + ko + '"]').prop('href', '/sitemaker' + vo);
                })

                if(galleryItemReference==0) {
                    if(iframe.contents().find('[data-sm-src="' + ik.toUpperCase() + '_' + 0 + '"]').length) {
                        // console.log('reinit slider');
                        galleryItemReference = iframe.contents().find('[data-sm-src="' + ik.toUpperCase() + '_' + 0 + '"]')
                        galleryItemReference.closest('.js-sm-code-sliderOn').css('display','block');
                        galleryItemReference.closest('.js-sm-code-sliderTw').css('display','block');
                        galleryItemReference.closest('.gallery-slider-container').css('opacity','1');
                    }
                }


            }else{
                // console.log('gallery start');
                // console.log(galleryItemReference.length);
                // console.log(galleryItemReference.closest('.js-sm-code-sliderOn').length);
                // console.log('gallery end');
                if (iframe.contents().find('.js-sm-code-sliderOn').length || iframe.contents().find('.js-sm-code-sliderTw').length) {
                    galleryItemReference = iframe.contents().find('[data-sm-src="' + ik.toUpperCase() + '_' + 0 + '"]')
                    // console.log('sliders-1-found');
                    galleryItemReference.closest('.js-sm-code-sliderOn').css('display','none');
                    galleryItemReference.closest('.js-sm-code-sliderTw').css('display','none');
                    galleryItemReference.closest('.gallery-slider-container').css('opacity','0');
                }
            }


            sphotos += '<li class="ct-image_preview ct-image_uploader ct-image_uploader-origin"><img src="/sitemaker/images/constr/ct-image-plus.svg">' + constr_terms['ln-image-add'] + '<div class="ct-image_upload-status"><div></div></div></li>'

            $('#secondPanel [name="' + ik.toLowerCase() + '[]"]').before('<div class="ct-image_uploader-info" data-for="' + ik + '" >' + sphotos + '</div>');
            $('.ct-image_uploader-info[data-for="' + ik + '"] .ct-image_uploader').append(inph);
            $('#secondPanel [name="' + ik.toLowerCase() + '[]"]:not(#ct-uploader_' + ik + ')').remove();

        } else if ($.inArray(ik, text_items) >= 0) {
            $.each(iv, function (ko, vo) {
                iframe.contents().find('[data-sm-text="' + ik.toUpperCase() + '_' + ko + '"]').html(parseLinks(vo));
            })

            if ((ik === 'TIMING_1' || ik === 'TIMING_2' || ik === 'TIMING_3' || ik === 'TIMING_4' || ik === 'LOCATION_TIMING') && !data_value[ik + '_0']) {

                $('#secondPanel [name="' + ik.toLowerCase() + '_0"]').val(iv[0]);
                $('#secondPanel [name="' + ik.toLowerCase() + '_1"]').val(iv[1]);
            }

            if (ik === 'TIMING_DESC') {
                var p = $('#secondPanel [name="' + ik.toLowerCase() + '"]').parents('.ct-input_wrapper');
                for (var c = 0; c < 3; c++) {
                    var w = p.clone();
                    var nn = ik.toLowerCase() + '_' + c;
                    w.find('.ct-input_label').html(constr_terms["ln-timing-description-label"] + ' ' + (c + 1))
                    w.find('input').attr('name', nn).val(iv[c]);
                    p.before(w);
                }
                p.remove();
            }


            if (ik === 'WISH_TEXT_ITEMS') {
                var p = $('#secondPanel [name="' + ik.toLowerCase() + '"]').parents('.ct-input_wrapper');
                var e = p.next('.ct-examples_toggle');
                var a = '';
                if ($('.ct-ai_button[data-for="' + ik.toLowerCase() + '"]').length > 0) {
                    a = e.next('.ct-ai_button');
                }
                for (var c = 0; c < 3; c++) {
                    var w = p.clone();
                    var ex = e.clone();

                    var nn = ik.toLowerCase() + '_' + c;
                    ex.attr('data-for', nn);

                    w.find('.ct-input_label').html(constr_terms["ln-wishes-wish"] + ' ' + (c + 1))
                    w.find('textarea').attr('name', nn).val(iv[c]);
                    p.before(w);
                    p.before(ex);
                    if (a != '') {
                        var ai = a.clone();
                        ai.attr('data-for', nn);
                        ai.attr('data-part', c + 1);
                        p.before(ai);
                    }
                }
                e.remove();
                p.remove();
                if (a != '') {
                    a.remove();
                }
            }
        }

        $.each($('.ct-image_uploader-info'), function () {
            var p = $(this);
            checkUploader(p)
        })

        var iv1 = '';
        var iv2 = '';
        var ivC = iv;

        $('#secondPanel [name="' + ik.toLowerCase() + '"]:not([type="file"])').val(iv);

        if (iframe.contents().find('[data-sm-text="' + ik.toUpperCase() + '"]').length > 0) {
            ivC = iv.replace(/<\/?[^>]+(>|$)/g, "");
            iv = parseLinks(iv);
        }

        iframe.contents().find('[data-sm-text="' + ik.toUpperCase() + '"]').html(iv).attr('title', ivC);
        iframe.contents().find('[data-sm-date="' + ik.toUpperCase() + '"]').attr('data-date', iv).attr('title', ivC);

        if (ik == 'GROOM_TEL' || ik == 'BRIDE_TEL') {
            iv1 = phonePrepareView(iv);
            iv2 = phonePrepare(iv);
            if (iv != '') {
                iframe.contents().find('[data-sm-tel="' + ik.toUpperCase() + '"]').prop('href', 'tel:' + iv2).text('+' + iv1.replace('+', ''));
            }

            iframe.contents().find('[data-sm-tel="' + ik.toUpperCase() + '"]').toggleClass('sm-hidden', iv == '');
        }

        iframe.contents().find('[data-sm-href="' + ik.toUpperCase() + '"]').prop('href', iv).attr('target', '_blank');
        iframe.contents().find('[data-sm-src="' + ik.toUpperCase() + '"]').prop('src', iv);

    })

    iframe.contents().find('[data-sm-text="TIMING_1_1"]').parent().toggle(data_value['TIMING_1_1'] != '');

    var timing_wrappers = ['.sm-program__body li', '.sm-timing__item', '.sm-timing-item', '.sm-program__wrapper-item', '.sm-time__list-row', '.sm_times', '.sm-program__list-item', '.sm-program__cell'];

    $.each(timing_wrappers, function (k, v) {
        if (iframe.contents().find(v).length > 0) {
            $.each(iframe.contents().find(v), function (k, v) {
                $(this).toggleClass('sm-hidden', data_value['TIMING_' + (k + 1) + '_1'] == '' || data_value['TIMING_' + (k + 1) + '_0'] == '');
            })
        }
    })

    if (iframe.contents().find('[data-sm-text="ANKETA_DRINKS_QUESTION"]').length > 0 && iframe.contents().find('[data-sm-text="ANKETA_DRINKS_QUESTION"]').val() == '' && typeof (data_value['ANKETA_DRINKS_QUESTION']) == 'undefined') {
        $('#secondPanel [name="anketa_drinks_question"]').val(constr_terms["ln-questionnaire-preferences"])
        iframe.contents().find('[data-sm-text="ANKETA_DRINKS_QUESTION"]').text(constr_terms["ln-questionnaire-preferences"]);
    }

    var nd = d_mdate.split('.');
    if (nd.length >= 3) {
        var pyear = nd[2];
        var pmonth = Number(nd[1]);
        var pday = nd[0];
    }

    var bd = d_bdate.split('.');
    if (bd.length >= 3) {
        var byear = bd[2];
        var bmonth = Number(bd[1]);
        var bday = bd[0];
    }

    var pweek = new Date(pyear, pmonth - 1, pday).getDay()
    var emonth = new Date(pyear, pmonth - 1, pday).toLocaleString('default', {month: 'long'});

    var tomorrow = new Date(new Date(pyear, pmonth - 1, pday).getTime() + 24 * 60 * 60 * 1000);
    var yesterday = new Date(new Date(pyear, pmonth - 1, pday).getTime() - 24 * 60 * 60 * 1000);

    var tom_week = tomorrow.getDay();
    var tom_month = tomorrow.getMonth() + 1;
    var tom_year = tomorrow.getFullYear();
    var tom_day = tomorrow.getDate();

    var yes_week = yesterday.getDay();
    var yes_month = yesterday.getMonth() + 1;
    var yes_year = yesterday.getFullYear();
    var yes_day = yesterday.getDate();

    if (yes_day < 10) {
        yes_day = '0' + yes_day;
    }

    if (tom_day < 10) {
        tom_day = '0' + tom_day;
    }

    if (yes_month < 10) {
        yes_month = '0' + yes_month;
    }

    if (tom_month < 10) {
        tom_month = '0' + tom_month;
    }

    iframe.contents().find('[data-sm-bmonth-rod]').html(tmonthsr[bmonth - 1]);
    iframe.contents().find('[data-sm-tmonth-rod]').html(tmonthsr[pmonth - 1]);
    iframe.contents().find('[data-sm-tmonth]').html(tmonths[pmonth - 1]);
    iframe.contents().find('[data-sm-wday]').html(dweeks[pweek]);
    iframe.contents().find('[data-sm-fyear]').html(pyear);

    iframe.contents().find('[data-sm-day_tom]').html(tom_day);
    iframe.contents().find('[data-sm-tmonth_tom]').html(tmonths[tom_month - 1]);
    iframe.contents().find('[data-sm-wday_tom]').html(dweeks[tom_week]);

    iframe.contents().find('[data-sm-day_yes]').html(yes_day);
    iframe.contents().find('[data-sm-tmonth_yes]').html(tmonths[yes_month - 1]);
    iframe.contents().find('[data-sm-wday_yes]').html(dweeks[yes_week]);

    if (pmonth < 10) {
        pmonth = '0' + pmonth;
    }
    if (pyear > 2000) {
        pyear = pyear.substring(2, 4);
    }

    if (bmonth < 10) {
        bmonth = '0' + bmonth;
    }
    var bfyear = byear;
    if (byear > 2000) {
        byear = byear.substring(2, 4);
    } else {
        bfyear = byear + 2000;
    }



    iframe.contents().find('[data-sm-year]').html(pyear);
    iframe.contents().find('[data-sm-day]').html(pday);
    iframe.contents().find('[data-sm-lnmonth]').html(tmonths_ln[pmonth - 1]);
    iframe.contents().find('[data-sm-demonth]').html(tmonths_de[pmonth - 1]);
    iframe.contents().find('[data-sm-emonth]').html(emonth);
    iframe.contents().find('[data-sm-month]').html(pmonth);
    iframe.contents().find('[data-sm-bfyear]').html(bfyear);
    iframe.contents().find('[data-sm-byear]').html(byear);
    iframe.contents().find('[data-sm-bday]').html(bday);
    iframe.contents().find('[data-sm-bmonth]').html(bmonth);

    if (iframe.contents().find('[data-sm-text="DRESSCODE_COLORS"]').length > 1) {
        var dc = iframe.contents().find('[data-sm-text="DRESSCODE_COLORS"]');
        var sc = $(dc[0]).find('.sm_colors').clone();
        var pc = (sc.length / dc.length);
        $.each(dc, function (k, v) {
            $(this).html('');
            for (var c = 0; c < pc; c++) {
                $(this).append(sc[c + k * pc]);
            }
        })
    }

    iframe[0].contentWindow.initAll();

    iframe.contents().find('[data-sm-anketa-toggle]').toggleClass('sm-hidden', d_alco != '1');

    $('input[data-target="alco"]').attr('checked', (d_alco == '1')).trigger('change');
    $('input[data-target="sput"]').attr('checked', (d_sput == '1')).trigger('change');
    $('input[data-target="palette"]').attr('checked', (d_palette == '1')).trigger('change');
    iframe.contents().find('[data-sm-contact-bride]').toggleClass('sm-hidden', data_value['BRIDE_TEL'] == '');
    iframe.contents().find('[data-sm-contact-groom]').toggleClass('sm-hidden', data_value['GROOM_TEL'] == '');
    iframe.contents().find('[data-sm-href="LOCATION_MAP"]').toggleClass('sm-hidden', data_value['LOCATION_MAP'] == '');
    iframe.contents().find('[data-sm-contact-mes]').attr('target', '_blank').toggleClass('sm-hidden', (!data_value['CONTACTS_LINK'] || data_value['CONTACTS_LINK']['value'] == ''));

    iframe.contents().find('.sm-contact_soc:first-child').toggleClass('sm-hidden', (!data_value['CONTACTS_LINK'] || data_value['CONTACTS_LINK']['type'] != '3'));
    iframe.contents().find('.sm-contact_soc:last-child').toggleClass('sm-hidden', (!data_value['CONTACTS_LINK'] || data_value['CONTACTS_LINK']['type'] != '2'));

    iframe.contents().find('[data-sm-href="WISH_WISHLIST"]').toggleClass('sm-hidden', (!data_value['WISH_WISHLIST'] || data_value['WISH_WISHLIST'] == ''));

    if (iframe.contents().find('[data-sm-text="MAIN_TIMING"]').length > 0) {
        if (typeof (data_value['MAIN_TIMING']) == 'undefined') {
            iframe.contents().find('[data-sm-text="MAIN_TIMING"]').parent().toggleClass('sm-hidden', data_value['TIMING_1_0'] == '');
            iframe.contents().find('.sm-date-slash').toggleClass('sm-hidden', data_value['TIMING_1_0'] == '');
            iframe.contents().find('[data-sm-text="MAIN_TIMING"]').html(data_value['TIMING_1_0']);
            iframe.contents().find('.timing-separator').addClass('sm-hidden');
        } else {
            iframe.contents().find('[data-sm-text="MAIN_TIMING"]').toggleClass('sm-hidden', data_value['MAIN_TIMING'] == '');
            if (iframe.contents().find('.timing-separator').length > 0) {
                iframe.contents().find('.timing-separator').toggleClass('sm-hidden', data_value['MAIN_TIMING'] == '');
            }
            iframe.contents().find('.sm-date-slash').toggleClass('sm-hidden', data_value['MAIN_TIMING'] == '');
        }
    }

    if (iframe.contents().find('[data-sm-text="LOCATION_TIMING_0"]').length > 0) {
        if (typeof (data_value['LOCATION_TIMING']) == 'undefined' && typeof (data_value['LOCATION_TIMING_0']) == 'undefined') {
            iframe.contents().find('[data-sm-text="LOCATION_TIMING_0"]').parent().toggleClass('sm-hidden', data_value['TIMING_1_0'] == '');
            iframe.contents().find('[data-sm-text="LOCATION_TIMING_0"]').html(data_value['TIMING_1_0'])

            iframe.contents().find('[data-sm-text="LOCATION_TIMING_1"]').parent().toggleClass('sm-hidden', data_value['TIMING_1_1'] == '');
            iframe.contents().find('[data-sm-text="LOCATION_TIMING_1"]').html(data_value['TIMING_1_1'])
        } else {
            iframe.contents().find('[data-sm-text="LOCATION_TIMING_0"]').parent().toggleClass('sm-hidden', data_value['LOCATION_TIMING_0'] == '');
            iframe.contents().find('[data-sm-text="LOCATION_TIMING_0"]').html(data_value['LOCATION_TIMING_0'])

            iframe.contents().find('[data-sm-text="LOCATION_TIMING_1"]').parent().toggleClass('sm-hidden', data_value['LOCATION_TIMING_1'] == '');
            iframe.contents().find('[data-sm-text="LOCATION_TIMING_1"]').html(data_value['LOCATION_TIMING_1'])
        }
    }

    window.document.addEventListener('scrollPos', handleEvent, false);
    setTimeout(function () {
        $('.ct-tpl_selector-item[data-tpl="' + template_val.id + '"]').toggleClass('active', true);
        $($('.ct-tpl_selector-item.active .ct-tpl_selector-item_footer-colors li')[(template_val.color - 1)]).toggleClass('active', true);
        if (typeof setPrice !== "undefined") {
            setPrice()
        }
        setFontSize();
        autoResizeText();
    }, 500)


    $.each($('input[name="main_date"]'), function () {
        var that = $(this);
        var cnt = $(this).next('.ct-calcontainer')
        that.Zebra_DatePicker({
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
            onChange: function () {
                that.trigger('input')
            }
        });
    })

    $('#birth_send').click(function () {

        var bd = $('[name="birth_date"]').val();
        if (bd == '' || bd == '01.01.1970' || $('[name="birth_date"]').hasClass('not-clicked')) {
            alert(constr_terms["ln-birthday-date"])
        } else {
            var mda = $('[data-modal="modal_present"]');
            $.post(ajax_url, {action: 'birth_date', bd: bd}, function (data) {
                if (data == '0') {
                    mda.find('.ct-modal_content-step').removeClass('active');
                    mda.find('.ct-modal_content-step[data-step="2"]').toggleClass('active', true);
                    mda.attr('data-step', 2);
                } else {
                    alert(constr_terms["ln-notify-unknown-error"]);
                }
            })
        }
    })



    $.each($('input[name="birth_date"]'), function () {
        var that = $(this);
        var cnt = $(this).prev('.ct-calcontainer')

        that.Zebra_DatePicker({
            direction: -1,
            format: 'd.m.Y',
            show_clear_date: false,
            container: cnt,
            default_position: 'icon_bottom_left',
            lang_clear_date: constr_terms["buttons_clean"],
            readonly_element: false,
            days_abbr: dweeks_short,
            months: tmonths,
            months_abbr: constr_terms['ln-months-short'],
            days: dweeks,
            onChange: function () {
                that.trigger('input')
                that.removeClass('not-clicked');
            }
        });
    })


    if (data_value['DRESSCODE_GIRLS_GALLERY_ITEMS']) {
        if (iframe.contents().find('[data-sm-src="DRESSCODE_GIRLS_GALLERY_ITEMS_0"]').parents('.slick-slider').length > 0) {
            iframe.contents().find('[data-sm-text="DRESSCODE_GIRLS_TITLE"]').toggleClass('sm-hidden', (data_value['DRESSCODE_GIRLS_GALLERY_ITEMS'].length === 0));
            iframe.contents().find('[data-sm-src="DRESSCODE_GIRLS_GALLERY_ITEMS_0"]').parents('.slick-slider').toggleClass('sm-hidden', (data_value['DRESSCODE_GIRLS_GALLERY_ITEMS'].length === 0));
        }
    }

    if (data_value['DRESSCODE_GUYS_GALLERY_ITEMS']) {
        if (iframe.contents().find('[data-sm-src="DRESSCODE_GUYS_GALLERY_ITEMS_0"]').parents('.slick-slider').length > 0) {
            iframe.contents().find('[data-sm-text="DRESSCODE_GUYS_TITLE"]').toggleClass('sm-hidden', (data_value['DRESSCODE_GUYS_GALLERY_ITEMS'].length === 0));
            iframe.contents().find('[data-sm-src="DRESSCODE_GUYS_GALLERY_ITEMS_0"]').parents('.slick-slider').toggleClass('sm-hidden', (data_value['DRESSCODE_GUYS_GALLERY_ITEMS'].length === 0));
        }
    }

    $.each($('input[name="before_date"]'), function () {
        var that = $(this);
        var cnt = $(this).next('.ct-calcontainer')
        that.Zebra_DatePicker({
            direction: 1,
            format: 'd.m.Y',
            show_clear_date: false,
            container: cnt,
            lang_clear_date: 'Очистить',
            readonly_element: false,
            days_abbr: dweeks_short,
            months: tmonths,
            months_abbr: constr_terms['ln-months-short'],
            days: dweeks,
            onChange: function () {
                that.trigger('input')
            }
        });
    })

    doGrayscales();

    $.each($('.ct-texteditor'), function (k, v) {
        var that = $(this);
        that.attr('id', 'ckeditor' + k);
        var thid = that.attr('id');
        var editorData = that.prev('.ct-texteditor_area').val()
        var ke = that.prev('.ct-texteditor_area').attr('name');

        that.html(editorData);
        ClassicEditor
            .create(document.getElementById(thid), {
                toolbar: ['bold', 'italic', 'link'],
                link: {
                    // Добавляет возможность выбора цели (вкладки)
                    addTargetToExternalLinks: false,
                    decorators: {
                        openInNewTab: {
                            mode: 'manual',
                            label: 'Открывать в новой вкладке',
                            defaultValue: true, // По умолчанию включено
                            attributes: {
                                target: '_blank',
                                rel: 'noopener noreferrer'
                            }
                        }
                    }
                }
            })
            .then(
                editor => {
//alignment
                    that.next('.ck-editor').find('.ck-toolbar__items').append('<button class="ck ck-button ct-ck-align ct-ck-align_left" type="button"><svg class="ck ck-icon ck-reset_all-excluded ck-icon_inherit-color ck-button__icon" viewBox="0 0 20 20" aria-hidden="true"><path d="M2 3.75c0 .414.336.75.75.75h14.5a.75.75 0 1 0 0-1.5H2.75a.75.75 0 0 0-.75.75zm0 8c0 .414.336.75.75.75h14.5a.75.75 0 1 0 0-1.5H2.75a.75.75 0 0 0-.75.75zm0 4c0 .414.336.75.75.75h9.929a.75.75 0 1 0 0-1.5H2.75a.75.75 0 0 0-.75.75zm0-8c0 .414.336.75.75.75h9.929a.75.75 0 1 0 0-1.5H2.75a.75.75 0 0 0-.75.75z"></path></svg></button><button class="ck ck-button ct-ck-align ct-ck-align_center" type="button"><svg class="ck ck-icon ck-reset_all-excluded ck-icon_inherit-color ck-button__icon" viewBox="0 0 20 20" aria-hidden="true"><path d="M2 3.75c0 .414.336.75.75.75h14.5a.75.75 0 1 0 0-1.5H2.75a.75.75 0 0 0-.75.75zm0 8c0 .414.336.75.75.75h14.5a.75.75 0 1 0 0-1.5H2.75a.75.75 0 0 0-.75.75zm2.286 4c0 .414.336.75.75.75h9.928a.75.75 0 1 0 0-1.5H5.036a.75.75 0 0 0-.75.75zm0-8c0 .414.336.75.75.75h9.928a.75.75 0 1 0 0-1.5H5.036a.75.75 0 0 0-.75.75z"></path></svg></button><button class="ck ck-button ct-ck-align ct-ck-align_right" type="button"><svg class="ck ck-icon ck-reset_all-excluded ck-icon_inherit-color ck-button__icon" viewBox="0 0 20 20" aria-hidden="true"><path d="M18 3.75a.75.75 0 0 1-.75.75H2.75a.75.75 0 1 1 0-1.5h14.5a.75.75 0 0 1 .75.75zm0 8a.75.75 0 0 1-.75.75H2.75a.75.75 0 1 1 0-1.5h14.5a.75.75 0 0 1 .75.75zm0 4a.75.75 0 0 1-.75.75H7.321a.75.75 0 1 1 0-1.5h9.929a.75.75 0 0 1 .75.75zm0-8a.75.75 0 0 1-.75.75H7.321a.75.75 0 1 1 0-1.5h9.929a.75.75 0 0 1 .75.75z"></path></svg></button>');

                    if (typeof (data_value[ke.toUpperCase() + '_ALIGN']) != 'undefined' && data_value[ke.toUpperCase() + '_ALIGN'] != '') {
                        that.next('.ck-editor').find('.ct-ck-align_' + data_value[ke.toUpperCase() + '_ALIGN']).click();
                    }
//alignment
                    editor.model.document.on('change:data', () => {
                        editorData = editor.getData();
                        that.prev('.ct-texteditor_area').val(editorData).trigger('input');

                    });
                })
            .catch(error => {
                console.error(error);
            });
    })

    $.each($('.ct-image_uploader-info'), function () {
        if ($(this).find('.ct-image_preview:not(.ct-image_uploader)').length > 1) {
            $(this).sortable({
                items: "li:not(.ct-image_uploader-origin)",
                tolerance: 'pointer',
                change: function (event, ui) {
                    $('.ct-panel_settings-page.active .submit_current').toggleClass('active', true);
                }
            });
            $(this).disableSelection();
        }
    })

    if (typeof cropInit !== "undefined" && iframe.contents().find('.ct-photo_cropper').length === 0) {
        cropInit()
        console.log('data-sm_cropper')
    }

    if (iframe.contents().find('.ct-photo_editor').length === 0 && $('.ct-demonstration').length === 0 && typeof newInt !== "undefined") {
        newInt()

    }

    if (typeof doQuests !== "undefined" && iframe.contents().find('.ct-addquests_wrapper').length === 0) {
        doQuests();
    }

    if (typeof setPrice !== "undefined") {
        if (needscreen) {
            $('#mainPanel .ct-panel_settings-page').removeClass('active');
            $('#mainPanel').toggleClass('active', true);
            $('#selectTpl').toggleClass('active', true);
            ifresize();
            needscreen = false;
            if (typeof (_tmr) != 'undefined')
            _tmr.push({type: 'reachGoal', id: 3322334, goal: 'newregistrationsitemaker'});
        }
    }

    initOwnBlock();
    initVideo();
    // initTimingIcons();

    initTemplateConfig();

    if (typeof afterload != 'undefined' && afterload > 0) {
        $('.ct-panel_settings-page[data-section="' + afterload + '"]').toggleClass('active');
        afterload = 0;
    }

    if (iframe.contents().find('.sm-template109').length > 0) { //904 arrows fix
        $.each(iframe.contents().find('.sm-decor-text-arrow'), function () {
            $(this).toggleClass('sm-hidden', $(this).prev('.sm-decor-text').text() == '')
        })
    }
}

function autoResizeText() {

    var el = iframe.contents().find('.sm-needtoresize');
    if (el.length > 0) {

        $.each(el, function () {

            var maxFont = 50;
            var minFont = 30;

            if ($(this).attr('data-max-font')) {
                maxFont = $(this).data('max-font')
                minFont = $(this).data('min-font');
            }

            var fontSize = maxFont;
            $(this).parent().css('font-size', fontSize + "px");
            while ((($(this).innerWidth() > $(this).parent().innerWidth()) || $(this).innerHeight() > $(this).parent().innerHeight()) && fontSize > minFont) {
                console.log(($(this).innerWidth() > $(this).parent().innerWidth()) || $(this).innerHeight() > $(this).parent().innerHeight());
                console.log(fontSize+': '+$(this).innerWidth()+' | '+$(this).parent().innerWidth()+' || '+$(this).innerHeight()+' | '+$(this).parent().innerHeight());
                fontSize -= 1;
                $(this).parent().css('font-size', fontSize + "px");
            }
        })
    }

}

function phonePrepare(phone) {
    if (phone != '') {
        $('body').append('<div class="ct-tmp">' + phone + '</div>')
        phone = $('.ct-tmp').text().replace(/\s/g, '').replace('-', '').replace('+', '').replace(/(\d)(\d{3})(\d{3})(\d{2})(\d{2})/, '$1$2$3$4$5');
        ;
        $('.ct-tmp').remove();
    }
    return phone;
}

function phonePrepareView(phone) {
    if (phone != '') {
        let cleaned = ('' + phone).replace(/\D/g, '');
        let match = cleaned.match(/^(7|)?(\d{3})(\d{3})(\d{2})(\d{2})$/);
        if (match) {
            let intlCode = (match[1] ? '7 ' : '')
            if (iframe.contents().find('.sm-template97').length > 0) {
                return [intlCode, ' ', match[2], ' ', match[3], '-', match[4], '-', match[5]].join('')
            } else {
                return [intlCode, '(', match[2], ') ', match[3], '-', match[4], '-', match[5]].join('')
            }
        }
    }
    return phone;
}

function parseLinks(text) {
    // return text;
    if ($.isArray(text)) {
        return text;
    }


    if (/<a\s+[^>]*href=["'].*?["'].*?>.*?<\/a>/i.test(text)) {
        return text.replace(/<a\s+([^>]*?)>/gi, function (match, p1) {
            p1 = p1.replace(/\s*target\s*=\s*['"][^'"]*['"]/i, '');
            return `<a ${p1} target="_blank" rel="noopener noreferrer">`;
        });
    }


    const urlRegex = /(https?:\/\/[^\s<]+|www\.[^\s<]+)/g;
    return text.replace(urlRegex, (url) => {
        const href = url.startsWith('http') ? url : `http://${url}`;
        return `<a href="${href}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });




}

function checkUrl(that, url) {

    if (url != '') {
        // $.post('/sitemaker/urlparser.php', {url:url}, function(data){$(that).html(data);})
    }
}

function loadFields() {
    var example_list = '';
    $.each(template_val.fields, function (k, v) {
        var field_list = '';
        $.each(v, function (ko, vo) {
            var tpl = vo.template;
            var str = ''
            var re = '';
            var for_name = '';
            $.each(vo, function (ki, vi) {
                str = new RegExp('{%' + ki.toUpperCase() + '%}')
                re = new RegExp(str, 'g');
                tpl = tpl.replace(re, vi);
                if (ki == 'slug') {
                    for_name = vi;
                }
            })

            if (template_val.hints[vo.cid]) {
                if (template_val.hints[vo.cid][(ko + 1)]) {
                    var hi = template_val.hints[vo.cid][(ko + 1)];
                    var hint = hi.data;
                    $('body').append('<div class="ct-tmp">' + tpl + '</div>')
                    $('.ct-tmp .ct-input_label').attr('data-hint', hint);
                    tpl = $('.ct-tmp').html();
                    $('.ct-tmp').remove();
                }
            }

            field_list += tpl;

            if (template_val.examples[vo.cid]) {
                if (template_val.examples[vo.cid][(ko + 1)]) {
                    var ex = template_val.examples[vo.cid][(ko + 1)];
                    var examples = $.parseJSON(ex.data);
                    var examples_list = '';
                    $.each(examples, function (ke, ve) {
                        examples_list += '<div class="ct-panel_examples-item">' + ve + '</div>'
                    })
                    example_list += '<div class="ct-panel_settings-page" data-ex="' + ex.id + '"><div class="ct-panel_header"><div class="ct-panel_close"></div><div class="ct-title">' + ex.title + '</div></div><div class="ct-panel_examples">' + examples_list + '</div><div class="ct-button submit_current ct-pointer">' + constr_terms['buttons_save'] + '</div></div>';
                    field_list += '<div class="ct-examples_toggle ct-example_with-ai" data-example="' + ex.id + '" data-for="' + for_name + '">' + constr_terms['ln-examples-select'] + '</div>';
                    field_list += '<div class="ct-ai_button" data-type="' + ex.id + '" data-for="' + for_name + '">AI</div>';

                }

            }

        })

        $('.ct-panel_settings-page[data-section="' + k + '"] .ct-menu_wrapper').html(field_list + '<div class="ct-button submit_current ct-pointer">' + constr_terms['buttons_save'] + '</div>')
        $('#secondPanel .ct-panel_sub').html(example_list);


    })
    loadData();
}

function loadSections() {
    var sections_list = '';
    var sections_forms = '';
    var sections_after = '';
    sections = [];
    $.each(template_val.sections, function (k, v) {
        if (v.id != 166 && v.id != 211) {
            sections.push(v.title);
            sections_list += '<li><span>' + v.title + '</span>' + ((v.required == '0') ? '<div class="ct-input_wrapper ct-switcher ct-switcher_small' + ((v.hideable == '0') ? '' : ' ct-hideable') + '"><input type="checkbox" id="switcher-' + v.id + '" checked><label for="switcher-' + v.id + '"></label></div>' : '') + '</li>';
        } else {
            sections[v.id - 1] = v.title;
        }

        sections_forms += '<div data-section="' + v.id + '" class="ct-panel_settings-page"><div class="ct-panel_header"><div class="ct-panel_header-controls"><div class="ct-panel_close"></div></div><div class="ct-flex ct-flex-space_between ct-flex-align-center"><div class="ct-title">' + v.title + '</div>' + ((v.required == '0') ? '<div class="ct-input_wrapper ct-switcher"><input type="checkbox" id="switcher-' + v.id + '" checked><label for="switcher-' + v.id + '"></label></div>' : '') + '</div></div><p>' + v.description + '</p><div class="ct-menu_wrapper"></div></div>';

        if (v.id != 166 && v.id != 211) {
            sections_after += '<li data-id="' + v.id + '">' + v.title + '</li>';
        }
    })
    if (template_val.sections.length > 0) {
        window.allsections = template_val.sections;

    }
    $('#secondPanel').html(sections_forms + '<div class="ct-panel ct-panel_sub"></div>');
    $('.ct-sections_setup').html(sections_list);

    $('.ct-sections_setup li span').click(function () {
        var cid = $(this).parent().index();
        iframe[0].contentWindow.scrollTo(0, $(iframe.contents().find('.sm-edit')[cid]).offset().top)

        setTimeout(function () {
            cursect = cid;
            $('.ct-setup').attr('data-block', sections[cid]);
            $('.ct-setup:not(#setupAddBlock)').click();
        }, 500);
    })

    $.each(offsections, function (k, v) {
        $('.ct-panel_settings-page[data-section="' + (v + 1) + '"] .ct-switcher input').prop('checked', false)
        $($('.ct-sections_setup li')[v]).find('input').prop('checked', false);
    })

    checkHideable();
    loadFields();

    $('.ct-own_block-setting ul').html('<li data-id="0">' + constr_terms['ln-own-not-set'] + '</li>' + sections_after);

    $('.ct-setup').attr('data-block', sections[cursect]);
}

function loadColors() {

    if (template_val.colors) {
        var colors = '';

        $.each(template_val.colors, function (k, v) {
            colors += '<li data-style="' + (k + 1) + '" style="background: ' + v + '" ' + ((template_val.color - 1) == k ? 'class="active"' : '') + '></li>'
        })

        $('#customizeView .ct-colors_switcher ul').html(colors);

        if (template_val.colors.length > 1) {
            $('.ct-footer_menu').show();
            $('.ct-header_colors.ct-colors_switcher').toggleClass('ct-hidden', false);
            $('#customizeView .ct-colors_switcher').parents('.ct-menu_wrapper').show();
            $('.ct-footer_menu-wrapper .ct-colors_switcher ul').html(colors); // нижний свитчер
            $('.ct-header_colors.ct-colors_switcher ul').html(colors); // нижний свитчер
        } else {
            $('.ct-header_colors.ct-colors_switcher').toggleClass('ct-hidden', true);
            $('.ct-footer_menu').hide();
            $('#customizeView .ct-colors_switcher').parents('.ct-menu_wrapper').hide();
        }
    } else {
        $('.ct-header_colors.ct-colors_switcher').toggleClass('ct-hidden', true);
        $('.ct-footer_menu').hide();
        $('#customizeView .ct-colors_switcher').parents('.ct-menu_wrapper').hide();
    }

    if (template_val.hfont) {
        var hfont = $('#hfont li[data-id="' + template_val.hfont + '"]').text();
        var tfont = $('#tfont li[data-id="' + template_val.tfont + '"]').text();
        $('#tfont li').removeClass('ct-input_select-current');
        $('#hfont li').removeClass('ct-input_select-current');
        $('#tfont span').text(tfont);
        $('#hfont span').text(hfont);
        $('#hfont li[data-id="' + template_val.hfont + '"]').addClass('ct-input_select-current');
        $('#tfont li[data-id="' + template_val.tfont + '"]').addClass('ct-input_select-current');
    }

    if (template_val.atype) {
        var atype = $('#anim_type li[data-id="' + template_val.atype + '"]').text();
        var aspeed = $('#anim_speed li[data-id="' + template_val.aspeed + '"]').text();
        $('#anim_type li').removeClass('ct-input_select-current');
        $('#anim_speed li').removeClass('ct-input_select-current');
        $('#anim_type span').text(atype);
        $('#anim_speed span').text(aspeed);
        $('#anim_type li[data-id="' + template_val.atype + '"]').addClass('ct-input_select-current');
        $('#anim_speed li[data-id="' + template_val.aspeed + '"]').addClass('ct-input_select-current');
    }
}

// alignment
$(document).on('click', '.ct-ck-align', function () {
    var clas = $(this).attr('class').split('ct-ck-align_')[1];
    var editr = $(this).parents('.ck-editor');
    var tname = editr.prev('.ct-texteditor').prev('.ct-texteditor_area').attr('name');
    var targ = tname.toUpperCase();
    var targe = iframe.contents().find('[data-sm-text="' + targ + '"]');
    editr.find('.ck-editor__main').removeClass('ct-text_align-left').removeClass('ct-text_align-right').removeClass('ct-text_align-center').toggleClass('ct-text_align-' + clas, true)
    targe.removeClass('sm-text_align-left').removeClass('sm-text_align-right').removeClass('sm-text_align-center').toggleClass('sm-text_align-' + clas, true);
    data_value[targ + '_ALIGN'] = clas;
})

//alignment
function loadTemplateData() {
    $.post(ajax_url, {action: 'loadTemplateData', project: project}, function (data) {
        if (data !== '' && data !== 'auth') {

            $('#changeData input[name="groom"]').val(d_groom);
            $('#changeData input[name="bride"]').val(d_bride);
            $('#changeData input[name="main_date"]').val(d_mdate);
            $('#changeData input[name="email"]').val(d_email);
            $('input[name="before_date"]').val(d_bdate);

            var d = $.parseJSON(data);

            tloaded = false;
            template_val = d;
            iframe.prop('src', loader);

            if (template_val.offsections && template_val.offsections != '') {
                offsections = $.parseJSON(template_val.offsections);
            } else {
                offsections = [];
            }


            if (template_val.grayscales && template_val.grayscales != '') {
                grayscales = $.parseJSON(template_val.grayscales);
            } else {
                grayscales = [];
            }
            pers_block_available = template_val.pblock;

            d_alco = template_val.alco;
            d_sput = template_val.sput;
            d_palette = template_val.palette;

            if (typeof setPrice !== "undefined") {
                payed = template_val.payed;
                paypcid = template_val.paypcid;
                var md = [];
                var subdate = d_mdate.split('.');
                var shortYear = '';
                if (subdate.length > 2) {
                    shortYear = subdate[2].replace('20', '');
                }
                if (d_domain != '') {
                    if ((typeof (main_domain) != 'undefined' && main_domain != 'wedwed.ru') || (typeof (main_country) != 'undefined' && main_country != '0')) {
                        var dd = d_domain.split('.ru' + main_domain).join('');
                        dd = dd.split('.ru').join('')
                        md.push(dd.split('.' + main_domain).join(''));

                    } else if ($('.ct-tpl_selector-item.active').attr('data-template_type') > 1) {
                        var dd = d_domain.split('.ru' + main_domain).join('');
                        dd = dd.split('.').join('');
                        md.push(dd);
                    } else {
                        md.push(d_domain.split('.ru').join(''));
                    }

                } else {
                    /*
                    *
                    приоритет 08-08-2025
                    далее 08-08-25
                    далее 08082025
                    далее имена
                    далее 080825
                    далее Wedding-08-08-2025
                    далее Wedding-08-08-25
                    далее Wedding-08-08
                    далее Family-08-08-2025
                    далее Wedding-stepan-mariya
                    */
                    //домены 27.08.2024
                    md.push(d_mdate.split('.').join('-'));
                    md.push(d_mdate.split('.').join(''));


                    if (shortYear != '') {
                        md.push(subdate[0] + '-' + subdate[1] + '-' + shortYear);
                        md.push(subdate[0] + '' + subdate[1] + '' + shortYear);
                    }
                    //md.push('18-08-2024');
                }

                if (payed && d_domain == '') {
                    var domain_bride = translit(d_bride.toLowerCase());
                    var domain_groom = translit(d_groom.toLowerCase());
                    var domain_year = d_mdate.split('.');
                    domain_bride = domain_bride.split(' ').join('');
                    domain_bride = domain_bride.split(',').join('');
                    domain_bride = domain_bride.split('.').join('');
                    domain_bride = domain_bride.split('_').join('');
                    domain_groom = domain_groom.split(' ').join('');
                    domain_groom = domain_groom.split(',').join('');
                    domain_groom = domain_groom.split('.').join('');
                    domain_groom = domain_groom.split('_').join('');

                    d_domain = d_domain.replace(/[^a-z0-9.\-]/gi, '');
                    domain_groom = domain_groom.replace(/[^a-z0-9.\-]/gi, '');
                    domain_bride = domain_bride.replace(/[^a-z0-9.\-]/gi, '');

                    if (domain_year.length >= 3) {
                        domain_year = domain_year[2];
                    }

                    md.push(domain_bride + 'and' + domain_groom);
                    md.push(domain_groom + 'and' + domain_bride);
                    md.push(domain_bride + 'and' + domain_groom + domain_year);
                    md.push(domain_groom + 'and' + domain_bride + domain_year);

                    md.push('wedding-' + d_mdate.split('.').join('-'));
                    md.push('wedding-' + d_mdate.split('.').join(''));
                    md.push('family-' + d_mdate.split('.').join('-'));
                    md.push('family-' + d_mdate.split('.').join(''));

                    if (shortYear != '') {
                        md.push('wedding-' + subdate[0] + '-' + subdate[1] + '-' + shortYear);
                        md.push('wedding-' + subdate[0] + '' + subdate[1] + '' + shortYear);
                        md.push('family-' + subdate[0] + '-' + subdate[1] + '-' + shortYear);
                        md.push('family-' + subdate[0] + '' + subdate[1] + '' + shortYear);
                    }


                }
                checkDomain(md, 0);
                setPrice();
            }
            checkUndoButtons(d['undo'], d['redo']);

        } else {
            if (data == 'auth') {
                alert(constr_terms['ln-notify-error'])
                window.location.href = '/sitemaker/';
            } else {
                alert(constr_terms['ln-notify-error']);
            }
        }
    })
}

function doGrayscales() {
    iframe.contents().find('[data-sm-src]').removeClass('sm-grayscale');

    $.each(grayscales, function (k, v) {
        var name = v.name;
        var data = v.data;

        if ($.inArray(name, gallery_items) !== -1) {
            if (data.length > 0) {
                $.each(data, function (ki, vi) {
                    iframe.contents().find('[data-sm-src="' + name + '_' + vi + '"]').addClass('sm-grayscale')
                    $('.ct-image_uploader-info[data-for="' + name + '"] .ct-image_preview[data-photos-k="' + vi + '"]').attr('data-filter', 'black');
                    $('.ct-image_uploader-info[data-for="' + name + '"] .ct-image_preview[data-photos-k="' + vi + '"]').find('i').addClass('active')
                })
            }
        } else {
            var i = iframe.contents().find('[data-sm-src="' + name + '"]');
            var c = $('.ct-image_uploader-info[data-for="' + name + '"] .ct-image_preview:not(.ct-image_uploader)')
            if (data.length > 0) {
                $.each(data, function (ki, vi) {
                    $(i[vi]).addClass('sm-grayscale')
                    $(c[vi]).attr('data-filter', 'black');
                    $(c[vi]).find('i').addClass('active')
                })
            }
        }
    })
}

function checkUploader(container) {
    var inputup = $(container).find('.ct-image_uploader-origin');
    var inputup_size = inputup.find('.ct-input').attr('data-count');
    var inputim = $(container).find('li:not(.ct-image_uploader-origin)').length;
    if (inputup_size && typeof (inputup_size) != 'undefined') {
        inputup.toggleClass('ct-hidden', inputup_size <= inputim && inputim > 0)
        // $('.ct-panel_settings-page.active .submit_current').toggleClass('active',inputup.hasClass('ct-hidden'));
    }
}

function checkUndoButtons(un, re) {
    $('.ct-cancel').toggleClass('active', un)
    $('.ct-redo').toggleClass('active', re)
}

function undoProject() {
    $.post(ajax_url, {action: 'undo', project: project}, function (data) {
        if (data != '') {
            var d = $.parseJSON(data);
            if (d['reload'] == '1') {
                $('#secondPanel').removeClass('active').html('');
                //   $('.ct-sections_setup').html('');
                ifresize();
                loadSections();
                checkUndoButtons(d['undo'], d['redo'])
            }
        }
    })
}

function redoProject() {
    $.post(ajax_url, {action: 'redo', project: project}, function (data) {
        if (data != '') {
            var d = $.parseJSON(data);
            if (d['reload'] == '1') {
                $('#secondPanel').removeClass('active').html('');
                //   $('.ct-sections_setup').html('');
                ifresize();
                loadSections();
                checkUndoButtons(d['undo'], d['redo'])
            }

        }
    })
}

function saveTemp() {
    var question_up = $('.ct-panel_settings-page.active .ct-addquests_wrapper').length > 0
    $.post(ajax_url, {
        action: 'presave',
        data: JSON.stringify(data_value),
        project: project,
        question_up: question_up
    }, function (data) {
        if (data != '') {
            var d = $.parseJSON(data);
            if (typeof setPrice != 'undefined') {
                if (d['TRIAL'] != '0' && d['PAYED'] == '0' && (d['TRIAL'] == '9' || d['TRIAL'] == '3' || d['TRIAL'] == '1')) {
                    $('.ct-pleasepay_wrapper h3').text(constr_terms["ln-trial-left"] + ': ' + d['TRIAL'])
                    $('.ct-pleasepay').toggleClass('active', true);
                }
                if (d['TRIAL'] == '0' && d['PAYED'] == '0') {
                    $('.ct-pleasepay_wrapper h3').text(constr_terms["ln-trial-expired"])
                    $('.ct-pleasepay').toggleClass('active', true);
                }
            }

            d_groom = d['GROOM'];
            d_bride = d['BRIDE'];
            d_mdate = d['MAIN_DATE'];
            d_bdate = d['BEFORE_DATE'];
            $('#changeData input[name="groom"]').val(d_groom);
            $('#changeData input[name="bride"]').val(d_bride);
            $('#changeData input[name="main_date"]').val(d_mdate);
            $('#changeData input[name="email"]').val(d_email);
            $('input[name="before_date"]').val(d_bdate);
        }

        $('#secondPanel').removeClass('active').html('');
        $('.ct-sections_setup').html('');
        if ($('.ct-panel_settings-page[data-section="166"].active').length == 0) {
            $('#secondPanel').removeClass('active').html('');
        } else {
            setTimeout(function () {
                $('.ct-panel_settings-page[data-section="166"]').toggleClass('active', true);
            }, 500)
        }

        if ($('.ct-panel_settings-page[data-section="211"].active').length == 0) {
            $('#secondPanel').removeClass('active').html('');
        } else {
            setTimeout(function () {
                $('.ct-panel_settings-page[data-section="211"]').toggleClass('active', true);
            }, 500)
        }

        ifresize();
        loadSections();
        checkUndoButtons(d['undo'], d['redo']);
    })
}

function checkHideable() {
    $.each($('.ct-sections_setup li'), function (k, v) {
        iframe.contents().find('[data-type=' + (k + 1) + ']').toggleClass('sm-hidden', ($(this).find('.ct-hideable').length > 0 && $.inArray(k, offsections) !== -1));
    })
    //$($('.ct-sections_setup li')[v]).find('input').prop('checked', false);
}


function handleEvent(e) {
    let diff = iframe.height()/6;
    if((iframe.contents().height() - iframe.height() - 50) > iframe.contents().scrollTop()) {
        cursect = e.detail.cursect - 1;
    }else{
        cursect = iframe.contents().find('section.sm-edit[data-type]').last().attr('data-type') - 1;
    }
    $('.ct-setup').attr('data-sect', cursect);
    $('.ct-setup').attr('data-block', sections[cursect]);
    if ($('body.ct-demonstration').length === 0) {
        checkSect();
    }
}

function setSect() {
    $.post(ajax_url, {action: 'setsect', data: JSON.stringify(offsections), project: project}, function () {
    })
    checkHideable();
}

function saveProject() {

    // if(confirm('Проект будет сохранен в ваш личный кабинет, а вы получите ссылку и QR код для отправки друзьям и близким. Редактирование будет невозможно. Продолжить?'))
    if (confirm(constr_terms['ln-notify-publish'])) {
        $.post(ajax_url, {
            action: 'save',
            data: JSON.stringify(data_value),
            tpl: JSON.stringify(template_val),
            project: project
        }, function (data) {
            if (data == '1') {
                window.location.href = '/sitemaker/account/';
            } else {

                window.location.reload();
            }
        })
    }
}

function checkSect() {
    tplwrapper.toggleClass('ct-unavailable', $.inArray(cursect, offsections) !== -1)
}

function checkIntroData() {
    console.log('check inro data')
    var hwrapper = $('.ct-hello_items');
    var curren_item = hwrapper.find('.swiper-slide-active .ct-hello_item');
    var did = curren_item.attr('data-id');
    var str1 = curren_item.attr('data-string-1');
    var str2 = curren_item.attr('data-string-2');
    var str3 = curren_item.attr('data-string-3');
    console.log(document.querySelector('.ct-hello_items').hasAttribute('data-string-3'));
    var blur = curren_item.attr('data-blur');
    var dark = curren_item.attr('data-dark');
    var intro_photo = curren_item.attr('data-photo') ? curren_item.attr('data-photo') : 0;
    var intro_video = curren_item.attr('data-video') ? curren_item.attr('data-video') : 0;

    $('.ct-hello_data .ct-image_uploader-info[data-for="INTRO_PHOTO"]').prev('.ct-input_wrapper').toggle(intro_photo > 0);
    $('.ct-hello_data .ct-video_uploader-info[data-for="INTRO_VIDEO"]').toggle(intro_video > 0);
    $('.ct-hello_data input[name="intro_photo"]').parents('.ct-image_uploader-info').toggle(intro_photo > 0);
    $('.ct-hello_data input[name="intro-dark"]').parents('.ct-input_wrapper').toggle(dark < 2);
    $('.ct-hello_data input[name="intro-blur"]').parents('.ct-input_wrapper').toggle(blur < 2);

    if(document.querySelector('.ct-hello_items .swiper-slide-active .ct-hello_item').hasAttribute('data-current-string-1')){
        console.log('check inro data 2')
        str1 = curren_item.attr('data-current-string-1');
        str2 = curren_item.attr('data-current-string-2');
        if(document.querySelector('.ct-hello_items .swiper-slide-active .ct-hello_item').hasAttribute('data-string-3')) {
            str3 = curren_item.attr('data-current-string-3');
        }
        console.log(document.querySelector('.ct-hello_items').hasAttribute('data-current-string-3'));
        blur = curren_item.attr('data-current-blur');
        dark = curren_item.attr('data-current-dark');
    }

    if (hwrapper.attr('data-current-blur') != '' && hwrapper.attr('data-current-blur') != '-1') {
        console.log('check inro data 1')
        str1 = hwrapper.attr('data-current-str1');
        str2 = hwrapper.attr('data-current-str2');
        str3 = hwrapper.attr('data-current-str3');
        console.log(document.querySelector('.ct-hello_items').hasAttribute('data-string-3'));
        blur = hwrapper.attr('data-current-blur');
        dark = hwrapper.attr('data-current-dark');
    }

    console.log(str3);


    var inputs = ['<input type="text" class="ct-input" name="string-1" placeholder="Первая строка" >','<input type="text" class="ct-input" name="string-2" placeholder="Вторая строка" >','<input type="text" class="ct-input" name="string-3" placeholder="Третья строка" >'];
    var textareas = ['<textarea name="string-1" class="ct-input" placeholder="Первая строка">','<textarea name="string-2" class="ct-input" placeholder="Вторая строка">','<textarea name="string-3" class="ct-input" placeholder="Третья строка">'];

    // if(str1.length>85) {
    //     if ($('.ct-hello_data .ct-input[name="string-1"]').prop('tagName') == 'input') {
    //         let inputContainer = $('.ct-hello_data .ct-input[name="string-1"]').parent();
    //         $('.ct-hello_data .ct-input[name="string-1"]').remove();
    //         inputContainer.append(textareas[0]+str1+'</textarea>');
    //     }
    // }else{
    //     if ($('.ct-hello_data .ct-input[name="string-1"]').prop('tagName') != 'input') {
    //         let inputContainer = $('.ct-hello_data .ct-input[name="string-1"]').parent();
    //         $('.ct-hello_data .ct-input[name="string-1"]').remove();
    //         inputContainer.append(inputs[0]);
    //         $('.ct-hello_data .ct-input[name="string-1"]').val(str1);
    //     }
    // }
    // if(str2.length>85) {
    //     if ($('.ct-hello_data .ct-input[name="string-2"]').prop('tagName') == 'input') {
    //         let inputContainer = $('.ct-hello_data .ct-input[name="string-2"]').parent();
    //         $('.ct-hello_data .ct-input[name="string-2"]').remove();
    //         inputContainer.append(textareas[1]+str2+'</textarea>');
    //     }
    // }else{
    //     if ($('.ct-hello_data .ct-input[name="string-2"]').prop('tagName') != 'input') {
    //         let inputContainer = $('.ct-hello_data .ct-input[name="string-2"]').parent();
    //         $('.ct-hello_data .ct-input[name="string-2"]').remove();
    //         inputContainer.append(inputs[1]);
    //         $('.ct-hello_data .ct-input[name="string-2"]').val(str1);
    //     }
    // }


    $('.ct-hello_data input[name="string-1"]').val(str1);
    $('.ct-hello_data input[name="string-2"]').val(str2);

    if(str1!=null) {
        if (str1.length > 85) {
            console.log('1len>85');
            if ($('.ct-hello_data .ct-input[name="string-1"]').prop('tagName') == 'input' || $('.ct-hello_data .ct-input[name="string-1"]').prop('tagName') == 'INPUT') {
                console.log('inp');
                let inputContainer = $('.ct-hello_data .ct-input[name="string-1"]').parent();
                $('.ct-hello_data .ct-input[name="string-1"]').remove();
                inputContainer.append(textareas[0] + str1 + '</textarea>');
            } else {
                $('.ct-hello_data .ct-input[name="string-1"]').val(str1);
                console.log('no inp');
            }
        } else {
            console.log('1len<85');
            if ($('.ct-hello_data .ct-input[name="string-1"]').prop('tagName') != 'input') {
                let inputContainer = $('.ct-hello_data .ct-input[name="string-1"]').parent();
                $('.ct-hello_data .ct-input[name="string-1"]').remove();
                inputContainer.append(inputs[0]);
                $('.ct-hello_data .ct-input[name="string-1"]').val(str1);
            }else{
                $('.ct-hello_data .ct-input[name="string-1"]').val(str1);
            }
        }
    }
    if(str2!=null) {
        if (str2.length > 85) {
            console.log('2len>85');
            if ($('.ct-hello_data .ct-input[name="string-2"]').prop('tagName') == 'input' || $('.ct-hello_data .ct-input[name="string-2"]').prop('tagName') == 'INPUT') {
                console.log('inp');
                let inputContainer = $('.ct-hello_data .ct-input[name="string-2"]').parent();
                $('.ct-hello_data .ct-input[name="string-2"]').remove();
                inputContainer.append(textareas[1] + str2 + '</textarea>');
            } else {
                $('.ct-hello_data .ct-input[name="string-2"]').val(str2);
                console.log('no inp');
            }
        } else {
            console.log('2len<85');
            if ($('.ct-hello_data .ct-input[name="string-2"]').prop('tagName') != 'input') {
                let inputContainer = $('.ct-hello_data .ct-input[name="string-2"]').parent();
                $('.ct-hello_data .ct-input[name="string-2"]').remove();
                inputContainer.append(inputs[1]);
                $('.ct-hello_data .ct-input[name="string-2"]').val(str2);
            }else{
                $('.ct-hello_data .ct-input[name="string-2"]').val(str2);
            }
        }
    }

    if (str3 != null) {
        $('.ct-input-wrapper-hidden').css('display', 'block');
        $('.ct-hello_data input[name="string-3"]').val(str3);
    } else {
        $('.ct-input-wrapper-hidden').css('display', 'none');
    }

    if(str3!=null) {
        if (str3.length > 85) {
            if ($('.ct-hello_data .ct-input[name="string-3"]').prop('tagName') == 'input' || $('.ct-hello_data .ct-input[name="string-3"]').prop('tagName') == 'INPUT') {
                console.log('inp');
                let inputContainer = $('.ct-hello_data .ct-input[name="string-3"]').parent();
                $('.ct-hello_data .ct-input[name="string-3"]').remove();
                inputContainer.append(textareas[2] + str3 + '</textarea>');
            } else {
                $('.ct-hello_data .ct-input[name="string-3"]').val(str3);
                console.log('no inp');
            }
        } else {
            if ($('.ct-hello_data .ct-input[name="string-3"]').prop('tagName') != 'input') {
                let inputContainer = $('.ct-hello_data .ct-input[name="string-3"]').parent();
                $('.ct-hello_data .ct-input[name="string-3"]').remove();
                inputContainer.append(inputs[2]);
                $('.ct-hello_data .ct-input[name="string-3"]').val(str3);
            }else{
                $('.ct-hello_data .ct-input[name="string-3"]').val(str3);
            }
        }
    }

    $('.ct-hello_data input[name="intro-blur"]').prop("checked", (blur == '1'));
    $('.ct-hello_data input[name="intro-dark"]').prop("checked", (dark == '1'));
    if ($('.ct-hello_edit').hasClass('active')) {
        $('.ct-hello_data').toggleClass('active', did > 0);
    }
}

function resetIntro() {
    var hwrapper = $('.ct-hello_items');
    hwrapper.attr('data-current-str1', "");
    hwrapper.attr('data-current-str2', "");
    hwrapper.attr('data-current-str3', "");
    hwrapper.attr('data-current-blur', "");
    hwrapper.attr('data-current-dark', "");
    $('li[data-photos-k="INTRO_PHOTO"]').remove();
    $('input[name="intro_photo"]').val('');
    $('input[name="intro_video"]').val('');
}

function clearIntroInfo() {
    var activeSlide = document.querySelector('.ct-hello_items .swiper-slide-active .ct-hello_item');
    activeSlide.removeAttribute('data-current-string-1');
    activeSlide.removeAttribute('data-current-string-2');
    activeSlide.removeAttribute('data-current-string-3');
    activeSlide.removeAttribute('data-current-dark');
    activeSlide.removeAttribute('data-current-blur');
}

function saveIntro(al = false) {
    var did = $('.ct-hello_items .swiper-slide-active .ct-hello_item').attr('data-id');
    var str1 = '';
    var str2 = '';
    var str3 = null;
    var blur = 0;
    var dark = 0
    var back = '';
    if (did > 0) {
        str1 = $('.ct-input_wrapper .ct-input[name="string-1"]').val()
        str2 = $('.ct-input_wrapper .ct-input[name="string-2"]').val()
        str3 = $('.ct-input_wrapper .ct-input[name="string-3"]').val()
        blur = $('input[name="intro-blur"]').prop('checked') ? '1' : 0
        dark = $('input[name="intro-dark"]').prop('checked') ? '1' : 0
        if ($('li[data-photos-k="INTRO_PHOTO"]').length > 0) {
            back = $('li[data-photos-k="INTRO_PHOTO"]').attr('data-url');
        }
    }
console.log('saving intro');
    $.post(ajax_url, {
        action: 'setintro',
        project: project,
        iid: did,
        str1: str1,
        str2: str2,
        str3: str3,
        blur: blur,
        dark: dark,
        back: back
    }, function (data) {
        if (al) {
            if (data == '1') {
                alert(constr_terms['ln-notify-intro']);
                $('.ct-hello_item[data-id="'+did+'"]').attr('data-current-string-1',str1);
                $('.ct-hello_item[data-id="'+did+'"]').attr('data-current-string-2',str2);
                if(str3!='' && str3!=null){
                    $('.ct-hello_item[data-id="'+did+'"]').attr('data-current-string-3',str3);
                }
                $('.ct-hello_item[data-id="'+did+'"]').attr('data-current-dark',dark);
                $('.ct-hello_item[data-id="'+did+'"]').attr('data-current-blur',blur);
                $('.ct-hello_item[data-id="'+did+'"]').attr('data-current',did);
            }
        }
    })
}


function initTemplateConfig(){

    console.log('init config')

    //получаем конфиг
    var fold = '';
    var url = '';
    if (typeof folders != 'undefined') {
        fold = folders[template_val.id];
        console.log('init config 1')
        url = '/sitemaker/templates/' + fold + 'config.json'
    } else {
        fold = template_val.folder
        console.log('init config2')
        url = '/sitemaker' + fold + 'config.json'
    }

    $.getJSON(url).done(function (data) {
        template_config = data;

        //устанавливаем тип иконок
        setIcons()

        //срываем элементы, если надо
        //Проверяем конфиг шаблона. Перебираем элементы, которые можем скрывать
        console.log(template_config);

        if(template_config['HIDE']!=null){
            console.log('hidden is set');
            const config_hide = template_config['HIDE'];
            //будем использовать для определения установлен ли инпут
            var swicherChecked = 'checked=""';
            //перебираем все, что находится в конфиге hide
            Object.entries(config_hide).forEach(([key, value]) => {
                console.log('key: '+key+'; value: '+value);
                //если в пользовательском конфиге указано, что надо скрыть - скрываем
                if(data_value["HIDE"]!=null && data_value["HIDE"].length!=0){
                    if(data_value['HIDE'].includes(key)){
                        console.log('dv hide includes '+ key);
                        iframe.contents().find(value).css('display','none');
                        swicherChecked = '';
                    }else{
                        console.log('dv hide not includes '+ key);
                        swicherChecked = 'checked=""';
                        iframe.contents().find(value).css('display','auto');
                    }
                }else{
                    swicherChecked = 'checked=""';
                    iframe.contents().find(value).css('display','auto');
                }

                // к редакту дописываем инпут скрыть/показать
                var $hideInput = ($('.ct-panel_settings-page [name="'+key+'"]').length > 0) ? $('.ct-panel_settings-page [name="'+key+'"]') : $('.ct-panel_settings-page [name="'+key.toLowerCase()+'"]');

                if(!$hideInput.closest('.ct-input_wrapper').hasClass('ct-can-hide')){
                    $hideInput.closest('.ct-input_wrapper').toggleClass('ct-can-hide',true);
                    var labelHTML = $hideInput.closest('.ct-input_wrapper').find('.ct-input_label').html();
                    $hideInput.closest('.ct-input_wrapper').find('.ct-input_label').remove();
                    $hideInput.closest('.ct-input_wrapper').prepend('<div class="ct-label-with-can-hide">' +
                        '<label class="ct-input_label">'+labelHTML+'</label>' +
                        '<div class="ct-can-hide-wrapper">\n' +
                        '    <div class="ct-input_wrapper ct-switcher ct-can-hide-swicher ct-switcher_small"><input type="checkbox" id="switcher-'+key+'-hide" '+swicherChecked+' data-for-value="'+key+'"><label for="switcher-'+key+'-hide"></label></div>\n' +
                        '</div></div>');
                }

            })

        }

    }).fail(function () {

    });
}

function initTimingIcons() {
    console.log('initTimingItems')
    var fold = '';
    var url = '';
    if (typeof folders != 'undefined') {
        fold = folders[template_val.id];
        url = '/sitemaker/templates/' + fold + '/config.json'
    } else {
        fold = template_val.folder
        url = '/sitemaker' + fold + '/config.json'
    }

    $.getJSON(url).done(function (data) {
        template_config = data;
        setIcons()
    }).fail(function () {

    });
}


function setIcons() {
    if (template_config['TIMING_ITEM_CONTAINER'] != '') {
        $.each($('.ct-input[name^="timing_"]'), function (k, v) {
            var i = $(this).attr('name').split('_');
            var p = $(this).parents('.ct-input_wrapper-half');

            if (!p.hasClass('ct-with_icon-lib')) {
                p.addClass('ct-with_icon-lib');
                p.append('<div class="ct-icon_library-item ct-icon_library-item_empty"><span class="ct-icon_library-item_remove"></span></div><div class="ct-input_wrapper ct-hidden"><input type="text" class="ct-input" name="timing_' + i[1] + '_i" placeholder=""></div><div class="ct-icon_library ct-modal_open" data-target="modal_icons-library"></div>');
            }

            var par = iframe.contents().find('[data-sm-text="TIMING_' + i[1] + '_0"]').parents(template_config['TIMING_ITEM_CONTAINER']);

            if (typeof data_value['TIMING_' + i[1] + '_I'] != 'undefined' && data_value['TIMING_' + i[1] + '_I'] != '') {
                if (template_config['TIMING_ICON_TYPE'] == '2') {
                    var im = par.find('img');
                    if (typeof par.attr('data-default') == 'undefined' || par.attr('data-default') == '') {
                        par.attr('data-default', im.attr('src'));
                    }
                    im.attr('src', data_value['TIMING_' + i[1] + '_I'])
                } else if (template_config['TIMING_ICON_TYPE'] == '1') {
                    $.get(data_value['TIMING_' + i[1] + '_I'], function (data) {
                        var im = par.find('svg');

                        if (typeof par.attr('data-default') == 'undefined' || par.attr('data-default') == '') {
                            par.attr('data-default', $(im[0]).prop('outerHTML'));
                        }

                        var svgElement = $(data).find('svg');
                        $(im[0]).replaceWith(svgElement)
                    }, 'xml');
                }

                p.find('.ct-icon_library-item').toggleClass('ct-icon_library-item_empty', false).css('background-image', 'url("' + data_value['TIMING_' + i[1] + '_I'] + '")');
                p.find('[name="timing_' + i[1] + '_i"]').val(data_value['TIMING_' + i[1] + '_I'])
            } else {
                if (typeof par.attr('data-default') != 'undefined' && par.attr('data-default') != '') {
                    if (template_config['TIMING_ICON_TYPE'] == '2') {
                        var im = par.find('img');
                        im.attr('src', par.attr('data-default'))
                    } else if (template_config['TIMING_ICON_TYPE'] == '1') {
                        var im = par.find('svg');
                        $(im[0]).replaceWith(par.attr('data-default'))
                    }

                    par.removeAttr('data-default')
                }
                p.find('.ct-icon_library-item').toggleClass('ct-icon_library-item_empty', true).css('background-image', 'url("")');
            }
        })
    }
}

function addQuest() {
    var colq = $('.ct-addquest_tools.active').length + 1;
    var str = new RegExp('{%QID%}')
    var re = new RegExp(str, 'g');
    var bltpl1 = bltpl.replace(re, colq);
    if (typeof setPrice == 'undefined') {
        var qid = colq;
        if (template_val.questions && template_val.questions.length >= qid) {
            qid = template_val.questions[colq - 1].id;
        }
        bltpl1 = bltpl.replace(re, qid);
        var stri = new RegExp('{%QIDI%}')
        var rei = new RegExp(stri, 'g');
        bltpl1 = bltpl1.replace(rei, colq);
    }
    $('.ct-addquests_wrapper').append(bltpl1);
    recalcOrderQuest();
}

function fillQuests() {
    if (template_val.questions && template_val.questions.length > 0) {
        var smb = iframe.contents().find('[data-sm-anketa-toggle]');
        var ins = '';
        if (smb.find('.sm-form_preferences').length > 0) {
            ins = ' > .sm-form_preferences';
        }
        $.each(template_val.questions, function (k, v) {
            var qu = $($('.ct-addquests-item.active')[k]);
            var forqu = qu.find('.ct-panel_header').attr('for');
            if (typeof setPrice == 'undefined') {
                forqu = 'quest-' + v.id;
                qu = $('.ct-panel_header[for="' + forqu + '"]').parents('.ct-addquests-item');
            }

            var co = qu.find('.ct-hidden_wrapper');

            qu.find('[name="' + forqu + '_answer[]"]').parents('.ct-input_wrapper').remove();
            qu.find('[name="' + forqu + '_question"]').val(v.question);
            if (typeof v.type != 'undefined') {
                qu.find('#' + forqu + '-type li[data-type="' + v.type + '"]').click();
                qu.find('#' + forqu + '-type').removeClass('active');
            }
            if (smb.length > 0) {
                $.each(smb, function (ko, vo) {
                    var sorname = forqu + '-' + ko
                    if (typeof setPrice == 'undefined') {
                        sorname = forqu
                    }
                    var smbt = $(smb.find('div')[0]).clone();

                    if (smb.parent().find('[data-sm-anketa-toggle]' + ins + ' > label').length > 0) {
                        smbt = $(smb.find('label')[0]).clone();
                    } else if (smb.parent().find('[data-sm-anketa-toggle]' + ins + ' > p').length > 0) {
                        smbt = $(smb.find('p')[0]).clone();
                    }

                    var smbc = $(smb.find('[data-sm-anketa]')[0]).clone();
                    var smbb = $(smb.find('.ct-alcotpl')[0]).clone();

                    smbt.attr('data-forq', sorname)
                    smbc.attr('data-forq', sorname);

                    $(this).append(smbt);
                    $(this).append(smbc);

                    var titl = iframe.contents().find('[data-forq="' + sorname + '"]:not([data-sm-anketa])');
                    while (titl.children().length) {
                        titl = titl.children();
                    }

                    $(titl[0]).html(v.question);
                    var drinks = iframe.contents().find('[data-sm-anketa][data-forq="' + sorname + '"]');
                    var tn = drinks.find('.ct-alcotpl').prop("tagName");
                    drinks.find(tn + ':not(.ct-alcotpl)').remove();

                    $.each(v.answers, function (ka, va) {
                        var sornamek = sorname + '_' + (ka + 1)
                        var sornamev = va;
                        if (typeof setPrice == 'undefined') {
                            sornamek = sorname + '_' + (va.id)
                            sornamev = va.answer
                        }
                        var smbd = smbb.clone();
                        drinks.append(smbd)
                        var chb = $(drinks.find('.ct-alcotpl')[ka]);

                        chb.find('input').val(ka + 1).attr('name', sorname + '[]').attr('id', sornamek);
                        chb.find('[data-sm-alcoitem]').attr('for', sornamek).html(sornamev);
                    })

                    if (typeof v.type != 'undefined' && v.type == '1' && iframe.contents().find('#' + sorname).length == 0) {
                        var smbi = iframe.contents().find('[data-sm-anketa-name]')[0];
                        var smbd = $(smbi).clone();
                        drinks.append(smbd)
                        var inp = drinks.find('[data-sm-anketa-name]');
                        inp.attr('name', sorname).attr('id', sorname).attr('placeholder', constr_terms["ln-questionnaire-your"]).removeAttr('data-sm-anketa-name');
                    }

                    smbb.remove();
                    drinks.find('.ct-alcotpl [name="alco[]"]').parents('.ct-alcotpl').remove();
                    drinks.find('.ct-alcotpl').removeClass('ct-alcotpl');
                })
                iframe.contents().find('[data-sm-anketa-toggle]').removeClass('sm-hidden');
                iframe.contents().find('[data-forq]').removeClass('sm-hidden');
            }
            if (v.answers.length > 0) {
                $.each(v.answers, function (ka, va) {
                    var fornam = forqu + '_answer[]';
                    var fornav = va
                    if (typeof setPrice == 'undefined') {
                        fornam = forqu + '_' + va.id + '_answer';
                        fornav = va.answer;
                    }
                    co.find('.ct-input-dynamic_multiplier').before('<div class="ct-input_wrapper ct-input-dynamic"><div class="ct-input_wrapper-item"><label class="ct-input_label">' + constr_terms["ln-questionnaire-response-choice"] + ' <span>' + (ka + 1) + '</span></label><input type="text" class="ct-input ct-input_answer" placeholder="' + constr_terms["ln-questionnaire-response-choice"] + '" name="' + fornam + '" value="' + fornav + '"></div><div class="ct-input_remover"></div></div>');
                })
            } else {
                co.find('.ct-input-dynamic_multiplier').before('<div class="ct-input_wrapper ct-input-dynamic ct-hidden"><div class="ct-input_wrapper-item"><label class="ct-input_label">' + constr_terms["ln-questionnaire-response-choice"] + ' <span>1</span></label><input type="text" class="ct-input" placeholder="' + constr_terms["ln-questionnaire-response-choice"] + '" name="' + forqu + '_answer[]" value=""></div><div class="ct-input_remover"></div></div>');
            }
        })
    }
    questfilled = true;
}


function recalcOrderQuest() {
    var adqa = $('.ct-addquests-item.active').length;
    if ($('.ct-addquests-item').length > 0) {
        $.each($('.ct-addquests-item'), function (k, v) {
            $(this).find('.ct-title span').text(k + 2);
            $(this).css('order', k);
            if (typeof setPrice != 'undefined') {
                $(this).find('.ct-addquest_tools-higher').toggleClass('active', (k > 0));
                $(this).find('.ct-addquest_tools-lower').toggleClass('active', (k < adqa - 1 && $('.ct-addquests-item.active').length > 1));
            } else {
                $(this).find('.ct-addquest_tools-higher').toggleClass('ct-hidden', true);
                $(this).find('.ct-addquest_tools-lower').toggleClass('ct-hidden', true);
            }
        })
    }


    if (template_val.questions.length > 0 && !questfilled) {
        if ($('.ct-addquests-item.active').length < template_val.questions.length) {
            $($('.ct-addquests-item:not(.active)')[0]).find('.ct-addquest_tools-addremove').click();
        } else {
            if (!questfilled) {
                fillQuests();
            }
        }
    }
}

function doQuests() {
    questfilled = false;
    template_val.questions = {};
    $('.ct-addquests_wrapper').remove();
    iframe.contents().find('[data-forq]').remove();

    if (bltpl == '') {
        bltpl = '<div class="ct-addquests-item"><div class="ct-panel_header" for="quest-{%QID%}"><div class="ct-flex ct-flex-space_between ct-flex-align-center"><div class="ct-title">' + constr_terms['ln-questionnaire-survey'] + ' №<span>{%QID%}</span></div><div class="ct-addquest_tools"><div class="ct-addquest_tools-higher"></div><div class="ct-addquest_tools-lower"></div><div class="ct-addquest_tools-addremove"></div></div></div></div><div id="quest-{%QID%}" class="ct-hidden_wrapper"><div class="ct-input_wrapper"><label class="ct-input_label">' + constr_terms["ln-questionnaire-question"] + '</label><input name="quest-{%QID%}_question" class="ct-input" placeholder="' + constr_terms["ln-questionnaire-question-holder"] + '" type="text"></div><div class="ct-input_wrapper ct-ignore"><label class="ct-input_label">' + constr_terms["ln-questionnaire-question-type"] + '</label><div data-type="question" data-id="{%QID%}" class="ct-input ct-input_select" id="quest-{%QID%}-type"><span>' + constr_terms["ln-questionnaire-question-type-1"] + '</span><ul><li class="ct-input_select-current" data-type="0">' + constr_terms["ln-questionnaire-question-type-1"] + '</li><li data-type="1">' + constr_terms["ln-questionnaire-question-type-2"] + '</li></ul></div></div><div class="ct-hidden ct-input_wrapper"><input class="ct-input" name="quest-{%QID%}_type" value="0"></div><div class="ct-input_wrapper ct-input-dynamic"><div class="ct-input_wrapper-item"><label class="ct-input_label">' + constr_terms["ln-questionnaire-response-choice"] + ' <span>1</span></label><input type="text" class="ct-input" placeholder="' + constr_terms["ln-questionnaire-response-choice"] + '" name="quest-{%QID%}_answer[]"></div><div class="ct-input_remover"></div></div><div class="ct-input-dynamic_multiplier">' + constr_terms["ln-questionnaire-answer-add"] + '</div></div></div>';

        var setp = $('#alco').parents('.ct-panel_settings-page');
        setp.find('.submit_current').before('<div class="ct-addquests_wrapper"></div>');

        $(document).on('click', '.ct-addquest_tools-addremove', function () {
            var cont = $(this).parents('.ct-addquests-item');
            var tools = $(this).parents('.ct-addquest_tools');
            tools.toggleClass('active')

            cont.find('.ct-hidden_wrapper').toggleClass('active', tools.hasClass('active'))
            if (!tools.hasClass('active')) {
                cont.remove();
                $('.ct-addquests-item:not(.active)').remove();
            } else {
                cont.toggleClass('active', true);
            }

            addQuest();
        })

        $(document).on('click', '.ct-addquest_tools-higher', function () {
            var cont = $(this).parents('.ct-addquests-item');
            var cind = cont.index();
            if (cind > 0) {
                var precind = cind - 1;
                $($('.ct-addquests-item')[precind]).before(cont);
                recalcOrderQuest();
            }
        })

        $(document).on('click', '.ct-addquest_tools-lower', function () {
            var cont = $(this).parents('.ct-addquests-item');
            var tot = $('.ct-addquests-item.active').length;
            var cind = cont.index();
            if (cind < tot) {
                var precind = cind + 1;
                $($('.ct-addquests-item')[precind]).after(cont);
                recalcOrderQuest();
            }
        })
    }

    $.post(ajax_url, {action: 'loadQuestions', project: project}, function (data) {
        if (data != '') {
            template_val.questions = $.parseJSON(data);
        }

        if ($('.ct-addquests_wrapper').length === 0) {
            $('#alco').parents('.ct-panel_settings-page').find('.submit_current').before('<div class="ct-addquests_wrapper"></div>');
        }
        addQuest();
    })
}

function switchQuestionType(type, id) {
    var par = $('.ct-input_select#quest-' + id + '-type').parents('.ct-addquests-item');
    $('[name="quest-' + id + '_type"]').val(type);
    par.find('.ct-input-dynamic').toggleClass('ct-hidden', type > 0)
    par.find('.ct-input-dynamic_multiplier').toggleClass('ct-hidden', type > 0)
}

function setFontSize() {
    var ic = iframe.contents()
    var fs = ic.find('[data-sm-text="LOCATION_TITLE"]').css('font-size');
    var fw = ic.find('[data-sm-text="LOCATION_TITLE"]').css('font-weight');
    var tfs = ic.find('[data-sm-text="LOCATION_TEXT"]').css('font-size');
    var tfw = ic.find('[data-sm-text="LOCATION_TEXT"]').css('font-weight');

    if (ic.find('.sm-template13').length > 0 || ic.find('.sm-template69').length > 0) {
        fs = ic.find('[data-sm-text="LOCATION_SUBTITLE"]').css('font-size');
        fw = ic.find('[data-sm-text="LOCATION_SUBTITLE"]').css('font-weight');
    }

    ic.find('[data-sm-text="OWN_TITLE"], [data-sm-text="NEW_OWN_TITLE"]').css({'font-size': fs, 'font-weight': fw});
    ic.find('[data-sm-text="OWN_TEXT"],[data-sm-text="NEW_OWN_TEXT"]').css({'font-size': tfs, 'font-weight': tfw});
}

function initVideo() {
    var vis = iframe.contents().find('[data-sm-video]');
    if (vis.length > 0) {
        // if (typeof data_value['HEAD_VIDEO'] != 'undefined' && data_value['HEAD_VIDEO'] != '') {
        //     $.each(iframe.contents().find('[data-sm-video]'), function () {
        //         $(this).attr('src', data_value['HEAD_VIDEO']);
        //         $(this).attr('poster', '');
        //         $(this).parent().css('filter', 'none');
        //         $(this).parents('video')[0].load();
        //     });
        // }

        videoUploader();
    }
}

function videoUploader() {
    var hv = '';
    if (typeof data_value['HEAD_VIDEO'] != 'undefined' && data_value['HEAD_VIDEO'] != '') {
        hv = data_value['HEAD_VIDEO'];
    }
    $('#video_uploader').remove();
    $('#secondPanel [data-section="1"] .submit_current').before('<div class="ct-input_wrapper" id="video_uploader"><label class="ct-input_label">' + constr_terms["ln-video-label"] + ':<br><span style="font-size:90%">' + (hv == '' ? constr_terms["ln-video-file-limit"] : constr_terms["ln-video-file-exists"]) + '</span></label><div class="ct-button ct-pointer ct-video_remove ct-button_secondary ct-hidden">' + constr_terms["buttons_remove"] + '</div><div class="ct-button ct-pointer ct-video_uploader ">' + constr_terms["buttons_upload"] + '<input type="file" name="head_video_upload" value="" accept=".mp4,webm,video/*" class="ct-video_file"><input type="text" name="head_video" value="' + hv + '" class="ct-input ct-hidden"></div></div>')
    $('#video_uploader .ct-video_remove').toggleClass('ct-hidden', hv == '')
    $('#video_uploader .ct-video_uploader').toggleClass('ct-hidden', hv != '')
}