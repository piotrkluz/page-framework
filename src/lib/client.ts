import { Selector, CssSelector } from "./Selector";
import { ElementHandle, Page } from "puppeteer";
import { FindError, NotFoundError } from "./Errors";

declare var page: Page;

export class Client {
    static async find(selectors: Selector[]): Promise<ElementHandle<Element>> {
        let handle: ElementHandle;
        for (const [index, selector] of selectors.entries()) {
            try {
                handle = await this.doFind(selector, handle);
            } catch(e) {
                throw new FindError(selectors, index, e);
            }
            
            if(!handle) {
                throw new NotFoundError(selectors, index);
            }
        }

        return handle;
    }

    static async findAll(selectors: Selector[]): Promise<ElementHandle<Element>[]> {
        let lastSelector = selectors.pop();

        let parent: ElementHandle;
        if (selectors.length > 0) {
            parent = await this.find(selectors);
        }

        return await this.doFindAll(lastSelector, parent);
    }

    /**
     * @param elementHandle Element to handle in browser context
     * @param pageFunction Function to evaluate in browser context
     * @param args Argument's to pass to pageFunction
     */
    static async eval<R>(
        elementHandle: ElementHandle<Element>,
        pageFunction: (element: Element, ...args: any[]) => R | Promise<R>,
        ...args: any[]
    ): Promise<R> {
        return await page.evaluate(
            pageFunction,
            elementHandle,
            ...args
        );
    }

    private static async doFind(selector: Selector, handle?: ElementHandle): Promise<ElementHandle<Element>> {
        const base = handle || page;

        return selector.nthIndex === 0 && selector instanceof CssSelector
            ? await base.$(selector.toString())
            : (await this.doFindAll(selector, handle))[selector.nthIndex];
    }

    private static async doFindAll(selector: Selector, handle?: ElementHandle): Promise<ElementHandle<Element>[]> {
        const base = handle || page;

        return selector instanceof CssSelector
            ? await base.$$(selector.toString())
            : await base.$x(selector.toString());
    }
}