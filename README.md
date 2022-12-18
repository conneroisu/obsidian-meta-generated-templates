# Obsidian Meta Generated Templates Plugin

Make sure to back up your vault before using this plugin. While I have tested it agaist my vault, the plugin has not been tested on other vaults besides mine currently.

The meta generated templates plugin allows for the user to generate anything from the values of the metadata in their notes in markdown from templates in a designated folder with configurable insertion characteristics. This plugin allows for a user to define certain elements that can be inserted into a template, such as text, images, code snippets, etc. This allows for the user to quickly generate content that is formatted in markdown with ease and efficiency. The plugin also allows for the user to customize the template by adding additional elements or removing existing ones through the power of markdown. This makes it easy for the user to create custom templates that can be used over and over again. It also allows for users to share templates with each other so that they can collaborate on a project within the same vault without needing to start from scratch.

This project uses Typescript to provide type checking and documentation.
The repo depends on the latest plugin API (obsidian.d.ts) in Typescript Definition format, which contains TSDoc comments describing what it does.

Use preconfigured templates to dynamically add to your notes through the use of meta-data fields in your notes. 


The Metadata Templates plugin for obsidian allows users to easily insert or append templates based on values of metadata fields. This can save time and improve consistency in document creation. Users can customize the templates within obsidian and their corresponding metadata field values within the plugin settings.

The benefits of using this plugin include saving time in document creation, providing consistency in document format, and allowing users to customize their templates through the utilization of using markdown files present within the obsidian vault.Overall, the Metadata Templates plugin is a useful tool for any user of Obsidian who is looking to save time and improve consistency when creating documents.

# Insertion Options
Additionally, the user has the option to choose how the template is inserted into the document. They can choose to prepend the template, which will insert it before any other content in the note. They can also choose to append the template, which will add it to the end of the note. Finally, the user can choose to insert the template, which will create a delimited area within the note where the template can be included.

This flexibility in insertion options allows the user to customize how the templates are used in their documents and ensures that they can be easily integrated into their existing workflow. Overall, the Metadata Templates plugin is a powerful tool for quickly and easily creating consistent, professional-looking documents within the obsidian markdown editor.

| Insertion Option | Description                                                             |
| ---------------- | ----------------------------------------------------------------------- |
| Prepend          | Insert the given template before any content in the note                |
| Append           | Insert the given template after any content in the note                 |
| Insert           | Insert the given template at a predefined delimiter inside of your note |
|                  |                                                                         |

## ADDITIONAL (FOR EACH VALUE in field setting to be Added)

# Use Cases

A user is writing an invoice and includes a `client` metadata field with the value `Acme Corporation`. The plugin automatically inserts a template with the company's logo, contact information, and payment terms at the beginning of the document.

A student wants to include dataview information about the note if the type is `Homework`.


Generate Workouts from the Body Part selector in your workout notes. 



