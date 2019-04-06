import { Selector } from "./selector";
import { ElementHandle, Page } from "puppeteer";

declare var page: Page;
export class Client {
    static async findOne(selector: Selector, parentElement: ElementHandle<Element> = null): Promise<ElementHandle<Element>> {
        const base: Page | ElementHandle<Element> = parentElement
            ? parentElement
            : page;

        if(selector.nth == 1 && selector.constructor.name == "CssSelector") {
            return await base.$(selector.toString());
        }

        const results = await this.findAll(selector, parentElement);
        const result = results[selector.nth - 1];

        if(result == undefined) {
            if(selector.nth == 0) {
                throw new Error(`Not found any element: 
                \nSELECTOR: ${selector.toString()}`)
            }

            if(results) {
                throw new Error(`Requested element number ${selector.nth} not found.
                Found only ${results.length} elementswith selector:
                ${selector.toString()}               
                `)
            }

            throw new Error(`Not found element:
            \nINDEX: ${selector.nth} 
            \nSELECTOR: ${selector.toString()}`);                        
        }

        return result;
    }

    static async findAll(selector: Selector, parentElement: ElementHandle<Element> = null): Promise<ElementHandle<Element>[]> {
        const base = parentElement
            ? parentElement
            : page;    

            //css
            if(selector.constructor.name == "CssSelector") {
                return await base.$$(selector.toString())
            } 
            
            // xpath
            const fixedXpath = parentElement
                ? this.fixNestedXpath(selector.toString()) //dot in xpath is required
                : selector.toString()

            return await base.$x(fixedXpath);
    }

    static async eval<R>(elementHandle: ElementHandle<Element>, pageFunction: (element: Element) => R | Promise<R>): Promise<R> {
        return await page.evaluate(
            pageFunction,
            elementHandle
        );
    }

    static async evalAll<R>(elementHandles: ElementHandle<Element>[], pageFunction: (element: Element) => R | Promise<R>): Promise<R> {
        return await page.evaluate(
            pageFunction,
            ...elementHandles
        );
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
    private static fixNestedXpath(xpath: string) {
        if(/^\//.test(xpath)) {
            return "." + xpath; // add dot
        }

        if(/[^\.\/]\//.test(xpath)) {
            return xpath.replace(/\//, "./"); //add dot 
        }
    }
}