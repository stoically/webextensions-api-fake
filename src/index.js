const SinonChromeApi = require("sinon-chrome/api");
const sinonChromeWebExtensionsConfig = require("sinon-chrome/config/stable-api-ff.json");

const contextualIdentities = require('./contextualIdentities');
const tabs = require('./tabs');
const storage = require('./storage')


class WebExtensionsApiFake {
  constructor() {
    this.contextualIdentities = contextualIdentities();
    this.tabs = tabs();
    this.storage = storage();
  }

  fakeApi(browser) {
    this.contextualIdentities.fakeApi(browser);
    this.tabs.fakeApi(browser);
    this.storage.fakeApi(browser);
  }
}

module.exports = (options = {}) => {
  let browser;
  if (!options.browser) {
    browser = new SinonChromeApi(sinonChromeWebExtensionsConfig).create();
  } else {
    browser = options.browser;
  }

  const webextensionApiFake = new WebExtensionsApiFake(browser);
  webextensionApiFake.fakeApi(browser);

  return browser;
};

module.exports.WebExtensionsApiFake = WebExtensionsApiFake;