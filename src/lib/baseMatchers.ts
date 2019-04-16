import { Module } from "./Module";
import { ModuleArray } from "./ModuleArray";
import { CssSelector, XPathSelector } from "./Selector";
import { Matcher } from "./matcher";

/**
 * Return new Matcher by CSS
 */
export function $(selector: string, nth: number = 0) {
    return new Module(new Matcher([new CssSelector(selector, nth)]));
}

/**
 * Return new Matcher by XPATH
 */
export function $x(xpath: string, nth: number = 0) {
    return new Module(new Matcher([new XPathSelector(xpath, nth)]));
}

/**
 * Return new Matcher Array by CSS
 */
export function $$(selector: string) {
    return new ModuleArray(new Matcher([new CssSelector(selector)]));
}

/**
 * Return new Matcher Array by XPATH
 */
export function $$x(xpath: string) {
    return new ModuleArray(new Matcher([new XPathSelector(xpath)]));
}