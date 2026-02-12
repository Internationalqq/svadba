$(function() {
    const urls = [
        "https://annaandalex.ru",
        "https://25092025.ru",
        "https://smirnovswedding.ru"
    ];

    const speed = 100;    // скорость печати
    const pause = 1500;   // пауза после печати
    let index = 0;
    let charIndex = 0;
    let typing = true;
    const $el = $('#typewriter');

    function type() {
        const text = urls[index];

        if (typing) {
            if (charIndex <= text.length) {
                $el.text(text.substring(0, charIndex++));
                setTimeout(type, speed);
            } else {
                typing = false;
                setTimeout(type, pause);
            }
        } else {
            if (charIndex >= 0) {
                $el.text(text.substring(0, charIndex--));
                setTimeout(type, speed / 2);
            } else {
                typing = true;
                index = (index + 1) % urls.length;
                setTimeout(type, speed);
            }
        }
    }

    type();

    $('.ct-tgauth').click(function(){
        initTelegramAuth();
    })
});