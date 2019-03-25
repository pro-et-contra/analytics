(() => {
  const BASE_URL = 'http://localhost:3000/';
  const defaultOptions = { registerClicks: false };
  const defaultEvent = 'Init';
  const headers = {
    'Content-Type': 'application/json',
    'token': '6i2nSgWu0DfYIE8I0ZBJOtxTmHJATRzu',
  };

  class BaseEvent {
    constructor() {
      this.PageID = null;
    }

    getBrowserData() {
      const userAgent = navigator.userAgent;
      var browser = '';

      // Opera 8.0+
      var isOpera = (!!window.opr && !!opr.addons) || !!window.opera ||
        navigator.userAgent.indexOf(' OPR/') >= 0;
      // Firefox 1.0+
      var isFirefox = typeof InstallTrigger !== 'undefined';
      // Safari 3.0+ "[object HTMLElementConstructor]"
      var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) {
          return p.toString() === '[object SafariRemoteNotification]';
        })(!window['safari'] ||
          (typeof safari !== 'undefined' && safari.pushNotification));
      // Internet Explorer 6-11
      var isIE = /*@cc_on!@*/false || !!document.documentMode;
      // Edge 20+
      var isEdge = !isIE && !!window.StyleMedia;
      // Chrome 1 - 71
      var isChrome = !!window.chrome &&
        (!!window.chrome.webstore || !!window.chrome.runtime);

      if (isOpera) browser = 'Opera';
      if (isFirefox) browser = 'Firefox';
      if (isSafari) browser = 'Safari';
      if (isIE) browser = 'Internet Explorer';
      if (isEdge) browser = 'Edge';
      if (isChrome) browser = 'Chrome';

      return { userAgent, browser };
    }

    setPageID(ID) {
      this.pageID = ID;
    }

    getPageID() {
      return this.pageID;
    }

    setUserID(ID) {
      localStorage.setItem('_a_user_id', ID);
    }

    getUserID() {
      return localStorage.getItem('_a_user_id');
    }

    requestInitData() {
      let self = this;
      return fetch(BASE_URL + 'init', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ page: !self.pageID, user: !self.getUserID() }),
      })
        .then(resp => {
          return resp.json();
        })
        .then(function (options) {
          if (options.userID)
            self.setUserID(options.userID)
          if (options.pageID)
            self.setPageID(options.pageID)
        })
    }

    getPageURL() {
      return location.href;
    }

    getSite() {
      return location.origin;
    }

  }

  class Analytics {
    constructor() {
      this.options = {};
      this.userID = null;
      this.pageID = null;
    }

    init(options = defaultOptions) {
      const self = this;
      self.setInitOptions(options);

      let init = new BaseEvent();

      return init.requestInitData()
        .then(() => {
          const userID = self.userID = init.getUserID();
          const pageID = self.pageID = init.getPageID();

          const { userAgent, browser } = init.getBrowserData();
          const timestamp = Date.now();
          const url = init.getPageURL()

          const data = { userAgent, userID, timestamp, url, browser, pageID };
          return fetch(BASE_URL + 'collect', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ event: 'init', options: data }),
          })
        })
        .then(() => {
          if (self.options.registerClicks) self.registerClicks();
        })
    }

    setInitOptions(options) {
      this.options = Object.assign({}, defaultOptions, options);
    }

    emit(event = defaultEvent, options = {}) {
      const timestamp = Date.now();
      options = Object.assign(options,
        { userID: this.userID, pageID: this.pageID, timestamp });
      const data = { event, options };

      return fetch(BASE_URL + 'collect', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
      })
    }

    registerClicks() {
      const self = this;
      document.addEventListener('click', function (e) {
        const { type, x, y } = e;
        const { width, height } = screen;
        self.emit('click', { type, x, y, width, height })
      }, false);
    }

  }

  window.al = function (...args) {
    this.a = this.a || new Analytics();
    if (!args.length) {
      this.a.init(typeof window.ANALYTICS_OPTIONS != 'undefined'
        ? window.ANALYTICS_OPTIONS
        : undefined);
    } else {
      this.a.emit.apply(this.a, args);
    }
  };
  al();

})();
