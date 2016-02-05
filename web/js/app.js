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

require.config({
    paths: {
        Ractive: '../packages/ractive/ractive',
        text: '../packages/requirejs-text/text',
    }
});

define('ractive', ['Ractive',
                   'text!../templates/index.html',
                   'text!../templates/pod.html',
                   'text!../templates/bladeList.html',
                   'text!../templates/users.html',
                   'text!../templates/usersAdd.html',
                   'text!../templates/configuration.html',
                   'text!../templates/documentation.html',
                   'text!../templates/serialTerminal.html'],
                   function(Ractive, indexTpl, podTpl, bladeListTpl, usersTpl, usersAddTpl, configurationTpl, documentationTpl, serialTerminalTpl){

    return new Ractive({
        el: 'container',
        template: indexTpl,
        partials: {
            pod: podTpl,
            bladeList: bladeListTpl,
            users: usersTpl,
            usersAdd: usersAddTpl,
            configuration: configurationTpl,
            documentation: documentationTpl,
            serialTerminal: serialTerminalTpl
        },
        data: {
            notification: null,
            currentBladeId: null,
            blades: [
                {
                    id: 1,
                    name: null,
                    description: null,
                    power: 0
                },
                {
                    id: 2,
                    name: null,
                    description: null,
                    power: 0
                },
                {
                    id: 3,
                    name: null,
                    description: null,
                    power: 0
                },
                {
                    id: 4,
                    name: null,
                    description: null,
                    power: 0
                }
            ]
        }
    });
});

define('hasher', [], function() {

    return hasher;
});

define('app',
       ['ractive', 'hasher', 'pod', 'bladeList', 'users', 'usersAdd', 'menu', 'serialTerminal'],
       function(ractive, hasher, pod, bladeList, users, usersAdd, menu, serialTerminal) {

    var modules = {
        'pod': pod,
        'bladeList': bladeList,
        'users': users,
        'usersAdd': usersAdd,
        'menu': menu,
        'serialTerminal': serialTerminal
    };

    function parseHash(hash) {
        var i = hash.indexOf('?');
        var url;
        if (i === -1) {
            url = hash;
        }
        else {
            url = hash.substring(0, i);
        }

        var params = {};
        var paramList = hash.substring(i+1, hash.length).split('&');
        for (var n = 0 ; n < paramList.length ; n++) {
            var param = paramList[n];
            i = param.indexOf('=');
            if (i === -1) {
                params[param] = param;
            }
            else {
                params[param.substring(0, i)] = param.substring(i+1, params.length);
            }
        }

        return {
            url: url,
            params: params
        };
    }

    function handleChanges(newHash, oldHash){
        var fragment;
        var pageModule;
        if (oldHash !== undefined && oldHash !== '') {
            if (oldHash === newHash) {
                return;
            }
            fragment = parseHash(oldHash);
            pageModule = modules[fragment.url];
            if (pageModule !== undefined) {
                var finalize = pageModule.finalize;
                if (typeof finalize == 'function') {
                    finalize(fragment.params);
                }
            }
        }
        if (newHash !== undefined) {
            if (newHash === '') {
                newHash = 'bladeList';
            }
            fragment = parseHash(newHash);
            ractive.set('page', fragment.url);
            pageModule = modules[fragment.url];
            if (pageModule !== undefined) {
                var initialize = pageModule.initialize;
                if (typeof initialize == 'function') {
                    initialize(fragment.params);
                }
            }
            ractive.fire("refresh-sidemenu", null, fragment.url);
        }
    }

    hasher.changed.add(handleChanges);
    hasher.initialized.add(handleChanges);
    hasher.init();

});

require(['app'], function(app) {


});
