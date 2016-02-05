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

define(['ractive', 'hasher', 'client', 'notification', 'form'], function(ractive, hasher, client, notification, form) {

    ractive.on({
        'user-add-submit': function(event) {

            user = {
                "username":  form.input("usernameInput"),
                "firstname": form.input("firstnameInput"),
                "lastname":  form.input("lastnameInput"),
                "password":  form.rawInput("passwordInput")
            };

            if (form.checkInputValues(user.username.length === 0,
                                     'Username and password are mandatory for a user',
                                     ['usernameInput', 'passwordInput', 'passwordConfirmInput'])) {
                return;
            }

            if (form.checkInputValues(user.password !== form.rawInput("passwordConfirmInput"),
                                     'Password fields does not match',
                                     ['passwordInput', 'passwordConfirmInput'])) {
                return;
            }

            client.http({
                path: '/users',
                method: 'POST',
                data: JSON.stringify(user),
                error: function (error) {
                    if (form.checkInputValues(error === 'CONFLICT',
                                              'A user with username "' + user.username + '" already exists',
                                              ['usernameInput'])) {
                        return;
                    }
                    notification.showError('Unable to create user');
                },
                success: function(data) {
                    notification.showSuccess('User successfully created');
                    hasher.setHash('users');
                }
            });
        }
    });

    function initialize(params) {
        form.setupSubmitButton('userCreateButton');
    }

    return {
        initialize: initialize
    };

});
