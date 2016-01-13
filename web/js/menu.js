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

define(['ractive', 'hasher'], function(ractive, hasher) {

    var mapping = {
        "pod": "menuitem-pod",
        "bladeList": "menuitem-blades",
        "serialTerminal": "menuitem-blades",
        "configuration": "menuitem-configuration",
        "documentation": "menuitem-documentation",
        "users": "menuitem-users"
    };

    refresh = function(fragment) {
        var menuItemId = mapping[fragment];
        if (menuItemId === undefined) {
            menuItemId = fragment;
        }
        $('#side-menu').find('li').removeClass('active');
        $('#'+ menuItemId).addClass('active');
    };

    ractive.on({
        'goto-page': function(event, fragment) {
            refresh(fragment);
            hasher.setHash(fragment);
        },
        'refresh-sidemenu': function(event, fragment) {
            refresh(fragment);
        }
    });

    return {
        "mapping": mapping
    };

});
