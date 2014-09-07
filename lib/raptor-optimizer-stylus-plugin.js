module.exports = function(optimizer, config) {
    optimizer.dependencies.registerStyleSheetType(
        'styl',
        require('./dependency-stylus').create(config));
};
