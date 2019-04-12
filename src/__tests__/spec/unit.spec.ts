import { CssSelector } from "../../lib/selector";

describe("Selector", () => {
    it("Copy selector CSS", () => {
        const base = new CssSelector("abcd");
        const copy1 = base.newWithIndex(2);
        const copy2 = base.newWithIndex(2);

        expect(copy1).not.toBe(base);
        
        expect(copy1).not.toBe(copy2);

        expect(copy1.toString()).toEqual(base.toString());
    })
})