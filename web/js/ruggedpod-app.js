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
            $.ajax({
                'error': function (jqXHR, status, error) {
                    ractive.set('server_status', 'Unknown (HTTP error' + error + ')');
                },
                'success': function (data, status, jqXHR) {
                    ractive.set('server_status', data.status);
                    ractive.set('power_state', 'OFF');
                    ractive.set('label_power_state', 'Power On');
                },
                'type': 'PUT',
                'url': '/server/1/stop'
            });
        }
        else if (power_state === 'OFF') {
            $.ajax({
                'error': function (jqXHR, status, error) {
                    ractive.set('server_status', 'Unknown (HTTP error' + error + ')');
                },
                'success': function (data, status, jqXHR) {
                    ractive.set('server_status', data.status);
                    ractive.set('power_state', 'ON');
                    ractive.set('label_power_state', 'Power Off');
                },
                'type': 'PUT',
                'url': '/server/1/start'
            });
        }
    }
});
