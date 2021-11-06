const fs = require('fs');
const path = require('path');
const process = require('process');
const{stdin, stdout} = process;

let onlyFiles = [];

async function getListOfFiles(path) {
  let result = await fs.promises.readdir(path, {withFileTypes: true});
  return result;
}

function checkIsObjectFile(object) {
  for (let key in object) {
    if (object[key].isFile() === true) {
      onlyFiles.push(object[key].name);
    }
  }
  showInConsole(onlyFiles);
}

async function showInConsole(array) {
  for (let file of array) {
    let address = path.join(__dirname, 'secret-folder', file);
    let fileExtension = path.extname(address);
    let fileName = path.basename(address, fileExtension);
    let fileSize = (await fs.promises.stat(address)).size;

    stdout.write(`${fileName} - ${fileExtension.slice(1)} - ${Math.trunc((fileSize / 1024) * 1000) / 1000}kb`);
    stdout.write('\r\n');
  }
}

let listOfFiles = getListOfFiles(path.join(__dirname, 'secret-folder'));

listOfFiles.then(
  result => {
    checkIsObjectFile(result);
  },
  error => {
    stdout.write(error);
    stdout.write('\r\n');
  }
)