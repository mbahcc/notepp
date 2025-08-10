// preload.cjs - Allows Node.js APIs to react app

console.log("--- PRELOAD SCRIPT HAS RUN ---");

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saveFile: (filePath, content) => ipcRenderer.invoke('file:save', filePath, content),
  readFile: (filePath) => ipcRenderer.invoke('file:read', filePath),
  showSaveDialog: (content) => ipcRenderer.invoke('show-save-dialog', content),
  showOpenDialog: () => ipcRenderer.invoke('show-open-dialog')
});
