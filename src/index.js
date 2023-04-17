const fs = require('fs');
// const bobo = 'https://www.google.com/'
// const baba = 'https://www.linkedin.com/in/sarahrodriguesvieira/'
// const bubu = 'http://localhost:5173/'

  function getLinks(filePath) {
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

  function getStatus(href) {
    return fetch(href)
    .then(response => {
      if (response.ok) {
      const result = { ok: 'ok', status: response.status }
      return result
      }
    })
    .catch(error => {
      const errortype = error.cause.code
      const badResult = { ok: 'fail', status: errortype } 
      return badResult
    })
  }

  function mdLinks(filePath) {
    return getLinks(filePath)
    .then(links => {
      links.forEach(link => {
        getStatus(link.URL)
        .then(result => {
            const output = `${link.text} ${link.URL} ${link.file} ${result.ok} ${result.status}`
            console.log(output)
        })
      });
    })
  }


module.exports = mdLinks