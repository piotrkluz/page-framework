# puppeteer-page-framework
Page object / page modules implementation, for puppeteer. 100% TypeScript.

# Description
Library powered by **puppeteer** helps in write well-structured browser automation. 
- Automates Chrome / Chromium browser in very performant way (thanks for puppeteer team)
- Implements Page object / Page modules pattern
- Simplifies and extends puppeteer API to handle WebElements
- Simplifies WebElement locators and let's mix different kinds of them.
- Uses newest ***JavaScript ES6+*** / ***TypeScript*** features.

# What You can do with this lib
- Define complex locators in simple way: ```$(".img").$x("../../div")``` (mixed CSS and XPATH)
- separate locators and their bahavior in **page modules**, and **page objects**
- Run tests in parallel using different runners (**jest** is recommended as default runner)
- Evaluate JavaScript directly in Browser console


# Getting started
## 1. Install package
```bash
npm i puppeteer puppeteer-page-framework
#OR yarn add puppeteer puppeteer-page-framework
```

## 2. Using package:
Only one requirement from library is **puppeteer page** instance in global scope.
The easiest way to do it is use bundled initializer.

> **NOTE:** If you are using ***jest***, there is ready solution (jest-puppeteer): https://jestjs.io/docs/en/puppeteer.
> With it you can skip this point.


```javascript
//SOMEWHERE AT THE BEGINNING OF THE SCRIPT
const BrowserUtils = require("puppeteer-page-framework").BrowserUtils;

(async () => {
    await BrowserUtils.initBrowser({ headless: false });
})()
```

Good place to put it is ```beforeAll()``` hook in Your test framework (this is working example for JEST)
```javascript
describe("My test", () => {
    beforeAll(async () => {
        await BrowserUtils.init({ headless: false });
    })

    afterAll(async () => {
        await BrowserUtils.disconnect(); // don't forget to close the browser.
    })

    it("my test", async () => {
        await page.open("http://www.example.com")
        await $("h1").click();
    })
})
```

## Working example in pure JS ES6+:
```javascript
const framework = require("puppeteer-page-framework")
const BrowserUtils = framework.BrowserUtils;
const $ = framework.$;

(async () => {
    await BrowserUtils.init({ headless: false });
    await page.goto("http://www.example.com");
    const txt = await $("h1").getText();

    console.log(txt);
    page.close(); // comment this line to keep the browser alive
})()
```

## Working example in pure TypeScript: 
```typescript
import { Page as PuppeteerPage } from "puppeteer";
import { $, BrowserUtils } from "puppeteer-page-framework";

declare var page: PuppeteerPage;

(async () => {
    await BrowserUtils.init({ headless: false });
    await page.goto("http://www.example.com");
    const txt = await $("h1").getText();

    console.log(txt);
    page.close(); // comment this line to keep the browser alive
})()
```


# Development
## Tasks to do: 
- [x] Browser launcher class
- [x] Element proxy mechanism
- [x] Slector abstraction
- [x] Fluent interface for selectors
- [x] Refactor -> create separated Matcher class
- [x] Add documentation with examples in JavaScript / TypeScript
- [x] use puppeteer-keyboard
- [x] $(".elem").module(ModuleName)
- [x] Add unit tests
- [ ] Refactor -> Extract Browser client behind interface
- [ ] Create examples folder with basic use cases
