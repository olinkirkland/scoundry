import fs from 'fs';

fs.copyFileSync(`./CNAME`, './dist/CNAME');

console.log('✓ Copied CNAME file');
