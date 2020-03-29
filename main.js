const {app} = require('electron');

const {createAuthWindow} = require('./main/auth-process');
const createAppWindow = require('./main/app-process');
const authService = require('./services/auth-service');

async function start() {
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
