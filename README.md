[ ![Codeship Status for hulilabs/insight-gt](https://app.codeship.com/projects/d884d130-c4f0-0136-192a-36d931be695a/status?branch=master)](https://app.codeship.com/projects/314239)

# Introduction

Reusable widgets or components in web applications. The intention behind them is to bring component-based software engineering to the Web. The components model allows for encapsulation and interoperability of individual HTML elements.

#Getting started

## Requirements

The components are based on material design and using the Vue framework

- [vue](https://vuejs.org/)

## Installation

### Bower

1. Add this reference to the bower.json:

```javascript
"<awesome_library>" : "<route_to_awesome_library>#latest",
```

2. Run the command:

```bash
cd src/resources
bower install
```

## Configuration

### RequireJS

1. Open the require-config.js file
2. Add the library reference

```javascript
"<awesome_library>" : "<path_where_awesome_library_is_installed>/src/<awesome_library>"
```

## Components naming conventions

### Name

### Filename

There are basically four types of files on this repo, please follow the pattern this pattern **component-name_type** for each one.

| Type               | Example              |
| ------------------ | -------------------- |
| component code     | drawer_component.js  |
| component template | drawer_template.html |
| component styles   | drawer_styles.scss   |

### Structure

There are categories (material design) when talking about components, for example let's say we have a category 'buttons' with regular buttons (flat, raised) and a image button.

So the structure will be:

```
components/
	buttons/
		button/
			button_component.js
			button_template.html
			button_styles.scss
			button_styles.css
		image-button/
			image-button_component.js
			image-button_template.html
			image-button_styles.scss
			image-button_styles.css
```

- There is a folder for each category
- For each component there is a folder inside a category
- Each component has all its files on its folder (css,js,html)

### Usage

It's recommended to use a prefix when importing the components into the app (template), example:

```javascript
define([
    'components/markdown/markdown_component'
], function(
    Markdown
) {
 var Example = Vue.extend({
        template : Template,
        // defining the prefix for the component
        components : {
            'wc-markdown' : Markdown
        }
        ...
```

Usage in template

```html
<wc-markdown v-bind:source="markdownSource"></wc-markdown>
```

### Folder structure

There are three main folders:

- **resource**: multipurpose folder, used to store configuration and SCSS files. **Each SCSS folder follows ITCSS and are totally independent between them.**
  - scss/site : SASS files for the site
  - scss/components : SASS files for the components.
- **site**: components documentation site, each web-component should have a page in the site explaining how to use it and some demos.
- **components**: this is the main folder of the repo, where the components live.

### Running tests

Steps:

1. Open a terminal and go to the root folder.
2. Execute this command 'jet steps'

More details:

- [Continuous deployment](https://github.com/hulilabs/docs/blob/master/sections/devops/continuous-deployment.md)
- [Installing jet steps](https://documentation.codeship.com/docker/installation/#jet)
- [vue unit testing ](https://vuejs.org/guide/unit-testing.html)
- [vue unit testing examples](https://github.com/vuejs/vue/tree/dev/test/unit)

#### Running tests on an actual browser

By default, the tests run on a headless browser, but sometimes you may need to run them on an actual browser, with UI and dev tools (like debugging). If you want to do so:

1. Navigate to the `src/resource` folder
2. Make sure you have all the dependencies listed on `package.json`, if don't, run `npm install -d`
3. Run the tests using this command: `node_modules/karma/bin/karma start karma-local.conf.js`

As you may have noticed, the tests will use a different setup file named `karma-local.conf.js`. Here are the differences with the default configuration:

- You can pass a `--browser` argument with the browser name to run (e.g. `--browser Chrome`). Firefox is launched by default. The available values are `Chrome`, `Chromium`, `Firefox`
- The browser won't exit after running the tests, it will stay open
- The source files will be watched for changes, so the tests will run automatically when the code changes
- If you want to dive deep on a test, you will have to add a breakpoint in the test case

_Notice_
There are some cases where a headless browser will need a workaround in order to make some tests pass. This setup is ideal to know when you need to do so, because the tests will pass on Firefox but not in the headless browser (PhantomJS).

### Coverage reports

We use [Karma Coverage package](https://github.com/karma-runner/karma-coverage) to generate coverage reports and ensure that minimal thresholds are met. You can refer to the package's documentation for more detail about the options.

#### Current coverage thresholds

The build process will throw an error if any of the following thresholds isn't met:

- Statements: 80%
- Lines: 80%
- Functions: 80%
- Branches: no threshold currently set

#### Obtaining a coverage report

- On the CI server, a summary report will be automatically displayed, with the percentual coverage for statements, branches, functions and lines.
- Locally, you need to add the `--coverage` flag, which will output the coverage per file, showing the same statements, branches, functions and lines stats. Example command:

```
components/src/resource$ node_modules/karma/bin/karma start karma-local.conf.js --browser Chromium --coverage
```

For more details, please check the [Karma Coverage package](https://github.com/karma-runner/karma-coverage) documentation and the `karma.conf.js`(./src/resource/karma.conf.js) (used for CI) and [`karma-local.conf.js`](./src/resource/karma-local.conf.js) files.

## Setup

#### Starting the server

Execute in the terminal these commands:

1. docker-compose pull
2. docker-compose up -d
3. go to http://localhost

#### Compiling styles

There are two Compass images running on docker to compile styles:

- compass_components : compiling the site SCSS.
- compass_site : compiling the components SCSS.

There is also an option to compile the styles locally without docker, using compass, the configuration files are located in 'resource/compass_config' with the suffix -local.

##### Customizing components styles.

###### Compilation set up

You can customize the components (colors, typography, etc) composing the SCSS files in the app, instead of overriding variables.

Once you have installed and configured the library in the app, execute the following steps to compile the library using custom files:

1. Create the following structure inside the resource folder:

   ```
   resource/
   	components-config/
   		scss/

   ```

2. Copy and paste the components configuration from this repo _resource/compass-config/web-components-config.rb_ into the app _web-components-config/_

   ```
   resource/
   	web-components-config/
   		scss/
   		web-components-config.rb
   ```

3. Modify the app _web-components-config.rb_ and set the variables to the path where the web-components library is installed, for example:

   ```
   css_dir = 'src/js/lib/vendors/web-components/src/web-components'
   sass_dir = 'src/js/lib/vendors/web-components/src/web-components'

   add_import_path "src/js/lib/vendors/web-components/src/resource/scss/web-components"
   ```

4. To use the new configuration folder _web-components-config_ in compilation time, add an aditional import path:

   ```
   additional_import_paths = "resource/web-components-config/scss"
   ```

## References

- [Vue](https://vuejs.org/)