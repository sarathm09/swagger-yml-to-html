const { SWAGGER_CODEGEN_JAR_PATH, HTML_TEMPLATE_DEFAULT_PATH } = require('./constants')
const { existsSync, lstatSync, mkdirSync, rmdir } = require('fs')
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
const convertSwaggerYmlToJson = async (yml, dir) => {
    try {
        const swaggerJsonDirectory = yml.replace('.yml', '').replace('.yaml', '')
        if (!existsSync(swaggerJsonDirectory)) {
            mkdirSync(swaggerJsonDirectory)
        }
        await exec(`java -jar ${SWAGGER_CODEGEN_JAR_PATH} generate -l swagger -i ${yml} -o ${swaggerJsonDirectory}`)
        return join(swaggerJsonDirectory, 'swagger.json')
    } catch (e) {
        console.error(`Error generating the swagger json file. Check if the swagger yml file ${yml} is correct: ${e}`)
        process.exit(1)
    }
}

/**
 * Cleanup swagger generated files
 */
const cleanupSwaggerFiles = directory =>
    new Promise(resolve => {
        try {
            rmdir(directory, { recursive: true }, () => {
                resolve(`Deleted swagger generated files in ${directory}`)
            })
        } catch (e) {
            console.log(e)
        }
    })

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
    const swaggerJsonFile = await convertSwaggerYmlToJson(swaggerYmlPath, swaggerJsonDirectory)

    const swaggerJson = JSON.parse(await readFile(swaggerJsonFile, 'utf-8'))
    const convertedHtml = replacePlaceholderForSwaggerJson(template, swaggerJson)

    await cleanupSwaggerFiles(dirname(swaggerJsonFile))
    return convertedHtml
}

module.exports = { getGeneratedHtml, convertToHtml }
