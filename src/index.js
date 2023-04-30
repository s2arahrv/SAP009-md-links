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
  const status = fetch(href)
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
  return status;
}

function validate(linksArr) {
  return linksArr.then((links) => {
    const fullObj = links.map((link) => getStatus(link.href).then((valObj) => ({
      ...link,
      ...valObj,
    })));
    return Promise.all(fullObj);
  });
}

function getStats(arrLinks) {
  const totalLinks = arrLinks.length;
  const linkFilter = arrLinks.map((link) => link.href);
  const uniqueLinks = new Set(linkFilter).size;
  const stats = `Total: ${totalLinks}\nUnique: ${uniqueLinks}`;
  return stats;
}

function validateStats(arrLinks) {
  const brokenFilter = arrLinks.filter((link) => link.ok === 'fail');
  const brokenStats = `Broken: ${brokenFilter.length}`;
  return brokenStats;
}

const mdLinks = (filePath, options) => {
  if (!fileExists(filePath) || !readFile(filePath)) {
    return Promise.reject(new Error(errorMessage));
  }
  const allLinks = getLinks(filePath);
  if (options.validate) {
    return validate(allLinks);
  }
  if (options.stats) {
    return getStats(allLinks);
  }
  return allLinks;
};

module.exports = {
  mdLinks, getStatus, getStats, validateStats,
};
