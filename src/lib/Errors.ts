import { Matcher } from "./Matcher";
import chalk from "chalk";

export class FindError extends Error {
    constructor(matcher: Matcher, index: number, internalError?: Error) {
        const fail = matcher.getAll()[index].toString();

        const msg = `
            NOT FOUND element by locator: ${chalk.red.bold(fail)},
            IN:
            ${selectorPointerMessage(matcher)},

            Internal error: ${internalError.name}
            ${internalError.message}
        `
        super(msg);
    }
}

export class NotFoundError extends FindError { }
export class NotFoundArrayError extends Error {
    constructor(error: NotFoundNthError, matcher: Matcher) {
        super(`
            NOT FOUND Element in by index: ${error.index}. 
            There are only ${error.foundCount} elements that match locator: 
            ${selectorPointerMessage(matcher)}
        `)
    }
}

export class NotFoundNthError extends Error {
    constructor(
        public foundCount: number,
        public index: number
    ) { super(`Not found element index: ${index}, collection contains only: ${foundCount}.`) }
}

function selectorPointerMessage(matcher: Matcher, index: number = -1) {
    const selectors = matcher.getAll();
    if(index == -1) {
        index = selectors.length - 1
    }

    const all = selectors.map(s => s.toString()).join(" -> ");

    const fail = selectors[index].toString();
    const position = all.indexOf(fail.toString());

    const allWithoutLast = all.slice(0, all.length - 2)

    return `
        ${chalk.green(allWithoutLast)} ${chalk.red.bold(fail)}
        ${" ".repeat(position) + chalk.red.bold("^")}
`
}