const { chromium } = require('playwright');
const assert = require('assert');
const CONFIG = require('../config');

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

it('搜索商品，并查看评论-一定失败', async () => {
  // Open new page
  const page = await context.newPage();

  // Go to https://www.vip.com/
  await page.goto('https://www.vip.com/');

  // Click [placeholder="护肤套装"]
  await page.click('#J-search > div.c-search-form > input');

  // Fill [placeholder="护肤套装"]
  await page.fill('#J-search > div.c-search-form > input', '吉他');

  // Press Enter
  await Promise.all([
    page.waitForNavigation(/*{ url: 'https://category.vip.com/suggest.php?keyword=%E5%90%89%E4%BB%96&ff=235|12|1|1' }*/),
    page.press('#J-search > div.c-search-form > input', 'Enter')
  ]);

  // Click text=尤克里里/ukulele 21寸乌克丽丽小吉他原木色
  const [page1] = await Promise.all([
    page.waitForEvent('popup'),
    page.click('#J_searchCatList > div:nth-child(2) > a')
  ]);

  // Click text=全部评价 (0)
  await page1.click('#J-topbar > div > ul > a.dt-list-item.J-topbar-tabs.J-detail-commentCnt');
  // 'https://detail.vip.com/detail-3558963-711574031.html#J-FW-prdComment'
  assert.equal(true, page1.url().startsWith('https://detail.vip.com/detail'));
  assert.equal(true, page1.url().endsWith('#J-FW-prdComment1'), '判断URL 以 Comment1 结束');

});