import { Page, $, $$, $$x, $x } from "../..";
import { Task } from "../modules/Task";
import { Input } from "../modules/Input";
import { Page as PuppeteerPage } from "puppeteer";

declare let page: PuppeteerPage
type MVCImplementation = "react"
export type FilterName = "All" | "Active" | "Completed";
export class ToDoMVCPage extends Page {
    allTasks = $$(".todo-list > li").module(Task);
    lastTask = $(".todo-list > li:last-child").module(Task);
    getTask = (nth: number) => $(".todo-list > li", nth).module(Task);

    newTaskField = $(".new-todo").module(Input);
    toggleAllButton = $("label[for='toggle-all']");
    itemsLeft = $(".todo-count > strong");
    clearCompletedBtn = $("button.clear-completed");
    filterBtn = (name: FilterName) => $("ul.filters").$x(`//a[contains(.,'${name}')]`);

    constructor(implementation: MVCImplementation) {
        super("http://todomvc.com/examples/" + implementation);
    }

    async addTasks(texts: string[]) {
        for (const text of texts) await this.addTask(text);
    }

    async addTask(text: string): Promise<Task> {
        await this.newTaskField.setValue(text);
        await this.newTaskField.typeText(" [Enter]");

        await this.lastTask.find();
        return this.lastTask;
    }

    async getAllTasks(): Promise<string[]> {
        return await this.allTasks.map(t => t.getText());
    }

    async clearAllTasks() {
        if (!await this.filterBtn("All").isExist()) {
            return;
        }

        await this.filterBtn("All").click();

        await this.selectAll();
        await this.clearCompletedBtn.click();
        await this.newTaskField.clear();
    }

    async selectAll() {
        if (await this.getTask(0).isExist() && await this.getItemsLeft() > 0) {
            await this.toggleAllButton.click();
        }
    }

    async getItemsLeft(): Promise<number> {
        //temporay solution
        const t = await page.$eval(".todo-count > strong", e => e.textContent);
        return Number.parseInt(t);
    }
}