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
            var savedSourceContent = beforeBladeAction(event);
            client.get({
                name: 'SetAllBladesShortOnOff',
                error: function (error) {
                    notification.showError('Unable to send a short press button on all blades');
                },
                success: function(data) {
                    notification.showSuccess('Successfully sent a short press button on all blades');
                },
                complete: function(status) {
                    afterBladeAction(event, savedSourceContent);
                }
            });
        },
        'all-blades-on-off-long': function (event) {
            var savedSourceContent = beforeBladeAction(event);
            client.get({
                name: 'SetAllBladesLongOnOff',
                error: function (error) {
                    notification.showError('Unable to send a long press button on all blades');
                },
                success: function(data) {
                    notification.showSuccess('Successfully sent a long press button on all blades');
                },
                complete: function(status) {
                    afterBladeAction(event, savedSourceContent);
                }
            });
        },
        'all-blades-reset': function (event) {
            var savedSourceContent = beforeBladeAction(event);
            client.get({
                name: 'SetAllBladesReset',
                error: function (error) {
                    notification.showError('Unable to reset all blades');
                },
                success: function(data) {
                    notification.showSuccess('Successfully reset all blades');
                },
                complete: function(status) {
                    afterBladeAction(event, savedSourceContent);
                }
            });
        },
        'blade-on-off-short': function (event, id) {
            var savedSourceContent = beforeBladeAction(event, id);
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
                },
                complete: function(status) {
                    afterBladeAction(event, savedSourceContent, id);
                }
            });
        },
        'blade-on-off-long': function (event, id) {
            var savedSourceContent = beforeBladeAction(event, id);
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
                },
                complete: function(status) {
                    afterBladeAction(event, savedSourceContent, id);
                }
            });
        },
        'blade-reset': function (event, id) {
            var savedSourceContent = beforeBladeAction(event, id);
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
                },
                complete: function(status) {
                    afterBladeAction(event, savedSourceContent, id);
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

    function beforeBladeAction(event, bladeId) {
        var source = $('#' + event.node.id);
        var savedContent = source.contents();
        source.empty().append('<img src="/img/loading.gif" />');
        _toggleButtonsActivation(bladeId, false);
        return savedContent;
    }

    function afterBladeAction(event, savedSourceContent, bladeId) {
        var source = $('#' + event.node.id);
        source.empty().append(savedSourceContent);
        _toggleButtonsActivation(bladeId, true);
    }

    function _toggleButtonsActivation(bladeId, enabled) {
        var bladeIdStart;
        var bladeIdEnd;

        if (bladeId === undefined) {
            bladeIdStart = 1;
            bladeIdEnd = 4;
        }
        else {
            bladeIdStart = bladeId;
            bladeIdEnd = bladeId;
        }

        var toggleDisabledClass = function(i, element) {
            if (enabled) {
                $(element).removeClass('disabled');
            }
            else {
                $(element).addClass('disabled');
            }
        };

        for (var id = bladeIdStart ; id <= bladeIdEnd ; id++) {
            $('#blade-button-' + id).find('button').each(toggleDisabledClass);
        }
        $("#all-blades-button").find("button").each(toggleDisabledClass);
    }

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
                cumulativePower += blades[i].power;
            }
            powerGaugeCumulative.refresh(cumulativePower);
        }, 1000);

    }

    function updatePowerBladesData() {
        var blades = ractive.get('blades');
        client.get({
            name: 'GetAllPowerConsumption',
            error: function (error) {
            },
            success: function(data) {
                for (var i = 0 ; i < blades.length ; i++) {
                    blades[i].power = parseInt(data.PowerConsumptionResponse[i].powerConsumption);
                }
            }
        });
    }

    function finalize(params) {
        clearInterval(powerGaugeRefresherId);
    }

    return {
        initialize: initialize,
        finalize: finalize
    };

});
