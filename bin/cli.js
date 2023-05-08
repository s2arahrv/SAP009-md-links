#! /usr/bin/env node
const chalk = require('chalk');
const errorMessage = require('../src/error');
const {
  mdLinks, getStats, validateStats,
} = require('../src/index');

const errorOutput = chalk.hex('#FFF8E7')(errorMessage);
const filePath = process.argv[2]; // process.argv[2]
const options = process.argv.slice(3);

const validate = options[0] === '--validate' || options[1] === '--validate';
const stats = options[0] === '--stats' || options[1] === '--stats';

if (!options.length) {
  mdLinks(filePath, { stats: false, validate: false })
    .then((links) => {
      links.forEach((link) => {
        const output = chalk.hex('#f19db4')(`❤ `) + ` ${link.href} `
                         + chalk.bold(chalk.hex('#FFF8E7')((`${link.text}`))
                         + chalk.hex('#f19db4')(` ${link.file}`));
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
        console.log(chalk.hex('#FFF8E7')(`ʕ •ᴥ•ʔ⊃━☆ .°\n`)+ chalk.bold(statsOutput));
        if (brokenOutput !== `Broken: 0`) {
        console.log(chalk.bold(chalk.red((brokenOutput))));
        } else {
          console.log(chalk.bold(chalk.green(brokenOutput)))
        }
      } else {
        links.forEach((link) => {
          if (link.ok === 'FAIL') {
            const output = chalk.hex('#f19db4')(`❤ `) + ` ${link.href} `
        + chalk.bold(chalk.hex('#FFF8E7')((`${link.text} `))) + chalk.bgRed(`${link.ok} ` + `${link.status}`) + chalk.hex('#f19db4')(` ${link.file}`);

          console.log(output)
          }
          else if (link.ok === 'OK') {
          const output = chalk.hex('#f19db4')(`❤ `) + ` ${link.href} `
        + chalk.bold(chalk.hex('#FFF8E7')((`${link.text} `))) + chalk.bgGreenBright(`${link.ok} ` + `${link.status}`) + chalk.hex('#f19db4')(` ${link.file}`);
          console.log(output);
          }
        });
      }
    })
    .catch(() => {
      console.log(errorOutput);
    });
} else if (stats) {
  mdLinks(filePath, { validate: false })
    .then((links) => {
      const statsOutput = getStats(links);
      console.log(chalk.hex('#FFF8E7')(`ʕ •ᴥ•ʔ⊃━☆ .°\n`)+ chalk.bold(statsOutput));
    })
    .catch(() => {
      console.log(errorOutput);
    });
} else {
  console.log(errorMessage)
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
