'use strict';
const electron = require('electron');
const {app, BrowserWindow, ipcMain} = require('electron');
const axios = require('axios');

// Adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// Prevent window being garbage collected
let mainWindow;

exports.currentResultData = [];
//var currentResultData = [];

function onClosed() {
	// Dereference the window
	// For multiple windows store them in an array
	mainWindow = null;
}

function createMainWindow() {
	const win = new electron.BrowserWindow({
		width: 500,
		height: 600
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

async function getResultData() {
	const data = await loadData();
	data['randomized_answers'] = handleReceivedAnswers(data.correct_answer, data.incorrect_answers);
	return await data;
}

function handleReceivedAnswers(receivedCorrectAnswer, receivedIncorrectAnswers) {
	var newAnswersArray = receivedIncorrectAnswers;
	newAnswersArray.push(receivedCorrectAnswer);
	newAnswersArray = shuffle(newAnswersArray);
	return newAnswersArray;
}

function shuffle(o) {
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
};

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('ready', async () => {
	mainWindow = createMainWindow();
});

ipcMain.on('load-data', async (event, arg) => {
	await refreshQuestion(event);
});

async function refreshQuestion(event){
	exports.currentResultData = await getResultData();
	event.sender.send('load-data-result', exports.currentResultData);
}

ipcMain.on('answer', async (event, arg) => {
	if(arg === exports.currentResultData.correct_answer){
		console.log('Yeahhhhh!!');
	}else{
		console.log(`Wroooong!! (${exports.currentResultData.correct_answer})`);
	}
	await refreshQuestion(event);
});