import { App, PluginSettingTab, Setting } from 'obsidian';
import MetaGeneratedTemplates from './main';

export class SampleSettingTab extends PluginSettingTab {
	plugin: MetaGeneratedTemplates;

	constructor(app: App, plugin: MetaGeneratedTemplates) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'Settings for my awesome plugin.' });

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					console.log('Secret: ' + value);
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
		new Setting(containerEl)
			.setName('Template Folder')
			.setDesc('Folder where templates for the meta generated templates plugin are stored')
			.addText(text => text
				.setPlaceholder('templates/')
				.setValue(this.plugin.settings.templateFolder)
				.onChange(async (value) => {
					console.log('Template Folder: ' + value);
					this.plugin.settings.templateFolder = value;
					await this.plugin.saveSettings();
				}));
		new Setting(containerEl)
			.setName('Target Fields')
			.setDesc('Fields that are used to generate the templates. Configurable in the configuration file.')
			.addText(text => text
				.setPlaceholder('type, tags, due date')
				.setValue(this.plugin.settings.targetfields.join(', '))
				.onChange(async (value) => {
					console.log('Target Fields: ' + value);
					this.plugin.settings.targetfields = value.split(',').map(x => x.trim());
					await this.plugin.saveSettings();
				}
				));
		new Setting(containerEl)
			.setName('Target Field Values')
			.setDesc('The values checked for when generating the templates.')
			.addText(text => text
				.setPlaceholder('Article, Journal, Book')
				.setValue(this.plugin.settings.targetfieldValues.join(', '))
				.onChange(async (value) => {
					console.log('Target File: ' + value);
					this.plugin.settings.targetfieldValues = value.split(',').map(x => x.trim());
					await this.plugin.saveSettings();
				}
				));
		new Setting(containerEl)
			.setName('Template CSV variable')
			.setDesc('The array used in the template to indicate the template to use per csv in targets.')
			.addText(text => text
				.setPlaceholder('template')
				.setValue(this.plugin.settings.templateCSV.join(', '))
				.onChange(async (value) => {
					console.log('Template CSV variable: ' + value);
					this.plugin.settings.templateCSV = value.split(',').map(x => x.trim());
					await this.plugin.saveSettings();
				}
				));
		new Setting(containerEl)
			.setName('Insertion Points CSV')
			.setDesc('The array used in the template to indicate the insertion point per csv in targets.')
			.addText(text => text
				.setPlaceholder('insertionPoint')
				.setValue(this.plugin.settings.insertLocation.join(', '))
				.onChange(async (value) => {
					console.log('Insertion Points CSV: ' + value);
					this.plugin.settings.insertLocation = value.split(',').map(x => x.trim());
					await this.plugin.saveSettings();
				}
				));
				



	}
}
