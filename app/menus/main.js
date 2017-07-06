'use strict';
const {Menu} = require('electron');

const helpTemplate = require('./help');
const macTemplate = require('./mac');
const viewTemplate = require('./view');

const template = [{
    role: 'editMenu'
}, {
    label: 'View',
    submenu: viewTemplate
}, {
    role: 'windowMenu'
}, {
    role: 'help',
    submenu: helpTemplate
}];

if (process.platform === 'darwin') {
    template.unshift(macTemplate);
}

module.exports = Menu.buildFromTemplate(template);
