const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true }, (err, items) => {
  items.forEach(item => {
    if (!item.isDirectory()) {
      fs.stat(path.join(__dirname, 'secret-folder', `${item.name}`), (err, stats) => {
        console.log(`${item.name.split('.').join(' - ')} - ${stats.size} bytes`);
      });
    }
  });
});