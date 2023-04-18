#! /usr/bin/env node
const chalk = require('chalk');
const path = require('path');
const  { mdLinks, getStatus } = require('../src/index.js')
const filePath = path.join('src', 'example.md') // process.argv[2]
const options = process.argv.slice(2)

const validate = options[0] === '--validate'

if (!validate) {
mdLinks(filePath, { validate: false })
.then(links => {
    links.forEach(link => {
          const output = chalk.blue(`${link.URL} `) + 
                         chalk.red(`${link.text} `) + 
                         chalk.yellow(`${link.file}`)
          console.log(output)
      })
    })
.catch(console.error)
}

if (validate) {
    mdLinks(filePath, { validate: true })
    .then(links => {
        links.forEach(link => {
            getStatus(link.URL)
            .then(result => {
                const output = chalk.yellow(`${link.file} `) +
                               chalk.blue(`${link.URL} `) +  
                               chalk.green(`${result.ok} `) +
                               chalk.green(`${result.status} `) +
                               chalk.red(`${link.text} `)
                console.log(output)
            })
        })
    })
}
// mdLinks("./some/example.md")
//   .then(links => {
//     // => [{ href, text, file }, ...]
//   })
//   .catch(console.error);

// mdLinks("./some/example.md", { validate: true })
//   .then(links => {
//     // => [{ href, text, file, status, ok }, ...]
//   })
//   .catch(console.error);

// mdLinks("./some/dir")
//   .then(links => {
//     // => [{ href, text, file }, ...]
//   })
//   .catch(console.error);