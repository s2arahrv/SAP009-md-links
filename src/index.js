const fs = require('fs');

// function fileExists(route) {
//   fs.existsSync(route);
// }

function getLinks(filePath) {
  return fs.promises.readFile(filePath, 'utf8')
    .then((data) => {
      const regex = /(?=\[(!\[.+?\]\(.+?\)|.+?)]\((https:\/\/[^\)]+)\))/gi;
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
    .then((response) {
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
      const errorType = { ok: 'fail', status: error.cause.code };
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

const mdLinks = (path, options) => new Promise((res, rej) => {
  const allLinks = getLinks(path);
  res(allLinks);
});

module.exports = {
  mdLinks, getStatus, getStats, brokenStats,
};
