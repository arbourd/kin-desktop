'use strict';
const path = require('path');
const {app, BrowserWindow, Menu, ipcMain} = require('electron');
const isDev = require('electron-is-dev');
const {autoUpdater} = require('electron-updater');

const config = require('./config');
const menu = require('./menu');
const {getMenuItemByLabel} = require('./utils');

require('electron-context-menu')();

let mainWindow;
let calendarsMenuItem;
let notificationsMenuItem;

let isQuitting = app.makeSingleInstance(() => {
    if (mainWindow) {
        if (mainWindow.isMinimized()) {
            mainWindow.restore();
        }

        mainWindow.focus();
    }
});

if (isQuitting) {
    app.quit();
}

if (!isDev && process.platform !== 'linux') {
    autoUpdater.logger = require('electron-log');
    autoUpdater.logger.transports.file.level = 'info';
    autoUpdater.checkForUpdates();
}

app.on('ready', () => {
    Menu.setApplicationMenu(menu);
    mainWindow = createMainWindow();

    setMainWindowEvents(mainWindow);

    calendarsMenuItem = getMenuItemByLabel(menu, 'Show Calendars');
    notificationsMenuItem = getMenuItemByLabel(menu, 'Show Notifications');
});

app.on('activate', () => {
    mainWindow.show();
});

app.on('before-quit', () => {
    isQuitting = true;
    config.set('lastWindow', mainWindow.getBounds());
});

ipcMain.on('update-menu', (e, showCalendars, showNotifications) => {
    calendarsMenuItem.checked = showCalendars;
    notificationsMenuItem.checked = showNotifications;
});

function createMainWindow() {
    const lastWindow = config.get('lastWindow');
    const icon = path.join(__dirname, './assets/icon.png');

    const win = new BrowserWindow({
        title: `${app.getName()}`,
        width: lastWindow.width,
        height: lastWindow.height,
        x: lastWindow.x,
        y: lastWindow.y,
        icon,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'browser.js'),
            nodeIntegration: false,
            plugins: true
        }
    });

    win.loadURL('https://calendar.kin.today/');
    return win;
}

function setMainWindowEvents(win) {
    const wc = win.webContents;

    win.on('page-title-updated', e => e.preventDefault());

    win.on('close', e => {
        if (!isQuitting) {
            e.preventDefault();

            if (process.platform === 'darwin') {
                app.hide();
            } else {
                win.hide();
            }
        }
    });

    wc.on('did-finish-load', () => {
        wc.send('finish-load-event', menu);
    });

    wc.on('will-navigate', (e, url) => {
        if (!url.startsWith('https://calendar.kin.today')) {
            e.preventDefault();
            createModalWindow(url);
        }
    });
}

function createModalWindow(url) {
    const win = new BrowserWindow({
        modal: true,
        parent: mainWindow,
        webPreferences: {
            nodeIntegration: false
        }
    });
    win.loadURL(url);

    setModalWindowEvents(win);
}

function setModalWindowEvents(win) {
    const wc = win.webContents;

    win.on('blur', () => {
        win.close();
    });

    wc.on('will-navigate', (e, url) => {
        if (url.startsWith('https://calendar.kin.today')) {
            e.preventDefault();
            win.close();
            mainWindow.loadURL(url);
        }
    });
}
