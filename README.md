### WebExtensions API Fake

When feature-testing [WebExtensions](https://developer.mozilla.org/Add-ons/WebExtensions) you might want to fake the API inmemory without spawning a complete browser.

This package depends on [sinon](https://github.com/sinonjs/sinon) and [sinon-chrome](https://github.com/acvetkov/sinon-chrome) to have the whole WebExtension API available as `sinon stubs`. You can pass in your own stubbed version of the `browser`, as long as the individual functions support `.callsFake(fakeFunction);`.


Currently partially supported APIs are:

* [contextualIdentities](https://developer.mozilla.org/Add-ons/WebExtensions/API/contextualIdentities)
  * create
  * remove
  * query
  * get  


* [tabs](https://developer.mozilla.org/Add-ons/WebExtensions/API/tabs)
  * create
  * get
  * query  


* [storage](https://developer.mozilla.org/Add-ons/WebExtensions/API/storage)
  * local
    * get
    * remove
    * set  


### Installation

```
npm install --save-dev webextensions-api-fake
```


### Example

Given the following production code for your WebExtension:

*index.js*
```js
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
```


You could have a test that looks like this (using `mocha`, `sinon-chai` and `chai.should` in this case):

*index.test.js*
```js
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const chai = require("chai");
chai.should();
chai.use(sinonChai);

const WebExtensionsApiFake = require('webextensions-api-fake');
global.browser = WebExtensionsApiFake();

describe('My Fancy Feature', () => {
  beforeEach(async () => {
    await myFancyFeature();
  });

  it('should work', async () => {
    browser.tabs.create.should.have.been.calledWithMatch({
      cookieStoreId: 'firefox-container-5'
    });
    const tabs = await browser.tabs.query({});
    tabs.length.should.equal(1);
  });
});
```


### API

#### exported default function([options])

* *options* `<object>`
  - *browser* `<object>` Optional stubbed version of the WebExtensions API. Defaults to `sinon-chrome/webextensions` if not given


Returns the stubbed `browser` with applied fakes.



#### Class: WebExtensionsApiFake

##### Constructor: new WebExtensionsApiFake

##### webExtensionsApiFake.fakeApi(browser)

* *browser* `<object>` Required stubbed version of the WebExtensions API

Applies the API fakes to the given browser object. Can be called multiple times.