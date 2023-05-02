const fs = require('fs');
const path = require('path');
const errorMessage = require('./error');

const fileExists = (filePath) => fs.existsSync(filePath);

const isMD = (filePath) => path.extname(filePath) === '.md';

const isDir = (filePath) => fs.statSync(filePath).isDirectory();

// const readingDir = (filePath) => fs.readdirSync(filePath);

const toRelative = (filePath) => path.relative(process.cwd(), filePath);

function checkPath(filePath) {
  // const allMdFiles = [];
  if (isMD(filePath) && toRelative(filePath) !== filePath) {
    const relativePath = toRelative(filePath);
    // console.log(`Current directory: ${process.cwd()}`);
    console.log(relativePath);
    // allMdFiles.push(filePath);
    return relativePath;
  }
  if (isDir(filePath)) {
    // readingDir(filePath).forEach((file) => {
    // const getPath = `${filePath}/${file}`;
    // if (isMD(getPath) === true) {
    //   console.log(`${getPath} is md!`);
    //   return allMdFiles.push(getPath);
    // }
    // return allMdFiles;
    // });
  }
  return filePath;
}

function getLinks(filePath) {
  // const arrayAllLinks = [];
  // arrFiles.forEach((filePath) =>
  return fs.promises.readFile(filePath, 'utf8')
    .then((data) => {
      const regex = /(?=\[(!\[.+?\]\(.+?\)|.+?)]\((https:\/\/[^)]+)\))/gi;
      const links = [...(data.matchAll(regex))];
      const arrayLinks = links.map((link) => ({
        text: link[1],
        href: link[2],
        file: filePath,
      }));
      // return arrayAllLinks.push(arrayLinks);
      return arrayLinks;
    });
  // return arrayAllLinks;
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
      return status;
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
  if (!fileExists(filePath)) {
    return Promise.reject(new Error(errorMessage));
  }
  const thePath = checkPath(filePath);
  const allLinks = getLinks(thePath);
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
