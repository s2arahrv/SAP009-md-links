const fs = require('fs');

  function fileExists(route) {
    fs.existsSync(route)
  }

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
    .then((response) => {
      if (response.ok) {
      const result = { ok: 'ok', status: response.status }
      return result
      }
      else if (!response.ok) {
        const badResult = { ok: 'fail', status: response.status}
        return badResult
      }
    })
    .catch(error => {
      const errorType = { ok: 'fail', status: error.cause.code } 
      return errorType
    })
  }


  function mdLinks(filePath) {
    return getLinks(filePath)
      }


module.exports = { mdLinks, getStatus }