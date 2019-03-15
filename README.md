### WebExtensions API Fake

When testing [WebExtensions](https://developer.mozilla.org/Add-ons/WebExtensions) you might want a working fake implementation of the API in-memory available without spawning a complete browser.

This package depends on [sinon](https://github.com/sinonjs/sinon) and [sinon-chrome](https://github.com/acvetkov/sinon-chrome) to have the whole `browser` WebExtension API available as `sinon stubs`. You can pass in your own stubbed version of the `browser`.

### Installation

```
npm install --save-dev webextensions-api-fake
```


### Usage

```js
const browserFake = require('webextensions-api-fake');
const browser = browserFake();
```

`browser` is now a `sinon-chrome/webextensions` stub with faked api.


### API Fake

Currently supported API fake implementations based on Firefox57+:

* [contextualIdentities](https://developer.mozilla.org/Add-ons/WebExtensions/API/contextualIdentities)
  * **create**
    * triggers: onCreated
  * **get**
  * **remove**
    * triggers: onRemoved
  * **query**

* [cookies](https://developer.mozilla.org/Add-ons/WebExtensions/API/cookies)
  * **get**
  * **getAll**
  * **getAllCookieStores**
  * **remove**
  * **set**

* [i18n](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/i18n)
  * **getAcceptLanguages**
    * Returns `['en-US']` by default, can be overwritten by `_setAcceptLanguages`
  * **getMessage**
    * Returns results based on the `locales` and `default_locale` passed as [`options`](#exported-default-functionoptions)
  * **getUILanguage**
    * Returns `en-US` by default, can be overwritten by `_setUILanguage`
  * **detectLanguage**
    * Returns a Promise that resolves to the result of `getUILanguage`

* [tabs](https://developer.mozilla.org/Add-ons/WebExtensions/API/tabs)
  * **create**
    * You can pass in any parameter you want to overwrite
    * triggers: `onCreated`. If `url` is given that doesn't start with `about:` or `moz-ext:`: `webRequest.onBeforeRequest`, `webRequest.onCompleted`, `onUpdated`
  * **update**
    * triggers: If `url` is given that doesn't start with `about:` or `moz-ext:`: `webRequest.onBeforeRequest`, `webRequest.onCompleted`, `onUpdated`
  * **get**
  * **query**  
  * **remove**
    * triggers: onRemoved

* [storage](https://developer.mozilla.org/Add-ons/WebExtensions/API/storage)
  * **local**
    * **get**
    * **remove**
    * **set**  


Faked API methods are also directly available with underscore prefix. E.g. `browser.tabs._create` exposes the `browser.tabs.create` fake. This can be useful to trigger fake behavior from tests without polluting its sinon call history.

#### Special Fake Methods

* i18n
  * **\_setAcceptLanguages**
    * Overwrite the default for `getAcceptLanguages`
  * **\_setUILanguage**
    * Overwrite the default for `getUILanguage`

* tabs
  * **\_create** - helper method, same as `create`, but takes a special fake object that you can pass as second parameter with the following properties
      * *options* `<object>`, optional
        * *webRequest* `<object>`, optional, lets you overwrite the object properties for the request that triggers `webRequest.onBeforeRequest`, e.g. `requestId`
        * *webRequestRedirects* `<array>`, optional, triggers `webRequest.onBeforeRequest` again with the given URLs in the array in the order they are listed. Instead of an URL string its possible to pass an object with properties `url` (the url to redirect) and `webRequest` (overwrite request parameters)
        * *webRequestDontYield* `<array>`, optional, given listeners are not triggered, e.g. `onCompleted`
        * *webRequestError* `<boolean>`, optional, if `true` is given `onErrorOccurred` will be triggered instead of `onCompleted`
      * *responses* `<object>`, optional, will get filled with the following structure if given
        * *webRequest* `<object>`, contains results of the call (`yield`) from `onBeforeRequest` and `onCompleted` as properties. Also contains the `request` property which is the object passed into the `onBeforeRequest` call.
        * *tabs* `<object>`, contains results of the call (`yield`) from `onCreated` and `onUpdated`  as properties
        * *promises* `<array>`, contains return values of all calls, useful to await Promise.all
  * **\_navigate** - helper method to trigger `onBeforeRequest`
    * *tabId* `<integer>`, required, id of the tab
    * *url* `<string>`, required, url to navigate to, will mutate the tabs url
    * *webRequest* `<object>`, optional, lets you overwrite `request` parameters
  * **\_redirect** - helper method to trigger `onBeforeRequest` for a tab with already used `request`, imitating a redirect. Will automatically use the last `request` seen for this tab if not overwritten by `webRequest`. Will mutate the stored tabs `url` to the last `url` in the array. Takes the parameters:
    * *tabId* `<integer>`, required, id of the tab
    * *redirects* `<array>`, required, triggers `webRequest.onBeforeRequest` with the given URLs in the array in the order they are listed. Instead of an URL string its possible to pass an object with properties `url` (the url to redirect) and `webRequest` (overwrite request parameters)
    * *webRequest* `<object>`, optional, lets you overwrite `request` parameters
  * **\_registerRedirects** - helper method to register triggering `onBeforeRequest` for the given redirect urls if the registered `url` is seen in a `tabs.create` or `tabs.update`. Will mutate the tabs url to the last redirect url. Has higher precedence than `webRequestRedirects`
    * *targetUrl* `<string>`, required, the target url
    * *redirectUrls* `<array>`, required, the urls for which follow-up `onBeforeRequest` calls are made. Instead of an URL string its possible to pass an object with properties `url` (the url to redirect) and `webRequest` (overwrite request parameters)
  * **\_unregisterRedirects** - helper method to remove registered redirects for the given target url
    * *targetUrl* `<string>`, required, the target url
  * **\_lastRequestId** - helper method to return the last used `requestId`


### NodeJS Example

Given the following production code for your WebExtension:

*example.js*
```js
browser.tabs.onCreated.addListener(async tab => {
  await browser.storage.local.set({
    lastCreatedTab: tab
  });
});

const firstWeDoThis = async () => {
  const container = await browser.contextualIdentities.create({
    name: 'My Container',
    color: 'blue',
    icon: 'fingerprint'
  });

  await browser.storage.local.set({
    lastCreatedContainer: container.cookieStoreId
  });
}

const thenWeDoThat = async () => {
  const {lastCreatedContainer} = await browser.storage.local.get('lastCreatedContainer');
  await browser.tabs.create({
    cookieStoreId: lastCreatedContainer
  });
}

const myFancyFeature = async () => {
  await firstWeDoThis();
  await thenWeDoThat();
}

myFancyFeature();
```


You could have a test that looks like this (using `mocha`, `sinon-chai`, `chai.should` and `require-reload` in this case):

*example.test.js*
```js
const browserFake = require('webextensions-api-fake');
const reload = require('require-reload')(require);
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chai = require('chai');
chai.should();
chai.use(sinonChai);


describe('Useful WebExtension', () => {
  beforeEach(async () => {
    // fake the browser
    global.browser = browserFake();

    // execute the production code
    reload('./example.js');

    // wait a tick to give the production code the chance to execute
    return new Promise(resolve => process.nextTick(resolve));

    // instead of doing a require and then waiting for the next tick
    // it would also be possible to set e.g. `global._testEnv = true;` in the test
    // and in the production code something like
    //   if (!_testEnv) {
    //     myFancyFeature();
    //   } else {
    //     module.exports = myFancyFeature;
    //   }
    //
    // that would make it possible to get the actual function when doing require
  });

  describe('My Fancy Feature which is executed on load', () => {
    it('should work', async () => {
      browser.tabs.create.should.have.been.calledWithMatch({
        cookieStoreId: sinon.match.string
      });
      const tabs = await browser.tabs.query({});
      tabs.length.should.equal(1);
    });
  });

  describe('Triggering listeners after loading the production code', () => {
    it('should work as well', async () => {
      const createdTab = await browser.tabs.create({});

      const {lastCreatedTab} = await browser.storage.local.get('lastCreatedTab');
      lastCreatedTab.id.should.equal(createdTab.id);
    });
  });
});
```


You can find the example in the `examples` directory and also execute it:

```
npm install
npm run example
```

### JSDOM

If you want to execute your WebExtensions tests using [JSDOM](https://github.com/jsdom/jsdom), then [`webextensions-jsdom`](https://github.com/stoically/webextensions-jsdom) might be for you.


### API

#### Exported default function([options])

* *options* `<object>`, optional
  - *browser* `<object>`, optional, stubbed version of the WebExtensions API. Defaults to `sinon-chrome/webextensions` if not given
  - *sinon* `<object>`, optional, a sinon instance, if given `sinon-chrome` will use it to create the stub. useful if you run into problems with `sinon.match`
  - *locales* `<object>`, optional, used for the `i18n.getMessage` fake. Format is `{locale: messages}`. E.g.: `{'en': {'translated': {'message': 'hello world'}}}`
  - *default_locale* `<string>`, optional, used for the `i18n.getMessage` fake


Returns a new stubbed `browser` with newly created and applied fakes.



#### Exported Class: WebExtensionsApiFake

##### Constructor: new WebExtensionsApiFake

##### webExtensionsApiFake.createBrowser([options])

* *options* `<object>`, optional
  - *sinon* `<object>`, optional, a sinon instance, if given `sinon-chrome` will use it to create the stub. useful if you run into problems with `sinon.match`
  - *api* `<string>`, optional, if `chrome` is given it will create a `sinon-chrome/extensions` stub instead. note that the api fakes are not compatible with the chrome api and you can't pass it into `fakeApi` (yet, might be possible with [`webextension-polyfill`](https://github.com/mozilla/webextension-polyfill))

Returns a new stubbed `browser` without applied fakes.


##### webExtensionsApiFake.fakeApi(browser)

* *browser* `<object>`, required, Stubbed version of the WebExtensions API

Applies the API fakes to the given browser object. Can be called multiple times with different browser stubs and applies the same fakes (with the same in-memory data) in that case.