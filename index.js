'use strict';
const electron = require('electron');
const {app, BrowserWindow, ipcMain} = require('electron');
const axios = require('axios');

// Adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// Prevent window being garbage collected
let mainWindow;

function onClosed() {
	// Dereference the window
	// For multiple windows store them in an array
	mainWindow = null;
}

function createMainWindow() {
	const win = new electron.BrowserWindow({
		width: 600,
		height: 400
	});

	win.loadURL(`file://${__dirname}/index.html`);
	win.on('closed', onClosed);

	return win;
}

async function loadData() { 
	const response = await axios.post('https://opentdb.com/api.php?amount=1&type=multiple', '');
	console.log(response.data.results);
	return response.data.results[0];
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('ready', () => {
	mainWindow = createMainWindow();
	loadData();
});

ipcMain.on('load-data', async (event, arg) => {
	const data = await loadData();
	event.sender.send('load-data-result', data)
});