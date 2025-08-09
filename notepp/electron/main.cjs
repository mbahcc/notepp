
// main.cjs - file entry point for Electron application

const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');

const isDev = process.env.NODE_ENV !== 'production';

const addon = require('notepp\src\file-io\FileManager.cpp')

// Listener for the 'file:save' event
ipcMain.handle('file:save', (event, filePath, content) => {
    console.log(`Saving file to ${filePath}`);
    try {
        const result = addon.saveFile(filePath, content);
        return result;
    } catch (error) {
        return false;
    }
});

// Listener for the 'file:read' event
ipcMain.handle('file:read', (event, filePath) => {
    console.log(`Reading file from ${filePath}`);
    try {
        const content = addon.readFile(filePath);
        return content;
    } catch (error) {
        console.error(`Error reading file: ${error.message}`);
        return null;
    }
});

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        }
    });
    if (isDev) {
        win.loadURL('http://localhost:5173');
        win.webContents.openDevTools();
    } else{
        win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
    }
}

app.whenReady().then(() => {
    createWindow();
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
});

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin'){
        app.quit();
    }
});