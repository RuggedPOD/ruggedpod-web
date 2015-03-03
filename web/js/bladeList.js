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
            client.get({
                name: 'SetAllBladesShortOnOff',
                error: function (error) {
                    notification.showError('Unable to send a short press button on all blades');
                },
                success: function(data) {
                    notification.showSuccess('Successfully sent a short press button on all blades');
                }
            });
        },
        'all-blades-on-off-long': function (event) {
            client.get({
                name: 'SetAllBladesLongOnOff',
                error: function (error) {
                    notification.showError('Unable to send a long press button on all blades');
                },
                success: function(data) {
                    notification.showSuccess('Successfully sent a long press button on all blades');
                }
            });
        },
        'all-blades-reset': function (event) {
            notification.showInfo('Not yet implemented');
        },
        'blade-on-off-short': function (event, id) {
            client.get({
                name: 'SetBladeShortOnOff',
                params: {
                    bladeId: id
                },
                error: function (error) {
                    notification.showError('Unable to send a short press button on blade ' + id);
                },
                success: function(data) {
                    notification.showSuccess('Successfully sent a short press button on blade ' + id);
                }
            });
        },
        'blade-on-off-long': function (event, id) {
            client.get({
                name: 'SetBladeLongOnOff',
                params: {
                    bladeId: id
                },
                error: function (error) {
                    notification.showError('Unable to send a long press button on blade ' + id);
                },
                success: function(data) {
                    notification.showSuccess('Successfully sent a long press button on blade ' + id);
                }
            });
        },
        'blade-reset': function (event, id) {
            notification.showInfo('Not yet implemented');
        },
        'serial-port-open-terminal': function (event, id) {
            notification.showInfo('Not yet implemented');
        }
    });

});
