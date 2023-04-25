#! /usr/bin/env node
const chalk = require('chalk');
const {
  mdLinks, getStats,
} = require('../src/index');

const filePath = process.argv[2]; // process.argv[2]
const options = process.argv.slice(3);

const validate = options[0] === '--validate' || options[1] === '--validate';
const stats = options[0] === '--stats' || options[1] === '--stats';

if (options.length === 0) {
  mdLinks(filePath, { validate: false })
    .then((links) => {
      links.forEach((link) => {
        const output = chalk.blue(`${link.href} `)
                         + chalk.red(`${link.text} `)
                         + chalk.yellow(`${link.file}`);
        console.log(output);
      });
    })
    .catch((error) => {
      const errorMessage = chalk.red(error);
      console.log(errorMessage);
    });
} else if (validate) {
  mdLinks(filePath, { validate: true })
    .then((links) => {
      if (!stats) {
        const output = chalk.blue(`${links.href} `)
        + chalk.red(`${links.text} `) + chalk.green(`${links.ok} `) + chalk.green(`${links.status} `) + chalk.yellow(`${links.file}`);
        console.log(output);
      }
    })
    .catch((error) => {
      const errorMessage = chalk.red(error);
      console.log(errorMessage);
    });
}
//   mdLinks(filePath, { validate: true })
//     .then((links) => {
//       links.forEach((link) => {
//         getStatus(link.href)
//           .then((result) => {
//             if (!stats) {
//               const output = chalk.green(`${result.ok} `)
//                                + chalk.green(`${result.status} `);
//               console.log(output);
//             }
//           });
//       });
//     });
// }

if (stats) {
  mdLinks(filePath, { validate: false })
    .then((links) => {
      console.log(getStats(links));
    });
}

// mdLinks("./some/example.md")
//   .then(links => {
//     // => [{ href, text, file }, ...]
//   })
//   .catch(console.error);

// mdLinks("./some/example.md", { validate: true })
//   .then(links => {
//     // => [{ href, text, file, status, ok }, ...]
//   })
//   .catch(console.error);

// mdLinks("./some/dir")
//   .then(links => {
//     // => [{ href, text, file }, ...]
//   })
//   .catch(console.error);
