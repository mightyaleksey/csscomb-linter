'use strict';

const CSScomb = require('csscomb');
const Transform = require('stream').Transform;
const util = require('util');

util.inherits(Linter, Transform);

/**
 * @param {Object} options
 * @param {Object} combOptions
 */
function Linter(options, combOptions) {
    if (!(this instanceof Linter)) {
        return new Linter(options, combOptions);
    }

    Transform.call(this, options);

    this._combOptions = combOptions;
}

/**
 * @param  {Buffer|String} chunk
 * @param  {String}        enc
 * @param  {Function}      done
 */
Linter.prototype._transform = function (chunk, enc, done) {
    if (this._data) {
        this._data += chunk.toString();
    } else {
        this._data = chunk.toString();
    }

    done();
};

/**
 * @param  {Function} done
 */
Linter.prototype._flush = function (done) {
    if (this._data) {
        this.processString(this._data);
    }

    this._data = null;

    done();
};

/**
 * @param  {String} configPath
 * @return {Linter}
 */
module.exports = function (configPath) {
    const config = CSScomb.getCustomConfig(config);
    const comb = new CSScomb(config || 'csscomb');

    /**
     * @param  {String}  string
     * @param  {Object}  [options]
     * @return {Boolean}
     */
    Linter.prototype.processString = function (string, options) {
        options = options || this._combOptions || {syntax: 'css'};

        const isValid = string === comb.processString(string, options);

        if (!isValid) {
            if (options.filename) {
                this.push(util.format('%s: CSScomb linting failed for that file\n', options.filePath));
            } else {
                this.push('CSScomb linting failed\n');
            }
        }

        return isValid;
    };

    /**
     * @param  {Object} combOptions
     * @param  {String} combOptions.context
     * @param  {String} combOptions.filename
     * @param  {String} combOptions.syntax
     * @return {Linter}
     */
    return function (combOptions) {
        return new Linter({objectMode: true}, combOptions);
    };
};
