// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu} = require('electron')
const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  //隐藏菜单栏
  Menu.setApplicationMenu(null)
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    // webPreferences: {
    //   preload: path.join(__dirname, 'preload.js'),
    //   nodeIntegration: true,
    //   autoHideMenuBar: true
    // }
  })

  //开发模式
  //mainWindow.loadURL('http://localhost:3000/');

  //react打包后
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, './build/index.html'),
    protocol: 'file:',
    slashes: true
  }));


  // and load the index.html of the app.
  //mainWindow.loadFile('index.html')

  //调试工具
  //mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
let pyProc = null
let pyPort = null

const NODE_ENV = 'production'
// const NODE_ENV = 'development'

const log4js = require('log4js');
log4js.configure({
    appenders: {
        xcLogFile: {
            type: "dateFile",
            filename: __dirname +'/.log/LogFile',//
            alwaysIncludePattern: true,
            pattern: "-yyyy-MM-dd.log",
            encoding: 'utf-8',//default "utf-8"，文件的编码
            maxLogSize: 1024 }, //文件最大存储空间
        xcLogConsole: {
            type: 'console'
        }
    },
    categories: {
        default: {
            appenders: ['xcLogFile'],
            level: 'all'
        },
        xcLogFile: {
            appenders: ['xcLogFile'],
            level: 'all'
        },
        xcLogConsole: {
            appenders: ['xcLogConsole'],
            level: log4js.levels.ALL
        }
    }
});

const selectPort = () => {
  pyPort = 4242
  return pyPort
}

const createPyProc = () => {
  const logger = log4js.getLogger('python_sub')
  logger.info('creating python server...')
  console.log('creating python server...')
  let port = '' + selectPort()
  if (NODE_ENV ==='development'){
    let script = path.join(__dirname, 'py', 'app.py')
    let pypath = path.join(__dirname, 'py','env','Scripts','python.exe')
    pyProc = require('child_process').spawn(pypath, [script, port])
  }
  else if(NODE_ENV ==='production')
  {
    let exePath = path.join(__dirname, 'pydist', 'app','app.exe')
    pyProc=require('child_process').execFile(exePath, [port])
  }
  if (pyProc != null) {
    logger.info('child process success')
    console.log('child process success')
  }
}

const exitPyProc = () => {
  pyProc.kill()
  pyProc = null
  pyPort = null
}

app.on('ready', createPyProc)
app.on('will-quit', exitPyProc)