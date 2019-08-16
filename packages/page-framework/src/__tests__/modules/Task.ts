import { Module, $ } from "../..";
import { Input } from "./Input";

export class Task extends Module {
    checkbox = this.$(".toggle");
    text = this.$("label");
    deleteButton = this.$("button.destroy");
    editInput = this.$("input.edit").module(Input);

    async markAsDone() {
        if (!await this.isDone()) {
            await this.checkbox.click()
        }
    }

    async markAsUndone() {
        if (await this.isDone()) {
            await this.checkbox.click()
        }
    }

    async isDone(): Promise<boolean> {
        return await this.haveClass("completed");
    }

    async delete(): Promise<void> {
        await (await this.find()).hover();
        await this.deleteButton.click();
    }

    async edit(text: string) {
        await this.doubleClick();
        await this.editInput.typeText(text + "[Enter]");
    }

    async getText(): Promise<string> {
        return await this.text.getText();
    }
}