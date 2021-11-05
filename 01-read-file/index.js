const fs = require('fs');
const path = require('path');
const readableStream = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');

let data = '';

readableStream.on('data', chunk => data = data + chunk);
readableStream.on('end', () => console.log('Привет, дорогой проверяющий. Наконец, я добрался до NodeJS. Раньше с ним не имел дела, поэтому, если ты нашёл в коде недостатки, пожалуйста, опиши их в комментариях к оценке. Ниже, согласно ТЗ, выводится содержимое файла text.txt:\n\n', data));
readableStream.on('error', error => console.log('ERROR!', error.message));