const { rejects, throws } = require('assert');
const fs = require('fs');
const path = require('path');
//const { resolve } = require('path/posix');
const process = require('process');
const{stdin, stdout} = process;

const projectDistFolder = path.join(__dirname, 'project-dist');
const assetsFolder = path.join(__dirname, 'project-dist', 'assets');

let writableStreamCSS;
let writableStreamHTML;
let readableStreamHTML;
let listOfFolders;
let indexHTML = '';

async function createEmptyStyleIndexFiles() {
  writableStreamCSS = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));
  writableStreamHTML = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
}

async function getListOfFolders(address) {
  let direntObjectOfFolders = await fs.promises.readdir(address, {withFileTypes: true});
  let arrayOfFoldernames = [];

  for (let key in direntObjectOfFolders) {
    arrayOfFoldernames.push(direntObjectOfFolders[key].name);
  }

  return arrayOfFoldernames;
}

async function copyFiles(array) {
  for (let folder of array) {
    await fs.promises.mkdir(path.join(assetsFolder, folder), {recursive: true});
    let listOfFiles = await getListOfFolders(path.join(__dirname, 'assets', folder));

    for (let file of listOfFiles) {
      let copyFrom = path.join(__dirname, 'assets', folder, file);
      let copyTo = path.join(assetsFolder, folder, file);

      await copyOneByOne(copyFrom, copyTo);
    }
  }
}

async function copyOneByOne(from, to) {
  await fs.promises.copyFile(from, to);
}

async function replaceString(stringifiedFile, stringToDelete, stringToPaste) {
  let newIndexHTMLString = await stringifiedFile.replace(stringToDelete, stringToPaste);
  return newIndexHTMLString;
}

async function readStartingHTML() {
  let chunksOfHTML = '';
  readableStreamHTML = fs.createReadStream(path.join(__dirname, 'project-dist', 'index.html'), 'utf-8');
  readableStreamHTML.on('data', chunk => chunksOfHTML = chunksOfHTML + chunk);
  let promise = await new Promise((resolve, reject) => {

    readableStreamHTML.on('end', () => {
      resolve(chunksOfHTML);
    })

  })

  return promise;
}

async function fillHTML() {
  let template = await fs.promises.readFile(path.join(__dirname, 'template.html'));
  await fs.promises.appendFile(path.join(__dirname, 'project-dist', 'index.html'), template);
  indexHTML = await readStartingHTML();
  let listOfComponentFiles = await getListOfFolders(path.join(__dirname, 'components'));

  for (let file of listOfComponentFiles) {
    let extension = path.extname(path.join(__dirname, 'components', file));

    if (extension !== '.html') {
      continue;
    }

    let name = path.basename(path.join(__dirname, 'components', file), extension);
    let stringMustBeReplaced = `{{${name}}}`;
    let replacer = '';
    let readableStreamComponent = fs.createReadStream(path.join(__dirname, 'components', file), 'utf-8');
    readableStreamComponent.on('data', chunk => replacer = replacer + chunk);
    
    let promise = await new Promise ((resolve, reject) => {
      readableStreamComponent.on('end', () => {
        resolve(replacer);
      })
    })

    indexHTML = await replaceString(indexHTML, stringMustBeReplaced, replacer);
  }

  await fs.promises.writeFile(path.join(projectDistFolder, 'index.html'), indexHTML);
}

async function fillCSS(array) {
  for (let file of array) {
    let styleFile = await fs.promises.readFile(path.join(__dirname, 'styles', file));
    await fs.promises.appendFile(path.join(projectDistFolder, 'style.css'), styleFile);
  }
}

async function start() {
  await fs.promises.rmdir(projectDistFolder, {recursive: true});
  await fs.promises.mkdir(projectDistFolder, {recursive: true});
  await createEmptyStyleIndexFiles();
  await fs.promises.mkdir(assetsFolder, {recursive: true});
  listOfFolders = await getListOfFolders(path.join(__dirname, 'assets'));
  await copyFiles(listOfFolders);
  await fillHTML();
  let listOfStyles = await getListOfFolders(path.join(__dirname, 'styles'));
  await fillCSS(listOfStyles);
}

start();

stdout.write('Дорогой проверяющий, осталось совсем чуть-чуть. Зайди в папку "project-dist" и запусти в браузере "index.html". Отобразится полностью собранная страничка. Когда добавишь 3 тестовых файла, не забудь в "template.html" добавить {{about}}. Лучше добавить перед закрывающим тегом body сразу после {{footer}}. Там он точно красиво отбразится, никому не мешая.\r\nЕсли что не понятно - стучи в телегу @AliakseiShyshko');
stdout.write('\r\n');