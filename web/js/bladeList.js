/*
 * RuggedPOD management web console
 *
 * Copyright (C) 2015 Guillaume Giamarchi <guillaume.giamarchi@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

define(['ractive', 'hasher', 'gauge', 'client', 'notification'], function(ractive, hasher, gauge, client, notification) {

    var powerGaugeRefresherId;

    ractive.on({
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
        source.empty().append('<img src="/img/loading.gif" width="40px"/>');
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
                $(element).removeClass('btn-disabled');
            }
            else {
                $(element).addClass('disabled');
                $(element).addClass('btn-disabled');
            }
        };

        for (var id = bladeIdStart ; id <= bladeIdEnd ; id++) {
            $('#blade-button-' + id).find('.btn').each(toggleDisabledClass);
        }
    }

    function initialize(params) {
        var blades = ractive.get('blades');
        var powerGauges = {};

        for (var i = 0 ; i < blades.length ; i++) {
            if (powerGauges[blades[i].id] === undefined) {
                powerGauges[blades[i].id] = gauge.createPowerGauge('gauge-power-' + blades[i].id);
            }
        }

        powerGaugeRefresherId = setInterval(function () {
            updatePowerBladesData();
            for (var i = 0 ; i < blades.length ; i++) {
                powerGauges[blades[i].id].refresh(blades[i].power);
            }
        }, 1000);

    }

    function updatePowerBladesData() {
        var blades = ractive.get('blades');
        client.get({
            name: 'GetAllPowerConsumption',
            error: function (error) {
            },
            success: function(data) {
                var blades = ractive.get('blades');
                var bladeMap = {};
                for (var i = 0 ; i < blades.length ; i++) {
                    bladeMap[blades[i].id] = blades[i];
                }
                var power = data.PowerConsumptionResponse;
                for (i = 0 ; i < power.length ; i++) {
                    var bladeId = power[i].bladeResponse.bladeNumber;
                    bladeMap[bladeId].power = parseInt(power[i].powerConsumption);
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
