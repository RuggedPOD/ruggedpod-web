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
        ractive.set('currentBladeId', parseInt(params.bladeId));
        reloadSerialTerminal();
        initializePowerGauge();
    }

    function initializePowerGauge() {
        if (powerGauge === undefined) {
            powerGauge = gauge.createPowerGauge('gauge-power-current-blade');
        }
        powerGaugeRefresherId = setInterval(function () {
            var blades = ractive.get('blades');
            client.get({
                name: 'GetPowerConsumption',
                params: {
                    bladeId: ractive.data.currentBladeId
                },
                error: function (error) {
                },
                success: function(data) {
                    powerGauge.refresh(parseInt(data.powerConsumption));
                }
            });
        }, 1000);
    }

    function finalize() {
        clearInterval(powerGaugeRefresherId);
        $('#gauge-power-current-blade').empty();
        powerGauge = undefined;
    }

    return {
        initialize: initialize,
        finalize: finalize
    };

});
