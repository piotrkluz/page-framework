export abstract class Selector {
    constructor(
        protected selector: string,
        public nth: number = 1
        ) {
            if (nth < 1) this.nth = 1; // ignore wrong selectors
        }

    toString() {
        return this.selector;
    }
}
export class CssSelector extends Selector { }
export class XPathSelector extends Selector { }