const { promisify } = require('util');
const { resolve } = require('path');
const fs = require('fs');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const core = require('@actions/core');
const github = require('@actions/github');
// var fs = require('fs');

async function getFiles(dir) {
  const subdirs = await readdir(dir);
  const files = await Promise.all(subdirs.map(async (subdir) => {
    const res = resolve(dir, subdir);
    return (await stat(res)).isDirectory() ? getFiles(res) : res;
  }));
  return files.reduce((a, f) => a.concat(f), []);
}

try {
  // `who-to-greet` input defined in action metadata file
  const nameToGreet = core.getInput('who-to-greet');
  console.log(`Hello ${nameToGreet}!`);
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
  console.log('PWD:', process.cwd());
  
  getFiles(process.cwd())
  .then(files => console.log(files))
  .catch(e => { console.error(e); core.setFailed(e)});

  // var files = fs.readdirSync(process.cwd());
  // files.forEach((file) => {
  //   console.log(file)
  // })
} catch (error) {
  core.setFailed(error.message);
}