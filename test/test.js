'use strict';
var chai = require('chai');
chai.Assertion.includeStack = true;
require('chai').should();
var expect = require('chai').expect;
var nodePath = require('path');
var fs = require('fs');

var stylusPlugin = require('../'); // Load this module just to make sure it works
var lasso = require('lasso');

describe('lasso-stylus' , function() {

    beforeEach(function(done) {
        for (var k in require.cache) {
            if (require.cache.hasOwnProperty(k)) {
                delete require.cache[k];
            }
        }
        done();
    });

    it('should render a simple stylus dependency', function(done) {

        var myLasso = lasso.create({
                fileWriter: {
                    fingerprintsEnabled: false,
                    outputDir: nodePath.join(__dirname, 'static')
                },
                bundlingEnabled: true,
                plugins: [
                    {
                        plugin: stylusPlugin,
                        config: {

                        }
                    }
                ]
            });

        myLasso.optimizePage({
                name: 'testPage',
                dependencies: [
                    nodePath.join(__dirname, 'fixtures/project1/simple.browser.json')
                ]
            },
            function(err, lassoPageResult) {
                if (err) {
                    return done(err);
                }

                var output = fs.readFileSync(nodePath.join(__dirname, 'static/testPage.css'), 'utf8');
                expect(output).to.equal("body {\n  font: 14px Arial, sans-seri;\n}\n");
                done();
            });
    });

    it('should allow custom include paths', function(done) {

        var myLasso = lasso.create({
                fileWriter: {
                    fingerprintsEnabled: false,
                    outputDir: nodePath.join(__dirname, 'static')
                },
                bundlingEnabled: true,
                plugins: [
                    {
                        plugin: stylusPlugin,
                        config: {
                            includes: [nodePath.join(__dirname, 'fixtures/project1/mixins')]
                        }
                    }
                ]
            });

        myLasso.optimizePage({
                name: 'testPage',
                dependencies: [
                    nodePath.join(__dirname, 'fixtures/project1/paths.browser.json')
                ]
            },
            function(err, lassoPageResult) {
                if (err) {
                    return done(err);
                }

                var output = fs.readFileSync(nodePath.join(__dirname, 'static/testPage.css'), 'utf8');
                expect(output).to.equal(".foo {\n  color: #f00;\n}\n.bar {\n  font-size: 2px;\n  -webkit-border-radius: 5px;\n  -moz-border-radius: 5px;\n  border-radius: 5px;\n  opacity: 0.5;\n}\n");
                done();
            });
    });

    it('should allow custom functions', function(done) {

        var myLasso = lasso.create({
                fileWriter: {
                    fingerprintsEnabled: false,
                    outputDir: nodePath.join(__dirname, 'static')
                },
                bundlingEnabled: true,
                plugins: [
                    {
                        plugin: stylusPlugin,
                        config: {
                            use: function(stylus) {
                                stylus.define('add', function(a, b) {
                                    a = parseFloat(a);
                                    b = parseFloat(b);
                                    return a+b;
                                });
                            },
                            define: {
                                sub: function(a, b) {
                                    a = parseFloat(a);
                                    b = parseFloat(b);
                                    return a-b;
                                }
                            }
                        }
                    }
                ]
            });

        myLasso.optimizePage({
                name: 'testPage',
                dependencies: [
                    nodePath.join(__dirname, 'fixtures/project1/functions.browser.json')
                ]
            },
            function(err, lassoPageResult) {
                if (err) {
                    return done(err);
                }

                var output = fs.readFileSync(nodePath.join(__dirname, 'static/testPage.css'), 'utf8');
                expect(output).to.equal(".add {\n  opacity: 0.7;\n  z-index: 1;\n}\n");
                done();
            });
    });

    it('should allow global imports', function(done) {

        var myLasso = lasso.create({
                fileWriter: {
                    fingerprintsEnabled: false,
                    outputDir: nodePath.join(__dirname, 'static')
                },
                bundlingEnabled: true,
                plugins: [
                    {
                        plugin: stylusPlugin,
                        config: {
                            imports: [
                                nodePath.join(__dirname, 'fixtures/project1/variables.styl')
                            ]
                        }
                    }
                ]
            });

        myLasso.optimizePage({
                name: 'testPage',
                dependencies: [
                    nodePath.join(__dirname, 'fixtures/project1/global-imports.browser.json')
                ]
            },
            function(err, lassoPageResult) {
                if (err) {
                    return done(err);
                }

                var output = fs.readFileSync(nodePath.join(__dirname, 'static/testPage.css'), 'utf8');
                expect(output).to.equal(".foo {\n  color: #00f;\n}\n");
                done();
            });
    });


});
