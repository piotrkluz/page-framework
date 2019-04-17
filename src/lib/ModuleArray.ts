import { Module, ModuleConstructor } from "./Module";
import { Matcher } from "./Matcher";
import { Client } from "./Client";

export class ModuleArray<M = Module> {
    constructor(
        private matcher: Matcher,
        private moduleClass: ModuleConstructor<M> = <ModuleConstructor<M>><any>Module //compile hack
    ) { }

    /**
     * @param func
     * @example
     * $$("li").map(el => el.getText()); // if one line async-await keywords can be skipped
     * 
     * @example
     * $$("li").map(async el => {
     *     await el.click()
     *     return await el.getText();
     * });
     */
    async map<T>(func: (el: M) => Promise<T>): Promise<T[]> {
        const els = await this.findAll();
        const retArr: T[] = [];

        for (let i = 0; i < els.length; i++) {
            const ret = await func(els[i]);
            retArr.push(ret);
        }

        return retArr;
    }

    /**
     * @example 
     * $$("li").filter(el => el.isDisplayed())
     * @example
     * $$("li").filter(async el => {
     *     return (await el.getText()) == "Some text"
     * })
     */
    async filter(func: (el: M) => Promise<boolean>): Promise<M[]> {
        const els = await this.findAll();

        const outputArr: M[] = [];
        for (let i = 0; i < els.length; i++) {
            if (await func(els[i])) {
                outputArr.push(els[i]);
            }
        }

        return outputArr;
    }

    /**
     * @param func
     * @example
     * $$("li").forEach(el => el.click());
     */
    async forEach(func: (el: M) => Promise<void>): Promise<void> {
        const els = await this.findAll();

        for (let i = 0; i < els.length; i++) {
            await func(els[i]);
        }
    }

    async count(): Promise<number> {
        return (await this.findAll()).length;
    }

    async findAll(): Promise<M[]> {
        const found = await Client.findAll(this.matcher);

        return found.map<M>((el, index) =>
            new this.moduleClass(this.matcher.newWithIndex(index), el))
    }

    /**
     * Creates ModuleArray<Type> of given Type. 
     * @example 
     * class Item extends Module {...}
     * $$("li").module(Item); //returns ModuleArray<Item>
     */
    module<T extends Module>(moduleClass: ModuleConstructor<T>): ModuleArray<T> {
        if (moduleClass.prototype instanceof Module === false) {
            throw new Error(`${moduleClass.name} should extend 'Module' class.`);
        }

        return new ModuleArray(
            this.matcher,
            moduleClass
        );
    }
}