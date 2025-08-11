// electron/main.cjs

const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');

const addon = require(path.join(__dirname, '..', 'build', 'Release', 'addon.node'));

const isDev = process.env.NODE_ENV !== 'production';

let win;

// --- IPC LISTENERS ---

ipcMain.handle('file:save', (event, filePath, content) => {
  console.log(`Main process received 'file:save' for path: ${filePath}`);
  try {
    const result = addon.saveFile(filePath, content);
    console.log(`C++ addon returned: ${result}`); 
    return result;
  } catch (err) {
    console.error("Error calling C++ addon 'saveFile':", err);
    return false;
  }
});



ipcMain.handle('file:read', (event, filePath) => {
  console.log(`Main process received 'file:read' for path: ${filePath}`);
  try {
    const content = addon.readFile(filePath);
    return content;
  } catch (err) {
    console.error("Error calling C++ addon 'readFile':", err);
    return null;
  }
});

ipcMain.handle('show-save-dialog', async (event, content) => {
  // The 'async' is important here because showSaveDialog is asynchronous
  try {
    const result = await dialog.showSaveDialog({
      title: 'Save Your Npp Document',
      defaultPath: 'Untitled.npp',
      buttonLabel: 'Save',
      filters: [
        { name: 'Npp Documents', extensions: ['npp'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });

    // Check if the user cancelled the dialog
    if (result.canceled || !result.filePath) {
      console.log('User cancelled the save dialog.');
      return false; // Let the UI know the save was cancelled
    }

    const filePath = result.filePath;
    console.log(`User selected path: ${filePath}`);
    if (win) {
      win.setTitle(`Notepp - ${path.basename(filePath)}`);
    }

    // Directly call our C++ addon with the chosen path and content
    const success = addon.saveFile(filePath, content);
    return success;

  } catch (err) {
    console.error("Error showing save dialog or saving file:", err);
    return false;
  }
});

ipcMain.handle('show-open-dialog', async () => {
  try {
    const result = await dialog.showOpenDialog({
      title: 'Open Npp File',
      buttonLabel: 'Open',
      properties: ['openFile'],
      filters: [
        { name: 'npp Files', extensions: ['npp'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });

    

    // Check if the user cancelled the dialog
    if (result.canceled || result.filePaths.length === 0) {
      console.log('User cancelled the open dialog.');
      return null;
    }

    const filePath = result.filePaths[0];
    console.log(`User selected file to open: ${filePath}`);

    if (win) {
      win.setTitle(`Notepp - ${path.basename(filePath)}`);
    }

    // Use our existing C++ addon to read the file's content
    const content = addon.readFile(filePath);

    // Return an object with both the path and the content
    return { filePath, content };

  } catch (err) {
    console.error("Error showing open dialog or reading file:", err);
    return null;
  }
});



// --- END OF IPC LISTENERS ---

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 600,
    title: "Notepp - Untitled Document",
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
    },
  });

  if (isDev) {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools();
  } else {
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
  if (process.platform !== 'darwin') {
    app.quit();
  }
});