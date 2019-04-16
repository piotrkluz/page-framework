import { ElementHandle, Page } from "puppeteer";
import * as utils from "../utils/utils";
import { Keyboard } from "puppeteer-keyboard";
import { Matcher } from "./Matcher";
import { Client } from "./Client";
import { FindError } from "./Errors";

declare var page: Page;

export class Elem {
    constructor(
        public matcher: Matcher,
        public handle: ElementHandle<Element> = null) { }

    /**
     * Finds element on the page and do nothing else.
     * If element is previously found, it's handle will be used. 
     * 
     * @param useCache If false => forces search element even if it's already found. 
     */
    async find(useCache = true): Promise<Elem> {
        if (this.handle && useCache) {
            return this;
        }
        
        this.handle = await Client.find(this.matcher.getAll())
        
        return this;
    }

    /**
     * Return null if not found.
     * @example
     * 
     * const found = await $(".elem").tryFind();
     * if(found) {
     *     await found.click()
     * }
     */
    async tryFind(useCache = true): Promise<Elem> {
        try {
            return await this.find(useCache)
        } catch (e) {
            return null;
        }
    }

    /**
     * Returns native puppeteer element handle. 
     */
    async getElement(): Promise<ElementHandle<Element>> {
        return await this.findAndDo(handle => handle);
    }

    /**
     * Returns true if element exist in DOM.
     */
    async isExist(): Promise<boolean> {
        return (await this.tryFind(false)) !== null;
    }

    /**
     * Return's true if element is exist and not have following styles
     * - display: none
     * - visibility: hidden
     * - opacity: 0
     */
    async isDisplayed(): Promise<boolean> {
        return await this.isExist() &&
            await this.eval(el => {
                const style = window.getComputedStyle(el);

                return style &&
                    style.display !== 'none' &&
                    style.visibility !== 'hidden' &&
                    style.opacity !== '0'
            });
    }

    /**
     * Return's true if element have given class. 
     * @param className 
     */
    async haveClass(className: string): Promise<boolean> {
        return this.eval(
            (el, expectedName) => el.classList.contains(expectedName),
            className)
    }

    async click() {
        await this.findAndDo(handle => handle.click());
    }

    async doubleClick(timeBetweenClicksMs = 50) {
        await this.findAndDo(async handle => {
            await handle.click();
            await this.sleep(timeBetweenClicksMs);
            await handle.click();
        });
    }

    /**
     * Return's element **textContent** property.
     */
    async getText(): Promise<string> {
        return await this.eval(e => e.textContent);
    }

    /**
     * Actual input value.
     */
    async getValue(): Promise<string> {
        return await this.eval(e => (<any>e).value);
    }

    /**
     * Clear element value. 
     */
    async clear(): Promise<void> {
        await this.eval(e => (<any>e).value = "");
    }

    /**
     * Text with Keyboard keys in parthenses []
     * @param text Examples: 
     * - "sometext"
     * - "sometext[Enter]" 
     * - "sometext[Ctrl+A] [Backspace]", etc.
     * 
     * Full available keys list: 
     * https://github.com/GoogleChrome/puppeteer/blob/master/lib/USKeyboardLayout.js
     */
    async typeText(text: string) {
        await this.findAndDo(h => h.focus())
        await new Keyboard(page).type(text);
    }

    /**
     * Wait for element to be exist on page.
     */
    async waitFor(timeout: number = 10000) {
        await utils.waitFor(() => this.isExist(), timeout);
    }

    /**
     * Wait for disappear element from page. 
     * uses **this.isDisplayed()** method.
     */
    async waitForDisappear(timeout: number = 10000) {
        await utils.waitFor(() => !this.isDisplayed(), timeout);
    }

    /**
     * Resolve after given amount of [ms]
     */
    async sleep(ms: number): Promise<void> {
        await utils.sleep(ms);
    }

    /**
     * Evaluate given JavaScript in browser context. 
     * 
     * @example
     * //log "hello" in browser console
     * $(".elem").eval(el => console.log("hello")) 
     * 
     * // return value from browser
     * const html = $(".elem").eval(el => el.innerHTML) 
     * 
     * // pass params
     * const myValue = "123"
     * $(".elem").eval((el, param) => console.log(param), myValue) // will log "123" in browser console
     */
    async eval<R>(pageFunction: (element: Element, ...args: any[]) => R | Promise<R>, ...args: any[]): Promise<R> {
        return this.findAndDo(handle => {
            return Client.eval(handle, pageFunction, ...args);
        })
    }

    /**
     * First tries to evaluate passed function using previously found (cached) handle for save time. 
     * 
     * Using cached handle can cause errors related to redraw element like "Node is detached from document"
     * If such error occur. Tries to find element one more time and re-evaluate
     */
    private async findAndDo<T>(func: (handle: ElementHandle<Element>) => T | Promise<T>): Promise<T> {
        if (!this.handle) {
            await this.find();
        }

        try {
            return await func(this.handle)
        } catch (e) {
            //TODO add if -> StaleElemntException or NavigationException
            await this.find(false); //re-find without cache
            return await func(this.handle);
        }
    }
}
