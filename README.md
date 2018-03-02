### WebExtensions API Fake

When feature/unit-testing [WebExtensions](https://developer.mozilla.org/Add-ons/WebExtensions) you might want a working fake implementation of the API in-memory available without spawning a complete browser.

This package depends on [sinon](https://github.com/sinonjs/sinon) and [sinon-chrome](https://github.com/acvetkov/sinon-chrome) to have the whole `browser` WebExtension API available as `sinon stubs`. You can pass in your own stubbed version of the `browser`, as long as the individual functions support `.callsFake(fakeFunction);`.


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


You can find the example in the `test` directory and also execute it:

```
npm install
npm test
```


### API

#### Exported default function([options])

* *options* `<object>`
  - *browser* `<object>` Optional stubbed version of the WebExtensions API. Defaults to `sinon-chrome/webextensions` if not given


Returns the stubbed `browser` with applied fakes.



#### Exported Class: WebExtensionsApiFake

##### Constructor: new WebExtensionsApiFake

##### webExtensionsApiFake.fakeApi(browser)

* *browser* `<object>` Required stubbed version of the WebExtensions API

Applies the API fakes to the given browser object. Can be called multiple times.