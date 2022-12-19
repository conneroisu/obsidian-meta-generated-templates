import { Editor, MarkdownView, Notice, Plugin, TFile } from 'obsidian';
import { SampleSettingTab } from './SampleSettingTab';
interface MetaGeneratedTemplatesSettings {
	mySetting: string;
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
	currFileContent: string;
	startingLine: number;
	async onload() {
		await this.loadSettings();
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				const cache = this.app.metadataCache;
				const cacheState = cache.getFileCache(view.file);
				if(cacheState){
					if(!cacheState.frontmatter){ return; }
					// for all values in targetfields that have a value in targetfieldValues with the same index
					for(let i = 0; i < this.settings.targetfields.length; i++){
						if(cacheState.frontmatter[this.settings.targetfields[i]] == this.settings.targetfieldValues[i]){
							console.log("template state is " + this.settings.targetfieldValues[i]);
							// get the template file
							await this.getTemplateFileContent(this.settings.templateFolder + "/" + this.settings.templateCSV[i]);
							// get the text of the template file and insert the template text at the end of the file
							this.writeToFile(i, view.file, editor);
							new Notice("Template " + this.settings.templateCSV[i] + " inserted");
						}
					}
				}
			}
		});
		this.addSettingTab(new SampleSettingTab(this.app, this)); // This adds a settings tab so the user can configure various aspects of the plugin
	}
	onunload() {
		console.log('unloading meta-generated-templates');
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
				this.app.vault.append(file, this.tempContent);
		}else if(insertLocation == 'start'){
			// Get the line of where the metadata ends marked by --- and ---
			await this.getStartLine(file);
			// Prepend to the start of the file
			console.log("startingLine is " + this.startingLine);
			editor.replaceRange(this.tempContent, {line: this.startingLine, ch:0 });
		}else if(insertLocation == 'cursor'){
			// Get the cursor position
			const cursor = editor.getCursor();
			// Insert at the cursor position
			editor.replaceRange(this.tempContent, cursor);
		}else if(insertLocation){
			// Find the line of the insert location string
			await this.getFileContent(file.name);
			// For each line in the content 
			for (let i = 0; i < this.currFileContent.length; i++) {
				// If the line contains the insert location string
				if(this.currFileContent[i].includes(insertLocation)){
					// Insert at the line
					editor.replaceRange(this.tempContent, {line: i, ch:0 });
					break;
				}
			}
			editor.replaceRange(this.tempContent, {line: line, ch:0 });
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
	getFileContent(name: string): void{
		const markdownFiles = app.vault.getMarkdownFiles();
		const templateFol = this.settings.templateFolder;
		markdownFiles.forEach(async (file) => {
			if(file.path.startsWith(templateFol) && file.path.contains(name)){
				// Read file with cacheRead
				const cRead = await this.app.vault.cachedRead(file); {
					// Convert to string
					const content = cRead.toString();
					this.currFileContent = content;
				}
			}
		});
		return;
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
					this.tempContent = content;
				}
			}
		});
		return;
	}
}
