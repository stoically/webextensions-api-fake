### WebExtensions API Fake

When testing [WebExtensions](https://developer.mozilla.org/Add-ons/WebExtensions) you might want a working fake implementation of the API in-memory available without spawning a complete browser.

This package depends on [sinon](https://github.com/sinonjs/sinon) and [sinon-chrome](https://github.com/acvetkov/sinon-chrome) to have the whole `browser` WebExtension API available as `sinon stubs`. You can pass in your own stubbed version of the `browser`.


Currently partially supported API fake implementations are:

* [contextualIdentities](https://developer.mozilla.org/Add-ons/WebExtensions/API/contextualIdentities)
  * create
  * remove
  * query
  * get  
  * onCreated  
  * onRemoved


* [tabs](https://developer.mozilla.org/Add-ons/WebExtensions/API/tabs)
  * create
  * get
  * query  
  * onCreated  


* [storage](https://developer.mozilla.org/Add-ons/WebExtensions/API/storage)
  * local
    * get
    * remove
    * set  


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