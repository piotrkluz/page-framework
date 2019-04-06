import { Selector, CssSelector, XPathSelector } from "./selector";
import { ElementHandle, Page } from "puppeteer";
import { MatcherArray } from "./matcherArray";
import { Client } from "./client";
import * as utils from "../utils/utils";
import { Keyboard } from "puppeteer-keyboard";
import { Elem } from "./elem";

declare var page: Page;

export class Matcher extends Elem {
    $(css: string, nth: number = 0): Elem {
        return new Matcher(new CssSelector(css, nth), this);
    }

    $$(css: string): MatcherArray {
        return new MatcherArray(new CssSelector(css), this)
    }

    $x(xpath: string, nth: number = 0) {
        return new Matcher(new XPathSelector(xpath, nth), this);
    }

    $$x(xpath: string) {
        return new MatcherArray(new XPathSelector(xpath), this);
    }
}