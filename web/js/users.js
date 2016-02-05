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

define(['ractive', 'hasher', 'client', 'notification'], function(ractive, hasher, client, notification) {

    ractive.on({
        'user-add': function(event) {
            hasher.setHash('usersAdd');
        },
        'user-edit': function(event, id) {
            notification.showInfo('Sorry, user modification is not yet implemented in this version');
        },
        'user-delete': function(event, id) {
            client.http({
                path: '/users/' + id,
                method: 'DELETE',
                error: function (error) {
                    notification.showError('Unable to delete user');
                },
                success: function(data) {
                    notification.showSuccess('User successfully deleted');
                    initialize();
                }
            });
        }
    });

    function initialize(params) {
        client.http({
            path: '/users',
            method: 'GET',
            error: function (error) {
                notification.showError('Unable to retrieve user list from server');
            },
            success: function(data) {
                ractive.set('users', data);
            }
        });
    }

    return {
        initialize: initialize
    };

});
