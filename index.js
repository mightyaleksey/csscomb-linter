'use strict';

var CSScomb = require('csscomb');
var Stream = require('stream');
var util = require('util');

util.inherits(CSSLinter, Stream);

function CSSLinter(config) {
    Stream.Writable.call(this, arguments);
    config = CSScomb.getCustomConfig(config);

    this._buf = '';
    this._comb = new CSScomb(config);
}

CSSLinter.prototype.write = function (chunk) {
    this._buf += chunk;
};

CSSLinter.prototype.end = function () {
    this.processString();
};

CSSLinter.prototype.processString = function (string) {
    string = string || this._buf;
    console.log(string === this._comb.processString(string, {syntax: 'css'}));
};

module.exports = CSSLinter;
