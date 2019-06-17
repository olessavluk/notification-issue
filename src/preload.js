const { ipcRenderer } = require("electron");

(function() {
  const OldNotify = window.Notification;

  const nfs = {};

  class NewNotify {
    constructor(title, options) {
      this.title = title;
      this.options = {
        ...options,
        tag: options.tag || String(Math.random())
      };

      nfs[options.tag] = this;
      ipcRenderer.send("notification", this);
    }
    requestPermission = OldNotify.requestPermission.bind(OldNotify);
    get permission() {
      return OldNotify.permission;
    }
  }

  ipcRenderer.on("notification-click", (e, notification) => {
    const { tag } = notification.options;
    const instance = nfs[tag];
    if (!!instance && !!instance.onclick) {
      instance.onclick(e);
      // release from memory
      nfs[tag] = null;
    }
  });

  window.Notification = NewNotify;
})();
