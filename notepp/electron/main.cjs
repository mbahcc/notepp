// electron/main.cjs

const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

const addonPath = app.isPackaged
  ? path.join(process.resourcesPath, 'app.asar.unpacked', 'build', 'Release', 'addon.node')
  : path.join(__dirname, '..', 'build', 'Release', 'addon.node');


let addon;
try {
  addon = require(addonPath);
} catch (err) {
  console.error(' Failed to load C++ addon:', err);
}

const isDev = !app.isPackaged;

let win;

// --- IPC LISTENERS ---

ipcMain.handle('file:save', (event, filePath, content) => {
  try {
    const result = addon.saveFile(filePath, content);
    return result;
  } catch (err) {
    console.error("Error calling C++ addon 'saveFile':", err);
    return false;
  }
});



ipcMain.handle('file:read', (event, filePath) => {
  try {
    const content = addon.readFile(filePath);
    return content;
  } catch (err) {
    console.error("Error calling C++ addon 'readFile':", err);
    return null;
  }
});

ipcMain.handle('show-save-dialog', async (event, content) => {
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
      return false;
    }

    const filePath = result.filePath;
    console.log(`User selected path: ${filePath}`);
    if (win) {
      win.setTitle(`Notepp - ${path.basename(filePath)}`);
    }


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
      return null;
    }

    const filePath = result.filePaths[0];
    

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
  win = new BrowserWindow({
    width: 1200,
    height: 600,
    title: "Notepp - Untitled Document",
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false
    },
    show: false
  });

   win.once('ready-to-show', () => {
    console.log('Window ready to show');
    win.show();
  });

  win.webContents.on('crashed', (event, killed) => {
    const errorMsg = 'The renderer process has crashed. This is a critical error.';
    console.error(`[MAIN PROCESS] ${errorMsg}`);
    dialog.showErrorBox('Application Error', errorMsg);
    // Optionally, close the app
    // app.quit();
  });

  win.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL, isMainFrame) => {
    console.error('Failed to load:', {
      errorCode,
      errorDescription,
      validatedURL,
      isMainFrame
    });
  });

  const indexPath = isDev 
    ? 'http://localhost:5173'
    : path.join(__dirname, '..', 'dist', 'index.html');
    
  console.log('Loading URL/file:', indexPath);

  if (isDev) {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools();
  } else {
    const htmlPath = path.join(__dirname, '..', 'dist', 'index.html');
 
    if (fs.existsSync(htmlPath)) {
      win.loadFile(htmlPath);
    } else {
      console.error('dist/index.html not found!');
      win.loadURL(`data:text/html,<h1>Build Error</h1><p>dist/index.html not found</p><p>Path: ${htmlPath}</p>`);
    }
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

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});