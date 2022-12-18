import { Console } from 'console';
import { readFile } from 'fs';
import { App, Editor, MarkdownView, Modal, Notice, Plugin, TFile, Vault, MetadataCache, TFolder } from 'obsidian';
import { SampleSettingTab } from './SampleSettingTab';


interface MetaGeneratedTemplatesSettings {
	mySetting: string;
	// template folder string
	templateFolder: TFolder;
	targetfields: string[];
	targetfieldValues: string[];
	templateCSV: string[];
}

const DEFAULT_SETTINGS: MetaGeneratedTemplatesSettings = {
	mySetting: 'default',
	templateFolder: 'templates',
	targetfields: [],
	targetfieldValues: [],  
	templateCSV: []
}

export default class MetaGeneratedTemplates extends Plugin {
	settings: MetaGeneratedTemplatesSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('This is a notice!');
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				new SampleModal(this.app).open();
			}
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				editor.replaceSelection('Sample Editor Command');
				// metadata cache
				const cache = this.app.metadataCache;
				const cacheState = cache.getFileCache(view.file);
				if(cacheState){
					if(!cacheState.frontmatter){
						return;
					}
					// for all values in targetfields that have a value in targetfieldValues with the same index
					for(let i = 0; i < this.settings.targetfields.length; i++){
						if(cacheState.frontmatter[this.settings.targetfields[i]] == this.settings.targetfieldValues[i]){
							console.log("template state is " + this.settings.targetfieldValues[i]);
							// get the path of the template fold
							const templateFolderPath = (this.settings.templateFolder);
							//insert at the end of the file the template with the same index
							editor.setCursor(editor.lineCount(), 0);
							// Get the content from template folder with the name of templateCSV[i]
							// Get TFile from templateFolderPath and templateCSV[i]
							const templateFile = this.app.vault.getAbstractFileByPath(templateFolderPath + "/" + this.settings.templateCSV[i]);
							const content = this.app.vault.read(templateFile);

						}

					}
					

				}

			}
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
		
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}


