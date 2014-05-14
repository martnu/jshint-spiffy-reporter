'use strict';

var chalk = require('chalk');

module.exports = {
  reporter: function(errors) {
    var files = {};
    var format = {
      line: {
        maxLength: 0,
        color: chalk.yellow
      },
      reason: {
        maxLength: 0,
        color: chalk.red
      }
    }

    var checkMaxLengths = function(error) {
      for (var k in format) {
        if (error[k] && error[k].toString().length > format[k].maxLength) {
          format[k].maxLength = error[k].toString().length;
        }
      }
    };

    errors.forEach(function(error) {
      if (!files[error.file]) {
        files[error.file] = [];
      }
      files[error.file].push(error.error);

      checkMaxLengths(error.error);
    });

    var sorter = function(a, b) {
      return a.line - b.line;
    };

    var log = [];
    for (var k in files) {
      log.push('\n' + chalk.underline.bold(' ' + k + ' ') + '\n');

      files[k].sort(sorter);

      files[k].forEach(function(error) {
        for (var k in format) {
          log.push(' | ');
          log.push(format[k].color(error[k]));
          log.push(new Array(format[k].maxLength - error[k].toString().length + 1).join(' '));
        }
        log.push('\n');
      });
    }
    console.log(log.join(''));
  }
};
