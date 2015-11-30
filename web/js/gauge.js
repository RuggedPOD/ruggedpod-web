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

define(function() {

    function create(elementId, title, initValue, maxValue) {
        return new JustGage({
            id: elementId,
            value: initValue,
            min: 0,
            max: maxValue,
            title: title,
            levelColors: ['#aaa']
        });
    }

    function createPowerGauge(elementId) {
        return create(elementId, 'Power (W)', 0, 200);
    }

    function createCumulativePowerGauge(elementId) {
        return create(elementId, 'Cumulative power (W)', 0, 800);
    }

    return {
        createPowerGauge: createPowerGauge,
        createCumulativePowerGauge: createCumulativePowerGauge
    };

});
