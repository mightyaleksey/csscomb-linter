#!/usr/bin/env node
'use strict';

var csscombLinter = require('../lib/csscomb-linter')();
var program = require('commander');
var pkg = require('../package');
var reporter = require('../lib/reporter')();

program
    .version(pkg.version)
    .parse(process.argv);

if (program.args.length) {
    lintFiles(program.args);
} else {
    lintBuffer();
}

process.on('exit', function () {
    process.exit(reporter.hasErrors() ? 2 : 0);
});

function lintBuffer() {
    process.stdin
        .pipe(csscombLinter())
        .pipe(reporter, {end: false});
}

/**
 * @param  {string[]} files
 */
function lintFiles(files) {
    var fs = require('fs');
    var path = require('path');

    // cheap solution
    reporter.setMaxListeners(files.length);

    files.forEach(function (file) {
        var filePath = path.resolve(file);

        fs.stat(filePath, function (err, stat) {
            if (err) {
                console.error(err.code === 'ENOENT' ?
                    filePath + ' not found!' : err);
                process.exit(1);
            }

            if (!stat.isFile()) {
                console.error(filePath + ' not a file!');
                process.exit(1);
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
        filePath: filePath,
        syntax: path.extname(filePath).replace('.', '')
    };

    fs.createReadStream(filePath)
        .pipe(csscombLinter(options))
        .pipe(reporter, {end: false});
}
