import { Selector } from "./selector";
import { Elem } from "./elem";
import { Client } from "./client";

export class ElemArray {
    constructor(
        private selector: Selector,
        protected parent: Elem = null) { }

    async map<T>(func: (el: Elem) => Promise<T>): Promise<T[]> {
        const els = await this.findAll();
        const retArr: T[] = [];

        for(let i = 0; i < els.length; i++) {
            const ret = await func(els[i]);
            retArr.push(ret);
        }

        return retArr;
    }

    async findAll(): Promise<Elem[]> {
        const parentEl = this.parent
            ? (await this.parent.find()).handle
            : null;

        const found = await Client.findAll(this.selector, parentEl)

        return found.map(el => new Elem(this.selector, this.parent, el));
    }
}