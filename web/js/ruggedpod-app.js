
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
            server_status: 'stopped',
            power_state: 'OFF',
            label_power_state: 'Power On'
        }
    });

    listener = ractive.on({
        'toggle-power-state': function () {

            power_state = ractive.get('power_state');
            if (power_state === 'ON') {
                ruggedpod.get({
                    name: 'SetBladeAttentionLEDOff',
                    params: {
                        bladeId: 1
                    },
                    error: function (error) {
                        ractive.set('server_status', 'Error : ' + error);
                    },
                    success: function(data) {
                        ractive.set('server_status', data.status);
                        ractive.set('power_state', 'OFF');
                        ractive.set('label_power_state', 'Power On');
                    }
                });
            }
            else if (power_state === 'OFF') {
                ruggedpod.get({
                    name: 'SetBladeAttentionLEDOn',
                    params: {
                        bladeId: 1
                    },
                    error: function (error) {
                        ractive.set('server_status', 'Error : ' + error);
                    },
                    success: function(data) {
                        ractive.set('server_status', data.status);
                        ractive.set('power_state', 'ON');
                        ractive.set('label_power_state', 'Power Off');
                    }
                });
            }
        }
    });

    // Display main page
    ractive.set('page', 'main');

});
