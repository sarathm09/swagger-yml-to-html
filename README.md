# swagger-yml-to-html

Convert Swagger \*.yml files into a single html file.

## Installation

Open Terminal/Command Prompt and run the following

```bash
npm i -g swagger-yml-to-html

# or if you prefer using yarn

yarn global add swagger-yml-to-html
```

## Running the tool

### Via CLI

Once installed, this tool is available as a command. To run it, use either `swagger-2-html` or `swagger-to-html` or `s2h`.

Available Options:

```
Usage: s2h [options]

Options:
  -V, --version                   output the version number
  -i, --input <input_file>        Input yml file path
  -o, --output <output_file>      Output html file path
  -t, --template <template_file>  Path to the template to use
  -h, --help                      display help for command
```

### Programmatically

Add this module as a dependency in your project.

```bash
npm i swagger-yml-to-html

# or if you prefer using yarn

yarn add swagger-yml-to-html
```

Import the module and use the available methods:

```js
// Import the module
const s2h = require('swagger-yml-to-html')
const { join } = require('path')

// Generate the html file
s2h.convertToHtml(join(__dirname, 'api-spec.yaml'), join(__dirname, 'output.yaml'), join(__dirname, 'template.html'))
// or just specify the input file. Output path will be same as input file directory and the default template will be used˝
s2h.convertToHtml(join(__dirname, 'api-spec.yaml'))

// Get the generated html file
s2h.getGeneratedHtml(join(__dirname, 'api-spec.yaml'), join(__dirname, 'template.html'))
// Or by using the default template
s2h.getGeneratedHtml(join(__dirname, 'api-spec.yaml'))
```

## Template file

You can use custom template files if needed. The template file should have a placeholder ``, where the generated JSON file will be replaced to.

### Sample template

```html
<html>
    <head>
        <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@3.48.0/swagger-ui.css"
            integrity="sha256-DC+RBCRl4tlDpij6pievKfKyxlm8OaX38Sn5yGlmT1I="
            crossorigin="anonymous"
        />
        <script
            src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@3.48.0/swagger-ui-bundle.js"
            integrity="sha256-UxKYBfPWl3Da6kCKrxYmmqMm+rit6ifogVaguCyISXQ="
            crossorigin="anonymous"
        ></script>
        <script>
            function render() {
                var ui = SwaggerUIBundle({
                    spec: '{{SWAGGER_JSON}}',
                    dom_id: '#swagger-ui',
                    defaultModelsExpandDepth: -1,
                    presets: [SwaggerUIBundle.presets.apis, SwaggerUIBundle.SwaggerUIStandalonePreset]
                })
            }
        </script>
    </head>

    <body onload="render()">
        <div id="swagger-ui"></div>
    </body>
</html>
```
