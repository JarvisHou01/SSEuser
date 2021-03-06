var electron = require('electron')

var app = electron.app

var BrowserWindow = electron.BrowserWindow

var mainWindow = null

const Menu = electron.Menu

app.on('ready', () => {
    Menu.setApplicationMenu(null)

    

    mainWindow = new BrowserWindow({
        width: 1000,
        height: 950,
        frame:false,
        //resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    })
    
    
    //开发工具
    mainWindow.webContents.openDevTools({ mode: 'detach' })

    mainWindow.loadFile('index.html')



    mainWindow.on('closed', () => {
        
        mainWindow = null
        app.quit()
    })

})