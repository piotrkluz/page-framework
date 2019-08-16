import { ElementHandle, Page, ClickOptions } from "puppeteer";
import * as utils from "../utils/utils";
import { Keyboard } from "puppeteer-keyboard";
import { Matcher } from "./Matcher";
import { Client } from "./Client";

declare var page: Page;

export class Elem {
    constructor(
        public matcher: Matcher) { }

    /**
     * Finds element on the page and do nothing else.
     */
    async find(): Promise<ElementHandle> {
        return await Client.find(this.matcher)
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
    async tryFind(): Promise<ElementHandle> {
        try {
            return await this.find()
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
        return (await this.tryFind()) !== null;
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

    /**
     * @example
     * $(".el").click()
     * $(".el").click({delay: 40, "right"})
     */
    async click(options?: ClickOptions) {
        await this.findAndDo(handle => handle.click(options));
    }

    /**
     * Schroucut to .click({clickCount: 2, delay })
     */
    async doubleClick(delay = 50) {
        await this.findAndDo(handle => handle.click({clickCount: 2, delay }));
    }

    async hover() {
        await this.findAndDo(handle => handle.hover());
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
     * @example
     * // return value from browser
     * const html = $(".elem").eval(el => el.innerHTML) 
     * @example
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
     * Evaluate function of found element handle.
     */
    private async findAndDo<T>(func: (handle: ElementHandle<Element>) => T | Promise<T>): Promise<T> {
        return await func(await this.find())
    }
}
