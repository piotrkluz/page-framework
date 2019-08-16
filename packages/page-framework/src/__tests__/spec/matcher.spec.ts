import { $, $x, $$, $$x } from "../..";
import { Page } from "puppeteer";
import * as server from "../testServer/server";
import { ModuleArray } from "../../lib/ModuleArray";

const H1 = "First";
const LIST = [
    "list1", "list2",
    "list3", "list4"
]
const INDEX = 2;
const Nth = LIST[INDEX];
const WRONG_CSS = "//h1";
const WRONG_XPATH = ".h1";

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

    describe("Element disappeared and redrawed", () => {
        it("Should re-search if element is deleted (and other one match selector)", async () => {
            const el = $(".redraw > p");
            await el.find();

            await $(".redraw").eval(e => {
                e.removeChild(e.querySelector("p")); //remove element

                // create new
                let newOne = document.createElement("p");
                newOne.innerHTML = "RECREATED AT: " + Date.now();
                e.appendChild(newOne)
            })

            await el.click(); // handle is removed, but it should re-find newOne element and click on it
            expect(await el.getText()).toMatch("RECREATED AT:");
        })

        it("Should not find deleted element", async () => {
            const el = await $(".redraw > p");

            await $(".redraw").eval(e => {
                e.removeChild(e.querySelector("p"));
            })

            expect(el.click()).rejects.toThrow();
        })
    })

    describe("Negative scenario's", () => {
        it("WRONG CSS", async () => {
            await shouldThrow(() => $(WRONG_XPATH).find())
        })

        it("Wrong XPATH should throw Exception", async () => {
            await shouldThrow(() => $x(WRONG_XPATH).find())
        })

        it("Wrong CSS Array", async () => {
            await shouldThrow(() => $$(WRONG_CSS).findAll())
        })

        it("Wrong XPATH Array", async () => {
            await shouldThrow(() => $$x(WRONG_XPATH).findAll())
        })
    })
})

async function verifySimpleList(els: ModuleArray) {
    const found = await els.findAll();
    expect(found.length).toEqual(LIST.length);

    const elsMap = await els.map(async (e) => await e.getText());
    expect(elsMap).toEqual(LIST);
}

async function shouldThrow(func) {
    try {
        await func();
    } catch(e) {
        return;
    }

    fail(`Function: ${func.toString()} \ndidn't throw error`)
}