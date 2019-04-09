import { $, $x, $$, $$x } from "../..";
import { Page } from "puppeteer";
import * as server from "../testServer/server";
import { Constructor, Module } from "../../lib/matcher";

const USER_NAME = "Johny Bravo";
const NAMES = ["Johny Bravo", "Walter Fields", "Charlene Miller"];

declare var page: Page;

describe("Matcher element", () => {
    beforeAll(async () => {
        const port = await server.start();
        await page.goto("http://localhost:" + port);
    });

    afterAll(() => {
        server.stop();
    });

    describe("Module", () => {
        it("Create by .module() method", async () => {
            const user = $(".user").module(User);

            expect(await user.name.getText()).toBe(USER_NAME);
        })

        it("Create by constructor", async () => {
            const user = User.from<User>($(".user"));

            expect(await user.name.getText()).toBe(USER_NAME);
        })

        it("Try create module that not extends Module class.", () => {
            //let typescript to compile this wrong code
            // but it should crash in Runtime !
            const usr: unknown = WrongUser;
            const fakeModule = <Constructor<Module>>usr;
            
            expect(() => $(".user").module(fakeModule)).toThrow("WrongUser should extend 'Module' class.")
        })
    })

    describe("Modules Array", () => {
        it("Create by .module() method", async () => {
            const names = await $$(".user").module(User).map(el => el.name.getText());

            expect(names).toEqual(NAMES); 
        })
    })
})

class User extends Module {
    avatar = this.$(".avatar");
    name = this.$("h1");
    address = this.$(".address");
}

class WrongUser { //not extends Module class !
    avatar = $(".avatar");
}