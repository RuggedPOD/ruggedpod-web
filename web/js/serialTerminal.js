define(['ractive', 'client', 'notification'], function(ractive, client, notification) {

    function reloadSerialTerminal() {
        var iframeId = $('#serial-terminal-iframe')[0];
        iframeId.src = iframeId.src;
    }

    function initialize(params) {
        ractive.set('currentBladeId', parseInt(params['bladeId']))
        reloadSerialTerminal();
    }

    function finalize(params) {

    }

    return {
        initialize: initialize,
        finalize: finalize
    }

});
