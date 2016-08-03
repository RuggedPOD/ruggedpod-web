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

define(function () {

    function buildUrl(opts) {
        var url = '/api/v2' + opts.path;

        if (_.isUndefined(opts.params) || opts.params === null) {
            return url;
        }

        if (!_.isObject(opts.params)) {
            opts.error('"params" field must be an object', null);
            return url;
        }

        if (_.isEmpty(opts.params)) {
            return url;
        }

        url += '?';
        var isFirst = true;
        for (var key in opts.params) {
            if (isFirst) {
                isFirst = false;
            }
            else {
                url += '&';
            }
            url += key + '=' + opts.params[key];
        }

        return url;
    }

    function http(opts) {
        if (_.isUndefined(opts.path) || opts.path === '' || opts.path === null) {
            if (!_.isUndefined(opts.error)) {
                opts.error('"name" field is not defined', null);
            }
            return;
        }

        $.ajax({
            error: function (jqXHR, status, error) {
                if (jqXHR.status === 401) {
                    $.removeCookie('X-Auth-Token', { path: '/' });
                    $.removeCookie('X-Auth-Username', { path: '/' });
                    window.location.replace('/');
                }
                else if ("error" in opts) {
                    opts.error(error, jqXHR.status, jqXHR.responseText);
                }
            },
            success: function (data, status, jqXHR) {
                if ('success' in opts) {
                    opts.success(data, status);
                }
            },
            complete: function (jqXHR, status) {
                if ("complete" in opts) {
                    opts.complete(status);
                }
            },
            contentType: 'application/json',
            dataType: 'json',
            type: opts.method,
            data: opts.data,
            url: buildUrl(opts)
        });
    }

    return {
        http: http
    };

});
