define(['ractive', 'hasher', 'client', 'notification'], function(ractive, hasher, client, notification) {

    ractive.on({
        'goto-blade-list': function (event) {
            hasher.setHash('bladeList');
        }
    });

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
