const { copyFileSync, writeFileSync } = require('fs');
const { join, resolve } = require('path');
const pkg = require('../package.json');

const rootPath = resolve(__dirname, '../');
const distPath = resolve(__dirname, '../dist');

delete pkg.private;
writeFileSync(join(distPath, 'package.json'), JSON.stringify(pkg, null, 4))
copyFileSync(join(rootPath, 'README.md'), join(distPath, 'README.md'));
copyFileSync(join(rootPath, 'LICENSE'), join(distPath, 'LICENSE'));
