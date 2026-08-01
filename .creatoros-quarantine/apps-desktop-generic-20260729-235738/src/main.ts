import {
  app,
  BrowserWindow,
  ipcMain,
  shell,
} from 'electron';
import path from 'node:path';

const API_BASE =
  process.env.CREATOROS_API_URL ??
  'http://localhost:3000';

let mainWindow: BrowserWindow | null = null;

async function apiRequest(
  endpoint: string,
  method = 'GET',
  body?: unknown,
) {
  const response = await fetch(
    `${API_BASE}${endpoint}`,
    {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body:
        body === undefined
          ? undefined
          : JSON.stringify(body),
    },
  );

  const text = await response.text();

  let data: unknown = text;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    throw new Error(
      `API ${response.status}: ${text}`,
    );
  }

  return data;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1480,
    height: 940,
    minWidth: 1120,
    minHeight: 720,
    backgroundColor: '#07111f',
    title: 'CreatorOS',
    webPreferences: {
      preload: path.join(
        __dirname,
        'preload.js',
      ),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  mainWindow.loadFile(
    path.join(__dirname, 'index.html'),
  );

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  ipcMain.handle(
    'creatoros:api',
    async (
      _event,
      input: {
        endpoint: string;
        method?: string;
        body?: unknown;
      },
    ) =>
      apiRequest(
        input.endpoint,
        input.method,
        input.body,
      ),
  );

  ipcMain.handle(
    'creatoros:openExternal',
    async (_event, url: string) => {
      await shell.openExternal(url);
      return true;
    },
  );

  ipcMain.handle(
    'creatoros:environment',
    () => ({
      apiBase: API_BASE,
      platform: process.platform,
      version: app.getVersion(),
    }),
  );

  createWindow();

  app.on('activate', () => {
    if (
      BrowserWindow.getAllWindows()
        .length === 0
    ) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});