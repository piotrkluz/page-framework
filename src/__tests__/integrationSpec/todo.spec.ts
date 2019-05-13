import { ToDoMVCPage } from "../pages/ToDoMVCPage";
import { Task } from "../modules/Task";
const TASK = "Some task";

describe("ToDo APP Tests", () => {
    const todoPage: ToDoMVCPage = new ToDoMVCPage("react");

    beforeAll(async () => {
        jest.setTimeout(30000);
        await todoPage.open();
        await todoPage.newTaskField.waitFor();
    })

    beforeEach(async () => {
        await todoPage.clearAllTasks();
    })

    describe("Create tasks", () => {
        beforeEach(async () => {
            await todoPage.clearAllTasks();
        })

        it("create simple task", async () => {
            await todoPage.addTask(TASK);

            expect(await todoPage.getTask(0).getText()).toEqual(TASK);
        })

        it("task description should trim", async () => {
            await todoPage.addTask(`   ${TASK}   `);

            expect(await todoPage.getTask(0).getText()).toEqual(TASK);
        })

        it("create long task description", async () => {
            const LONG_TASK = "255 chars text fdsadddddddddddddddddddddddddddddddddddddddddddddddddddddd"
            await todoPage.addTask(LONG_TASK);

            expect(await todoPage.getTask(0).getText()).toEqual(LONG_TASK);
        })

        it("create multiple tasks", async () => {
            const count = 10;
            const TASKS = [];

            let task;
            for (let i = 0; i < count; i++) {
                task = "Task" + i.toString();

                await todoPage.addTask(task);
                TASKS.push(task);
            }

            expect(await todoPage.getAllTasks()).toEqual(TASKS);
        })
    })

    describe("Update task", () => {

        it("Confirm by ENTER", async () => {
            await todoPage.addTask("to be edited");

            const task = todoPage.getTask(0);
            await (await task.getElement()).click({ clickCount: 2 });

            const NEW_VALUE = "NEW VALUE !!!"
            await task.editInput.typeText("[Ctrl+A]" + NEW_VALUE + "[Enter]");

            expect(await task.getText()).toEqual(NEW_VALUE);
        })

        it("Confirm by click outside of field", async () => {
            await todoPage.addTask("to be edited");

            const task = todoPage.getTask(0);
            await (await task.getElement()).click({ clickCount: 2 });

            const NEW_VALUE = "NEW VALUE !!!"
            await task.editInput.typeText("[Ctrl+A]" + NEW_VALUE);
            await todoPage.itemsLeft.click() //somewhere outside edited task

            expect(await task.getText()).toEqual(NEW_VALUE);
        })
        it("finished task", async () => {
            await todoPage.addTask("to be edited")

            const task = todoPage.getTask(0);
            await (await task.getElement()).click({ clickCount: 2 });

            const NEW_VALUE = "NEW VALUE !!!"
            await task.editInput.typeText("[Ctrl+A]" + NEW_VALUE + "[Enter]");

            expect(await task.getText()).toEqual(NEW_VALUE);
        })
        it("Cancel edit by [Esc]", async () => {
            await todoPage.addTask("to be edited")
            
            const task = todoPage.getTask(0);
            const oldValue = await task.getText()
            await (await task.getElement()).click({ clickCount: 2 });

            const NEW_VALUE = "NEW VALUE !!!"
            await task.editInput.typeText("[Ctrl+A]" + NEW_VALUE + "[Escape]");

            expect(await task.getText()).toEqual(oldValue);
        })
    })

    describe("Delete task", () => {
        it("done task", async () => {
            const task = await todoPage.addTask("to be deleted");

            await task.markAsDone();
            await task.delete();

            expect(await task.isExist()).toBe(false);
        })

        it("not done task", async () => {
            const task: Task = await todoPage.addTask("next to be deleted");

            await task.delete();

            expect(await task.isExist()).toBe(false);
        })
    })

    describe("marks all tasks done", () => {
        beforeEach(async () => {
            await todoPage.addTasks(["one", "two", "three", "four"]);
        })

        afterEach(async () => {
            await todoPage.clearAllTasks();
        })

        it("All view", async () => {
            await todoPage.toggleAllButton.click();

            expect(await todoPage.allTasks.map(t => t.isDone()))
                .toEqual([true, true, true, true]);
        })

        it("filtered view", async () => {
            await todoPage.getTask(0).markAsDone();
            await todoPage.getTask(1).markAsDone();

            await todoPage.toggleAllButton.click();
            expect(await todoPage.allTasks.map(t => t.isDone()))
                .toEqual([true, true, true, true]);
        })

        it("unmark all tasks done", async () => {
            await todoPage.allTasks.forEach(t => t.markAsDone());

            await todoPage.toggleAllButton.click();

            expect(await todoPage.allTasks.map(t => t.isDone()))
                .toEqual([false, false, false, false]);
        })
    })

    describe("'Clear completed' button", () => {
        beforeEach(async () => {
            await todoPage.addTasks(["one", "two", "three", "four"]);
        })

        afterEach(async () => {
            await todoPage.clearAllTasks();
        })

        it("List not contains done tasks", async () => {
            expect(await todoPage.clearCompletedBtn.isDisplayed())
                .toBe(false);
        })

        it("list contain few done and few not done tasks", async () => {
            await todoPage.getTask(0).markAsDone()
            await todoPage.getTask(1).markAsDone()
            await todoPage.clearCompletedBtn.click();
            expect(await todoPage.allTasks.map(t => t.isDone()))
                .toEqual([false, false]);
        })

        it("completed tasks filtered", async () => {
            await todoPage.getTask(1).markAsDone()
            await todoPage.filterBtn("Active").click();
            await todoPage.clearCompletedBtn.click();
            expect(await todoPage.allTasks.map(t => t.isDone()))
                .toEqual([false, false, false]);

            expect(await todoPage.clearCompletedBtn.isDisplayed())
                .toBe(false);
        })
    })


    describe("Filter tasks", () => {
        beforeEach(async () => {
            await todoPage.clearAllTasks();
            await todoPage.addTasks(["one", "two", "three", "four"])
            await todoPage.getTask(0).markAsDone();
            await todoPage.getTask(2).markAsDone();
        })

        it("Completed", async () => {
            await todoPage.filterBtn("Completed").click();

            expect(await todoPage.getAllTasks())
                .toEqual(["one", "three"])
        })

        it("Active", async () => {
            await todoPage.filterBtn("Active").click();

            expect(await todoPage.getAllTasks())
                .toEqual(["two", "four"])
        })

        it("All", async () => {
            await todoPage.filterBtn("All").click();

            expect(await todoPage.getAllTasks())
                .toEqual(["one", "two", "three", "four"])
        })
    })
})