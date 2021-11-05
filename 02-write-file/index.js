const fs = require('fs');
const path = require('path');
const process = require('process');
const readline = require('readline');
const{stdin, stdout} = process;
const readingLine = readline.createInterface({
  input: stdin,
  output: stdout
})
const writableStream = fs.createWriteStream(path.join(__dirname, 'vital-important-user-data.txt'));

function exitMessage() {
  stdout.write('\r\nПроцесс завершён. Введённые Вами строки сохранены в файл "vital-important-user-data.txt"');
}

stdout.write('\r\nВведите текст в консоль и нажмите Enter. Каждая введённая строка будет сохранена в файл "vital-important-user-data.txt". При нажатии сочетания клавиш ctrl + c или вводе exit в консоль процесс завершится\r\n\r\n');

process.on('beforeExit', exitMessage);

readingLine.on('line', (data) => {
  let dataWithNewLine = `${data}\r\n`;
  if (data === 'exit') {
    exitMessage();
    process.exit();
  } else {
    fs.appendFile(path.join(__dirname, 'vital-important-user-data.txt'), dataWithNewLine, (error) => {
      if (error) {
        stdout.write('ERROR!');
      }
    })
  }
});