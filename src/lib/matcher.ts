import { Selector } from "./Selector";

export class Matcher {
    constructor(private selectors: Selector[]) {}

    /**
     * Creates new instance of Matcher with given child selector.
     * @param childSelector 
     */
    add(childSelector: Selector) {
        const selectors = this.getAll();
        selectors.push(childSelector);

        return new Matcher(selectors);
    }

    /**
     * Makes copy of Matcher with set different index of last element.
     * @param nthIndex 
     */
    newWithIndex(nthIndex: number) {
        const selectors = this.getAll();

        const last = selectors.pop();
        selectors.push(last.newWithIndex(nthIndex));

        return new Matcher(selectors);
    }

    /**
     * Returns copy of selectors array.
     */
    getAll(): Selector[] {
        return this.selectors.slice(); //slice() -> copy of array
    }

    toString() {
        return this.selectors.map(s => s.toString()).join(" -> ")
    }
}