const fs = require('fs');
const http = require('http')

  function mdLinks(filePath) {
    return fs.promises.readFile(filePath, 'utf8')
    .then(data => {
    const regex = /(?=\[(!\[.+?\]\(.+?\)|.+?)]\((https:\/\/[^\)]+)\))/gi
    const areLinks = [...data.matchAll(regex)].map(link => {

      const linkInfo = { 
        text: link[1], 
        URL: link[2], 
        file: filePath
      }
      
      console.log(linkInfo)
    })
  })
  .catch(error => { throw error });
  }

  function getStatus(response, error) {
    fetch(link) 
    .then(response => {
      if (response.status === 200 || 201) {
        console.log('link OK!')
        console.log(response.status)
      }
    })
    .catch(error => {
      if (response.status === 400 || 404) {
        console.log('link bad :(')
      }
    })
  }
getStatus(link)

//   function mdLinks(path) {
//     if (ext === '.md') {
//     return getLinks(path)
//     }
//     // status.getStatus(link)
//   }

// mdLinks(filePath)


module.exports = mdLinks