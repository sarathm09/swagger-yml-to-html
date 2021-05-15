const { join } = require('path')

// Swagger jar constants
const SWAGGER_CODEGEN_VERSION = '2.4.8'
const SWAGGER_CODEGEN_URL = `https://repo1.maven.org/maven2/io/swagger/swagger-codegen-cli/${SWAGGER_CODEGEN_VERSION}/swagger-codegen-cli-${SWAGGER_CODEGEN_VERSION}.jar`

// Swagger file (local) constants
const SWAGGER_CODEGEN_JAR = 'swagger-codegen.jar'
const SWAGGER_CODEGEN_DIRECTORY = join(__dirname, '..', 'lib')
const SWAGGER_CODEGEN_JAR_PATH = join(SWAGGER_CODEGEN_DIRECTORY, SWAGGER_CODEGEN_JAR)

// Template constants
const HTML_TEMPLATE_DEFAULT = 'basic.html'
const HTML_TEMPLATE_PATH = join(__dirname, '..', 'templates')
const HTML_TEMPLATE_DEFAULT_PATH = join(HTML_TEMPLATE_PATH, HTML_TEMPLATE_DEFAULT)

module.exports = {
    SWAGGER_CODEGEN_VERSION,
    SWAGGER_CODEGEN_URL,
    SWAGGER_CODEGEN_JAR,
    SWAGGER_CODEGEN_DIRECTORY,
    SWAGGER_CODEGEN_JAR_PATH,
    HTML_TEMPLATE_DEFAULT,
    HTML_TEMPLATE_PATH,
    HTML_TEMPLATE_DEFAULT_PATH
}
