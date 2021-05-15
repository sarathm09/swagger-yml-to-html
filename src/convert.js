const { SWAGGER_CODEGEN_JAR_PATH, HTML_TEMPLATE_DEFAULT_PATH } = require('./constants')
const { existsSync, lstatSync, unlinkSync, rmdirSync } = require('fs')
const { mkdir, readFile, writeFile } = require('fs').promises
const { join, dirname, sep } = require('path')
const { promisify } = require('util')

/**
 * Get the promisified version of exec
 */
const exec = promisify(require('child_process').exec)

/**
 * Convert the template into a swagger html by replacing the placeholders
 *
 * @param {string} template template html as string
 * @param {object} json Swagger JSON object
 * @returns converted html
 */
const replacePlaceholderForSwaggerJson = (template, json) => template.replace("'{{SWAGGER_JSON}}'", JSON.stringify(json))

/**
 * Convert the swagger yml file into a json file
 *
 * @param {string} yml path to swagger yml file
 * @param {string} dir directory to save the json file
 * @returns a promise that resolves when the yml is converted
 */
const convertSwaggerYmlToJson = async (yml, dir) => exec(`java -jar ${SWAGGER_CODEGEN_JAR_PATH} generate -l swagger -i ${yml} -o ${dir}/`)

/**
 * Cleanup swagger generated files
 */
const cleanupSwaggerFiles = () => {
    try {
        ;['.swagger-codegen'].map(file => rmdirSync(file, { recursive: true }))
        ;['.swagger-codegen-ignore', 'README.md'].map(file => unlinkSync(file))
    } catch (e) {}
}

/**
 * Convert the yml to html using the given template and save in the specified location
 *
 * @param {string} swaggerYmlPath Path to swagger yml file
 * @param {string} templatePath Path to the swagger template. takes the default template if not specified
 * @param {string} outputFile Path to the output file
 */
const convertToHtml = async (swaggerYmlPath, outputFile = __dirname, templatePath = HTML_TEMPLATE_DEFAULT_PATH) => {
    if (!existsSync(swaggerYmlPath)) {
        console.error(`YML file not found: ${swaggerYmlPath}`)
        exit(1)
    }
    if (!existsSync(templatePath)) {
        console.error(`HTML template file not found: ${templatePath}`)
        exit(1)
    }
    if (!existsSync(dirname(outputFile))) {
        await mkdir(dirname(outputFile))
    }

    if (!outputFile.endsWith('.html') && lstatSync(outputFile).isDirectory()) {
        outputFile = join(outputFile, swaggerYmlPath.split(sep)[swaggerYmlPath.split(sep).length - 1].replace('.yml', '.html').replace('.yaml', '.html'))
    } else if (!outputFile.endsWith('.html')) {
        outputFile += '.html'
    }

    const generatedHtml = await getGeneratedHtml(swaggerYmlPath, templatePath)
    await writeFile(outputFile, generatedHtml)
    console.log(`Generated the html file: ${outputFile}`)
    cleanupSwaggerFiles()
}

/**
 * Convert the yml to html and return it
 *
 * @param {string} swaggerYmlPath Path to swagger yml file
 * @param {string} templatePath Path to the swagger template. takes the default template if not specified
 * @returns string with converted html
 */
const getGeneratedHtml = async (swaggerYmlPath, templatePath = HTML_TEMPLATE_DEFAULT_PATH) => {
    if (!existsSync(swaggerYmlPath)) {
        console.error(`YML file not found: ${swaggerYmlPath}`)
        exit(1)
    }
    const swaggerJsonDirectory = dirname(swaggerYmlPath)
    const template = await readFile(templatePath, 'utf-8')
    await convertSwaggerYmlToJson(swaggerYmlPath, swaggerJsonDirectory)
    cleanupSwaggerFiles()

    const swaggerJson = JSON.parse(await readFile(join(swaggerJsonDirectory, 'swagger.json'), 'utf-8'))
    const convertedHtml = replacePlaceholderForSwaggerJson(template, swaggerJson)

    return convertedHtml
}

module.exports = { getGeneratedHtml, convertToHtml }