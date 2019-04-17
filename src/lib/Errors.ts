import { Matcher } from "./Matcher";
import chalk from "chalk";

export class FindError extends Error {
    constructor(matcher: Matcher, index: number, internalError?: Error) {
        const selectors = matcher.getAll();

        const all = selectors.map(s => s.toString()).join(" -> ");

        const fail = selectors[index].toString();
        const position = all.indexOf(fail.toString());

        const msg = `
            NOT FOUND SELECTOR: ${chalk.red.bold(fail.toString())},
            IN: 
            ${chalk.green(all)}
            ${" ".repeat(position) + chalk.red.bold("^")}

        `
        super(msg);
    }
}

export class NotFoundError extends FindError {}