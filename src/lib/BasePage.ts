import { Page } from "puppeteer";
import { Elem } from "./elem";
import { CssSelector, XPathSelector } from "./selector";
import { MatcherArray } from "./matcherArray";
import { Matcher } from "./matcher";

/** DECLARED GLOBAL VARIABLE */
declare var page: Page;

export class BasePage {
    readonly URL: string;

    async open() {
        if (!this.URL) {
            throw new Error(`URL not set in page: ${this.constructor.name}`)
        }
        await page.goto(this.URL)

        return this;
    }

    async isOpened(): Promise<boolean> {
        return this.URL && page.url().includes(this.URL); 
    }
}

export function $(selector: string, nth: number = 0) {
    return new Matcher(new CssSelector(selector, nth));
}

export function $$(selector: string) {
    return new MatcherArray(new CssSelector(selector));
}

export function $x(xpath: string, nth: number = 0) {
    return new Matcher(new XPathSelector(xpath, nth));
}

export function $$x(xpath: string) {
    return new MatcherArray(new XPathSelector(xpath));
}



