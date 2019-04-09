# puppeteer-page-object
Page object / page modules implementation, for puppeteer. 100% TypeScript.

# Attention. This project is NOT finished !
## Tasks to do: 
- [x] Browser launcher class
- [x] Element proxy mechanism
- [x] Slector abstraction
- [x] Fluent interface for selectors
- [x] Refactor -> create separated Matcher class
- [x] Add documentation with examples in JavaScript / TypeScript
- [x] use puppeteer-keyboard
- [ ] $(".elem").module(ModuleName)


# What You can do with this lib (examples)
- Define page elements using CSS, XPATH in the same locator like ```$(".img").$x("../../div")```
- Define page modules classes that composes few elements and its behavior
- Use predefined elements within library (and extends their behavior by simply extending class)
- Compose Page Objects using predefined modules and Elements

## And also:
- evaluate JavaScript directly in browser and get results from it (works for all kinds of selectors)
- easily iterate thorough array of elements
- easily run test on multiple browsers (thanks to ```jest``` test runner)


# Getting started
## 1. Install package
```bash
npm i puppeteer puppeteer-page-object
#OR yarn add puppeteer puppeteer-page-object
```

## 2. Using package:
Library requires **puppeteer page** instance in global scope. The easiest way to do it is use bundled initializer.
```javascript
//SOMEWHERE AT THE BEGINNING OF THE SCRIPT
const Browser = require("puppeteer-page-object").BrowserUtils;

(async () => {
    await Browser.init({ headless: false });
})()
```

Good place to put it is ```beforeAll()``` hook in Your test framework.
```javascript
describe("My test", () => {
    beforeAll(async () => {
        await Browser.init({ headless: false });
    })

    afterAll(async () => {
        await Browser.disconnect(); // don't forget to close the browser.
    })

    it("my test", async () => {
        page.open("http://www.example.com")
        await $("h1").click();
    })
})
```


#Examples
## Use only matchers (without page object)
```javascript
// We can create set of matchers independly
const button = $(".myButton")
const form = $("//div[@class='container']").$(".my-form");
const loginField = form.$(".login")
const passwordField = form.$(".pass")

await button.click();
await loginField.type("mylogin[Enter]")
await passwordField.type("mypass123")

```


## Complex example: 
```typescript
import { PagerPage, PagerElement } from "pager";

class TodoMVCPage extends Page {
    URL = "http://todomvc.com/examples/react/#/";

    app = $(".todoapp");
    todoInput = app.$(".header").$("input");
    
    list = app.$("ul.todo-list]");
    allTasks = list.$$("li");

    thirdTask = list.$("li", 3).module(Task);
    nthTask = n => list.$x(`//li[${n}]`).module(Task);
    taskByText = n => list.$x(`//li[${n}]`).module(Task);

    // Any request to the browser isn't send at this point.

    async createTask(task) {
        await todoInput.typeText(task);
        await todoInput.press("Enter");
    }

    async getTasks() {
        return await allElements.map(el => el.getText());
    }

    async closeTask(textOrNumber) {
        if(typeof textOrNumber === "number") {
            return await nthTask(textOrNumber).close();
        }

        return await taskByText(textOrNumber).close();
    }

    // ...
}
```


# Matchers description

At the core of framework are Element **```Matcher```**.
- It represent's way to localize it with different kind of selectors (CSS, XPATH).
- Provide's extendable API to handle with elements (such as ```click()```, ```getText()```, ```eval()```, ```scrollTo()``` and more)
- It became as Proxy, and selector is eveluated lazily (in the moment when it's really need)

```javascript
const simpleCssMatcher = $(".some.css > selector");
```
After eveluate above expression any request to the browser **isn't** sent. Request will be send after make an action on the page. For example: 
```javascript
const simpleCssMatcher = $(".some.css > selector");
await simpleCssMatcher.click()
```

Or in shorter way: 
```javascript
await $(".some.css > selector").click();
```

**Matcher's** can have children: 
```javascript
const elem = $(".some.css").$(".child.selector").$(".child.of.child")

await el.click();
``` 

**Matcher's** can match elements by XPATH selector
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

// Or get one element for future usage
const firstElem = (await elems.findAll())[0]
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