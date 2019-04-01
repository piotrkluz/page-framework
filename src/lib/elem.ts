import { Selector, CssSelector, XPathSelector } from "./selector";
import { ElementHandle, Page } from "puppeteer";
import { ElemArray } from "./elemArray";
import { Client } from "./client";
import * as utils from "./utils";
import { InputType } from "zlib";

interface Global {
    page: Page
}
(<Global><unknown>global).page;

export class Elem {
    constructor(
        private selector: Selector,
        protected parent: Elem = null,
        public handle: ElementHandle<Element> = null) { }

    $(css: string, nth: number = 0): Elem {
        return new Elem(new CssSelector(css, nth), this);
    }

    $$(css: string): ElemArray {
        return new ElemArray(new CssSelector(css), this)
    }

    $x(xpath: string, nth: number = 0) {
        return new Elem(new XPathSelector(xpath, nth), this);
    }

    $$x(xpath: string) {
        return new ElemArray(new XPathSelector(xpath), this);
    }

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

    async isDisplayed(): Promise<boolean> {
        await this.tryFind();
        return this.handle !== null
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

    async typeText(text: string) {
        await this.find();
        await this.handle.type(text);
    }

    async waitFor(timeout: number = 10000) {
        return await utils.waitFor(() => this.find(), timeout);
    }

    async waitForDisappear(timeout: number = 10000) {
        await utils.waitFor(async () => !this.isDisplayed(), timeout);
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

    // async press() {
    //     await this.find();
    //     await this.foundEl.press();
    // }

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

    private async verifyHandle() {
        try {
            await this.handle.executionContext().evaluate(() => { }); //make sure handle is available
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