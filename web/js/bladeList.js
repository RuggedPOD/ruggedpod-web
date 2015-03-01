define(['ractive', 'client', 'notification'], function(ractive, client, notification){

    ractive.on({
        'pump-on': function (event, id) {
            client.get({
                name: 'SetBladeAttentionLEDOn',
                params: {
                    bladeId: id
                },
                error: function (error) {
                    notification.show('Unable to start pump for blade ' + id, 'danger');
                },
                success: function(data) {
                    notification.show('Pump of blade ' + id + ' has been successfully started');
                }
            });
        },
        'pump-off': function (event, id) {
            client.get({
                name: 'SetBladeAttentionLEDOff',
                params: {
                    bladeId: id
                },
                error: function (error) {
                    notification.show('Unable to start pump for blade ' + id, 'danger');
                },
                success: function(data) {
                    notification.show('Pump of blade ' + id + ' has been successfully stopped');
                }
            });
        },
        'blade-on': function (event, id) {
            notification.show('Not yet implemented', 'info');
        },
        'blade-off': function (event, id) {
            notification.show('Not yet implemented', 'info');
        },
        'blade-reset': function (event, id) {
            notification.show('Not yet implemented', 'info');
        },
        'blade-force-off': function (event, id) {
            notification.show('Not yet implemented', 'info');
        },
        'serial-port-console': function (event, id) {
            notification.show('Not yet implemented', 'info');
        },
    });

});
