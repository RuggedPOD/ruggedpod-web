define(['ractive', 'hasher', 'gauge', 'client', 'notification'], function(ractive, hasher, gauge, client, notification) {

    var powerGaugeRefresherId;
    var powerGauge;

    ractive.on({
        'goto-blade-list': function (event) {
            hasher.setHash('bladeList');
        }
    });

    function reloadSerialTerminal() {
        var iframeId = $('#serial-terminal-iframe')[0];
        iframeId.src = iframeId.src;
    }

    function initialize(params) {
        ractive.set('currentBladeId', parseInt(params['bladeId']))
        reloadSerialTerminal();
        initializePowerGauge();
    }

    function initializePowerGauge() {
        if (powerGauge === undefined) {
            powerGauge = gauge.createPowerGauge('gauge-power-current-blade');
        }

        powerGaugeRefresherId = setInterval(function () {
            // TODO Replace by a real call API
            var delta = [-10, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 10];
            var power = 125 + Math.floor(Math.random() * delta.length);

            powerGauge.refresh(power);
        }, 1000);
    }

    function finalize() {
        clearInterval(powerGaugeRefresherId);
    }

    return {
        initialize: initialize,
        finalize: finalize
    }

});
