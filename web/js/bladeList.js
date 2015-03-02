define(['ractive', 'client', 'notification'], function(ractive, client, notification){

    ractive.on({
        'all-pumps-on': function (event) {
            client.get({
                name: 'SetAllPumpsOn',
                error: function (error) {
                    notification.showError('Unable to start pumps');
                },
                success: function(data) {
                    notification.showSuccess('Pumps has been successfully started');
                }
            });
        },
        'all-pumps-off': function (event) {
            client.get({
                name: 'SetAllPumpsOff',
                error: function (error) {
                    notification.showError('Unable to stop pumps');
                },
                success: function(data) {
                    notification.showSuccess('Pumps has been successfully stopped');
                }
            });
        },
        'all-blades-on-off-short': function (event) {
            notification.showInfo('Not yet implemented');
        },
        'all-blades-on-off-long': function (event) {
            notification.showInfo('Not yet implemented');
        },
        'all-blades-reset': function (event) {
            notification.showInfo('Not yet implemented');
        },
        'blade-on-off-short': function (event, id) {
            notification.showInfo('Not yet implemented');
        },
        'blade-on-off-long': function (event, id) {
            notification.showInfo('Not yet implemented');
        },
        'blade-reset': function (event, id) {
            notification.showInfo('Not yet implemented');
        },
        'serial-port-open-terminal': function (event, id) {
            notification.showInfo('Not yet implemented');
        }
    });

});
