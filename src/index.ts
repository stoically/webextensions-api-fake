import webExtensionsSchema from 'webextensions-schema';
import sinon from 'sinon';
import { BrowserFake } from './types';
// import apis from './apis';

export class WebExtensionsApiFake {
  constructor(options = {}) {
    // this.apis = apis(options);
  }

  async createBrowser(): Promise<BrowserFake> {
    const schema = await webExtensionsSchema();
    const browser: any = {};
    const aliases = new Map();
    schema.getNamespaces().forEach(namespace => {
      if (namespace.$import) {
        aliases.set(namespace.namespace, namespace.$import);
        return;
      }

      browser[namespace.namespace] = {};
      if (namespace.events) {
        namespace.events.forEach(event => {
          if (!event.name || event.type !== 'function') {
            return;
          }
          browser[namespace.namespace][event.name] = {
            addListener: sinon.stub(),
            removeListener: sinon.stub(),
            hasListener: sinon.stub(),
          };
        });
      }

      if (namespace.functions) {
        namespace.functions.forEach(fn => {
          if (!fn.name || fn.type !== 'function') {
            return;
          }
          browser[namespace.namespace][fn.name] = sinon.stub();
        });
      }
    });

    aliases.forEach((to, from) => {
      browser[from] = browser[to];
    });

    return browser;
  }

  // fakeApi(browser) {
  //   this.apis.alarms.fakeApi(browser);
  //   this.apis.contextualIdentities.fakeApi(browser);
  //   this.apis.cookies.fakeApi(browser);
  //   this.apis.extension.fakeApi(browser);
  //   this.apis.i18n.fakeApi(browser);
  //   this.apis.runtime.fakeApi(browser);
  //   this.apis.storage.fakeApi(browser);
  //   this.apis.tabs.fakeApi(browser);
  //   this.apis.windows.fakeApi(browser);
  // }
}

const factory = async (
  options: { browser?: BrowserFake } = {}
): Promise<BrowserFake> => {
  const webextensionApiFake = new WebExtensionsApiFake(options);
  const browser =
    options.browser || (await webextensionApiFake.createBrowser());
  // webextensionApiFake.fakeApi(browser);

  return browser;
};

export default factory;

// declare const browserFake: {
//   (options?: {
//     /*
//      * stubbed version of the WebExtensions API. Defaults to sinon-chrome/webextensions if not given
//      */
//     browser?: browserFake.Browser;

//     /*
//      * sinon instance, if given sinon-chrome will use it to create the stub. useful if you run into problems with sinon.match
//      */
//     sinon?: sinon.SinonStatic;

//     /*
//      * used for the `i18n.getMessage` fake. Format is {locale: messages}. E.g.: {'en': {'something': {'message': 'hello world'}}}
//      */
//     locales?: {
//       [key: string]: {
//         message: string;
//         description?: string;
//         placeholders?: {
//           [key: string]: {
//             content: string;
//             example?: string;
//           };
//         };
//       };
//     };

//     /*
//      * used for the i18n.getMessage fake
//      */
//     default_locale?: string;
//   }): browserFake.Browser;
// };
