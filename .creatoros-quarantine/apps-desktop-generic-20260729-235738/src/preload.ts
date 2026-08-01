import {
  contextBridge,
  ipcRenderer,
} from 'electron';

contextBridge.exposeInMainWorld(
  'creatorOS',
  {
    api: (
      endpoint: string,
      method = 'GET',
      body?: unknown,
    ) =>
      ipcRenderer.invoke(
        'creatoros:api',
        {
          endpoint,
          method,
          body,
        },
      ),
    environment: () =>
      ipcRenderer.invoke(
        'creatoros:environment',
      ),
    openExternal: (url: string) =>
      ipcRenderer.invoke(
        'creatoros:openExternal',
        url,
      ),
  },
);