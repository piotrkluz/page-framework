import { Module, ModuleConstructor } from "./Module";
import { Matcher } from "./Matcher";
import { Client } from "./Client";

export class ModuleArray<M = Module> {
    constructor(
        private matcher: Matcher,
        private moduleClass: ModuleConstructor<M> = <ModuleConstructor<M>><any>Module //compile hack
    ) { }

    async map<T>(func: (el: M) => Promise<T>): Promise<T[]> {
        const els = await this.findAll();
        const retArr: T[] = [];

        for (let i = 0; i < els.length; i++) {
            const ret = await func(els[i]);
            retArr.push(ret);
        }

        return retArr;
    }

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
        const found = await Client.findAll(this.matcher.getAll());

        return found.map<M>((el, index) =>
            new this.moduleClass(this.matcher.setIndex(index), el))
    }

    module<T extends Module>(matcherClass: ModuleConstructor<T>): ModuleArray<T> {
        return new ModuleArray(
            this.matcher,
            matcherClass
        );
    }
}