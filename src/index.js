const fs = require('fs');
const path = require('path');
const errorMessage = require('./error');

const fileExists = (filePath) => fs.existsSync(filePath);

const isMD = (filePath) => path.extname(filePath) === '.md';

const toRelative = (filePath) => path.relative(process.cwd(), filePath);

function checkPath(filePath) {
  if (isMD(filePath)) {
    const relativePath = toRelative(filePath);
    return relativePath;
  }
  else {
    return errorMessage
  }
}

function getLinks(filePath) {
  return fs.promises.readFile(filePath, 'utf8')
    .then((data) => {
      const regex =  /\[([^[\]]*?)\]\((https?:\/\/[^\s?#.].[^\s]*)\)/gm;
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
        const result = { ok: 'OK', status: response.status };
        return result;
      }
      else {
        const badResult = { ok: 'FAIL', status: response.status };
        return badResult;
      }
    })
    .catch((error) => {
      const errorType = { ok: 'FAIL', status: error.cause.code };
      return errorType;
    });
    return status
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
  const brokenFilter = arrLinks.filter((link) => link.ok === 'FAIL');
  const brokenStats = `Broken: ${brokenFilter.length}`;
  return brokenStats;
}

const mdLinks = (filePath, options) => {
  if (!fileExists(filePath)) {
    return Promise.reject((errorMessage));
  }
  const thePath = checkPath(filePath);
  const allLinks = getLinks(thePath);
  if (options.validate) {
    return validate(allLinks);
  }
  return allLinks;
};

module.exports = {
  mdLinks, checkPath, fileExists, getLinks, validate, getStats, validateStats,
};
