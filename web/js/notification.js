define(['ractive', 'utils'], function(ractive, utils) {

    function show(text, severity) {
        var id = utils.generateID();
        var icon;
        if (severity === 'info') {
            icon = 'glyphicon-info-sign'
        }
        else if (severity === 'success') {
            icon = 'glyphicon-ok-sign'
        }
        else if (severity === 'danger') {
            icon = 'glyphicon-remove-sign'
        }
        else {
            return;
        }

        ractive.set('notification', {
            id: id,
            text: text,
            severity: severity,
            icon: icon
        });
        setTimeout(function(){
            n = ractive.get('notification');
            if (n !== null && n.id === id) {
                ractive.set('notification', null);
            }
        }, 2000);
    }

    function showInfo(text) {
        show(text, 'info');
    }

    function showSuccess(text) {
        show(text, 'success');
    }

    function showError(text) {
        show(text, 'danger');
    }

    return {
        showInfo: showInfo,
        showError: showError,
        showSuccess: showSuccess
    }

})
