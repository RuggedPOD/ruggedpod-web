/*
 * RuggedPOD management web console
 *
 * Copyright (C) 2016 Guillaume Giamarchi <guillaume.giamarchi@gmail.com>
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

define(['ractive', 'hasher', 'client', 'notification', 'form'], function(ractive, hasher, client, notification, form) {

    ractive.on({
        'blade-edit-submit': function (event) {

            var bladeId = ractive.get("blade").id;

            var blade = {
                "id":  form.rawInput("idInput"),
                "name":  form.input("nameInput"),
                "description": form.input("descriptionInput"),
                "mac_address":  form.input("macaddressInput"),
            };

            client.http({
                path: '/blades/' + bladeId,
                method: 'PUT',
                data: JSON.stringify(blade),
                error: function (error) {
                    notification.showError('Unable to save blade ' + bladeId + ' information');
                },
                success: function(data) {
                    notification.showSuccess('Successfully saved blade ' + bladeId + ' information');
                }
            });
        },
        'blade-build-submit': function (event) {
            var blade = ractive.get("blade");
            client.http({
                path: '/blades/' + blade.id + '/build',
                method: 'POST',
                error: function (error) {
                    notification.showError('Unable to enabled build mode for blade ' + blade.id);
                },
                success: function(data) {
                    blade.building = true;
                    ractive.set("blade", blade);
                    notification.showSuccess('Successfully enabled build mode for blade ' + blade.id);
                }
            });
        },
        'blade-build-cancel': function (event) {
            var blade = ractive.get("blade");
            client.http({
                path: '/blades/' + blade.id + '/build',
                method: 'DELETE',
                error: function (error) {
                    notification.showError('Unable to cancel build for blade ' + blade.id);
                },
                success: function(data) {
                    blade.building = false;
                    ractive.set("blade", blade);
                    notification.showSuccess('Successfully canceled build for blade ' + blade.id);
                }
            });
        },
    });

    function initialize(params) {
        client.http({
            path: '/blades/' + params.bladeId,
            method: 'GET',
            error: function (error) {
                notification.showError('Unable to retrieve information for blade ' + params.bladeId);
            },
            success: function(blade) {
                ractive.set("blade", blade);
            }
        });
    }

    return {
        initialize: initialize
    };

});
