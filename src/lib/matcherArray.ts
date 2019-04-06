import { Selector } from "./selector";
import { Elem } from "./elem";
import { Client } from "./client";
import { Matcher } from "./matcher";

export class MatcherArray {
    constructor(
        private selector: Selector,
        protected parent: Matcher = null) { }

    async map<T>(func: (el: Elem) => Promise<T>): Promise<T[]> {
        const els = await this.findAll();
        const retArr: T[] = [];

        for(let i = 0; i < els.length; i++) {
            const ret = await func(els[i]);
            retArr.push(ret);
        }

        return retArr;
    }

    async forEach(func: (el: Elem) => Promise<void>): Promise<void> {
        const els = await this.findAll();

        for(let i = 0; i < els.length; i++) {
            await func(els[i]);
        }
    }

    async findAll(): Promise<Elem[]> {
        const parentEl = this.parent
            ? (await this.parent.find()).handle
            : null;

        const found = await Client.findAll(this.selector, parentEl)

        return found.map(el => new Elem(this.selector, this.parent, el));
    }
}