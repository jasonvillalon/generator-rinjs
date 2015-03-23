exports.config = {
  framework: 'mocha',
  // seleniumAddress: 'http://localhost:8080/wd/hub',
  specs: [
    'test/spec/*.js'
  ],
  mochaOpts: {
    reporter: "spec",
    ui: 'bdd',
    enableTimeouts: false
  },
  // multiCapabilities: [
  //   {"browserName": "chrome"},
  //   {"browserName": "firefox"}
  // ],
  onPrepare: function() {
    browser.ignoreSynchronization = true;
  }
}
