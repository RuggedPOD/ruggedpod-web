var ruggedpod = (function () {

    function xml2object(node) {

        var	data = {};

        // append a value
        function Add(name, value) {
            if (data[name]) {
                if (data[name].constructor != Array) {
                    data[name] = [data[name]];
                }
                data[name][data[name].length] = value;
            }
            else {
                data[name] = value;
            }
        };

        // element attributes
        var c, cn;
        for (c = 0; cn = node.attributes[c]; c++) {
            if (cn.name.match("^xmlns:?")) {
                // Ignore namespaces.
                continue;
            }
            Add('@' + cn.name, cn.value);
        }

        // child elements
        for (c = 0; cn = node.childNodes[c]; c++) {
            if (cn.nodeType == 1) {
                if (cn.childNodes.length == 1 && cn.firstChild.nodeType == 3) {
                    // text value
                    Add(cn.nodeName, cn.firstChild.nodeValue);
                }
                else {
                    // sub-object
                    var objectNode = xml2object(cn);
                    if (Object.keys(objectNode).length == 0) {
                        Add(cn.nodeName, null);
                    } else {
                        Add(cn.nodeName, xml2object(cn));
                    }
                }
            }
        }

        return data;
    }

    function get(opts) {
        if (_.isUndefined(opts.name) || opts.name === '' || opts.name === null) {
            if (!_.isUndefined(opts['error'])) {
                opts['error']('name is not defined', null);
            }
            return;
        }

        $.ajax({
            error: function (jqXHR, status, error) {
                console.log(status);
                console.log(error);
                if ("error" in opts) {
                    opts['error'](error, status);
                }
            },
            success: function (data, status, jqXHR) {
                console.log(status); // TODO Check status
                console.log(data);
                var resp = xml2object(data.children[0]);
                console.log(resp);
                if ('success' in opts) {
                    opts['success'](resp, status);
                }
            },
            dataType: 'xml',
            'type': 'GET',
            'url': '/admin/' + opts['name'] + '?' + opts['params'] // TODO Make params a json object
        });
    }

    return {
        get: get
    };

})();
