import { CssSelector, XPathSelector, Selector } from "./selector";
import { MatcherArray } from "./matcherArray";
import { Elem } from "./elem";
import { ElementHandle } from "puppeteer";

export type Constructor<T> = new (...x: any[]) => T;
export type ModuleConstructor<T> = new (selector: Selector, parent: Matcher, handle: ElementHandle<Element>) => T;

export class Matcher extends Elem {
    $(css: string, nth: number = 1) {
        return new Matcher(new CssSelector(css, nth), this);
    }

    $$(css: string) {
        return new MatcherArray(new CssSelector(css), this, <ModuleConstructor<Matcher>>this.constructor)
    }

    $x(xpath: string, nth: number = 1) {
        return new Matcher(new XPathSelector(xpath, nth), this);
    }

    $$x(xpath: string) {
        return new MatcherArray(new XPathSelector(xpath), this, <ModuleConstructor<Matcher>>this.constructor);
    }

    /**
     * @example
     * class MyModule extends Module {
     * subField = this.$(".elem")
     * }
     * 
     * $(".elem").module(MyModule)
     */
    module<T extends Module>(module: ModuleConstructor<T>): T {
        if (module.prototype instanceof Module === false) {
            throw new Error(`${module.name} should extend 'Module' class.`);
        }

        return new module(this.selector, this.parent, this.handle);
    }
}

export class Module extends Matcher {
    static from<T extends Module>(matcherFrom: Matcher): T {
        return <T>new this(matcherFrom.selector,
            matcherFrom.parent,
            matcherFrom.handle)
    }
}