const fs = require('fs');
const path = require('path');
const process = require('process');
const{stdin, stdout} = process;

let filesCopy = path.join(__dirname, 'files-copy');
let listOfFiles;

async function start() {
  await fs.promises.rmdir(filesCopy, {recursive: true});
  await fs.promises.mkdir(filesCopy, {recursive: true});
  listOfFiles = await getListOfFiles(path.join(__dirname, 'files'));
  await copyFiles(listOfFiles);
}

async function copyOneFile(from, to) {
  await fs.promises.copyFile(from, to);
}

async function copyFiles(array) {
  for (let file of array) {
    let copyFrom = path.join(__dirname, 'files', file);
    let copyTo = path.join(__dirname, 'files-copy', file);
    await copyOneFile(copyFrom, copyTo);
  }
}

async function getListOfFiles(path) {
  let direntObjectOfFilesFromFolder = await fs.promises.readdir(path, {withFileTypes: true});
  let arrayOfFilenames = [];

  for (let key in direntObjectOfFilesFromFolder) {
    arrayOfFilenames.push(direntObjectOfFilesFromFolder[key].name);
  }

  return arrayOfFilenames;
}

start();

stdout.write('Пожалуйста, загляни в "files-copy". Там всё должно быть.');
stdout.write('\r\n');