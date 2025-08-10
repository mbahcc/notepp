export interface IElectronAPI {
  saveFile: (filePath: string, content: string) => Promise<boolean>,
  readFile: (filePath: string) => Promise<string | null>,
  showSaveDialog: (content: string) => Promise<boolean>,
  showOpenDialog: () => Promise<{ filePath: string; content: string | null } | null>,
}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}