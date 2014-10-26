#!/usr/bin/env node
'use strict';

var csscombLinter = require('../lib/csscomb-linter')();

process.stdin.isTTY ?
    processArgs() :
    lintBuffer();

function lintBuffer() {
    process.stdin
        .pipe(csscombLinter())
        .pipe(process.stderr);
}

function processArgs() {
    var program = require('commander');
    var pkg = require('../package');

    program
        .version(pkg.version)
        .parse(process.argv);

    if (program.args.length === 0) {
        program.help();
    }

    lintFiles(program.args);
}

/**
 * @param  {string[]} files
 */
function lintFiles(files) {
    var fs = require('fs');
    var path = require('path');

    files.forEach(function (file) {
        var filePath = path.resolve(file);

        fs.stat(filePath, function (err, stat) {
            if (err) {
                console.error(err.code === 'ENOENT' ?
                    filePath + ' not found!' : err);
                process.exit(2);
            }

            if (!stat.isFile()) {
                console.error(filePath + ' not a file!');
                process.exit(2);
            }

            lintFile(filePath);
        });
    });
}

/**
 * @param {String} filePath Absolute path.
 */
function lintFile(filePath) {
    var fs = require('fs');
    var path = require('path');

    var options = {
        filename: path.basename(filePath),
        syntax: path.extname(filePath).replace('.', '')
    };

    fs.createReadStream(filePath)
        .pipe(csscombLinter(options))
        .pipe(process.stderr);
}