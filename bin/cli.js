#!/usr/bin/env node
'use strict';

const csscombLinter = require('../lib/csscomb-linter')();
const glob = require('glob');
const program = require('commander');
const pkg = require('../package');
const reporter = require('../lib/reporter')();

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
    const fs = require('fs');
    const path = require('path');

    // cheap solution
    reporter.setMaxListeners(Infinity);

    files.map(pattern => glob(pattern, {absolute: true}, function (er, resolvedFiles) {
      if (er) {
        console.error(er);
        return void process.exit(1);
      }

      resolvedFiles.forEach(lintFile);
    }));
}

/**
 * @param {String} filePath Absolute path.
 */
function lintFile(filePath) {
    const fs = require('fs');
    const path = require('path');

    const options = {
        filename: path.basename(filePath),
        filePath: filePath,
        syntax: path.extname(filePath).replace('.', '')
    };

    fs.createReadStream(filePath)
        .pipe(csscombLinter(options))
        .pipe(reporter, {end: false});
}
