import { app, BrowserWindow, ipcMain } from "electron";
import { autoUpdater } from "electron-updater";
import { docDir } from "../renderer/utils/settings";
import fse from "fs-extra";
import path from "path";

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== "development") {
  global.__static = require("path")
    .join(__dirname, "/static")
    .replace(/\\/g, "\\\\");
}

let mainWindow;
const winURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:9080"
    : `file://${__dirname}/index.html`;

function createWindow() {
  mainWindow = new BrowserWindow({
    frame: true,
    useContentSize: true,
    width: 1366,
    height: 795,
    minWidth: 800,
    minHeight: 600,
    show: false,
    webPreferences: {
      nodeIntegration: true,
    },
    autoHideMenuBar: true,
  });

  mainWindow.loadURL(winURL);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
    mainWindow.focus();
  });

  // mainWindow.webContents.openDevTools({ detach: true });
}

app.on("ready", () => {
  autoUpdater.checkForUpdatesAndNotify();
  createWindow();

  if (!fse.existsSync(docDir + "/ecdict.sqlite")) {
    console.log("ecdit-db file does not exist!");
    let oldDbPath = "./database/ecdict.sqlite";
    if (process.env.NODE_ENV === "production") {
      const dbPath = path.resolve(process.resourcesPath, "database");
      oldDbPath = path.resolve(dbPath, "ecdict.sqlite");
    }

    fse
      .copy(oldDbPath, docDir + "/ecdict.sqlite")
      .then(() => {
        console.log("copy ecdit-db file successfully!");
      })
      .catch((err) => console.error(err));
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on("app_version", (event) => {
  console.log("app_version");
  event.sender.send("app_version", { version: app.getVersion() });
});

autoUpdater.on("update-available", (data) => {
  console.log("update-available");
  mainWindow.webContents.send("update_available", { data });
});

autoUpdater.on("update-downloaded", () => {
  console.log("update-downloaded");
  mainWindow.webContents.send("update_downloaded");
});

ipcMain.on("restart_app", () => {
  console.log("restart_app");
  autoUpdater.quitAndInstall();
});
