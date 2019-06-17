const path = require("path");
const notifier = require("node-notifier");
const { app, ipcMain, Notification, BrowserWindow } = require("electron");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL("https://www.bennish.net/web-notifications.html");

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on("notification", (e, notification) => {
  notifier.notify(
    {
      title: "My awesome title",
      message: "Hello from node, Mr. User!",
      // icon: path.join(__dirname, 'coulson.jpg'), // Absolute path (doesn't work on balloons)
      // sound: true, // Only Notification Center or Windows Toasters
      wait: true // Wait with callback, until user action is taken against notification
    },
    function(err, response) {
      console.log({ err, response });
      // Response is response from notification
    }
  );

  notifier.on("click", function(notifierObject, options) {
    console.log("click", notifierObject, options);
    // Triggers if `wait: true` and user clicks notification
    mainWindow.show();
  });

  notifier.on("timeout", function(notifierObject, options) {
    console.log("timeout", notifierObject, options);
    // Triggers if `wait: true` and notification closes
  });
});

// setTimeout(() => {
//   const n = new Notification('Title', {
//     body: 'Lorem Ipsum Dolor Sit Amet'
//   });
//
//   // this is never executed on Windows 10
//   n.on("click", () => {
//     console.log('Notification clicked')
//     app.quit();
//   });
//
//   n.show();
// }, 5000);

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
