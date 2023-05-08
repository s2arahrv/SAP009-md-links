#! /usr/bin/env node
const chalk = require('chalk');
const errorMessage = require('../src/error');
const {
  mdLinks, getStats, validateStats,
} = require('../src/index');

const errorOutput = chalk.red(errorMessage);
const filePath = process.argv[2]; // process.argv[2]
const options = process.argv.slice(3);

const validate = options[0] === '--validate' || options[1] === '--validate';
const stats = options[0] === '--stats' || options[1] === '--stats';

if (!options.length) {
  mdLinks(filePath, { validate: false })
    .then((links) => {
      links.forEach((link) => {
        const output = chalk.blue(`${link.href} `)
                         + chalk.magenta(`${link.text}`)
                         + chalk.yellow(` ${link.file}`);
        console.log(output);
      });
    })
    .catch(() => {
      console.log(errorOutput);
    });
} else if (validate) {
  mdLinks(filePath, { validate: true })
    .then((links) => {
      if (stats) {
        const statsOutput = getStats(links);
        const brokenOutput = validateStats(links);
        console.log(chalk.bold(statsOutput));
        if (brokenOutput !== `Broken: 0`) {
        console.log(chalk.red((brokenOutput)));
        } else {
          console.log(chalk.green(brokenOutput))
        }
      } else {
        links.forEach((link) => {
          if (link.ok === 'FAIL') {
            const output = chalk.italic(`${link.href} `)
        + chalk.bold(`${link.text} `) + chalk.bgRed(`${link.ok} `) + chalk.bgRed(`${link.status}`) + chalk.yellow(` ${link.file}`);

          console.log(output)
          }
          else if (link.ok === 'OK') {
          const output = chalk.italic(`${link.href} `)
        + chalk.bold(`${link.text} `) + chalk.bgGreenBright(`${link.ok}`) + chalk.bgGreenBright(` ${link.status}`) + chalk.yellow(` ${link.file}`);
          console.log(output);
          }
        });
      }
    })
    .catch(() => {
      console.log(errorOutput);
    });
} else if (stats) {
  mdLinks(filePath, { stats: true, validate: false })
    .then((links) => {
      const statsOutput = chalk.green(getStats(links));
      console.log(statsOutput);
    })
    .catch(() => {
      console.log(errorOutput);
    });
} else {
  console.log(errorOutput);
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

// if (stats) {
//   if (validate) {
//     mdLinks(filePath, { validate: false })
//       .then((links) => {
//         console.log(getStats(links));
//       });
//   }
// }

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
