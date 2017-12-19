exports.getLassoConfig = function (lassoStylusPlugin) {
    return {
        fingerprintsEnabled: false,
        bundlingEnabled: true,
        urlPrefix: '/static',
        plugins: [
            {
                plugin: lassoStylusPlugin,
                config: {
                    use: function (stylus) {
                        stylus.define('add', function (a, b) {
                            a = parseFloat(a);
                            b = parseFloat(b);
                            return a+b;
                        });
                    },
                    define: {
                        sub: function (a, b) {
                            a = parseFloat(a);
                            b = parseFloat(b);
                            return a-b;
                        }
                    }
                }
            }
        ]
    }
}

exports.getLassoOptions = function () {
    return {
        dependencies: [
            require.resolve('./browser.json')
        ]
    };
};
