
var ractive;
var templateIndex;
var partials = {};

$.when(

    $.getScript( "js/utils.js"),
    $.getScript( "js/client.js"),

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
        var id = utils.generateID();
        var icon;
        if (severity === 'info') {
            icon = 'glyphicon-info-sign'
        }
        else if (severity === 'succes') {
            icon = 'glyphicon-ok-sign'
        }
        else if (severity === 'danger') {
            icon = 'glyphicon-remove-sign'
        }
        else {
            severity = 'success'
            icon = 'glyphicon-ok-sign'
        }

        ractive.set('notification', {
            id: id,
            text: text,
            severity: severity,
            icon: icon
        });
        setTimeout(function(){
            n = ractive.get('notification');
            if (n !== null && n.id === id) {
                ractive.set('notification', null);
            }
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
