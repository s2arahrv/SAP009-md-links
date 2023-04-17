#! /usr/bin/env node
const chalk = require('chalk');
const path = require('path');
const mdLinks = require('../src/index.js')
const filePath = path.join('src', 'example.md');

mdLinks(filePath)

console.log(chalk.blue('hiii'))