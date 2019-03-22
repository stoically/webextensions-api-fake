const browserFake = require('../src');
const reload = require('require-reload')(require);
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chai = require('chai');
chai.should();
chai.use(sinonChai);


describe('Useful WebExtension', () => {
  beforeEach(async () => {
    // fake the browser
    global.browser = browserFake({sinon});

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