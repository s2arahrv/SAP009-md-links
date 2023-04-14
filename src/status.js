const http = require('http')
const link = 'https://vegibit.com/best-way-to-learn-node-js/#hello-world'

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

exports.getStatus = getStatus;