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
                   'text!../templates/bladeList.html',
                   'text!../templates/serialTerminal.html'], function(Ractive, indexTpl, bladeListTpl, serialTerminalTpl){

    return new Ractive({
        el: 'container',
        template: indexTpl,
        partials: {
            bladeList: bladeListTpl,
            serialTerminal: serialTerminalTpl
        },
        data: {
            notification: null,
            currentBladeId: null,
            blades: [
                {
                    id: 1,
                    power: 0
                },
                {
                    id: 2,
                    power: 0
                },
                {
                    id: 3,
                    power: 0
                },
                {
                    id: 4,
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
       ['ractive', 'hasher', 'bladeList', 'serialTerminal'],
       function(ractive, hasher, bladeList, serialTerminal) {

    var modules = {
        'bladeList': bladeList,
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
        if (oldHash !== undefined && oldHash !== '') {
            fragment = parseHash(oldHash);
            var finalize = modules[fragment.url].finalize;
            if (typeof finalize == 'function') {
                finalize(fragment.params);
            }
        }
        if (newHash !== undefined) {
            if (newHash === '') {
                hasher.setHash('bladeList');
            }
            else {
                fragment = parseHash(newHash);
                ractive.set('page', fragment.url);
                var initialize = modules[fragment.url].initialize;
                if (typeof initialize == 'function') {
                    initialize(fragment.params);
                }
            }
        }
    }

    hasher.changed.add(handleChanges);
    hasher.initialized.add(handleChanges);
    hasher.init();

});

require(['app'], function(app) {


});
