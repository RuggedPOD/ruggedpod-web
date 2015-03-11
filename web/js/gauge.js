define(function() {

    function create(elementId, title, initValue, maxValue) {
        return new JustGage({
            id: elementId,
            value: initValue,
            min: 0,
            max: maxValue,
            title: title,
            levelColors: ['#aaa']
        });
    }

    function createPowerGauge(elementId) {
        return create(elementId, 'Power (W)', 0, 200);
    }

    function createCumulativePowerGauge(elementId) {
        return create(elementId, 'Cumulative power (W)', 0, 800);
    }

    return {
        createPowerGauge: createPowerGauge,
        createCumulativePowerGauge: createCumulativePowerGauge
    };

});
