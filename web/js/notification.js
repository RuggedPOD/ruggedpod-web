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

define(['ractive', 'utils'], function(ractive, utils) {

    function show(text, severity) {
        var id = utils.generateID();
        var icon;
        if (severity === 'info') {
            icon = 'glyphicon-info-sign';
        }
        else if (severity === 'success') {
            icon = 'glyphicon-ok-sign';
        }
        else if (severity === 'danger') {
            icon = 'glyphicon-remove-sign';
        }
        else {
            return;
        }

        ractive.set('notification', {
            id: id,
            text: text,
            severity: severity,
            icon: icon
        });
        setTimeout(function(){
            n = ractive.get('notification');
            if (n !== null && n.id === id) {
                ractive.set('notification', null);
            }
        }, 2000);
    }

    function showInfo(text) {
        show(text, 'info');
    }

    function showSuccess(text) {
        show(text, 'success');
    }

    function showError(text) {
        show(text, 'danger');
    }

    return {
        showInfo: showInfo,
        showError: showError,
        showSuccess: showSuccess
    };

});
