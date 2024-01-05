const { BrowserWindow, app } = require('electron');
require('./express.js');

let mainWindow = null;

function main() {
  mainWindow = new BrowserWindow();
  mainWindow.loadURL(`http://localhost:5000/`);
  mainWindow.on('close', event => {
    mainWindow = null;
  })
}

app.on('ready', main);