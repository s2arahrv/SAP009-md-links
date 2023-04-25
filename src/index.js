const fs = require('fs');
const path = require('path');
const errorMessage = require('./error');

const fileExists = (filePath) => fs.existsSync(filePath);

const isMD = (filePath) => path.extname(filePath);

function readFile(filePath) {
  if (isMD(filePath) === '.md') {
    return filePath;
  }
  return filePath;
}

function getLinks(filePath) {
  return fs.promises.readFile(filePath, 'utf8')
    .then((data) => {
      const regex = /(?=\[(!\[.+?\]\(.+?\)|.+?)]\((https:\/\/[^)]+)\))/gi;
      const links = [...(data.matchAll(regex))];
      const arrayLinks = links.map((link) => ({
        text: link[1],
        href: link[2],
        file: filePath,
      }));
      return arrayLinks;
    });
}

function getStatus(href) {
  return fetch(href)
    .then((response) => {
      if (response.ok) {
        const result = { ok: 'ok', status: response.status };
        return result;
      }
      if (!response.ok) {
        const badResult = { ok: 'fail', status: response.status };
        return badResult;
      }
    })
    .catch((error) => {
      const errorType = { ok: 'fail', status: error.cause };
      return errorType;
    });
}

function getStats(arrLinks) {
  const totalLinks = arrLinks.length;
  const uniqueLinks = new Set(arrLinks.map((link) => link.href)).size;
  const stats = `Total: ${totalLinks}\nUnique: ${uniqueLinks}`;
  return stats;
}

function brokenStats(arrLinks) {
  const brokenLinks = arrLinks.filter(({ ok }) => ok === 'fail').length;
  const stats = `Broken: ${brokenLinks}`;
  return stats;
}

const mdLinks = (filePath, options) => new Promise((res, rej) => {
  if (fileExists(filePath)) {
    const getFile = readFile(filePath);
    const allLinks = getLinks(getFile);
    if (options.validate) {
      allLinks.then((links) => {
        links.forEach((link) => {
          const linkObj = getStatus(link.href).then((result) => ({
            ...link,
            ...result,
          }));
          res(linkObj);
        });
      });
    } else {
      res(allLinks);
    }
  } else if (!fileExists) {
    rej(errorMessage);
  }
});

module.exports = {
  mdLinks, getStatus, getStats, brokenStats,
};
