'use strict';
const Store = require('electron-store');

const config = new Store({
    defaults: {
        lastWindow: {
            width: 1200,
            height: 800
        },
        textSize: 1.0
    }
});

module.exports = config;
