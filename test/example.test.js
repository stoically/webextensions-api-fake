// index.js
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


// index.test.js
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const chai = require("chai");
chai.should();
chai.use(sinonChai);

const WebExtensionsApiFake = require('../src');
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