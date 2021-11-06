const fs = require('fs');
const path = require('path');
const process = require('process');
const{stdin, stdout} = process;

const writableStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));
const stylesFolder = path.join(__dirname, 'styles');
const projectFolder = path.join(__dirname, 'project-dist');
let listOfFiles;

async function getListOfFiles(address) {
  let direntObjectOfFilesFromFolder = await fs.promises.readdir(address, {withFileTypes: true});
  let arrayOfFilenames = [];

  for (let key in direntObjectOfFilesFromFolder) {
    let address = path.join(stylesFolder, direntObjectOfFilesFromFolder[key].name);
    let extension = path.extname(address).slice(1);
    if (direntObjectOfFilesFromFolder[key].isFile() === true & extension === 'css') {
      arrayOfFilenames.push(direntObjectOfFilesFromFolder[key].name);
    }
  }

  return arrayOfFilenames;
}

async function addStilesInBundle(array) {
  for (let file of array) {
    let fileData = await fs.promises.readFile(path.join(stylesFolder, file));
    await fs.promises.appendFile(path.join(projectFolder, 'bundle.css'), fileData);
  }
}

async function start() {
  listOfFiles = await getListOfFiles(path.join(__dirname, 'styles'));
  await addStilesInBundle(listOfFiles);
  // stdout.write(listOfFiles.toString());
  // stdout.write('\r\n');
}

start();