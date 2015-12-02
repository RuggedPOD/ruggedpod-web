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

    function xml2object(node) {

        var	data = {};

        // append a value
        function add(name, value) {
            if (data[name]) {
                if (data[name].constructor != Array) {
                    data[name] = [data[name]];
                }
                data[name][data[name].length] = value;
            }
            else {
                data[name] = value;
            }
        }

        // element attributes
        var c, cn;
        for (c = 0 ; c < node.attributes.length ; c++) {
            cn = node.attributes[c];
            if (cn.name.match("^xmlns:?")) {
                // Ignore namespaces.
                continue;
            }
            add('@' + cn.name, cn.value);
        }

        // child elements
        for (c = 0 ; c < node.childNodes.length ; c++) {
            cn = node.childNodes[c];
            if (cn.nodeType === 1) {
                if (cn.childNodes.length == 1 && cn.firstChild.nodeType == 3) {
                    // text value
                    add(cn.nodeName, cn.firstChild.nodeValue);
                }
                else {
                    // sub-object
                    var objectNode = xml2object(cn);
                    if (Object.keys(objectNode).length === 0) {
                        add(cn.nodeName, null);
                    } else {
                        add(cn.nodeName, xml2object(cn));
                    }
                }
            }
        }

        return data;
    }

    function buildUrl(opts) {
        var url = '/admin/' + opts.name;

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

    function get(opts) {
        if (_.isUndefined(opts.name) || opts.name === '' || opts.name === null) {
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
                    opts.error(error, status);
                }
            },
            success: function (data, status, jqXHR) {
                var resp = xml2object(data.childNodes[0]);
                if ('success' in opts) {
                    opts.success(resp, status);
                }
            },
            complete: function (jqXHR, status) {
                if ("complete" in opts) {
                    opts.complete(status);
                }
            },
            dataType: 'xml',
            type: 'GET',
            url: buildUrl(opts)
        });
    }

    return {
        get: get
    };

});
