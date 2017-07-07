'use strict';
const os = require('os');
const path = require('path');
const {app, dialog, shell} = require('electron');

const appName = app.getName();
const appVersion = app.getVersion();

const helpTemplate = [{
    label: `${appName} Website`,
    click() {
        shell.openExternal('https://kin.today/');
    }
}, {
    label: 'Report an Issue…',
    click() {
        const body = `
<!-- Please succinctly describe your issue and steps to reproduce it. -->

-

${appName} ${appVersion}
Electron ${process.versions.electron}
${process.platform} ${process.arch} ${os.release()}`;

        shell.openExternal(`https://github.com/arbourd/kin-desktop/issues/new?body=${encodeURIComponent(body)}`);
    }
}];

if (process.platform !== 'darwin') {
    helpTemplate.push({
        type: 'separator'
    }, {
        role: 'about',
        click() {
            dialog.showMessageBox({
                title: `About ${appName}`,
                message: `${appName} ${appVersion}`,
                detail: 'Created by Dylan Arbour',
                icon: path.join(__dirname, '../../assets/icon.png')
            });
        }
    });
}

module.exports = helpTemplate;
