// Модальное окно
$('.open-modal').click(function() {
    $('.sm-questionnaire').addClass('sm-open')
    $('body').addClass('lock')
    $('html.animating [data-jsscroll]:not([data-jsscroll_nomob])').css('opacity','1')
})

$('.sm-quest-modal-close').click(function() {
    $('.sm-quest-modal').removeClass('sm-open')
    $('body').removeClass('lock')
})

const wishSliderParams = {
    slidesToShow: 1,
    infinite: true,
    adaptiveHeight: false,
    nextArrow: $('#wishes-navigation .sm-arrow-next'),
    prevArrow: $('#wishes-navigation .sm-arrow-prev'),
}

function onResize(){
    //
    // $('.sm-dress-code__slider1').slick({
    //     slidesToShow: 1,
    //     infinite: true,
    //     adaptiveHeight: true,
    //     nextArrow: $('.sm-dress-code__slider1').parents('.sm-dress-code__box-gallery__item').find('.sm-arrow-next'),
    //     prevArrow: $('.sm-dress-code__slider1').parents('.sm-dress-code__box-gallery__item').find('.sm-arrow-prev'),
    // });
    //
    // $('.sm-dress-code__slider2').slick({
    //     slidesToShow: 1,
    //     infinite: true,
    //     adaptiveHeight: true,
    //     nextArrow: $('.sm-dress-code__slider2').parents('.sm-dress-code__box-gallery__item').find('.sm-arrow-next'),
    //     prevArrow: $('.sm-dress-code__slider2').parents('.sm-dress-code__box-gallery__item').find('.sm-arrow-prev'),
    // });

}
//
// $(window).on('resize', function() {
//     onResize();
// });
function startAll() {
    startAllScripts();
    onResize();
}
const forms = document.querySelectorAll('.contact-form');
const thankYouMessage = document.getElementById('thankYouMessage');
const body = document.body;

// Обрабатываем каждую форму
forms.forEach(form => {

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // предотвращаем отправку формы по умолчанию
        thankYouMessage.classList.add('sm-open'); // показываем сообщение
        body.classList.add('sm-hidde'); // добавляем класс sm-hidde к body
        form.reset(); // очищаем форму
    });
});
// Закрываем модальное сообщение
$(".sm-modal-close").on('click', function() {
    $(this).closest('.sm-modal.sm-open').removeClass('sm-open');
    $('body').removeClass('lock');
})

$(window).on('load', function() {
    setTimeout(function(){
        console.log('len: '+$('.sm-dress-code__colors .sm_colors div').length);
        $('.sm_colors div').each(function (color) {
            if($(this).css('background')==$('.sm-dress-code').css('background')){
                $(this).css('border','solid 1px #262222');
            }
        });
    },700);
});


function checkVisibilityEr(element, callback, offset = 0) {

    const rect = element.getBoundingClientRect();
    const isVisible = (     rect.top <= (window.innerHeight + offset) &&         rect.bottom >= (0 - offset))
    if (isVisible) callback();
}

var isThrottleder = false;
$(function(){
    setTimeout(function(){
        var checkIntro = setInterval(function(){
            if(!$(body).hasClass('opener-active')) {
                handleScroller()
                clearInterval(checkIntro);
            }
        }, 500)
    },2000);
})
window.addEventListener('scroll',  () => {if (!isThrottleder) {
    handleScroller();
    isThrottleder = true;
    setTimeout(() => { isThrottleder = false; }, 100);
}})
// window.addEventListener('load',  () => {if (!isThrottleder) {
//     handleScroller();
//     isThrottleder = true;
//     setTimeout(() => { isThrottleder = false; }, 100);
// }})
window.addEventListener('resize', () => { if (!isThrottleder) {
    handleScroller();
    isThrottleder = true;
    setTimeout(() => { isThrottleder = false; }, 100);
}})
function handleScroller() {
    if(!$(body).hasClass('opener-active')) {
        document.querySelectorAll('.item-animation').forEach(el => {
            checkVisibilityEr(el, () => {
                el.classList.add('item-active');
            });
        });
    }
}


function handleAnimationTemplateElements(){
    if (document.readyState !== 'complete') return;

    $('.sm-js-animation').each(function() {
        const maxWidth = 434;
        const minWidth = 190;

        const scrollTop = $(window).scrollTop();

        // Если пользователь в самом верху страницы
        if (scrollTop <= 100) {
            $('.sm-js-animation').each(function () {
                $(this).css('--decor-width', maxWidth + 'px');
            });
            return;
        }

        // Иначе — обычная логика
        $('.sm-js-animation').each(function () {
            var $el = $(this);

            var windowHeight = $(window).height();
            var elTop = $el.offset().top;
            var elHeight = $el.outerHeight();

            var animationOffset = 50;
            var start = elTop - windowHeight + animationOffset;
            var end = elTop + elHeight / 2 - windowHeight / 2;

            var progressRaw = (scrollTop - start) / (end - start);
            var scrollProgress = Math.min(Math.max(progressRaw, 0), 1);

            var newWidth = maxWidth - (maxWidth - minWidth) * scrollProgress;

            $el.css('--decor-width', newWidth + 'px');
        });
    });
}
