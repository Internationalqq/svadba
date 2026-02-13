var recursiveSearch;
var possibilities = [];
var filter_options = [];


$(document).on('input', '.ct-domain_check', function () {
    this.value = this.value.replace(/[^a-z0-9.\-]/gi, '');
    var dotcheck = this.value.split('.ru');
    var domdotcheck = dotcheck[0].split('.wedwed');
    if (domdotcheck.length > 1) {
        dotcheck[0] = domdotcheck[0];
    }

    var domain = dotcheck[0].split('.').join('-');
    domainCheckHandler(domain);
})

$('.ct-present').click(function () {

    if (present_view !== false) {
        $.post(ajax_url, {action: 'present'}, function () {
            present_view = false;
            clearTimeout(pres_timer);
        });
    }
})

$(document).on('click', '#pay_more', function () {
    $.post(ajax_url, {action: 'pay_more'}, function (data) {
        if (data != 0) {
            window.location.href = data;
        } else {
            alert(constr_terms['ln-notify-pleasepay-fail']);
        }
    })
})

$(document).on('click', '.ct-tpl_selector-item_body', function () {
    $('.ct-tpl_selector-item').removeClass('active')
    $(this).parent().addClass('active');

    setPrice()

    var tpl = $(this).parent().data('tpl');
    var col = $(this).parent().find('.ct-tpl_selector-item_footer-colors li.active').index() + 1;
    var atype = $('#anim_type .ct-input_select-current').attr('data-id');
    var aspeed = $('#anim_speed .ct-input_select-current').attr('data-id');
    var hfont = $('#hfont .ct-input_select-current').attr('data-id');
    var tfont = $('#tfont .ct-input_select-current').attr('data-id');
    var noneedtoask = true;

    if (tpl != template_val.id) {
        if ($('.ct-cancel.active').length > 0) {
            noneedtoask = false;
            presaveTpl(tpl, col, atype, aspeed, hfont, tfont)
        }
    }

    if (noneedtoask) {
        presaveTpl(tpl, col, atype, aspeed, hfont, tfont)
    }
})

$(document).on('click', '.ct-tpl_selector-item_footer .ct-button, .ct-tpl_selector-item_footer span', function () {
    var titem = $(this).parents('.ct-tpl_selector-item')
    $('.ct-tpl_selector-item').removeClass('active')
    titem.toggleClass('active', true);

    setPrice()

    var tpl = titem.data('tpl');
    var col = titem.find('.ct-tpl_selector-item_footer-colors li.active').index() + 1;
    var atype = $('#anim_type .ct-input_select-current').attr('data-id');
    var aspeed = $('#anim_speed .ct-input_select-current').attr('data-id');
    var hfont = $('#hfont .ct-input_select-current').attr('data-id');
    var tfont = $('#tfont .ct-input_select-current').attr('data-id');
    var noneedtoask = true;

    if (tpl != template_val.id) {
        if ($('.ct-cancel.active').length > 0) {
            noneedtoask = false;
            presaveTpl(tpl, col, atype, aspeed, hfont, tfont)
        }
    }

    if (noneedtoask) {
        presaveTpl(tpl, col, atype, aspeed, hfont, tfont)
    }
})


if ($(this).parents('#ct-sort_templates').length > 0) {
    var ctpid = $('#ct-sort_templates .ct-input_select-current').data('id');
    if (ctpid != cursort_template) {
        if (ctpid == 4) {
            reSortFilter("price");
        } else if (ctpid == 1) {
            reSortFilter('popular', true);
        } else if (ctpid == 0) {
            reSortFilter('sort');
        } else if (ctpid == 2) {
            reSortFilter('colors', true);
        } else if (ctpid == 3) {
            reSortFilter('new', true);
        } else if (ctpid == 5) {
            reSortFilter("price", true);
        }
        cursort_template = ctpid;
    }
}


checkEmail = function (email) {
    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
}
$(document).on('input', '[name="email"]', function () {
    $('#prepay .ct-pay').toggleClass('ct-disabled', false);
    $('.ct-pleasepay [name="email"]').toggleClass('ct-input_error', false);
})

$('.ct-pay').click(function () {
    $('.ct-mob-menu').toggleClass('active', false);
    var tvid = (template_val.type_id > 1 && template_val.type_id != 5) ? 2 : template_val.type_id;

    if (payed != '0') {
        if (typeof template_user_type == 'undefined' || template_user_type == tvid || (template_user_type == 1 && tvid == 2) || template_user_type == 5) {
            saveProject();
        } else {
            $('.ct-modal[data-modal="modal_error"]').toggleClass('active', true)
        }
    } else {
        var that = $(this);
        $.post(ajax_url, {action: 'whois', domain: $('#domain_check').val()}, function (data) {
            var d = $.parseJSON(data);
            if (d[0] == '1') {
                if (that.parents('#prepay').length == 0) { // && paypcid == '0' ????
                    $('.ct-pleasepay_wrapper h3').text(constr_terms['ln-notify-pleasepay-trial'])
                    $('.ct-pleasepay').toggleClass('active', true);
                } else {
                    var domain = $('.ct-pleasepay [name="domain"]').val();
                    var email = $('.ct-pleasepay [name="email"]').val();
                    if (!checkEmail(email)) {
                        $('.ct-pleasepay [name="email"]').toggleClass('ct-input_error', true).focus();
                        $('#prepay .ct-pay').toggleClass('ct-disabled', true);
                    } else {
                        $.ajax({
                            type: 'POST',
                            url: ajax_url,
                            data: {action: 'payment', domain: domain, email: email},
                            success: function (data) {
                                if (data != 0) {
                                    console.log('here');
                                    paymentAction(data);
                                } else {
                                    alert(constr_terms['ln-notify-pleasepay-fail']);
                                }
                            }
                        });
                    }
                }
            } else {
                $('.ct-pleasepay_wrapper h3').text(constr_terms['ln-notify-pleasepay-domain'])
                $('.ct-pleasepay').toggleClass('active', true);
            }
        })
    }
})


$('.ct-update').click(function () {
    var groom = $('#changeData input[name="groom"]').val();
    var bride = $('#changeData input[name="bride"]').val();
    var main_date = $('#changeData input[name="main_date"]').val();
    var email = $('#changeData input[name="email"]').val();

    $.each($('#changeData input'), function () {
        $(this).toggleClass('ct-input_error', $(this).val() === '');
    })

    if ($('#changeData input.ct-input_error').length === 0) {
        $.post(ajax_url, {
            action: 'start',
            groom: groom,
            bride: bride,
            main_date: main_date,
            email: email
        }, function (data) {
            d_groom = groom;
            d_bride = bride;
            d_mdate = main_date;
            d_email = email;
            loadTemplateData();
        })
    }


})

$('.ct-resetpassword').click(function (e) {

    e.preventDefault();
    $.each($('.ct-splash input'), function () {
        if (!$(this).parents('.ct-input_wrapper').hasClass('ct-hidden')) {
            $(this).toggleClass('ct-input_error', $(this).val() === '' && $(this).attr('name') !== 'password');
        }
    });

    var ehash = '';

    if ($('.ct-splash input[name="ehash"]').length > 0) {
        ehash = $('.ct-splash input[name="ehash"]').val();
    }

    var email = $('.ct-splash input[name="email"]').val();
    if ($('.ct-splash input.ct-input_error').length === 0) {
        if (!psending) {
            psending = true;
            $.post(ajax_url, {
                action: 'reset',
                ehash: ehash,
                email: email
            }, function (data) {
                psending = false;
                if (data == 'auth') {
                    alert(constr_terms['ln-notify-error']);
                } else {
                    if (data != '0') {
                        alert(constr_terms['ln-notify-error']);
                    } else {
                        alert(constr_terms['ln-auth-email-sent']);
                    }
                }
            })
        }
    }

    return false;
})

$('.ct-toauth').click(function (e) {
    e.preventDefault();
    $(this).toggleClass('ct-hidden', true);
    $('.ct-toconstr').after('<div class="ct-pointer ct-tomain">' + constr_terms['ln-auth-back'] + '</div>')
    $('.ct-form_intro').text(constr_terms['ln-auth-email-code']);
    $('.ct-small').hide();
    $('.ct-toconstr').text(constr_terms['ln-auth-receive-code']);
    $.each($('.ct-splash input'), function () {
        $(this).parents('.ct-input_wrapper').toggleClass('ct-hidden', $(this).attr('name') != 'email')
    })
    return false;
})


$(document).on('click', '.ct-tomain', function (e) {
    e.preventDefault();
    $(this).remove();
    $('.ct-form_intro').text(constr_terms['ln-auth-fields']);
    $('.ct-small').show();
    $('.ct-toconstr').text(constr_terms['ln-auth-toconstr']);
    $('.ct-toauth').removeClass('ct-hidden')
    $.each($('.ct-splash input'), function () {
        $(this).parents('.ct-input_wrapper').toggleClass('ct-hidden', false)
    })
    return false;
})

$('.ct-toconstr').click(function (e) {
    e.preventDefault();
    var groom = $('.ct-splash input[name="groom"]').val();
    var bride = $('.ct-splash input[name="bride"]').val();
    var main_date = $('.ct-splash input[name="main_date"]').val();
    var email = $('.ct-splash input[name="email"]').val();

    var ehash = '';
    if ($('.ct-splash input[name="ehash"]').length > 0) {
        ehash = $('.ct-splash input[name="ehash"]').val();
    }

    var pass = '';
    if ($('input[name="password"]').length > 0) {
        pass = $('input[name="password"]').val();
    }

    $.each($('.ct-splash input'), function () {
        $(this).toggleClass('ct-input_error', !$(this).parents('.ct-input_wrapper').hasClass('ct-hidden') && $(this).val() === '');
    })

    if ($('.ct-splash input.ct-input_error').length === 0) {
        $('body').toggleClass('sending', true);
        if (pass != '') {
            if (!psending) {
                psending = true;
                $.post(ajax_url, {
                    action: 'auth',
                    password: pass,
                    ehash: ehash,
                    email: email
                }, function (data) {
                    if (data == 'auth') {
                        $('body').toggleClass('sending', false);
                        psending = false;
                        alert(constr_terms['ln-notify-error']);
                    } else {
                        var d = $.parseJSON(data);
                        if (d[0] == 'ok' && d.length > 1) {
                            if (d[1] == '/sitemaker/' && typeof (_ym) != 'undefined' && _ym != 0) {
                                ym(_ym, 'reachGoal', 'sitemakerReg');
                            }

                            window.location.href = d[1];
                        }
                    }
                })
            }
        } else {    // первый этап
            var oper = 'start';
            var wtg = 0;
            if ($('.ct-splash input[name="bride"]').parents('.ct-input_wrapper').hasClass('ct-hidden')) {
                oper = 'restart';
            } else {
                wtg = $('.ct-telegram').length > 0 && $('.ct-telegram input').is(':checked');
            }
            console.log(oper);

            if (!psending) {
                psending = true;
                $.post(ajax_url,
                    {
                        action: oper,
                        groom: groom,
                        wtg: Number(wtg),
                        bride: bride,
                        main_date: main_date,
                        email: email
                    }, function (data) {
                        if (data == 'auth') {
                            psending = false;
                            $('body').toggleClass('sending', false);
                            alert(constr_terms['ln-notify-error']);
                        } else {
                            $('body').toggleClass('sending', false);
                            if (wtg) {
                                initTelegramAuth();
                                return false;
                            } else {
                                if (data == 'ok') {
                                    $('.ct-splash').removeClass('active');
                                    d_groom = groom;
                                    d_bride = bride;
                                    d_mdate = main_date;
                                    d_email = email;
                                    psending = false;
                                    var urlParams = new URLSearchParams(window.location.search);
                                    var n = urlParams.toString();
                                    console.log(n);
                                    if (n == 'new=') {

                                        window.location.href = '/sitemaker/';
                                    } else {
                                        loadTemplateData();
                                    }
                                } else if (data == 'nouser') {
                                    alert(constr_terms['ln-auth-email-error']);
                                } else {
                                    window.location.href = '/sitemaker/?e=' + data;
                                }
                            }
                        }
                    })
            }
        }
    }

    return false;

})

$('.ct-demo').click(function () {
    // $('body').toggleClass('ct-demonstration');
    // iframe.contents().find('.sm-edit').removeClass('sm-hidden');
    // if($('body').hasClass('ct-demonstration')) {
    //     $.each(offsections, function (k, v) {
    //         iframe.contents().find('.sm-edit[data-type="'+(v+1)+'"]').addClass('sm-hidden');
    //     })
    // }
    // setTimeout(function(){
    //     ifresize();
    // },500)
})

$('.ct-cancel').click(function () {
    undoProject();
    //cleanProject();
})
$('.ct-redo').click(function () {
    redoProject();
    //cleanProject();
})

$('.ct-democlose').click(function () {
    $(this).parent().hide();
})

$('#ct-domain_block:not(.hovered) .ct-domain_info svg').on('mouseover', function () {
    $('#ct-domain_block').toggleClass('active', true);
    $('#ct-domain_block').toggleClass('hovered', true);
    $('.ct-domain_helper').css('top', $('.ct-domain_info').offset().top - 100);
});

$('#ct-domain_block .ct-domain_info svg').on('click', function () {
    $('#ct-domain_block').toggleClass('active');
    $('.ct-domain_helper').css('top', $('.ct-domain_info').offset().top - 100);
})

$('.js-filter').click(function () {
    $('.ct-panel_settings-page').removeClass('active');
    $('#filterTpl').toggleClass('active', true)
});

$('[name="finp[]"]').on('change', function () {
    var par = $(this).parents('.ct-menu_wrapper').index();
    getFacet(par);
})

$('.ct-resetfilter').click(function () {
    resetAll();
    $('#filterTpl').toggleClass('active', false);
    $('#selectTpl').toggleClass('active', true)
})

$('.ct-subfilter').click(function () {
    getFacet();
    $('#filterTpl').toggleClass('active', false);
    $('#selectTpl').toggleClass('active', true)
})


$('#filterTpl .ct-subtitle').on('click', function () {
    $(this).parents('.ct-menu_wrapper').toggleClass('active')
    if ($(this).parents('.ct-menu_wrapper').hasClass('active')) {
        $(this).parents('.ct-menu_wrapper').find('.ct-menu_section').show()
    } else {
        $(this).parents('.ct-menu_wrapper').removeClass('start')
        $(this).parents('.ct-menu_wrapper').find('.ct-menu_section').hide()
    }
})

$('.start').each(function () {
    $(this).find('.ct-subtitle').click()
})

$('.ct-filter-toggle').on('click', function () {
    if ($(this).hasClass('active')) {
        $(this).find('.ct-filter-toggle-title').text(constr_terms['ln-filter-show-all'])
        $(this).parents('.ct-menu_wrapper').find('.ct-menu_section').removeClass('active')
        $(this).removeClass('active').parents('.ct-menu_section').find('.ct-field-hidden-wrap').hide(200);
    } else {
        $(this).find('.ct-filter-toggle-title').text(constr_terms['ln-filter-hide'])
        $(this).addClass('active').parents('.ct-menu_section').find('.ct-field-hidden-wrap').show(200, function () {
            $(this).parents('.ct-menu_wrapper').find('.ct-menu_section').addClass('active')
        });
    }
    return false;
})

document.addEventListener('DOMContentLoaded', () => {
    const accordions = document.querySelectorAll('.ct-accordion');
    accordions.forEach(el => {
        el.addEventListener('click', (e) => {
            const self = e.currentTarget;
            const control = self.querySelector('.ct-accordion__control');
            const content = self.querySelector('.ct-accordion__content');
            self.classList.toggle('open');
            if (self.classList.contains('open')) {
                control.setAttribute('aria-expanded', true);
                content.setAttribute('aria-hidden', false);
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                control.setAttribute('aria-expanded', false);
                content.setAttribute('aria-hidden', true);
                content.style.maxHeight = null;
            }
        });
    });
});

$(document).on('mouseover', '.ct-tpl_selector-item.active .ct-tpl_selector-item_footer-colors li', function () {
    var col = $(this).index() + 1;
    iframe.contents().find('body').removeClass().toggleClass('sm-color' + col, true);
})

$(document).on('mouseout', '.ct-tpl_selector-item.active .ct-tpl_selector-item_footer-colors li', function () {
    var col = $(this).parents('.ct-tpl_selector-item_footer-colors').find('li.active').index() + 1;
    iframe.contents().find('body').removeClass().toggleClass('sm-color' + col, true);
})

$(document).on('click', '.ct-tpl_selector-item_footer-colors li', function () {
    $('.ct-tpl_selector-item').removeClass('active')
    $(this).parents('.ct-tpl_selector-item').toggleClass('active', true);

    setPrice();
    $(this).parent().find('li').removeClass('active');
    $(this).toggleClass('active', true);

    var tpl = $(this).parents('.ct-tpl_selector-item').data('tpl');
    var col = $(this).index() + 1;
    var atype = $('#anim_type .ct-input_select-current').attr('data-id');
    var aspeed = $('#anim_speed .ct-input_select-current').attr('data-id');
    var hfont = $('#hfont .ct-input_select-current').attr('data-id');
    var tfont = $('#tfont .ct-input_select-current').attr('data-id');

    presaveTpl(tpl, col, atype, aspeed, hfont, tfont);
})


