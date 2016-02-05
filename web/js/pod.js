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
        'all-pumps-on': function (event) {
            notification.showInfo('Pumps management is not available in this version');
        },
        'all-pumps-off': function (event) {
            notification.showInfo('Pumps management is not available in this version');
        },
        'all-blades-on-off-short': function (event) {
            var savedSourceContent = beforeBladeAction(event);
            client.http({
                path: '/blades/power',
                method: 'PATCH',
                params: {
                    long: false
                },
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
            client.http({
                path: '/blades/power',
                method: 'PATCH',
                params: {
                    long: true
                },
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
            client.http({
                path: '/blades/reset',
                method: 'PATCH',
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
        }
    });

    function beforeBladeAction(event) {
        var source = $('#' + event.node.id);
        var savedContent = source.contents();
        source.empty().append('<img src="/img/loading.gif" width="40px"/>');
        _toggleButtonsActivation(false);
        return savedContent;
    }

    function afterBladeAction(event, savedSourceContent) {
        var source = $('#' + event.node.id);
        source.empty().append(savedSourceContent);
        _toggleButtonsActivation(true);
    }

    function _toggleButtonsActivation(enabled) {
        $(".blade-container").find(".btn").each(function(i, element) {
            if (enabled) {
                $(element).removeClass('disabled');
                $(element).removeClass('btn-disabled');
            }
            else {
                $(element).addClass('disabled');
                $(element).addClass('btn-disabled');
            }
        });
    }

    function initialize(params) {
        var powerGaugeCumulative = gauge.createCumulativePowerGauge('gauge-power-all');
        powerGaugeRefresherId = setInterval(function () {
            client.http({
                path: '/blades',
                error: function (error) {
                },
                success: function(data) {
                    cumulativePower = 0;
                    for (var i = 0 ; i < data.length ; i++) {
                        cumulativePower += data[i].consumption;
                    }
                    powerGaugeCumulative.refresh(cumulativePower);
                }
            });
        }, 1000);
    }

    function updatePowerBladesData() {
        var blades = ractive.get('blades');
        client.http({
            path: '/blades',
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
