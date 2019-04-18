import { CssSelector, XPathSelector, Selector } from "./Selector";
import { ElementHandle } from "puppeteer";
import { Elem } from "./Elem";
import { ModuleArray } from "./ModuleArray";
import { Matcher } from "./Matcher";

export type Constructor<T> = new (...x: any[]) => T;
export type ModuleConstructor<T> = new (matcher: Matcher, handle?: ElementHandle<Element>) => T;

export class Module extends Elem {
    /**
     * Create new **Module**, with this as parent. 
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
        return new Module(this.matcher.add(new CssSelector(css, nthIndex)));
    }

    /**
     * Create new **Module**, with this as parent. 
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
        xpath = this.fixNestedXpath(xpath);
        return new Module(this.matcher.add(new XPathSelector(xpath, nthIndex)));
    }

    /**
     * Create new **Module array** with this matcher as parent.
     * 
     * Uses **CSS** selector
     * 
     * @example
     * $("ul").$$("li"); // matcher for every item on list
     * 
     * @param css 
     */
    $$(css: string) {
        return new ModuleArray(
            this.matcher.add(new CssSelector(css))
        )
    }

    /**
     * Create new **Module array** with this matcher as parent.
     * 
     * Uses **XPATH** selector
     * 
     * @example
     * $("ul").$$x("//li"); // matcher for every item on list
     * 
     * @param css 
     */
    $$x(xpath: string) {
        xpath = this.fixNestedXpath(xpath);
        return new ModuleArray(
            this.matcher.add(new XPathSelector(xpath))
        )
    }

    /**
     * @example
     * class MyElem extends Module {
     * subField = this.$(".elem")
     * }
     * 
     * $(".elem").module(MyModule)
     */
    module<T extends Module>(moduleClass: ModuleConstructor<T>): T {
        if (moduleClass.prototype instanceof Module === false) {
            throw new Error(`${moduleClass.name} should extend 'Module' class.`);
        }

        return new moduleClass(this.matcher, this.handle);
    }

    static from<T extends Module>(from: Module): T {
        return <T>new this(from.matcher, from.handle)
    }

    /**
     * To work properly with nested elements. 
     * Xpath selector should have dot at the beginning. dot means "current node"
     * Explanation:
     * page.$("div").$x("//elements-inside-div") - matches all elements on the page
     * page.$("div").$x(".//elements-inside-div") - matches elements inside div (as expected)
     * 
     * for example: 
     * //div/h1 -> returns .//div/h1
     * (/div/h1) -> returns (./div/h1)[1]
     */
    private fixNestedXpath(xpath: string) {
        if (/^\//.test(xpath)) {
            return "." + xpath; // add dot
        }

        if (/[^\.\/]\//.test(xpath)) {
            return xpath.replace(/\//, "./"); //add dot 
        }
    }
}