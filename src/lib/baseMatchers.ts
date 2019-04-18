import { Module } from "./Module";
import { ModuleArray } from "./ModuleArray";
import { CssSelector, XPathSelector } from "./Selector";
import { Matcher } from "./matcher";

/**
 * Return new Module with CSS Matcher
 */
export function $(selector: string, nth: number = 0) {
    return new Module(new Matcher([new CssSelector(selector, nth)]));
}

/**
 * Return new Module with XPATH Matcher
 */
export function $x(xpath: string, nth: number = 0) {
    return new Module(new Matcher([new XPathSelector(xpath, nth)]));
}

/**
 * Return new Module Array with CSS Matcher
 */
export function $$(selector: string) {
    return new ModuleArray(new Matcher([new CssSelector(selector)]));
}

/**
 * Return new Module Array with XPATH Matcher
 */
export function $$x(xpath: string) {
    return new ModuleArray(new Matcher([new XPathSelector(xpath)]));
}