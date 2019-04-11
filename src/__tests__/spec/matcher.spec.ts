import { $, $x, $$, $$x } from "../..";
import { Page } from "puppeteer";
import { MatcherArray } from "../../lib/matcherArray";
import * as server from "../testServer/server";
import { shouldThrow } from "../testLib";

const H1 = "First";
const LIST = [
    "list1", "list2",
    "list3", "list4"
]
const INDEX = 2;
const Nth = LIST[INDEX];

declare var page: Page;

describe("Matcher element", () => {
    beforeAll(async () => {
        const port = await server.start();
        await page.goto("http://localhost:" + port);
    });

    afterAll(() => {
        server.stop();
    });

    it("simple css", async () => {
        const text = await $("h1").getText();
        expect(text).toEqual(H1)
    })

    it("simple xpath", async () => {
        const text = await $x("//h1[1]").getText();
        expect(text).toEqual(H1)
    })

    it("css with css children", async () => {
        const text = await $("ul").$("li").getText();
        expect(text).toEqual(LIST[0]);
    })

    it("css with xpath children", async () => {
        const text = await $("ul").$x("//li[1]").getText();
        expect(text).toEqual(LIST[0]);
    })

    describe("Collections", () => {
        it("ALL CSS Elements", async () => {
            const els = $$("ul.simple li");

            await verifySimpleList(els);
        })

        it("All Xpath elements", async () => {
            const els = $$x("//ul[@class='simple']/li");

            await verifySimpleList(els);
        })

        it("Nested ALL XPATH in CSS base", async () => {
            const els = $("ul.simple").$$x("//li");

            await verifySimpleList(els);
        })

        it("Nested ALL XPATH in XPATH base", async () => {
            const els = $x("//ul[@class='simple']").$$x("//li");

            await verifySimpleList(els);
        })

        it("Nested ALL CSS in CSS base", async () => {
            const els = $("ul.simple").$$("li");

            await verifySimpleList(els);
        })

        it("Nested ALL CSS in XPATH base", async () => {
            const els = $x("//ul[@class='simple']").$$("li");

            await verifySimpleList(els);
        })
    })

    describe("nth elements", () => {

        it("CSS nth element", async () => {
            const el = await $("ul.simple > li", INDEX).getText();

            expect(el).toBe(Nth);
        })

        it("XPATH nth element", async () => {
            const el = await $x("//ul[@class='simple']/li", INDEX).getText();

            expect(el).toBe(Nth);
        })

        it("nth XPATH nested in CSS", async () => {
            const xpathNumber = INDEX + 1;
            const el = await $("ul.simple").$x(`(/li)[${INDEX + 1}]`).getText();

            expect(el).toBe(Nth);
        })

        it("Nested nth CSS in Xpath", async () => {
            const el = await $x("//ul[@class='simple']").$("li", INDEX).getText();

            expect(el).toBe(Nth);
        })

        it("Nested nth XPATH in Xpath", async () => {
            const el = await $("ul.simple").$x("/li", INDEX).getText();

            expect(el).toBe(Nth);
        })
    })

    describe("Negative scenario's", () => {

        it("WRONG CSS", async () => {
            for (const wrongCss of ["//h1", "lol z", "xDe "]) {
                await shouldThrow(async () => $(wrongCss).find());
            }
        })

        it("Wrong XPATH should throw Exception", async () => {
            for (const wrongXpath of ["h1", "lol", "///"]) {
                await shouldThrow(
                    () => $x(wrongXpath).find()
                );
            }
        })

        it("Wrong CSS should throw Exception", async () => {
            for (const wrongCss of ["////h1", "", "//h1"]) {
                await shouldThrow(
                    () => $(wrongCss).find()
                );
            }
        })
    })
})

async function verifySimpleList(els: MatcherArray) {
    const found = await els.findAll();
    expect(found.length).toEqual(LIST.length);

    const elsMap = await els.map(async (e) => await e.getText());
    expect(elsMap).toEqual(LIST);
}