const fs = require('fs');
const path = require('path')
const http = require('http')
const status = require('./status')
const filePath = path.join('src', 'example.md');
const ext = path.extname(filePath)

  function getLinks(filePath) {
    return fs.promises.readFile(filePath, 'utf8')
    .then(data => {
    const regex = /(?=\[(!\[.+?\]\(.+?\)|.+?)]\((https:\/\/[^\)]+)\))/gi
    const links = [...data.matchAll(regex)].map((link =>({ text: link[1], URL: link[2], file: filePath})))

    links.forEach(link => {
      console.log(link)
    })
  })
  .catch(error => { throw error });
  }

  function mdLinks(path) {
    if (ext === '.md') {
    return getLinks(path)
    }
    // status.getStatus(link)
  }

mdLinks(filePath)


module.exports = () => {
  // ... mdLinks() { ... }
}