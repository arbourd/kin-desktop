'use strict';
const {BrowserWindow} = require('electron');

exports.sendToBrowser = arg => {
    const [win] = BrowserWindow.getAllWindows();

    if (process.platform === 'darwin') {
        win.restore();
    }

    return win.webContents.send(arg);
};

exports.getMenuItemByLabel = (menu, label) => {
    const item = traverseMenuItems(menu.items, label);
    return item ? item : null;
};

function traverseMenuItems(items, label) {
    let result;

    for (const item of items) {
        if (!item.label) {
            continue;
        }

        if (item.label.toLowerCase() === label.toLowerCase()) {
            return item;
        }

        if (item.submenu) {
            result = traverseMenuItems(item.submenu.items, label);
        } else {
            result = false;
        }

        if (result !== false) {
            return result;
        }
    }

    return false;
}
