define(['ractive', 'hasher', 'gauge', 'client', 'notification'], function(ractive, hasher, gauge, client, notification) {

    var powerGaugeRefresherId;

    ractive.on({
        'all-pumps-on': function (event) {
            client.get({
                name: 'SetAllBladesOilPumpOn',
                error: function (error) {
                    notification.showError('Unable to start pumps');
                },
                success: function(data) {
                    notification.showSuccess('Pumps has been successfully started');
                }
            });
        },
        'all-pumps-off': function (event) {
            client.get({
                name: 'SetAllBladesOilPumpOff',
                error: function (error) {
                    notification.showError('Unable to stop pumps');
                },
                success: function(data) {
                    notification.showSuccess('Pumps has been successfully stopped');
                }
            });
        },
        'all-blades-on-off-short': function (event) {
            client.get({
                name: 'SetAllBladesShortOnOff',
                error: function (error) {
                    notification.showError('Unable to send a short press button on all blades');
                },
                success: function(data) {
                    notification.showSuccess('Successfully sent a short press button on all blades');
                }
            });
        },
        'all-blades-on-off-long': function (event) {
            client.get({
                name: 'SetAllBladesLongOnOff',
                error: function (error) {
                    notification.showError('Unable to send a long press button on all blades');
                },
                success: function(data) {
                    notification.showSuccess('Successfully sent a long press button on all blades');
                }
            });
        },
        'all-blades-reset': function (event) {
            client.get({
                name: 'SetAllBladesReset',
                error: function (error) {
                    notification.showError('Unable to reset all blades');
                },
                success: function(data) {
                    notification.showSuccess('Successfully reset all blades');
                }
            });
        },
        'blade-on-off-short': function (event, id) {
            client.get({
                name: 'SetBladeShortOnOff',
                params: {
                    bladeId: id
                },
                error: function (error) {
                    notification.showError('Unable to send a short press button on blade ' + id);
                },
                success: function(data) {
                    notification.showSuccess('Successfully sent a short press button on blade ' + id);
                }
            });
        },
        'blade-on-off-long': function (event, id) {
            client.get({
                name: 'SetBladeLongOnOff',
                params: {
                    bladeId: id
                },
                error: function (error) {
                    notification.showError('Unable to send a long press button on blade ' + id);
                },
                success: function(data) {
                    notification.showSuccess('Successfully sent a long press button on blade ' + id);
                }
            });
        },
        'blade-reset': function (event, id) {
            client.get({
                name: 'SetBladeReset',
                params: {
                    bladeId: id
                },
                error: function (error) {
                    notification.showError('Unable to reset blade ' + id);
                },
                success: function(data) {
                    notification.showSuccess('Successfully reset blade ' + id);
                }
            });
        },
        'serial-port-open-terminal': function (event, id) {
            client.get({
                name: 'StartBladeSerialSession',
                params: {
                    bladeId: id
                },
                error: function (error) {
                    notification.showError('Unable to open the serial terminal for blade' + id);
                },
                success: function(data) {
                    hasher.setHash('serialTerminal?bladeId=' + id);
                }
            });
        }
    });

    function initialize(params) {
        var blades = ractive.get('blades');
        var powerGauges = {};
        var powerGaugeCumulative = gauge.createCumulativePowerGauge('gauge-power-all');

        for (var i = 0 ; i < blades.length ; i++) {
            if (powerGauges[blades[i].id] === undefined) {
                powerGauges[blades[i].id] = gauge.createPowerGauge('gauge-power-' + blades[i].id);
            }
        }

        powerGaugeRefresherId = setInterval(function () {
            updatePowerBladesData();
            var cumulativePower = 0;
            for (var i = 0 ; i < blades.length ; i++) {
                powerGauges[blades[i].id].refresh(blades[i].power);
                cumulativePower += blades[i].power
            }
            powerGaugeCumulative.refresh(cumulativePower);
        }, 1000);

    }

    function updatePowerBladesData() {
        var blades = ractive.get('blades');

        // TODO Replace by a real call API
        var delta = [-10, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 10];
        for (var i = 0 ; i < blades.length ; i++) {
            blades[i].power = 125 + Math.floor(Math.random() * delta.length);
        }
    }

    function finalize(params) {
        clearInterval(powerGaugeRefresherId);
    }

    return {
        initialize: initialize,
        finalize: finalize
    }

});
