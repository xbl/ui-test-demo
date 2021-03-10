const { chromium } = require('playwright');
const assert = require('assert');

let browser;
let context;
before(async() => {
  browser = await chromium.launch({ headless: false});
  context = await browser.newContext();
});

after(async () => {
  await context.close();
  await browser.close();
});

it('搜索商品列表，判断是否都包含 a 标签', async () => {
  // Open new page
  const page = await context.newPage();

  // Go to https://www.vip.com/
  await page.goto('https://www.vip.com/');

  // Click [placeholder="护肤套装"]
  await page.click('[placeholder="护肤套装"]');

  // Fill [placeholder="护肤套装"]
  await page.fill('[placeholder="护肤套装"]', '吉他');

  // Press Enter
  await Promise.all([
    page.waitForNavigation(/*{ url: 'https://category.vip.com/suggest.php?keyword=%E5%90%89%E4%BB%96&ff=235|12|1|1' }*/),
    page.press('[placeholder="护肤套装"]', 'Enter')
  ]);

  // Click #J_searchCatList div:has-text("特卖价 ¥299 ¥399 7.5折 演奏家民谣吉他41英寸初学者新手入门吉它男女生木吉他专用乐器 商家直营")
  const queryResultArr = await page.$$('.c-goods-item.J-goods-item.c-goods-item--auto-width');

  for(var i = 0; i < queryResultArr.length; i++) {
    let aElement = await queryResultArr[i].$('a');
    assert.notEqual(null, aElement);
  }

  // Close page
  await page.close();
});