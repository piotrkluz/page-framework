export abstract class Selector {
    constructor(
        protected selector: string,
        public nthIndex: number = 0
    ) { }

    newWithIndex(index: number) {
        return this instanceof CssSelector
            ? new CssSelector(this.selector, index)
            : new XPathSelector(this.selector, index);
    }

    toString() {
        return this.selector;
    }
}
export class CssSelector extends Selector { }
export class XPathSelector extends Selector { }