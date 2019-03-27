'use strict';

const {ipcRenderer} = require('electron');

ipcRenderer.on('load-data-result', (event, arg) => {
    document.getElementById('question').innerHTML = arg.question;
    document.getElementById('answer1').innerHTML = arg.randomized_answers[0];
    document.getElementById('answer2').innerHTML = arg.randomized_answers[1];
    document.getElementById('answer3').innerHTML = arg.randomized_answers[2];
    document.getElementById('answer4').innerHTML = arg.randomized_answers[3];
});