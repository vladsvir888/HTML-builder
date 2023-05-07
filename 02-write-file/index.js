const fs = require('fs');
const path = require('path');

const pathToFile = path.join(__dirname, 'text.txt');
 
fs.writeFile(pathToFile, '', () => console.log('Приветствую! Введите какой-нибудь текст.'));

process.stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    console.log('Спасибо за ответ. Удачи!');

    process.exit();
  }

  fs.appendFile(pathToFile, data, () => {});
});

process.on('SIGINT', () => {
  console.log('Спасибо за ответ. Удачи!');

  process.exit();
});