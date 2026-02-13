function paymentAction(data) {
    if (typeof (_ym) != 'undefined' && _ym != 0) {
        ym(_ym, 'reachGoal', 'sitemakerBuyTry')
    }
    window.location.href = data;
}