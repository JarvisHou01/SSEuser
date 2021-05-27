const { app, BrowserWindow } = require("electron")


const createWindow = function () {
    const mainWindow = new BrowserWindow({
        width: 1500,
        height: 1500,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            webSecurity: false
        }
    })

    mainWindow.loadFile("index.html")
    
    mainWindow.webContents.openDevTools()
}


app.on('ready', createWindow)


app.on('window-all-closed', function () {
    app.quit()
})


