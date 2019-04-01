export abstract class Selector {
    constructor(
        protected selector: string,
        public nth: number = 0
        ) { }

    toString() {
        return this.selector;
    }
}
export class CssSelector extends Selector { }
export class XPathSelector extends Selector { }