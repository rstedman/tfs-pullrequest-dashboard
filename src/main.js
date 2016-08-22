const electron = require("electron");

const app = electron.app;

const BrowserWindow = electron.BrowserWindow;

let mainWin;

function createMainWin() {

    const {session} = require('electron')

    session.defaultSession.allowNTLMCredentialsForDomains('*')

    mainWin = new BrowserWindow();
    mainWin.loadURL(`file://${__dirname}/index.html`);
    mainWin.on("closed", () => {
        mainWin = null;
    });
}

app.on("ready", createMainWin);

app.on("window-all-closed", () => {
    app.quit();
});
