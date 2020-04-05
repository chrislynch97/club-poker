const {BrowserWindow} = require('electron');

function createAppWindow() {

  win = new BrowserWindow({
    //icon: '',
    // frame: false,
    autoHideMenuBar: true,
    webPreferences: {
      // devTools: false,
      nodeIntegration: true
    }
  });

  win.maximize();

  win.loadFile('./renderers/home.html');

  win.on('closed', () => {
    win = null;
  });
}

module.exports = createAppWindow;
