var ractive = new Ractive({
    el: 'container',
    template: '#template',
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
                params: 'bladeId=1',
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
                params: 'bladeId=1',
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
