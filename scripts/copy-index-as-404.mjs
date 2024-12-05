import fs from 'fs';

const distDirectory = fs.readdirSync('./dist');
const indexFile = distDirectory.find((file) => file.startsWith('index'));
fs.copyFileSync(`./dist/${indexFile}`, './dist/404.html');

console.log('✓ Copied index.html as 404.html');
