const { chromium } = require('playwright');
const assert = require('assert');
const CONFIG = require('../../config');

let browser;
let context;
before(async() => {
  browser = await chromium.launch(CONFIG);
  context = await browser.newContext();
});

after(async () => {
  await context.close();
  await browser.close();
});

it('点击登录之后跳转到登录页面', async () => {
  // Open new page
  const page = await context.newPage();
  // Go to https://www.vip.com/
  await page.goto('https://www.vip.com/');
  // Click #J_user_noId >> text=请登录
  await page.click('#J_user_noId >> text=请登录');

  assert.equal(page.url(), 'https://passport.vip.com/login', '跳转登录页面失败！');
});