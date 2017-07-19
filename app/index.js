'use strict';
const path = require('path');
const {app, BrowserWindow, ipcMain, Menu, shell} = require('electron');
const isDev = require('electron-is-dev');
const {autoUpdater} = require('electron-updater');

const config = require('./config');
const menu = require('./menu');
const {getMenuItemByLabel} = require('./utils');

require('electron-context-menu')();

let mainWindow;
let modalWindow;
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

ipcMain.on('close-modal', () => {
    if (modalWindow) {
        modalWindow.close();
    }
});

ipcMain.on('redirect-from-modal', (_, url) => {
    mainWindow.loadURL(url);
    modalWindow.close();
});

function createMainWindow() {
    const lastWindow = config.get('lastWindow');

    const win = new BrowserWindow({
        title: `${app.getName()}`,
        width: lastWindow.width,
        height: lastWindow.height,
        minHeight: 600,
        minWidth: 800,
        x: lastWindow.x,
        y: lastWindow.y,
        icon: path.join(__dirname, 'assets/icon.png'),
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
                app.quit();
            }
        }
    });

    wc.on('did-finish-load', () => {
        wc.send('finish-load-event', menu);
    });

    wc.on('new-window', (e, url) => {
        e.preventDefault();
        shell.openExternal(url);
    });

    wc.on('will-navigate', (e, url) => {
        if (url.startsWith('https://api.kin.today')) {
            e.preventDefault();
            modalWindow = createModalWindow();
            setModalWindowEvents(modalWindow, url);
        }
    });
}

function createModalWindow() {
    const win = new BrowserWindow({
        modal: true,
        parent: mainWindow,
        show: false,
        frame: false,
        autoHideMenuBar: true,
        alwaysOnTop: true
    });

    win.loadURL(`file://${path.join(__dirname, 'modal.html')}`);
    return win;
}

function setModalWindowEvents(win, url) {
    const wc = win.webContents;

    win.once('ready-to-show', () => win.show());

    wc.on('dom-ready', () => {
        wc.send('modal-navigate', url);
    });
}
