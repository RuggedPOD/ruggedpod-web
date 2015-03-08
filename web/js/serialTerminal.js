define(['ractive', 'client', 'notification'], function(ractive, client, notification) {

    function initialize(params) {
        ractive.set('currentBladeId', parseInt(params['bladeId']))
    }

    function finalize(params) {

    }

    return {
        initialize: initialize,
        finalize: finalize
    }

});
