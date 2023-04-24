#! /usr/bin/env node
const chalk = require('chalk');
const path = require('path');
const  { mdLinks, getStats, brokenStats, getStatus } = require('../src/index.js')
const filePath = path.join('src', 'example.md') // process.argv[2]
const options = process.argv.slice(2)

const validate = options[0] === '--validate' || options[1] === '--validate'
const stats = options[0] === '--stats' || options[1] === '--stats'

if (options.length === 0) {
mdLinks(filePath, { validate: false })
.then(links => {
    links.forEach(link => {
          const output = chalk.blue(`${link.href} `) + 
                         chalk.red(`${link.text} `) + 
                         chalk.yellow(`${link.file}`)
          console.log(output)
      })
    })
.catch(console.error)
}

else if (validate) {
    mdLinks(filePath, { validate: true })
    .then(links => {
        links.forEach((link) => {
            getStatus(link.href)
            .then(result => {
                if (!stats){
                const output=  chalk.green(`${result.ok} `) +
                               chalk.green(`${result.status} `)
                console.log(output)
                }
            })
            })
            })
        } 

if(stats) {
    mdLinks(filePath, {validate: false})
    .then(links => {
        console.log(getStats(links))
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