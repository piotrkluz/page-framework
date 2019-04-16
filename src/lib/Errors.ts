import { Selector } from "./Selector";
import { Matcher } from "./Matcher";

export class FindError extends Error {
    constructor(selectors: Selector[], index: number, internalError?: Error) {
        const msg = [
            "NOT FOUND. MSG TO BE DONE.",
            new Matcher(selectors).toString(),
            internalError || internalError.name,
            internalError || internalError.message
        ]
        super(msg.join("\n---"));
    }
}

export class NotFoundError extends FindError {}