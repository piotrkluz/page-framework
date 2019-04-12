export abstract class Selector {
    constructor(
        protected selector: string,
        public nthIndex: number = 0
    ) {
        if (nthIndex < 0) this.nthIndex = 0; // ignore wrong selectors
    }

    newWithIndex(index: number) {
        return this.constructor.name == "CssSelector"
            ? new CssSelector(this.selector, index)
            : new XPathSelector(this.selector, index);
    }

    toString() {
        return this.selector;
    }
}
export class CssSelector extends Selector { }
export class XPathSelector extends Selector { }