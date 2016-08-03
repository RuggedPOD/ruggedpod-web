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
        'dhcp-save': function() {
            client.http({
                path: '/dhcp',
                method: 'PUT',
                data: JSON.stringify(ractive.get('dhcp')),
                error: function (error, status, text) {
                    if (status === 409) {
                        return notification.showError(JSON.parse(text).message);
                    }
                    notification.showError('Unable to save DHCP information');
                },
                success: function(data) {
                    notification.showSuccess('Successfully applied DHCP information');
                    refresh(data);
                }
            });
        },
        'dhcp-infinite-lease-changed': function(e) {
            if (e.node.checked) {
                ractive.set('dhcp.dhcp_lease_duration', 'infinite');
            }
            else {
                ractive.set('dhcp.dhcp_lease_duration', '3600');
            }
        }
    });

    function refresh(data) {
        ractive.set('dhcp', data);
        if (data.dhcp_lease_duration === 'infinite') {
            ractive.set('dhcp.dhcp_infinite_lease', true);
        }
        else {
            ractive.set('dhcp.dhcp_infinite_lease', false);
        }
    }

    function initialize(params) {
        client.http({
            path: '/dhcp',
            method: 'GET',
            error: function (error) {
                notification.showError('Unable to fetch DHCP information');
            },
            success: function(data) {
                refresh(data);
            }
        });
    }

    return {
        initialize: initialize
    };

});
