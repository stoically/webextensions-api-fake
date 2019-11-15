/// <reference types="firefox-webext-browser"/>
/// <reference types="sinon"/>

declare namespace browserFake {
  namespace Cookies {
    interface Get extends sinon.SinonStub {
      (): typeof browser.cookies.get;
    }
    interface GetAll extends sinon.SinonStub {
      (): typeof browser.cookies.getAll;
    }
    interface GetAllCookieStores extends sinon.SinonStub {
      (): typeof browser.cookies.getAllCookieStores;
    }
    interface Remove extends sinon.SinonStub {
      (): typeof browser.cookies.remove;
    }
    interface Set extends sinon.SinonStub {
      (): typeof browser.cookies.set;
    }
  }

  interface Cookies {
    get: Cookies.Get;
    _get: Cookies.Get;
    getAll: Cookies.GetAll;
    _getAll: Cookies.GetAll;
    getAllCookieStores: Cookies.GetAllCookieStores;
    _getAllCookieStores: Cookies.GetAllCookieStores;
    remove: Cookies.Remove;
    _remove: Cookies.Remove;
    set: Cookies.Set;
    _set: Cookies.Set;
  }

  namespace Tabs {
    interface Create extends sinon.SinonStub {
      (): typeof browser.tabs.create;
    }
    interface CreateHelper {
      (
        createProperties: any,
        fake?: {
          options: any;
          responses: any;
        }
      ): Promise<browser.tabs.Tab>;
    }
    interface Update extends sinon.SinonStub {
      (): typeof browser.tabs.update;
    }
    interface Get extends sinon.SinonStub {
      (): typeof browser.tabs.get;
    }
    interface Query extends sinon.SinonStub {
      (): typeof browser.tabs.query;
    }
  }

  interface Tabs {
    create: Tabs.Create;
    _create: Tabs.CreateHelper;
    update: Tabs.Update;
    get: Tabs.Get;
    query: Tabs.Query;
  }

  interface Browser {
    cookies: Cookies;
    tabs: Tabs;
  }
}

declare const browserFake: {
  (options?: {
    /*
     * stubbed version of the WebExtensions API. Defaults to sinon-chrome/webextensions if not given
     */
    browser?: browserFake.Browser;

    /*
     * sinon instance, if given sinon-chrome will use it to create the stub. useful if you run into problems with sinon.match
     */
    sinon?: sinon.SinonStatic;

    /*
     * used for the `i18n.getMessage` fake. Format is {locale: messages}. E.g.: {'en': {'something': {'message': 'hello world'}}}
     */
    locales?: {
      [key: string]: {
        message: string;
        description?: string;
        placeholders?: {
          [key: string]: {
            content: string;
            example?: string;
          };
        };
      };
    };

    /*
     * used for the i18n.getMessage fake
     */
    default_locale?: string;
  }): browserFake.Browser;
};

export = browserFake;
