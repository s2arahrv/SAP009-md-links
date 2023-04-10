const fs = require('fs');
const path = require('path');

const paths = path.join('SAP009-md-links', 'src', 'example.md');

const folder = './src/';
fs.readdir(folder, (err, list) => {
  if (err) throw err;
  list.forEach((file) => {
    console.log(file);
  });
  console.log(paths);
});