csscomb-linter
==============

Линтер, сделанный на базе инструмента [csscomb](https://github.com/csscomb/csscomb.js).

## Установка

```
npm i sullenor/csscomb-linter
```

## Использование

### Из командной строки

```
cat common.css | csscomb-linter
```
```
csscomb-linter file1 file2
```

### В качестве node.js модуля

```javascript
var linter = require('csscomb-linter')('zen')();
csscombLinter.processString('some valid css data'); // true
```
```javascript
var csscombLinter = require('csscomb-linter')('zen');
process.stdin
    .pipe(csscombLinter({filename: 'common.css', syntax: 'css'}))
    .pipe(process.stderr);
```