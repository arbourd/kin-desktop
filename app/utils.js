'use strict';
const {BrowserWindow} = require('electron');

exports.getWebContents = () => {
    const [win] = BrowserWindow.getAllWindows();

    if (process.platform === 'darwin') {
        win.restore();
    }

    return win.webContents;
};

exports.getMenuItemByLabel = (menu, label) => {
    return traverseMenuItems(menu.items, label);
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
