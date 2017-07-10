'use strict';
const {ipcRenderer} = require('electron');

const webview = document.querySelector('webview');

ipcRenderer.on('modal-navigate', (_, url) => {
    webview.src = url;
});

webview.addEventListener('did-finish-load', () => {
    document.querySelector('.loading-overlay').style.display = 'none';
});

webview.addEventListener('will-navigate', e => {
    if (e.url.startsWith('https://calendar.kin.today')) {
        ipcRenderer.send('redirect-from-modal', e.url);
    }
});
