import { Module } from "../..";

export class Input extends Module {

    /**
     * Clear field and fill it with given keys sequence.
     * @param value @see typeText
     */
    async setValue(value: string) {
        await this.clear();
        return await this.eval((el, value) => (<any>el).value = value, value);
    }

    /**
     * @returns text filled in input ("value" property)
     */
    async getText(): Promise<string> {
        return await this.getValue();
    }
}