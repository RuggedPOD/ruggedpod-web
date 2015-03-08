require.config({
    paths: {
        Ractive: '../packages/ractive/ractive',
        text: '../packages/requirejs-text/text',
    }
});

define('ractive', ['Ractive',
                   'text!../templates/index',
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
            blades: [
                {
                    id: 1
                },
                {
                    id: 2
                },
                {
                    id: 3
                },
                {
                    id: 4
                }
            ]
        }
    });
});

require(['ractive', 'bladeList'], function(ractive, bladeList) {
    ractive.set('page', 'bladeList');
});
