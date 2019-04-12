import { Selector } from "./selector";
import { Client } from "./client";
import { Matcher, ModuleConstructor } from "./matcher";

export class MatcherArray<M = Matcher> {
    constructor(
        private selector: Selector,
        protected parent: Matcher = null,
        private matcherClass: ModuleConstructor<M> = <ModuleConstructor<M>><any>Matcher //compile hack
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

    async filter(func: (el: M) => Promise<boolean>): Promise<M[]> {
        const els = await this.findAll();

        const outputArr: M[] = [];
        for(let i = 0; i < els.length; i++) {
            if(await func(els[i])) {
                outputArr.push(els[i]);
            }
        }

        return outputArr;
    }

    async forEach(func: (el: M) => Promise<void>): Promise<void> {
        const els = await this.findAll();

        for(let i = 0; i < els.length; i++) {
            await func(els[i]);
        }
    }

    async count(): Promise<number> {
        return (await this.findAll()).length;
    }

    async findAll(): Promise<M[]> {
        const parentEl = this.parent
            ? (await this.parent.find()).handle
            : null;

        const found = await Client.findAll(this.selector, parentEl);

        return found.map((el, index) => new this.matcherClass(this.selector.newWithIndex(index), this.parent, el));
    }

    module<newM extends Matcher>(matcherClass: ModuleConstructor<newM>): MatcherArray<newM> {
        return new MatcherArray(
            this.selector, 
            this.parent, 
            matcherClass
            
        );
    }
}