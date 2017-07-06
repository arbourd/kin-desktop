'use strict';
const {app} = require('electron');

const {getWebContents} = require('../utils');

const macTemplate = {
    label: `${app.getName()}`,
    submenu: [
        {
            role: 'about'
        }, {
            type: 'separator'
        }, {
            label: 'Preferences...',
            accelerator: 'Cmd+,',
            click() {
                getWebContents().send('show-preferences');
            }
        }, {
            type: 'separator'
        }, {
            label: 'Add Account...',
            click() {
                getWebContents().send('add-account');
            }
        }, {
            type: 'separator'
        }, {
            role: 'services',
            submenu: []
        }, {
            type: 'separator'
        }, {
            role: 'hide'
        }, {
            role: 'hideothers'
        }, {
            role: 'unhide'
        }, {
            type: 'separator'
        }, {
            role: 'quit'
        }
    ]
};

module.exports = macTemplate;
