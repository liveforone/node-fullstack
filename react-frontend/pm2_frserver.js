const exec = require('child_process').exec;
const path = require('path');

const pm2_client = exec('npm run start', {
  windowsHide: true,
  cwd: path.join(__dirname, './'),
});

pm2_client.stdout.pipe(process.stdout);
pm2_client.stderr.pipe(process.stderr);
