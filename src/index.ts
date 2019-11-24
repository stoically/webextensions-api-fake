import webextensionsApiMock, { BrowserMock } from 'webextensions-api-mock';
import apis from './apis';
import { BrowserFake, WebExtensionsApiFakeOptions } from './types';

export class WebExtensionsApiFake {
  private apis: any;

  constructor(options = {}) {
    this.apis = apis(options);
  }

  createBrowser(): BrowserMock {
    return webextensionsApiMock();
  }

  fakeApi(browser: BrowserFake): void {
    this.apis.alarms.fakeApi(browser);
    this.apis.contextualIdentities.fakeApi(browser);
    this.apis.cookies.fakeApi(browser);
    this.apis.extension.fakeApi(browser);
    this.apis.i18n.fakeApi(browser);
    this.apis.runtime.fakeApi(browser);
    this.apis.storage.fakeApi(browser);
    this.apis.tabs.fakeApi(browser);
    this.apis.windows.fakeApi(browser);
  }
}

export default (options: WebExtensionsApiFakeOptions = {}): BrowserFake => {
  const webextensionApiFake = new WebExtensionsApiFake(options);
  const browser = (options.browser ||
    webextensionApiFake.createBrowser()) as BrowserFake;
  webextensionApiFake.fakeApi(browser);
  return browser;
};

export * from './types';
