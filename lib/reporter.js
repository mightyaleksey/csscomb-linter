'use strict';

var stream = require('stream');
var util = require('util');

util.inherits(Reporter, stream);

/**
 * Выводит результат работы линтера. Пишет отшибки в stderr.
 *
 * @type {stream}
 */
function Reporter() {
    if (!(this instanceof Reporter)) {
        return new Reporter();
    }

    stream.Writable.call(this);
    this._errors = 0;
}

Reporter.prototype.write = function (data) {
    process.stdout.write(data);
    this._errors++;
};

Reporter.prototype.end = function (data) {
    if (data) {
        this.write(data);
    }

    this.writable = false;
    this.emit('finish');

    if (this._errors) {
        process.stdout.write(util.format('%s errors\n', this._errors));
        process.exit(2);
    } else {
        process.stdout.write('No errors found\n');
        process.exit(0);
    }
};

module.exports = Reporter;