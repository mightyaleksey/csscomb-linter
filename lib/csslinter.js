'use strict';

var CSScomb = require('csscomb');
var stream = require('stream');
var util = require('util');

module.exports = function (config) {
    config = CSScomb.getCustomConfig(config);
    var comb = new CSScomb(config || 'csscomb');

    util.inherits(CSSLinter, stream);

    /**
     * Сохраняет в буфер входной поток данных и прогоняет полученный результат через csscomb.
     *
     * @type {Stream}
     */
    function CSSLinter(config) {
        if (!(this instanceof CSSLinter)) {
            return new CSSLinter(config);
        }

        this._buf = '';
        this._comb = comb;
    }

    CSSLinter.prototype.write = function (chunk) {
        this._buf += chunk;
    };

    CSSLinter.prototype.end = function (chunk) {
        if (chunk) {
            this.write(chunk);
        }

        this.processString();
    };

    /**
     * Processes a string.
     *
     * @param {String}   text
     * @param {Object}   options
     * @param {String}   options.context
     * @param {String}   options.filename
     * @param {String}   options.syntax
     * @return {Boolean}                  Valid string or not.
     */
    CSSLinter.prototype.processString = function (string, options) {
        string = string || this._buf;
        options = options || {};

        var combed = this._comb.processString(string, options);
        var isValid = string === combed;

        if (!isValid) {
            this.emit('data', options.filename ?
                util.format('%s: use csscomb for that\n', options.filename) : 'use csscomb for the specified data\n');
        }

        return isValid;
    };

    return CSSLinter;
};