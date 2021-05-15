#!/usr/bin/env node

const { HTML_TEMPLATE_DEFAULT_PATH } = require('./constants')
const { convertToHtml } = require('./convert')
const { program } = require('commander')

program.version('0.0.1')

program
    .option('-i, --input <input_file>', 'Input yml file path')
    .option('-o, --output <output_file>', 'Output html file path')
    .option('-t, --template <template_file>', 'Path to the template to use')

program.parse(process.argv)

const options = program.opts()
convertToHtml(options.input, options.output || process.cwd(), options.template || HTML_TEMPLATE_DEFAULT_PATH)
