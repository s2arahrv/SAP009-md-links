#! /usr/bin/env node
const chalk = require('chalk');
const path = require('path');
const mdLinks = require('../src/index.js')
const filePath = path.join('src', 'example.md');

mdLinks(filePath)
.then(links => {
    links.forEach(link => {
          const output = chalk.blue(`${link.URL} `) + 
                         chalk.red(`${link.text} `) + 
                         chalk.yellow(`${link.file}`)
          console.log(output)
      })
    })
.catch(console.error)

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