import { Matcher } from "./matcher";
import { MatcherArray } from "./matcherArray";
import { CssSelector, XPathSelector } from "./selector";

/**
 * Return new Matcher by CSS
 */
export function $(selector: string, nth: number = 0) {
    return new Matcher(new CssSelector(selector, nth));
}

/**
 * Return new Matcher by XPATH
 */
export function $x(xpath: string, nth: number = 0) {
    return new Matcher(new XPathSelector(xpath, nth));
}

/**
 * Return new Matcher Array by CSS
 */
export function $$(selector: string) {
    return new MatcherArray(new CssSelector(selector));
}

/**
 * Return new Matcher Array by XPATH
 */
export function $$x(xpath: string) {
    return new MatcherArray(new XPathSelector(xpath));
}