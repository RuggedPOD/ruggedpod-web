
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

    function showNotification(text, severity) {
        ractive.set('notification', {
            text: text,
            severity: severity ? severity : 'success'
        });
        setTimeout(function(){
            ractive.set('notification', null);
        }, 2000);
    }

    ractive.on({
        'pump-on': function (event, id) {
            ruggedpod.get({
                name: 'SetBladeAttentionLEDOn',
                params: {
                    bladeId: id
                },
                error: function (error) {
                    showNotification('Unable to start pump for blade ' + id, 'danger');
                },
                success: function(data) {
                    showNotification('Pump of blade ' + id + ' has been successfully started');
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
                    showNotification('Unable to start pump for blade ' + id, 'danger');
                },
                success: function(data) {
                    showNotification('Pump of blade ' + id + ' has been successfully stopped');
                }
            });
        },
        'blade-on': function (event, id) {
            showNotification('Not yet implemented', 'info');
        },
        'blade-off': function (event, id) {
            showNotification('Not yet implemented', 'info');
        },
        'blade-reset': function (event, id) {
            showNotification('Not yet implemented', 'info');
        },
        'blade-force-off': function (event, id) {
            showNotification('Not yet implemented', 'info');
        },
        'serial-port-console': function (event, id) {
            showNotification('Not yet implemented', 'info');
        },
    });

    // Display main page
    ractive.set('page', 'main');

});
