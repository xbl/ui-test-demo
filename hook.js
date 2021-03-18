const ora = require('ora');
const spinner = ora('测试进行中');

exports.mochaHooks = {
  beforeAll() {
    spinner.start();
  },
  afterAll() {
    spinner.stop();
  }
};

