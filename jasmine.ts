const J = require('jasmine');
const jsm = new J({});

jsm.loadConfig({
  spec_files: [
    './src/*.[sS]pec.js'
  ],
  helpers: [
    './src/test-helpers/**/*.js'
  ],
  stopSpecOnExpectationFailure: false,
  random: true
});

// setup console reporter
const jasmineConsoleReporter = require('jasmine-console-reporter');
const reporter = new jasmineConsoleReporter({
    colors: 1,           // (0|false)|(1|true)|2
    cleanStack: 1,       // (0|false)|(1|true)|2|3
    verbosity: 4,        // (0|false)|1|2|(3|true)|4
    listStyle: 'indent', // "flat"|"indent"
    activity: true,
    emoji: true,         // boolean or emoji-map object
    beep: true
});

// initialize and execute
jsm.env.clearReporters();
jsm.addReporter(reporter);
jsm.execute();
