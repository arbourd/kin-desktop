'use strict';
const {ipcRenderer} = require('electron');

const config = require('./config');

function isShowingCalendars() {
    return document.querySelector('aside.show') !== null;
}

function isShowingNotifications() {
    return document.querySelector('#settings-notifications a').text === 'Disable Notifications';
}

function updateMenu(ipc) {
    ipc.send('update-menu', isShowingCalendars(), isShowingNotifications());

    // Re-add event listeners just in case React removed the elements from the DOM
    addEventListeners();
}

function updateMenuWithTimeout(ipc) {
    setTimeout(updateMenu, 250, ipc);
}

function addEventListeners() {
    document.querySelector('div.logo').onclick = () => updateMenuWithTimeout(ipcRenderer);
    document.querySelector('#settings-notifications a').onclick = () => updateMenuWithTimeout(ipcRenderer);
}

function switchView(view) {
    let currentView;

    if (document.querySelector('span.view-switch.fa-bars')) {
        currentView = 'month';
    } else {
        currentView = 'week';
    }

    return currentView !== view;
}

function addStyleElement() {
    const style = document.createElement('style');
    style.id = 'textSizeZoom';

    document.body.appendChild(style);
}

function setTextSize(size) {
    const style = document.getElementById('textSizeZoom');

    style.textContent = `.fc-content {zoom: ${size} !important;}`;
    config.set('textSize', size);
}

ipcRenderer.on('show-preferences', () => {
    document.querySelector('#settings-modal a[href="#settings-preferences"]').click();
    document.querySelector('a[href="#settings-modal"]').click();
});

ipcRenderer.on('show-accounts', () => {
    document.querySelector('div.add-account button').click();
});

ipcRenderer.on('logout', () => {
    document.querySelector('#settings-modal footer a.alert').click();
});

ipcRenderer.on('sync-calendars', () => {
    document.querySelector('#settings-preferences button').click();
});

ipcRenderer.on('toggle-calendars', () => {
    document.querySelector('div.logo').click();
});

ipcRenderer.on('toggle-notifications', () => {
    document.querySelector('#settings-notifications a').click();
});

ipcRenderer.on('toggle-view', (_, arg) => {
    if (switchView(arg)) {
        document.querySelector('span.view-switch').click();
    }
});

ipcRenderer.on('move-today', () => {
    document.querySelectorAll('.calendar-toolbar button')[1].click();
});

ipcRenderer.on('move-left', () => {
    document.querySelectorAll('.calendar-toolbar button')[2].click();
});

ipcRenderer.on('move-right', () => {
    document.querySelectorAll('.calendar-toolbar button')[3].click();
});

ipcRenderer.on('make-text-bigger', () => {
    const size = config.get('textSize');
    if (size < 1.5) {
        setTextSize(size + 0.1);
    }
});

ipcRenderer.on('make-text-smaller', () => {
    const size = config.get('textSize');
    if (size > 0.7) {
        setTextSize(size - 0.1);
    }
});

ipcRenderer.on('reset-text-size', () => {
    setTextSize(1.0);
});

ipcRenderer.on('finish-load-event', e => {
    addEventListeners();
    addStyleElement();

    updateMenu(e.sender);
    setTextSize(config.get('textSize') || 1.0);
});
