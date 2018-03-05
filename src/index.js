const SinonChromeApi = require('sinon-chrome/api');
const sinonChromeWebExtensionsConfig = require('sinon-chrome/config/stable-api-ff.json');
const sinonChromeChromeExtensionsConfig = require('sinon-chrome/config/stable-api.json');

const apis = require('./apis');

class WebExtensionsApiFake {
  constructor(options = {}) {
    this.apis = apis();

    let sinonChromeConfig = sinonChromeWebExtensionsConfig;
    if (options.api === 'chrome') {
      sinonChromeConfig = sinonChromeChromeExtensionsConfig;
    }

    this.sinonChromeApi = new SinonChromeApi(sinonChromeConfig, {
      sinon: options.sinon || undefined
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