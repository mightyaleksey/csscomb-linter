'use strict';

const Writable = require('stream').Writable;
const util = require('util');

util.inherits(Reporter, Writable);

/**
 * @param  {Object}   options
 * @return {Reporter}
 */
function Reporter(options) {
    if (!(this instanceof Reporter)) {
        return new Reporter(options);
    }

    Writable.call(this, options);
    this._err = 0;
}

/**
 * @param  {Buffer|String} chunk
 * @param  {String}        enc
 * @param  {Function}      done
 */
Reporter.prototype._write = function (chunk, enc, done) {
    process.stderr.write(chunk.toString());
    this._err++;
    done();
};

/**
 * @return {Boolean}
 */
Reporter.prototype.hasErrors = function () {
    return this._err > 0;
};

/**
 * @return {Reporter}
 */
module.exports = function () {
    return new Reporter({objectMode: true});
};
