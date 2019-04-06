import { $ } from "../../lib/basePage";
import * as server from "../testServer/server";
import { Page } from "puppeteer";

declare var page: Page;
describe("typeText", () => {
    beforeAll(async () => {
        const port = await server.start();
        await page.goto("http://localhost:" + port);
    });

    afterAll(() => {
        server.stop();
    });

    it("simple text", async () => check(
        "simple",
        "simple"
    ))

    it("backspace", async () => check(
        "simple[Backspace]",
        "simpl"
    ))

    it("multiple backspace", async () => check(
        "simple[Backspace][Backspace]",
        "simp"
    ))

    it("Ctrl+A", async () => check(
        "simple[Control+A][Backspace]",
        ""
    ))

    it("Home", async () => check(
        "simple[Home]AAA",
        "AAAsimple"
    ))

    it("Edit with Shift", async () => check(
        "aaaaa[Shift+ArrowLeft+ArrowLeft]b",
        "aaab"
    ))
})

async function check(keys: string, expectedResult: string) {
    await $("input").clear();

    await $("input").typeText(keys);
    expect(await $("input").getValue()).toEqual(expectedResult);
}