'use strict';
const os = require('os');
const path = require('path');
const {app, dialog, shell, Menu} = require('electron');
const isDev = require('electron-is-dev');

const {getWebContents} = require('./utils');

const appName = app.getName();
const appVersion = app.getVersion();

/*
 *   Mac (macOS only)
 */
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
            label: 'Accounts...',
            click() {
                getWebContents().send('show-accounts');
            }
        }, {
            type: 'separator'
        }, {
            label: 'Logout',
            click() {
                getWebContents().send('logout');
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

/*
 *   File (Windows / Linux only)
 */
const fileTemplate = {
    label: 'File',
    submenu: [
        {
            label: 'Preferences...',
            accelerator: 'Ctrl+,',
            click() {
                getWebContents().send('show-preferences');
            }
        }, {
            label: 'Accounts...',
            click() {
                getWebContents().send('show-accounts');
            }
        }, {
            type: 'separator'
        }, {
            label: 'Logout',
            click() {
                getWebContents().send('logout');
            }
        }, {
            type: 'separator'
        }, {
            role: 'quit'
        }
    ]
};

/*
 *   View
 */
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
    label: 'Refresh Calendars',
    accelerator: 'CmdOrCtrl+R',
    click() {
        getWebContents().send('refresh-calendars');
    }
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

/*
 *   Help
 */
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
                icon: path.join(__dirname, '../assets/icon.png')
            });
        }
    });
}

/*
 *   Main
 */
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
} else {
    template.unshift(fileTemplate);
}

module.exports = Menu.buildFromTemplate(template);
