const {remote} = require('electron');
const axios = require('axios');
const authService = remote.require('./services/auth-service');
const authProcess = remote.require('./main/auth-process');
const webContents = remote.getCurrentWebContents();
const {serverURL} = require('../env-variables.json');
const dialog = remote.dialog;

webContents.on('dom-ready', () => {
  updateNavBar();

  let ws;

  axios.get(serverURL + '/socket/get-ticket', {
    headers: {
      'Authorization': `Bearer ${authService.getAccessToken()}`,
      'email': authService.getProfile().email
    }
  }).then(response => {
    let ticket = response.data;

    ws = new WebSocket(serverURL.replace('http://', 'ws://') + '/socket/open/' + ticket.id);

    ws.onopen = function(event) {
      let msg = {
        ticket : ticket,
        type: 'authentication'
      };
      ws.send(JSON.stringify(msg));
    };

    // handle onclose - could be server closing it or server has gone down

  }).catch((error) => {
    let reason = error.response.data.reason;

    let options = {
      title: 'Sign in error',
      message: 'There was an error signing in',
      detail: 'Error code: ' + reason
    }

    switch(reason) {
      case 'email-in-use':
        options.message = 'You are already signed, exiting application';
        break;
    }

    let window = remote.getCurrentWindow();
    dialog.showMessageBoxSync(window, options);
    window.close();
  })
});

document.getElementById('logout').onclick = async () => {
  await authProcess.createLogoutWindow();
  remote.getCurrentWindow().close();
};

async function updateNavBar() {
  let status = await axios.get(serverURL + '/server-status')
    .then((response) => {
      return response.data;
    }).catch(() => {
      return "offline";
    });

  const profile = authService.getProfile();
  document.getElementById('picture').src = profile.picture;
  document.getElementById('name').innerText = status;
}
