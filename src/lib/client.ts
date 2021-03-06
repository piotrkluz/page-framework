import { Selector, CssSelector } from "./Selector";
import { ElementHandle, Page } from "puppeteer";
import { FindError, NotFoundError, NotFoundNthError, NotFoundArrayError } from "./Errors";
import { Matcher } from "./Matcher";

declare var page: Page;

/**
 * Client for handling puppeteer requests.
 */
export class Client {

    /**
     * Find first element by given Matcher.
     */
    static async find(matcher: Matcher): Promise<ElementHandle<Element>> {
        const selectors = matcher.getAll();

        let handle: ElementHandle;
        for (const [index, selector] of selectors.entries()) {
            try {
                handle = await this.doFind(selector, handle);
            } catch (e) {
                if (e instanceof NotFoundNthError) {
                    throw new NotFoundArrayError(e, matcher)
                }
                throw new FindError(matcher, index, e);
            }

            if (!handle) {
                throw new NotFoundError(matcher, index);
            }
        }

        return handle;
    }

    /**
     * Find all elements by given Matcher.
     */
    static async findAll(matcher: Matcher): Promise<ElementHandle<Element>[]> {
        const selectors = matcher.getAll();
        let lastSelector = selectors.pop();

        let parent: ElementHandle;
        if (selectors.length > 0) {
            parent = await this.find(new Matcher(selectors));
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

        let index = selector.nthIndex;
        if(index === 0 && selector instanceof CssSelector) {
            return await base.$(selector.toString())
        }

        const allFound = await this.doFindAll(selector, handle);
        if (index < 0) {
            index += allFound.length;
        }

        if(index < 0 || index >= allFound.length) {
            throw new NotFoundNthError(allFound.length, index);
        }

        return allFound[index];
    }

    private static async doFindAll(selector: Selector, handle?: ElementHandle): Promise<ElementHandle<Element>[]> {
        const base = handle || page;

        return selector instanceof CssSelector
            ? await base.$$(selector.toString())
            : await base.$x(selector.toString());
    }
}