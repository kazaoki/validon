exports.config = {
  tests: './*_test.js',
  output: './output',
  helpers: {
    Puppeteer: {
	  url: 'http://localhost',
	  show: true
    }
  },
  include: {
    I: './steps_file.js'
  },
  bootstrap: null,
  mocha: {},
  name: 'tests',
  translation: 'ja-JP',
  plugins: {
    stepByStepReport: {
      enabled: true,
      deleteSuccessful: false,
    },
  },
  "retryFailedStep": {
    "enabled": true
  }
}
