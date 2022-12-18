import { Console } from 'console';
import { App, Editor, MarkdownView, Modal, Notice, Plugin, TFile, Vault, MetadataCache, TFolder, View, editorEditorField } from 'obsidian';
import { SampleSettingTab } from './SampleSettingTab';
import { Line } from '@codemirror/state';


interface MetaGeneratedTemplatesSettings {
	mySetting: string;
	// template folder string
	templateFolder: string;
	targetfields: string[];
	targetfieldValues: string[];
	templateCSV: string[];
	insertLocation: string[];
}

const DEFAULT_SETTINGS: MetaGeneratedTemplatesSettings = {
	mySetting: 'default',
	templateFolder: 'meta-gen templates',
	targetfields: [],
	targetfieldValues: [],  
	templateCSV: [],
	insertLocation: ['end', 'start']
}

export default class MetaGeneratedTemplates extends Plugin {
	settings: MetaGeneratedTemplatesSettings;
	tempContent: string;
	startingLine: number;

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
			editorCallback: async (editor: Editor, view: MarkdownView) => {
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
							// get the template file
							await this.getTemplateFileContent(this.settings.templateFolder + "/" + this.settings.templateCSV[i]);
									// get the text of the template file
									// insert the template text at the end of the file
							this.writeToFile(i, view.file, editor);
							console.log("cursor is at " + view.editor.getCursor());
										
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
	async writeToFile(int: number, file: TFile, editor: Editor): Promise<void>{
		// Get the state of the insert location setting with index int
		const insertLocation = this.settings.insertLocation[int];
		if(insertLocation == 'end'){
			// Append to the end of the file
			// if(activeFile){
				this.app.vault.append(file, this.tempContent);
			// } 
		}else if(insertLocation == 'start'){
			// Get the line of where the metadata ends marked by --- and ---
			// Parse
			await this.getStartLine(file);
			// Prepend to the start of the file
			console.log("startingLine is " + this.startingLine);
			editor.replaceRange(this.tempContent, {line: this.startingLine, ch:0 });
		}
}
		
	async getStartLine(tfile: TFile): Promise<void>{
		// Get the line of where the metadata ends marked by --- and ---
		// Parse the file
		const markdownFiles = this.app.vault.getMarkdownFiles();
		const fname = tfile.basename;
		markdownFiles.forEach(async (file) => {
				// Read file with cacheRead
				if(file.basename == fname){

				const cRead = await this.app.vault.cachedRead(file); {
					// Convert to string
					const content = cRead.toString();
					console.log("content is1 " + content);
					// find line where metadata ends using --- and content
					const contentArray = content.split("\n");
					console.log("content is2 " + contentArray);
					// Find the line where the metadata ends
					let startingLine = 0;
					let count = 0;
					for(let i = 0; i < 100; i++){
						if(contentArray[i].startsWith("---")){
							count++;
							if(count > 1){
								startingLine = i + 1;
								break;
							}else{
								continue;
							}
						}
					}
					this.startingLine = startingLine;

				}
				}

		});
	}
	getTemplateFileContent(name: string): void{
		const markdownFiles = app.vault.getMarkdownFiles();
		const templateFol = this.settings.templateFolder;
		markdownFiles.forEach(async (file) => {
			if(file.path.startsWith(templateFol) && file.path.contains(name)){
				// Read file with cacheRead
				const cRead = await this.app.vault.cachedRead(file); {
					// Convert to string
					const content = cRead.toString();
					console.log("content is1 " + content);
					this.tempContent = content;
				}

			}
		});
		return;
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


