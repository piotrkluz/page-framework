import { $, $x, $$, $$x } from "../..";
import { Page } from "puppeteer";
import * as server from "../testServer/server";
import { Elem } from "../../lib/elem";
import { shouldThrow } from "../testLib";

declare var page: Page;
const ELEM_TEXT = "Some text."
const SUB_ELEMENT_TEXT = " Sub-element text."

const TYPE_TEXT = "Some text."

describe("Matcher element", () => {
    beforeAll(async () => {
        const port = await server.start();
        await page.goto("http://localhost:" + port);
    });

    afterAll(() => {
        server.stop();
    });

    describe("tryFind", () => {
        it("exists", async () => {
            expect(await $(".exist").tryFind()).toBeInstanceOf(Elem);
        })
        it("not exists", async () => {
            expect(await $(".not-exist").tryFind()).toBeNull();
        })
    })

    describe("getElement", () => {
        it("getElement", async () => {
            expect(
                (await $(".exist").getElement()).constructor.name
            ).toEqual("ElementHandle")
        })
    })

    describe("click", () => {
        it("Visible", async () => {
            expect(await $(".elem").click())
        })

        it("Scrolled element", async () => {
            expect(await $(".scrolled").click())
        })

        it("Hidden element", async () => {
            expect(await $(".hidden").click())
        })

        it("Not displayed element", () => {
            shouldThrow(() => $(".not-displayed").click());
        })
    })

    describe("getText", () => {
        it("Empty element", async () => {
            expect(await $(".elem").getText()).toBe(ELEM_TEXT)
        })
        it("Element with text", async () => {
            expect(await $(".empty").getText()).toBe("")
        })
        it("Element with subelement", async () => {
            expect(await $(".with-subelement").getText()).toBe(ELEM_TEXT)
        })
        it("Element with text and subelement", async () => {
            expect(await $(".with-text-and-subelement").getText())
                .toBe(ELEM_TEXT + SUB_ELEMENT_TEXT) 
        })
    })

    describe("typeText", () => {
        
        it("Empty input", async () => {
            const input = $(".input");
            await input.clear();
            await input.typeText(TYPE_TEXT);

            expect(await input.getValue()).toBe(TYPE_TEXT);
        })
        it("Input with text", async () => {
            const input = $(".input");
            await input.clear();
            await input.typeText(TYPE_TEXT);
            await input.typeText(TYPE_TEXT);

            expect(await input.getValue()).toBe(TYPE_TEXT + TYPE_TEXT);
        })
    })

    describe("isDisplayed", () => {
        it("not exist element", async () => { 
            expect(await $(".not-exist").isDisplayed()).toBeFalsy();
        })

        it("element display:none", async () => {
            expect(await $(".display-none").isDisplayed()).toBeFalsy();
        })

        it("element visibility:hidden", async () => {
            expect(await $(".hidden").isDisplayed()).toBeFalsy();
        })

        it("visible zero-height element", async () => {
            expect(await $(".zero").isDisplayed()).toBeTruthy();
        })

        it("visible empty element", async () => {
            expect(await $(".empty").isDisplayed()).toBeTruthy();
        })

        it("visible element with content", async () => {
            expect(await $(".elem").isDisplayed()).toBeTruthy();
        })
    })

    describe("isExist", () => {
        it("element display:none", async () => {
            expect(await $(".display-none").isExist()).toBeTrue();
        })
        it("element visibility:hidden", async () => {
            expect(await $(".hidden").isExist()).toBeTrue();
        })

        
    })
})