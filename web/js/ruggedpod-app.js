
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

    listener = ractive.on({
        'set-attention-led-on': function (event, id) {
            ruggedpod.get({
                name: 'SetBladeAttentionLEDOn',
                params: {
                    bladeId: id
                },
                error: function (error) {
                    // TODO error popup
                },
                success: function(data) {
                    // TODO success popup
                }
            });
        },
        'set-attention-led-off': function (event, id) {
            ruggedpod.get({
                name: 'SetBladeAttentionLEDOff',
                params: {
                    bladeId: id
                },
                error: function (error) {
                    // TODO error popup
                },
                success: function(data) {
                    // TODO success popup
                }
            });
        }
    });

    // Display main page
    ractive.set('page', 'main');

});
