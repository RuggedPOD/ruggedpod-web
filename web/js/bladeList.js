define(['ractive', 'client', 'notification'], function(ractive, client, notification){

    ractive.on({
        'pump-on': function (event, id) {
            client.get({
                name: 'SetBladeAttentionLEDOn',
                params: {
                    bladeId: id
                },
                error: function (error) {
                    notification.showError('Unable to start pump for blade ' + id);
                },
                success: function(data) {
                    notification.showSuccess('Pump of blade ' + id + ' has been successfully started');
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
                    notification.showError('Unable to start pump for blade ' + id);
                },
                success: function(data) {
                    notification.showSuccess('Pump of blade ' + id + ' has been successfully stopped');
                }
            });
        },
        'blade-on': function (event, id) {
            notification.showInfo('Not yet implemented');
        },
        'blade-off': function (event, id) {
            notification.showInfo('Not yet implemented');
        },
        'blade-reset': function (event, id) {
            notification.showInfo('Not yet implemented');
        },
        'blade-force-off': function (event, id) {
            notification.showInfo('Not yet implemented');
        },
        'serial-port-console': function (event, id) {
            notification.showInfo('Not yet implemented');
        }
    });

});
