require.config({
    paths: {
        Ractive: '../packages/ractive/ractive',
        text: '../packages/requirejs-text/text',
    }
});

define('ractive', ['Ractive',
                   'text!../templates/index',
                   'text!../templates/bladeList.html'], function(Ractive, indexTpl, bladeListTpl){

    return new Ractive({
        el: 'container',
        template: indexTpl,
        partials: {
            bladeList: bladeListTpl
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
