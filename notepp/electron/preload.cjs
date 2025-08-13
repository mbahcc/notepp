// preload.cjs - Allows Node.js APIs to react app

console.log("--- PRELOAD SCRIPT HAS RUN ---");

const { contextBridge, ipcRenderer } = require('electron');

try {
  contextBridge.exposeInMainWorld('electronAPI', {
    saveFile: (filePath, content) => {
      return ipcRenderer.invoke('file:save', filePath, content);
    },
    readFile: (filePath) => {
      return ipcRenderer.invoke('file:read', filePath);
    },
    showSaveDialog: (content) => {
      return ipcRenderer.invoke('show-save-dialog', content);
    },
    showOpenDialog: () => {
      return ipcRenderer.invoke('show-open-dialog');
    }
  });
  
} catch (error) {
  console.error("PRELOAD SCRIPT ERROR:", error);
}