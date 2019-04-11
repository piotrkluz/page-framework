import { $, $x, $$, $$x } from "../..";
import { Page } from "puppeteer";
import * as server from "../testServer/server";
import { Module, ModuleConstructor } from "../../lib/matcher";

const USER_NAME = "Johny Bravo";
const USER_ADDRESS = "2856 Taylor St";
const USER_STRING = `NAME: ${USER_NAME}, ADDRESS: ${USER_ADDRESS}`

const NAMES = [USER_NAME, "Walter Fields", "Charlene Miller"];

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

        it("Use module fields", async () => {
            const user = $(".user").module(User);

            await user.address.focus();
            await user.address.waitFor();
            await user.avatar.getText();
        })

        it("Sub-modules", async () => {
            const container = $("ul.users").module(UsersContainer);

            expect(await container.firstUser.name.getText())
                .toEqual(USER_NAME);

            expect(await container.users.map(u => u.name.getText()))
                .toEqual(NAMES);
        })

        it("Use module methods.", async () => {
            const user = $(".user").module(User);

            expect(await user.toString())
                .toEqual(USER_STRING);
        })

        it("Module with different selectors (CSS / XPATH).", async () => {
            const container = $x("//ul[@class='users']", 1).module(UsersContainer);
            const users = container.$$(".user").module(User);

            expect(await users.map(u => u.name.getText())).toEqual(NAMES);
        })


        it("Try create module that not extends Module class.", () => {
            //let typescript to compile this wrong code
            // but it should crash in Runtime !
            const usr: unknown = WrongUser;
            const fakeModule = <ModuleConstructor<Module>>usr;
            
            expect(() => $(".user").module(fakeModule)).toThrow("WrongUser should extend 'Module' class.")
        })
    })

    describe("Modules Array", () => {
        it("Map modules.", async () => {
            const users = $$(".user").module(User);

            const names = await users.map(el => el.name.getText());
            expect(names).toEqual(NAMES); 
        })
        
        it("Filter modules", async () => {
            const users = $$(".user").module(User);

            const filtered = await users.filter(async el => await el.name.getText() == USER_NAME);

            expect(filtered.length).toEqual(1); 
            expect(await filtered[0].name.getText()).toEqual(USER_NAME); 
        })
        
        it("Foreach modules", async () => {
            const users = $$(".user").module(User);

            const arr = [];
            await users.forEach(async u => {
                arr.push(await u.name.getText())
            })

            expect(arr).toEqual(NAMES);
        })
    })
})

class UsersContainer extends Module {
    users = $$(".user").module(User);
    firstUser = $(".user").module(User);

    async getAllNames() {
        await this.users.map(u => u.name.getText());
    }
}

class User extends Module {
    avatar = this.$(".avatar");
    name = this.$("h1");
    address = this.$(".address");

    async toString() {
        return `NAME: ${await this.name.getText()}, ADDRESS: ${await this.address.getText()}`
    }
}

class WrongUser { // not extends Module class !
    avatar = $(".avatar");
}