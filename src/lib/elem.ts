import { Selector, CssSelector, XPathSelector } from "./selector";
import { ElementHandle, Page } from "puppeteer";
import { Client } from "./client";
import * as utils from "../utils/utils";
import { Keyboard } from "puppeteer-keyboard";
import { Matcher } from "./matcher";

declare var page: Page;

export class Elem {
    constructor(
        protected selector: Selector,
        protected parent: Matcher = null,
        public handle: ElementHandle<Element> = null) { }

    async find(): Promise<Elem> {
        if (await this.verifyHandle()) {
            return this;
        }

        const parentEl = this.parent
            ? (await this.parent.find()).handle
            : null;

        this.handle = await Client.findOne(this.selector, parentEl);

        if (this.handle === null) {
            this.throwNotFound();
        }

        return this;
    }

    async tryFind(): Promise<Elem> {
        try {
            return await this.find()
        } catch (e) {
            return null;
        }
    }

    async getElement() {
        await this.find();
        return this.handle;
    }

    async isExist(): Promise<boolean> {
        return (await this.tryFind()) !== null;
    }

    async isDisplayed(): Promise<boolean> {
        return (await this.isExist()) &&
            await this.eval(el => {
                const style = window.getComputedStyle(el);

                return style &&
                    style.display !== 'none' &&
                    style.visibility !== 'hidden' &&
                    style.opacity !== '0'
            });
    }

    async click() {
        await this.find();
        await this.handle.click();
    }

    async getText(): Promise<string> {
        await this.find();
        return await this.eval(e => e.textContent);
    }

    async getValue(): Promise<string> {
        await this.find();
        return await this.eval(e => (<any>e).value);
    }

    async clear(): Promise<void> {
        await this.find();
        await this.eval(e => (<any>e).value = "");
    }

    /**
     * Text with Keyboard keys in parthenses []
     * Examples: 
     * - "sometext"
     * - "sometext[Enter]" 
     * - "sometext[Ctrl+A] [Backspace]", etc.
     * 
     * Keys list are in Keys.js file:
     * 
     * @param text
     */
    async typeText(text: string) {
        await this.focus();
        await new Keyboard(page).type(text);
    }

    async waitFor(timeout: number = 10000) {
        return await utils.waitFor(() => this.find(), timeout);
    }

    async waitForDisappear(timeout: number = 10000) {
        await utils.waitFor(() => !this.isDisplayed(), timeout);
    }

    async eval<R>(pageFunction: (element: Element) => R | Promise<R>): Promise<R> {
        await this.find();
        return await Client.eval(this.handle, pageFunction);
    }

    async focus() {
        await this.find();
        await this.handle.focus();
    }

    async hover() {
        await this.find();
        await this.handle.hover();
    }

    async tap() {
        await this.find();
        await this.handle.tap();
    }

    async boundingBox() {
        await this.find();
        await this.handle.boundingBox();
    }

    async boxModel() {
        await this.find();
        await this.handle.boxModel();
    }

    async getProperty(name: string) {
        await this.find();
        await this.handle.getProperty(name);
    }

    async getProperties() {
        await this.find();
        await this.handle.getProperties();
    }

    private throwNotFound() {
        let msg;
        msg += this.parent
            ? "\nFOUND PARENT: " + this.parent.allSelectors().join(" ==> ")
            : "";

        msg += "\nNOT FOUND SELECTOR: " + this.selector.toString();

        throw new Error(msg);
    }

    /**
     * Most cost-effective way to check if element handle is still available.
     * It takes approx 2-3ms
     */
    private async verifyHandle() {
        try {
            await this.handle.executionContext().evaluate(() => { }); //make sure handle is still available
            return this.handle;
        } catch (e) {
            this.handle = null; // reset found state
            return null;
        }
    }

    private allSelectors(): string[] {
        return this.allParents().map(e => e.selector.toString());
    }

    /**
     * Map inheritance hierarchy into array of elements: 
     * [..., grandparent, parent, child]
     */
    private allParents(): Elem[] {
        return this.parent
            ? [...this.allParents(), this]
            : [this]
    }
}