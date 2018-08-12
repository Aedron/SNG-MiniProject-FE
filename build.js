
const path = require('path');
const fs = require('fs-extra');
const execSync = require('child_process').execSync;


const dist = path.join(__dirname, './dist');
fs.removeSync(dist);
fs.mkdirSync(dist);
fs.mkdirSync(path.join(dist, 'scripts'));


['img', 'style', 'lib', 'index.html'].map(name => {
    fs.copySync(
        path.join(__dirname, name),
        path.join(__dirname, 'dist', name)
    )
});

fs.readdirSync(path.join(__dirname, 'scripts')).map(name => {
    const from = path.join(__dirname, 'scripts', name);
    const to = path.join(__dirname, 'dist/scripts', name);
    execSync(`babel ${from} --out-file ${to}`);
    console.log('done');
});
