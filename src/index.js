const SinonChromeApi = require('sinon-chrome/api');
const sinonChromeWebExtensionsConfig = require('sinon-chrome/config/stable-api-ff.json');
const apis = require('./apis');

class WebExtensionsApiFake {
  constructor(options = {}) {
    this.apis = {
      contextualIdentities: apis.contextualIdentities(),
      extension: apis.extension(),
      runtime: apis.runtime(),
      storage: apis.storage(),
      tabs: apis.tabs(),
      windows: apis.windows(),
    };

    this.sinonChromeApi = new SinonChromeApi(sinonChromeWebExtensionsConfig, {
      sinon: options.sinon ? options.sinon : undefined
    });
    this.sinon = this.sinonChromeApi.sinon;
  }

  createBrowser() {
    const browser = this.sinonChromeApi.create();
    browser.contextMenus = browser.menus;
    return browser;
  }

  fakeApi(browser) {
    this.apis.contextualIdentities.fakeApi(browser);
    this.apis.extension.fakeApi(browser);
    this.apis.runtime.fakeApi(browser);
    this.apis.storage.fakeApi(browser);
    this.apis.tabs.fakeApi(browser);
    this.apis.windows.fakeApi(browser);
  }
}

module.exports = (options = {}) => {
  const webextensionApiFake = new WebExtensionsApiFake(options);

  let browser;
  if (!options.browser) {
    browser = webextensionApiFake.createBrowser();
  } else {
    browser = options.browser;
  }

  webextensionApiFake.fakeApi(browser);

  return browser;
};

module.exports.WebExtensionsApiFake = WebExtensionsApiFake;