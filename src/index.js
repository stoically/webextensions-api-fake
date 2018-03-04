const SinonChromeApi = require('sinon-chrome/api');
const sinonChromeWebExtensionsConfig = require('sinon-chrome/config/stable-api-ff.json');

const contextualIdentities = require('./contextualIdentities');
const tabs = require('./tabs');
const storage = require('./storage');


class WebExtensionsApiFake {
  constructor(options = {}) {
    this.contextualIdentities = contextualIdentities();
    this.tabs = tabs();
    this.storage = storage();
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
    this.contextualIdentities.fakeApi(browser);
    this.tabs.fakeApi(browser);
    this.storage.fakeApi(browser);
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