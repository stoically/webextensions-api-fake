const SinonChromeApi = require('sinon-chrome/api');
const sinonChromeWebExtensionsConfig = require('sinon-chrome/config/stable-api-ff.json');

const contextualIdentities = require('./contextualIdentities');
const tabs = require('./tabs');
const storage = require('./storage');


class WebExtensionsApiFake {
  constructor() {
    this.contextualIdentities = contextualIdentities();
    this.tabs = tabs();
    this.storage = storage();
  }

  createBrowser() {
    return new SinonChromeApi(sinonChromeWebExtensionsConfig).create();
  }

  fakeApi(browser) {
    this.contextualIdentities.fakeApi(browser);
    this.tabs.fakeApi(browser);
    this.storage.fakeApi(browser);
  }
}

module.exports = (options = {}) => {
  const webextensionApiFake = new WebExtensionsApiFake;

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