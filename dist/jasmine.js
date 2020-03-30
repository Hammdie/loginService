"use strict";
var J = require('jasmine');
var jsm = new J({});
jsm.loadConfig({
    spec_files: [
        './src/**/*.spec.js'
    ],
    helpers: [
        './src/test-helpers/**/*.js'
    ],
    stopSpecOnExpectationFailure: false,
    random: true
});
// setup console reporter
var jasmineConsoleReporter = require('jasmine-console-reporter');
var reporter = new jasmineConsoleReporter({
    colors: 1,
    cleanStack: 1,
    verbosity: 4,
    listStyle: 'indent',
    activity: true,
    emoji: true,
    beep: true
});
jsm.DEFAULT_TIMEOUT_INTERVAL = 10000;
// initialize and execute
jsm.env.clearReporters();
jsm.addReporter(reporter);
jsm.execute();
//# sourceMappingURL=jasmine.js.map