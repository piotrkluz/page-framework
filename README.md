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
npm i puppeteer page-framework
#OR yarn add puppeteer-page-framework
```

## 2. Using package:
Only one requirement from library is **puppeteer page** instance in global scope.
The easiest way to do it is use bundled initializer.

> **NOTE:** If you are using ***jest***, there is ready solution (jest-puppeteer): https://jestjs.io/docs/en/puppeteer.
> With it you can skip this point.


```javascript
//SOMEWHERE AT THE BEGINNING OF THE SCRIPT
const BrowserUtils = require("page-framework").BrowserUtils;

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
const framework = require("page-framework")
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
import { $, BrowserUtils } from "page-framework";

declare var page: PuppeteerPage;

(async () => {
    await BrowserUtils.init({ headless: false });
    await page.goto("http://www.example.com");
    const txt = await $("h1").getText();

    console.log(txt);
    page.close(); // comment this line to keep the browser alive
})()
```


#Functionalities description
## Simple use element matchers
```javascript
const button = $(".myButton")
const form = $("//div[@class='container']").$(".my-form");
const loginField = form.$(".login")
const passwordField = form.$(".pass")

await button.click();
await loginField.type("mylogin[Enter]")
await passwordField.type("mypass123")
```


# Matchers description
At the core of framework are Element **```Matcher```**.
- It represent's way to localize it with different kinds of selectors (CSS, XPATH).
- Provide's extendable API to handle element properties and actions (such as ```click()```, ```getText()```, ```eval()``` and more).
- It became as Proxy - selector is evaluated while it's really needed - just before click, read, eval is performed)

```javascript
const simpleCssMatcher = $(".some.css > selector");
```
After evaluate above expression any request to the browser **isn't** sent. Request will be send after make an action on the page. For example: 
```javascript
const simpleCssMatcher = $(".some.css > selector");
await simpleCssMatcher.click(); // here, action is evaluated
```

The same in shorter way: 
```javascript
await $(".some.css > selector").click();
```

**Matcher's** can have children: 
```javascript
const elem = $(".some.css").$(".child.selector").$(".child.of.child")

await elem.click();
``` 

**Matcher's** can match elements by XPATH selector. 
> Note the name of method: ```$x()``` for XPATH instead ```$()``` for CSS.
```javascript
$x("//some/xpath/selector/..")
```

...or combine both ways
```javascript
$x("//some/xpath/selector/..").$("nested.css.selector");
``` 

By default matches first found element, but behavior can be changed with second parameter: 
```javascript
$x("//some/xpath/selector/..", 3)  // - matches third found element
$(".some.css", 3)  // - works for css too
```


There is possibility to match collections: 
```javascript
const elems = $$("ul > li")  // - matches every element from list
const xpathElems = $$x("//ul/li")  // - works for xpath too

// Results can be mapped - grab text from every element
const textArray = await elems.map(el => el.getText());

// Can be iteratd - click every element
await xpathElems.forEach(el => el.click());

// And filtered
const filtered = await xpathElems.filter(el => {
    (await el.getText()).includes("search text");
});

// Or just get found element handles
const handles = await elems.findAll(); // Returns Array
const firstElem = handles[0];
// ...
// some code
// ...
await firstElem.click()
```

Of course sub-elements still works as arrays: 
```javascript 
elems = $(".some.parent").$x("//ul").$$("li");
await elems.forEach(e => console.log(e.getText())) 
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
