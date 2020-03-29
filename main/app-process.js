const {BrowserWindow} = require('electron');

function createAppWindow() {
  let win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    },
  });

  win.maximize();

  win.loadFile('./renderers/home.html');

  win.on('closed', () => {
    win = null;
  });
}

module.exports = createAppWindow;
