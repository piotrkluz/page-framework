
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