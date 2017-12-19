exports.getLassoConfig = function (lassoStylusPlugin) {
    return {
        fingerprintsEnabled: false,
        bundlingEnabled: true,
        urlPrefix: '/static',
        plugins: [
            {
                plugin: lassoStylusPlugin,
                config: {
                    includes: [ require.resolve('./mixins/mixins.styl') ]
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
