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
            client.http({
                path: '/blades/' + ractive.data.currentBladeId,
                method: 'GET',
                error: function (error) {
                },
                success: function(data) {
                    powerGauge.refresh(parseInt(data.consumption));
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
