'use strict';
const isDev = require('electron-is-dev');
const {getWebContents} = require('../utils');

const viewTemplate = [{
    label: 'By Week',
    accelerator: 'CmdOrCtrl+1',
    click() {
        getWebContents().send('toggle-view', 'week');
    }
}, {
    label: 'By Month',
    accelerator: 'CmdOrCtrl+2',
    click() {
        getWebContents().send('toggle-view', 'month');
    }
}, {
    type: 'separator'
}, {
    label: 'Next',
    accelerator: 'CmdOrCtrl+Right',
    click() {
        getWebContents().send('move-right');
    }
}, {
    label: 'Previous',
    accelerator: 'CmdOrCtrl+Left',
    click() {
        getWebContents().send('move-left');
    }
}, {
    type: 'separator'
}, {
    label: 'Go to Today',
    accelerator: 'CmdOrCtrl+T',
    click() {
        getWebContents().send('move-today');
    }
}, {
    type: 'separator'
}, {
    type: 'checkbox',
    label: 'Show Calendars',
    checked: true,
    accelerator: 'CmdOrCtrl+Shift+S',
    click() {
        getWebContents().send('toggle-calendars');
    }
}, {
    type: 'checkbox',
    label: 'Show Notifications',
    checked: false,
    accelerator: 'CmdOrCtrl+Shift+N',
    click() {
        getWebContents().send('toggle-notifications');
    }
}, {
    type: 'separator'
}, {
    role: 'reload'
}, {
    type: 'separator'
}, {
    role: 'togglefullscreen'
}];

if (isDev) {
    viewTemplate.push({
        type: 'separator'
    }, {
        role: 'toggledevtools'
    });
}

module.exports = viewTemplate;
