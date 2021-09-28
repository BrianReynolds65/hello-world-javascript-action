const core = require('@actions/core');
const github = require('@actions/github');
var fs = require('fs');
const { default: walk } = require('./file');

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
  walk(process.cwd(), (err, results) => {
    if (err) throw err;
    console.log(results);
  })
  
  // var files = fs.readdirSync(process.cwd());
  // files.forEach((file) => {
  //   console.log(file)
  // })
} catch (error) {
  core.setFailed(error.message);
}