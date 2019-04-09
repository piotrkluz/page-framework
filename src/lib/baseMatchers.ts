import { Matcher } from "./matcher";
import { MatcherArray } from "./matcherArray";
import { CssSelector, XPathSelector } from "./selector";

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