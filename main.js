const {app} = require('electron');
const isDev = require('electron-is-dev');

const fs = require('fs');
const fileName = './env-variables.json';
const file = require(fileName);

const {createAuthWindow} = require('./main/auth-process');
const createAppWindow = require('./main/app-process');
const authService = require('./services/auth-service');

async function start() {
  if (isDev) {
    file.serverURL = "http://localhost:3000";
  } else {
    file.serverURL = file.fixedServerURL;
  }
  await fs.writeFile(fileName, JSON.stringify(file, null, 2), () => {});
  try {
    await authService.refreshTokens();
    return createAppWindow();
  } catch (err) {
    createAuthWindow();
  }
}

app.on('ready', start);

app.on('window-all-closed', () => {
  app.quit();
});
