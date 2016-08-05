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
                    notification.showError('Unable to save DHCP configuration');
                },
                success: function(data) {
                    refreshDhcp(data);
                    notification.showSuccess('Successfully applied DHCP configuration');
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
        },
        'i2c-detect': function(e) {
            var i2cBusList = ractive.get("i2c.i2c_bus_list");
            var i2cBus = ractive.get('i2c.i2c_power_bus');
            if (!i2cBus) {
                if (i2cBusList.length === 1) {
                    i2cBus = i2cBusList[0].id;
                    ractive.set('i2c.i2c_power_bus', i2cBus);
                }
                else {
                    return notification.showInfo('First, choose an I2C bus');
                }
            }
            client.http({
                path: '/i2c/' + i2cBus + '/detect',
                method: 'PUT',
                error: function (error, status, text) {
                    ractive.set('i2c.devices', null);
                    if (status === 409) {
                        return notification.showError(JSON.parse(text).message);
                    }
                    if (status === 404) {
                        return notification.showError("Cannot find I2C bus \"" + i2cBus + "\"");
                    }
                    notification.showError('Unable to detect I2C devices');
                },
                success: function(data) {
                    ractive.set('i2c.devices', data);
                }
            });
        },
        'i2c-choose-address': function(e, address) {
            ractive.set("i2c.i2c_power_address", '0x' + address);
        },
        'i2c-save': function(e, address) {
            client.http({
                path: '/i2c/' + ractive.get('i2c.i2c_power_bus') + '/devices/' + ractive.get('i2c.i2c_power_address'),
                method: 'POST',
                data: '{ "purpose": "power_read" }',
                error: function (error) {
                    notification.showError('Unable to save I2C configuration');
                },
                success: function(data) {
                    notification.showSuccess('Successfully applied I2C configuration');
                }
            });
        }
    });

    function refreshDhcp(data) {
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
                refreshDhcp(data);
            }
        });
        client.http({
            path: '/i2c',
            error: function () {
                notification.showError('Unable to detect I2C bus');
            },
            success: function(i2cBusList) {
                ractive.set("i2c.i2c_bus_list", i2cBusList);
                i2cBusList.forEach(function(bus) {
                    bus.devices.forEach(function(device) {
                        if (device.purpose === "power_read") {
                            ractive.set("i2c.i2c_power_bus", bus.id);
                            ractive.set("i2c.i2c_power_address", device.address);
                        }
                    });
                });
            }
        });
    }

    return {
        initialize: initialize
    };

});
