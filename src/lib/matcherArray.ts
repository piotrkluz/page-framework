import { Selector } from "./selector";
import { Client } from "./client";
import { Matcher, Constructor } from "./matcher";

export class MatcherArray<M = Matcher> {
    constructor(
        private selector: Selector,
        protected parent: Matcher = null,
        private matcherClass: Constructor<M> = <Constructor<M>><any>Matcher //compile hack
    ) { }

    async map<T>(func: (el: M) => Promise<T>): Promise<T[]> {
        const els = await this.findAll();
        const retArr: T[] = [];

        for(let i = 0; i < els.length; i++) {
            const ret = await func(els[i]);
            retArr.push(ret);
        }

        return retArr;
    }

    async forEach(func: (el: M) => Promise<void>): Promise<void> {
        const els = await this.findAll();

        for(let i = 0; i < els.length; i++) {
            await func(els[i]);
        }
    }

    async findAll(): Promise<M[]> {
        const parentEl = this.parent
            ? (await this.parent.find()).handle
            : null;

        const found = await Client.findAll(this.selector, parentEl);

        return found.map(el => new this.matcherClass(this.selector, this.parent, el));
    }

    module<newM extends Matcher>(matcherClass: Constructor<newM>): MatcherArray<newM> {
        return new MatcherArray(
            this.selector, 
            this.parent, 
            matcherClass
        );
    }
}