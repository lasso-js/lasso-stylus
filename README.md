lasso-stylus
=======================

This plugin for the RaptorJS Optimizer provides support for rendering [Stylus](http://learnboost.github.io/stylus/) dependencies to CSS.

# Installation

First install the plugin:

```bash
npm install lasso-stylus --save
```

Then, enable the plugin when configuring the RaptorJS Optimizer:

```javascript
require('lasso').configure({
        plugins: [
            {
                module: 'lasso-stylus',
                config: {
                    ... // See Configuration below
                }
            }
        ]
    });
```

# Usage

Once this plugin has been enabled, you can then add Stylus dependencies to your `browser.json` files. The file extension for Stylus files is expected to be `.styl`. Example:

__browser.json:__

```json
{
    "dependencies": [
        "style.styl"
    ]
}
```

# Configuration

The configuration for the `lasso-stylus` plugin supports the following properties:

* __defines:__ An array of functions to make available to Stylus files (see [Stylus API » define](https://github.com/LearnBoost/stylus/blob/master/docs/js.md#definename-node))
* __imports:__ An array of paths to Stylus files that should be globally imported to every Stylus file (see [Stylus API » import](https://github.com/LearnBoost/stylus/blob/master/docs/js.md#importpath))
* __includes:__ An array of directory paths to add to the search path (see [Stylus API » include](https://github.com/LearnBoost/stylus/blob/master/docs/js.md#includepath))
* __set:__ An object containing key/value settings for the Stylus renderer (see [Stylus API » set](https://github.com/LearnBoost/stylus/blob/master/docs/js.md#setsetting-value))
* __use:__ An array of library functions for Stylus (see [Stylus API » use](https://github.com/LearnBoost/stylus/blob/master/docs/js.md#usefn))


Example configuration:

```javascript
require('lasso').configure({
        plugins: [
            {
                module: 'lasso-stylus',
                config: {
                    includes: [nodePath.join(__dirname, 'stylus/mixins/')],
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
                    },
                    imports: [
                        nodePath.join(__dirname, 'stylus/variables.styl')
                    ]
                }
            }
        ]
    });
```
