const {BrowserWindow, protocol} = require('electron');
const authService = require('../services/auth-service');
const createAppWindow = require('../main/app-process');

let win = null;

function createAuthWindow() {
  destroyAuthWin();

  win = new BrowserWindow({
    width: 500,
    height: 600,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    //icon: '',
    frame: false,
    autoHideMenuBar: true,
    webPreferences: {
      devTools: false,
      nodeIntegration: true
    }
  });

  win.loadURL(authService.getAuthenticationURL());

  protocol.interceptFileProtocol("file", async ({url}) => {
    if(!url.includes("file:///callback?code")){
       return;
    }

    await authService.loadTokens(url);
    protocol.uninterceptProtocol("file");
    createAppWindow();
    return destroyAuthWin();
  });

  win.on('authenticated', () => {
    destroyAuthWin();
  });

  win.on('closed', () => {
    win = null;
  });
}

function destroyAuthWin() {
  if (!win) return;
  win.close();
  win = null;
}

function createLogoutWindow() {
  return new Promise(resolve => {
    const logoutWindow = new BrowserWindow({
      show: false,
    });

    logoutWindow.loadURL(authService.getLogOutUrl());

    logoutWindow.on('ready-to-show', async () => {
      logoutWindow.close();
      await authService.logout();
      resolve();
    });
  });
}

module.exports = {
  createAuthWindow,
  createLogoutWindow,
};
