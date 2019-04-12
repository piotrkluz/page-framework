import { CssSelector, XPathSelector, Selector } from "./selector";
import { MatcherArray } from "./matcherArray";
import { Elem } from "./elem";
import { ElementHandle } from "puppeteer";

export type Constructor<T> = new (...x: any[]) => T;
export type ModuleConstructor<T> = new (selector: Selector, parent: Matcher, handle: ElementHandle<Element>) => T;

export class Matcher extends Elem {

    /**
     * Create new **Matcher**, with this as parent. 
     * 
     * Uses **CSS** selector
     * 
     * @param css 
     * @param nthIndex Start from 0
     * 
     * @example
     * elem.$(".sub-elem")
     * elem.$("li", 3) //matches 4th element from list
     */
    $(css: string, nthIndex: number = 0) {
        return new Matcher(new CssSelector(css, nthIndex), this);
    }

    /**
     * Create new **Matcher**, with this as parent. 
     * 
     * Uses **XPATH** selector
     * 
     * @param xpath 
     * @param nthIndex Start from 0
     * 
     * @example
     * elem.$x("//*contains(., 'text')")
     * elem.$x("//*contains(., 'text')", 2) //matches 3rd element from found list
     */
    $x(xpath: string, nthIndex: number = 0) {
        return new Matcher(new XPathSelector(xpath, nthIndex), this);
    }

    /**
     * Create new **Matcher array** with this matcher as parent.
     * 
     * Uses **CSS** selector
     * 
     * @example
     * $("ul").$$("li"); // matcher for every item on list
     * 
     * @param css 
     */
    $$(css: string) {
        return new MatcherArray(new CssSelector(css), this, <ModuleConstructor<Matcher>>this.constructor)
    }

    /**
     * Create new **Matcher array** with this matcher as parent.
     * 
     * Uses **XPATH** selector
     * 
     * @example
     * $("ul").$$x("//li"); // matcher for every item on list
     * 
     * @param css 
     */
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