const fs = require('fs');
const http = require('http')
const bobo = 'https://www.google.com/'
const baba = 'https://www.linkedin.com/in/sarahrodriguesvieira/'
const bubu = 'http://localhost:5173/'

  function mdLinks(filePath) {
    return fs.promises.readFile(filePath, 'utf8')
    .then(data => {
    const regex = /(?=\[(!\[.+?\]\(.+?\)|.+?)]\((https:\/\/[^\)]+)\))/gi
    const links = [...data.matchAll(regex)].map((link) => ({ 
        text: link[1], 
        URL: link[2], 
        file: filePath
      }))
      
      return links
    })
  };

  function fetchLinks(href) {
    return fetch(href)
    .then(response => {
      if (response.status === 200 || 201 || 202) {
      const result = { status: response.status, ok: 'ok' }
      return result
      }
    })
    .catch(error => {
      const errortype = error.cause.code
      const badResult = { status: errortype, ok: 'fail' } 
      return badResult
    })
    }
  fetchLinks(bubu)

//   function mdLinks(path) {
//     if (ext === '.md') {
//     return getLinks(path)
//     }
//     // status.getStatus(link)
//   }

// mdLinks(filePath)


module.exports = mdLinks