const fs = require('fs');
const path = require('path');

const filePath = path.join('src', 'example.md');

  function getLinks(filePath) {
    return fs.promises.readFile(filePath, 'utf8')
    .then(data => {
    const regex = /(?=\[(!\[.+?\]\(.+?\)|.+?)]\((https:\/\/[^\)]+)\))/gm
    const links = [...data.matchAll(regex)].map((link =>({ text: link[1], URL: link[2], file: filePath})))

    links.forEach(link => {
      console.log(link.text, link.URL, link.file)
    })
  })
  .catch(error => { throw error });
  }

getLinks(filePath);

module.exports = () => {
  // ... mdLinks() { ... }
}