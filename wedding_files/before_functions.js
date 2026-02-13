function setPrice() {

    var cur_price = $('.ct-tpl_selector-item.active').find('.ct-tpl_selector-item_footer-price')
    if (cur_price.length > 0 && payed == 0) {
        if (Number(paypcid) > 0) {
            $('.ct-current_template-price').html(constr_terms['ln-payments-template-more'] + ' <b>' + cur_price.text() + '</b>');
        } else {
            $('.ct-current_template-price').html(constr_terms['ln-payments-template'] + ' <b>' + cur_price.text() + '</b>');
        }

        $('.ct-pay').text(constr_terms['ln-button-pay']);
        $('.ct-modal_content .ct-pay').text(constr_terms['ln-button-pay']);
        $('.ct-header .ct-pay').text((Number(paypcid) > 0) ? constr_terms['ln-button-pay-short'] : constr_terms['ln-button-publish'])
    } else {
        $('.ct-current_template-price').html('');
        $('.ct-pay').text(constr_terms['ln-button-publish'])
    }

    if ($('.ct-type_switcher').length > 0) {
        var template_type = $('.ct-tpl_selector-item.active').attr('data-template_type');
        if (template_type) {
            template_type = (template_type > 1 && template_type != 5) ? 3 : template_type;
            $('.ct-type_switcher-item[data-type="' + template_type + '"]').click();
        }
        $('.ct-present').toggleClass('ct-hidden', template_val.type_id > 1 && template_val.type_id != 5)
    }
}


function translit(word) {
    var answer = '';
    var converter = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
        'е': 'e', 'ё': 'e', 'ж': 'zh', 'з': 'z', 'и': 'i',
        'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
        'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
        'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch',
        'ш': 'sh', 'щ': 'sch', 'ь': '', 'ы': 'y', 'ъ': '',
        'э': 'e', 'ю': 'yu', 'я': 'ya',

        'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D',
        'Е': 'E', 'Ё': 'E', 'Ж': 'Zh', 'З': 'Z', 'И': 'I',
        'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M', 'Н': 'N',
        'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T',
        'У': 'U', 'Ф': 'F', 'Х': 'H', 'Ц': 'C', 'Ч': 'Ch',
        'Ш': 'Sh', 'Щ': 'Sch', 'Ь': '', 'Ы': 'Y', 'Ъ': '',
        'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
    };

    for (var i = 0; i < word.length; ++i) {
        if (converter[word[i]] == undefined) {
            answer += word[i];
        } else {
            answer += converter[word[i]];
        }
    }

    return answer;
}


function checkDomain(domains, iter) {
    var od = $('#domain_check').val();
    if (!payed || (payed && $('#domain_check').val() == '')) {
        $.post(ajax_url, {action: 'whois', domain: domains[iter]}, function (data) {
            var d = $.parseJSON(data);
            if (d[0] != '1' && iter < (domains.length - 1)) {
                iter++;
                checkDomain(domains, iter);
            } else {

                var smdom = '.ru';

                if ((typeof (main_domain) != 'undefined' && main_domain != 'wedwed.ru') || (typeof (main_country) != 'undefined' && main_country != '0') || ($('.ct-tpl_selector-item.active').attr('data-template_type') > 1 && $('.ct-tpl_selector-item.active').attr('data-template_type') != 5)) {
                    smdom = '.' + main_domain;
                }

                if (od != domains[iter] + smdom) {
                    $('#domain_check').val(domains[iter] + smdom).trigger('input')
                } else {
                    $('.ct-domain_check').parents('.ct-input_wrapper').find('.ct-input_hint').text(od + ' ' + constr_terms['ln-domain-available']);
                    $('.ct-domain_check').parents('.ct-input_wrapper').toggleClass('ct-success', true);
                    $('#mainSettings .ct-pay').toggleClass('ct-disabled', false)
                    $('.ct-pleasepay .ct-pay').toggleClass('ct-disabled', false)
                    $('.ct-demotext .ct-pay').toggleClass('ct-disabled', false)
                }
            }
        })
    } else {
        if ((typeof (main_domain) != 'undefined' && main_domain != 'wedwed.ru') || (typeof (main_country) != 'undefined' && main_country != '0') || ($('.ct-tpl_selector-item.active').attr('data-template_type') > 1 && $('.ct-tpl_selector-item.active').attr('data-template_type') != 5) && od.split(main_domain).length <= 1) {
            $('#domain_check').val('');
            checkDomain(domains, iter)
        } else {
            $('.ct-domain_check').parents('.ct-input_wrapper').find('.ct-input_hint').text(od + ' ' + constr_terms['ln-domain-available']);
            $('.ct-domain_check').parents('.ct-input_wrapper').toggleClass('ct-success', true);
            $('#mainSettings .ct-pay').toggleClass('ct-disabled', false)
            $('.ct-pleasepay .ct-pay').toggleClass('ct-disabled', false)
            $('.ct-demotext .ct-pay').toggleClass('ct-disabled', false)
        }
    }
}

function domainCheckHandler(domain) {
    $.each($('.ct-domain_check'), function () {
        $(this).parent().removeClass('ct-loading').removeClass('ct-error').removeClass('ct-success');
        $(this).parent().find('.ct-input_hint').text(constr_terms['ln-domain-minimum']);
    })

    $('.ct-demotext .ct-pay').toggleClass('ct-disabled', true)
    $('#mainSettings .ct-pay').toggleClass('ct-disabled', true)
    $('.ct-pleasepay .ct-pay').toggleClass('ct-disabled', true)

    clearTimeout(inp);

    if (domain.length > 2) {
        inp = setTimeout(function () {
            $.each($('.ct-domain_check'), function () {
                $(this).parent().toggleClass('ct-loading', true);
                $(this).parent().find('.ct-input_hint').text(constr_terms['ln-domain-checking'])
            })
            domain = domain.replace(/-$/, '');
            $.post(ajax_url, {action: 'whois', domain: domain}, function (data) {
                var d = $.parseJSON(data);
                var st = d[1] + (d[0] == '1' ? ' ' + constr_terms['ln-domain-available'] : ' ' + constr_terms['ln-domain-not-available']);
                if (d[0] == 1) {
                    d_domain = domain;
                }

                $.each($('.ct-domain_check'), function () {
                    $(this).val(domain);
                    $(this).parent().toggleClass('ct-success', d[0] == '1').toggleClass('ct-error', d[0] == '0').toggleClass('ct-loading', false);
                    $(this).parent().find('.ct-input_hint').html(st);
                })

                $('.ct-demotext .ct-pay').toggleClass('ct-disabled', d[0] == '0')
                $('#mainSettings .ct-pay').toggleClass('ct-disabled', d[0] == '0')
                $('.ct-pleasepay .ct-pay').toggleClass('ct-disabled', d[0] == '0')
            })
        }, 500)
    }
}


/* Telegram Auth */
function CheckConfirmChangeOperation() {
    clearTimeout(checkCook);
    var formData = new FormData();
    formData.append('action', 'checkCook');
    $.ajax({
        url: "/ixml/tgapism.php",
        data: formData,
        contentType: false,
        processData: false,
        type: 'POST',
        success: function (result) {
            console.log('checkCook: '+result);
            if (result == 'nocook') {
                // alert('NO COOKIE!')
            } else if (result != '1' && result != '0') {
                // alert(result)
                window.location.href = '/sitemaker/?tginit=1&tauth=' + result;
            } else {
                checkCook = setTimeout(function () {
                    CheckConfirmChangeOperation()
                }, 5000);
            }
        },
        error: function (jqXHR, exception) {
            if (jqXHR.status !== 0)
                alert(constr_terms['ln-notify-unknown-error'] + " status:" + ' ' + jqXHR.status + ', exception: ' + exception, 'error');
        }
    });
}


function MakeHashStr(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;

    for (var i = 0; i < length; i++)
        result += characters.charAt(Math.floor(Math.random() * charactersLength));

    return result;
}

function GetCookieValueByName(cookiename) {
    var cookiestring = RegExp(cookiename + "=[^;]+").exec(document.cookie);
    return decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./, "") : "");
}

function GetCookie(name) {
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    } else {
        begin += 2;
        var end = document.cookie.indexOf(";", begin);
        if (end == -1) {
            end = dc.length;
        }
    }

    return decodeURI(dc.substring(begin + prefix.length, end));
}

function setAddCookie(c_name, value, exdays = 1) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null)
            ? "" : "; expires=" + exdate.toUTCString())
        + "; path=/";
    document.cookie = c_name + "=" + c_value;
}

function initTelegramAuth(d) {
    clearTimeout(checkCook)
    $('.tghelper').toggleClass('active', true);
    confirm_code = MakeHashStr(22);

    tglink = 'tg://resolve?domain=wedding_website_wedwed_bot&start=sitemaker-' + confirm_code;
    $('.qrcode').html('');

    setAddCookie('qr_cookie', confirm_code);

    $.post(ajax_url, {action: 'subtg'}, function (data) {

    });

    $('.qrcode').qrcode({
        render: 'image',
        quiet: 1,
        size: 200,
        fill: '#1d1d1d',
        minVersion: 6,
        radius: .5,
        maxVersion: 40,
        ecLevel: 'H',
        background: '#fff',
        mode: 4,
        mSize: 0.3,
        mPosX: 0.5,
        mPosY: 0.5,
        image: img_buffer,
        text: tglink,
    }).attr('title', tglink);

    document.location.replace(tglink);

    checkCook = setTimeout(function () {
        CheckConfirmChangeOperation()
    }, 5000);
}

function reSortFilter(field, desc = false) {

    var result = $(".ct-tpl_selector-item").sort(function (a, b) {
        var contentA = parseInt($(a).data(field));
        var contentB = parseInt($(b).data(field));
        if (!desc) {
            return (contentA < contentB) ? -1 : (contentA > contentB) ? 1 : 0;
        } else {
            return (contentA < contentB) ? 1 : (contentA > contentB) ? -1 : 0;
        }
    });
    $('.ct-tpl_selector').html(result);
}

recursiveSearch = function (text, depth) {
    text = text || "";
    depth = depth || 0;
    if (typeof (filter_options[depth]) != 'undefined' && filter_options[depth].length > 0) {
        for (var i = 0; i < filter_options[depth].length; i++) {
            if (depth + 1 < filter_options.length)
                recursiveSearch(text + ((text == "") ? "" : "") + filter_options[depth][i], depth + 1);
            else
                possibilities.push(text + filter_options[depth][i]);
        }

    } else {
        recursiveSearch(text, depth + 1);
    }
}


function getFacet(par = -1) {
    var ch = $('[name="finp[]"]:checked');
    if (ch.length > 0) {
        $('.ct-tpl_selector-item').toggleClass('ct-hidden', true);
        filter_options = [];
        possibilities = [];
        $.each(ch, function () {
            var v = $(this).val();
            var i = $(this).parents('.ct-menu_wrapper').index() - 1;

            if (!filter_options[i]) {
                filter_options[i] = [];
            }
            filter_options[i].push('[data-f' + v + ']');
        })
        recursiveSearch()
        $.each(possibilities, function (k, v) {
            $('.ct-tpl_selector-item' + v).toggleClass('ct-hidden', false);
        })
        $('#selectTpl .js-filter').toggleClass('active', true);
    } else {
        resetAll()
    }
    reFacet(par);
}

function startPresent() {
    clearTimeout(pres_timer);
    if ($('.ct-present').length > 0) {
        pres_timer = setTimeout(function () {
            if (present_view !== false) {
                $('.ct-present').click();
            }
        }, 120000)
    }
}

function reFacet(par) {
    $('[name="finp[]"]:not(:checked)').parents('.ct_checkbox').toggleClass('ct-disabled', true);
    var dot = [];
    $.each($('.ct-tpl_selector-item:not(.ct-hidden)'), function () {
        var d = $(this).data()
        $.each(d, function (k, v) {
            var da = k.split('f');
            if (da.length > 1) {
                dot.push(da[1]);
            }
        })
    })

    if (dot.length > 0) {
        $.each(dot, function (k, v) {
            $('[name="finp[]"][value="' + v + '"]').parents('.ct_checkbox').toggleClass('ct-disabled', false);
        })
    }

    if (par > -1) {
        $($('#filterTpl .ct-menu_wrapper')[(par - 1)]).find('.ct_checkbox').toggleClass('ct-disabled', false);
    }
}

function resetAll() {
    $('#selectTpl .js-filter').toggleClass('active', false);
    $('.ct-tpl_selector-item').toggleClass('ct-hidden', false);
    $('[name="finp[]"]').prop('checked', false);
    $('[name="finp[]"]').parents('.ct_checkbox').toggleClass('ct-disabled', false);
}

function setCook(name, value, options = {}) {
    options = {
        path: '/',
    };

    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }

    document.cookie = updatedCookie;
}
