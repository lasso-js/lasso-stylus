exports.getLassoConfig = function (lassoStylusPlugin) {
    return {
        fingerprintsEnabled: false,
        bundlingEnabled: true,
        urlPrefix: '/static',
        plugins: [
            {
                plugin: lassoStylusPlugin,
                config: {
                    imports: [
                        require.resolve('./variables.styl')
                    ]
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
