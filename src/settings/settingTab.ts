import { Setting, Plugin ,PluginSettingTab } from "obsidian";

import MetaGeneratedTemplates  from "../main";
export class MetaGeneratedTemplatesSettingTab extends PluginSettingTab {
	plugin: MetaGeneratedTemplates;

  constructor(app: App, plugin: MetaGeneratedTemplates) {
	super(app, plugin);
	this.plugin = plugin;
  }

  display(): void {
	let { containerEl } = this;

	containerEl.empty();

	containerEl.createEl("h2", { text: "Settings for my awesome plugin." });

	new Setting(containerEl)
	  .setName("Setting #1")
	  .setDesc("It's a secret")
	  .addText((text) =>
		text
		  .setPlaceholder("Enter your secret")
		  .setValue("")
		  .onChange(async (value) => {
			console.log("Secret: " + value);
			await this.plugin.saveSettings();
		  })
	  );
  }
}
