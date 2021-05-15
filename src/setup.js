#!/usr/bin/env node

const { SWAGGER_CODEGEN_DIRECTORY, SWAGGER_CODEGEN_URL, SWAGGER_CODEGEN_JAR_PATH, SWAGGER_CODEGEN_VERSION } = require('./constants')
const { createWriteStream, existsSync, mkdirSync } = require('fs')
const fetch = require('node-fetch')

/**
 * Download the swagger codegen cli
 *
 * @param {string} path path to the swagget codegen cli
 */
const downloadSwaggerCodegen = async (path = SWAGGER_CODEGEN_DIRECTORY) => {
    console.log(`Downloading swagger-codegen v${SWAGGER_CODEGEN_VERSION} from ${SWAGGER_CODEGEN_URL}`)
    const res = await fetch(SWAGGER_CODEGEN_URL)

    if (!existsSync(path)) {
        mkdirSync(path)
    }

    const fileStream = createWriteStream(SWAGGER_CODEGEN_JAR_PATH)

    await new Promise((resolve, reject) => {
        res.body.pipe(fileStream)
        res.body.on('error', reject)
        fileStream.on('finish', resolve)
    })
    console.log(`Download complete, file name: ${SWAGGER_CODEGEN_JAR_PATH}`)
}

downloadSwaggerCodegen()
