import {Keyboard} from "puppeteer-keyboard";
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto('https://google.com');

  const input = await page.$("input[name=q]");
  const kb = new Keyboard(page, { delay: 300 });

  await kb.type("puppeteer[ArrowDown][ArrowDown][Enter]", input)

//   await browser.close();
})();