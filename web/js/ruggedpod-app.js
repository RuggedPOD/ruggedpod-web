
var ractive;
var templateIndex;
var partials = {};

$.when(

    $.get("/templates/index", function(index) {
        templateIndex = index;
    }),

    $.get("/templates/main.html", function(html) {
        partials.main = html;
    })

).then(function() {

    var ractive = new Ractive({
        el: 'container',
        template: templateIndex,
        partials: partials,
        data: {
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

    ractive.on({
        'pump-on': function (event, id) {
            ruggedpod.get({
                name: 'SetBladeAttentionLEDOn',
                params: {
                    bladeId: id
                },
                error: function (error) {
                    // TODO
                },
                success: function(data) {
                    // TODO
                }
            });
        },
        'pump-off': function (event, id) {
            ruggedpod.get({
                name: 'SetBladeAttentionLEDOff',
                params: {
                    bladeId: id
                },
                error: function (error) {
                    // TODO
                },
                success: function(data) {
                    // TODO
                }
            });
        },
        'blade-on': function (event, id) {
            // TODO
        },
        'blade-off': function (event, id) {
            // TODO
        },
        'blade-reset': function (event, id) {
            // TODO
        },
        'blade-force-off': function (event, id) {
            // TODO
        },
        'serial-port-console': function (event, id) {
            // TODO
        },
    });

    // Display main page
    ractive.set('page', 'main');

});
