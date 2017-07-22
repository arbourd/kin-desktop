'use strict';
const os = require('os');
const path = require('path');
const {app, dialog, shell, Menu} = require('electron');
const isDev = require('electron-is-dev');

const {sendToBrowser} = require('./utils');

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
                sendToBrowser('show-preferences');
            }
        }, {
            label: 'Accounts...',
            click() {
                sendToBrowser('show-accounts');
            }
        }, {
            type: 'separator'
        }, {
            label: 'Logout',
            click() {
                sendToBrowser('logout');
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
                sendToBrowser('show-preferences');
            }
        }, {
            label: 'Accounts...',
            click() {
                sendToBrowser('show-accounts');
            }
        }, {
            type: 'separator'
        }, {
            label: 'Logout',
            click() {
                sendToBrowser('logout');
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
        sendToBrowser('toggle-view', 'week');
    }
}, {
    label: 'By Month',
    accelerator: 'CmdOrCtrl+2',
    click() {
        sendToBrowser('toggle-view', 'month');
    }
}, {
    type: 'separator'
}, {
    label: 'Next',
    accelerator: 'CmdOrCtrl+Right',
    click() {
        sendToBrowser('move-right');
    }
}, {
    label: 'Previous',
    accelerator: 'CmdOrCtrl+Left',
    click() {
        sendToBrowser('move-left');
    }
}, {
    type: 'separator'
}, {
    label: 'Go to Today',
    accelerator: 'CmdOrCtrl+T',
    click() {
        sendToBrowser('move-today');
    }
}, {
    type: 'separator'
}, {
    label: 'Make Text Bigger',
    accelerator: 'CmdOrCtrl+Plus',
    click() {
        sendToBrowser('make-text-bigger');
    }
}, {
    label: 'Make Text Smaller',
    accelerator: 'CmdOrCtrl+-',
    click() {
        sendToBrowser('make-text-smaller');
    }
}, {
    label: 'Reset Text Size',
    accelerator: 'CmdOrCtrl+0',
    click() {
        sendToBrowser('reset-text-size');
    }
}, {
    type: 'separator'
}, {
    type: 'checkbox',
    label: 'Show Calendars',
    checked: true,
    accelerator: 'CmdOrCtrl+Shift+S',
    click() {
        sendToBrowser('toggle-calendars');
    }
}, {
    type: 'checkbox',
    label: 'Show Notifications',
    checked: false,
    click() {
        sendToBrowser('toggle-notifications');
    }
}, {
    type: 'separator'
}, {
    label: 'Sync Calendars',
    accelerator: 'CmdOrCtrl+R',
    click() {
        sendToBrowser('sync-calendars');
    }
}, {
    role: 'reload',
    label: 'Reload Kin',
    accelerator: 'CmdOrCtrl+Shift+R'
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
 *   Window
 */
const windowTemplate = [{
    role: 'close'
}, {
    role: 'minimize'
}, {
    type: 'separator'
}, {
    label: 'Open in Browser',
    accelerator: 'CmdOrCtrl+o',
    click() {
        shell.openExternal('https://calendar.kin.today/');
    }
}, {
    type: 'separator'
}, {
    role: 'front'
}];

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
                icon: path.join(__dirname, 'assets/icon.png')
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
    label: 'Window',
    submenu: windowTemplate
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
