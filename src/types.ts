import {
  BrowserMock,
  Alarms,
  ContextualIdentities,
  Cookies,
  Extension,
  I18n,
  Runtime,
  Storage,
  Tabs,
  Windows,
} from 'webextensions-api-mock';

export interface WebExtensionsApiFakeOptions {
  /*
   * stubbed version of the WebExtensions API. Defaults to sinon-chrome/webextensions if not given
   */
  browser?: BrowserMock;

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
   * used for the `i18n.getMessage` fake
   */
  default_locale?: string;
}

export interface AlarmsFake extends Alarms {
  _create(name: string, alarmInfo: any): void;
  _clear(name: string): Promise<any>;
  _clearAll(): Promise<boolean>;
  _get(name: string): Promise<any>;
  _getAll(): Promise<any>;
}

export interface ContextualIdentitiesFake extends ContextualIdentities {
  _create(container: any): Promise<any>;
  _remove(cookieStoreId: any): Promise<any>;
  _query(query: any): Promise<any>;
  _get(cookieStoreId: any): Promise<any>;
  _update(cookieStoreId: any, details: any): Promise<any>;
}

export interface CookiesFake extends Cookies {
  _set(details: any): Promise<any>;
  _get(query: any): Promise<any>;
  _getAll(query: any): Promise<any>;
  _getAllCookieStores(): Promise<any>;
  _remove(details: any): Promise<any>;
}

export interface ExtensionFake extends Extension {
  _getURL(path: string): string;
}

export interface I18nFake extends I18n {
  _getMessage: (messageName: any, substitutions?: never[]) => string;
  _getAcceptLanguages: () => string[];
  _setAcceptLanguages: (acceptLanguages: any) => void;
  _getUILanguage: () => string;
  _setUILanguage: (uiLanguage: string) => void;
  _detectLanguage: (text: string) => Promise<string>;
}

export interface RuntimeFake extends Runtime {
  _getURL(path: string): string;
  _getBrowserInfo(): Promise<any>;
}

export interface StorageFake extends Storage {
  _get(key: any): Promise<any>;
  _set(key: any, value: any): Promise<any>;
  _remove(key: any): Promise<any>;
}

export interface TabsFake extends Tabs {
  _create: (createProperties: any, fake?: any) => Promise<any>;
  _update: (tabId: any, updateProperties: any, fake?: any) => Promise<any>;
  _get: (tabId: any) => Promise<any>;
  _query: (query: any) => Promise<any>;
  _remove: (tabId: any) => Promise<any>;
  _navigate: (tabId: any, url: any, fakeWebRequest?: any) => Promise<any>;
  _redirect: (
    tabId: any,
    fakeRedirects: any,
    fakeWebRequest?: any
  ) => Promise<any>;
  _lastRequestId: () => number;
  _registerRedirects: (targetUrl: any, redirectUrls: any) => any;
  _unregisterRedirects: (targetUrl: any) => any;
}

export interface WindowsFake extends Windows {
  _getCurrent(): Promise<any>;
}

export interface BrowserFake extends BrowserMock {
  alarms: AlarmsFake;
  contextualIdentities: ContextualIdentitiesFake;
  cookies: CookiesFake;
  extension: ExtensionFake;
  i18n: I18nFake;
  runtime: RuntimeFake;
  storage: StorageFake;
  tabs: TabsFake;
  windows: WindowsFake;
}
