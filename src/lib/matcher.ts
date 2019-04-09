import { CssSelector, XPathSelector } from "./selector";
import { MatcherArray } from "./matcherArray";
import { Elem } from "./elem";

export type Constructor<T> = new (...x: any[]) => T;

export class Matcher extends Elem {
    $(css: string, nth: number = 1): Elem {
        return new Matcher(new CssSelector(css, nth), this);
    }

    $$(css: string) {
        return new MatcherArray(new CssSelector(css), this, <Constructor<Matcher>>this.constructor)
    }

    $x(xpath: string, nth: number = 1) {
        return new Matcher(new XPathSelector(xpath, nth), this);
    }

    $$x(xpath: string) {
        return new MatcherArray(new XPathSelector(xpath), this, <Constructor<Matcher>>this.constructor);
    }

    module<T extends Module>(module: Constructor<T>): T {
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