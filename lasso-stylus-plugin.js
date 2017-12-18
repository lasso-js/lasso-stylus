var stylus = require('stylus');
var fs = require('fs');
var nodePath = require('path');

function handleIncludes(renderer, includes) {
    if (includes) {
        includes.forEach(function(include) {
            renderer = renderer.include(include);
        });
    }
    return renderer;
}

function handleDefines(renderer, defines) {
    if (defines) {
        Object.keys(defines).forEach(function(name) {
            var fn = defines[name];
            renderer = renderer.define(name, fn);
        });
    }
    return renderer;
}
function handleOptions(renderer, options) {
    renderer = handleIncludes(renderer, options.includes);
    renderer = handleIncludes(renderer, options.paths);

    var imports = options.imports;
    if (imports) {
        imports.forEach(function(imp) {
            renderer = renderer.import(imp);
        });
    }

    renderer = handleDefines(renderer, options.define);
    renderer = handleDefines(renderer, options.defines);

    var set = options.set;
    if (set) {
        Object.keys(set).forEach(function(setting) {
            var value = set[setting];
            renderer = renderer.set(setting, value);
        });
    }

    var use = options.use;
    if (use) {
        if (Array.isArray(use)) {
            use.forEach(function(use) {
                renderer = renderer.use(use);
            });

        } else {
            renderer = renderer.use(use);
        }
    }

    return renderer;
}

module.exports = function(lasso, config) {
    lasso.dependencies.registerStyleSheetType(
        'styl',
        {
            properties: {
                'path': 'string',
                'paths': 'string',
                'set': 'object',
                'defines': 'object',
                'includes': 'array',
                'imports': 'array',
                'use': 'array'
            },

            init: function(lassoContext, callback) {
                if (!this.path) {
                    var error = new Error('"path" is required');
                    if (callback) return callback(error);
                    throw error;
                }

                var _this = this;
                if (this.includes) {
                    this.includes = this.includes.map(function(path) {
                        return _this.resolvePath(path);
                    });
                }

                if (this.paths) {
                    this.paths = this.paths.map(function(path) {
                        return _this.resolvePath(path);
                    });
                }

                this.path = this.resolvePath(this.path);

                if (callback) callback();
            },

            read: function(lassoContext, callback) {
                return new Promise((resolve, reject) => {
                    callback = callback || function (err, res) {
                        return err ? reject(err) : resolve(res);
                    };

                    var path = this.path;
                    var _this = this;


                    fs.readFile(path, {encoding: 'utf8'}, function(err, stylusCode) {
                        if (err) {
                            return callback(err);
                        }

                        var renderer = stylus(stylusCode).set('filename', path);

                        renderer = handleOptions(renderer, config);
                        renderer = handleOptions(renderer, _this);

                        renderer.include(nodePath.dirname(path));

                        renderer.render(function(err, css) {
                            if (err) {
                                return callback(err);
                            }

                            callback(null, css);
                        });
                    });
                });
            },

            getSourceFile: function() {
                return this.path;
            },

            getLastModified: function(lassoContext, callback) {
                return callback ? callback(null, -1) : -1;
            }
        }
    );
};
