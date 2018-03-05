module.exports = () => {
  const _tabs = [];
  let _tabId = 1;
  let _requestId = 1;

  return {
    fakeApi(browser) {
      browser.tabs.create.callsFake(async (tab, fake = {}) => {
        tab.id = _tabId;
        _tabs.push(Object.assign(tab));
        _tabId++;

        if (!fake.options) {
          fake.options = {};
        }
        if (!fake.responses) {
          fake.responses = {};
        }
        fake.responses.tabs = {},
        fake.responses.webRequest = {};

        let _networkTab = false;
        tab.status = 'complete';
        if (tab.url && !tab.url.startsWith('about:') && !tab.url.startsWith('moz-ext:')) {
          _networkTab = true;
          tab.status = 'loading';
        }

        if (browser.tabs.onCreated.addListener.callCount) {
          const result = browser.tabs.onCreated.addListener.yield(tab);
          fake.responses.tabs.onCreated = result;
        }

        if (_networkTab) {
          const webRequest = fake.options.webRequest || {};
          const _request = {
            frameId: webRequest.frameId || 0,
            tabId: webRequest.tabId || tab.id,
            url: webRequest.tabUrl || tab.url,
            requestId: webRequest.requestId || _requestId++
          };
          if (browser.webRequest.onBeforeRequest.addListener.callCount) {
            const result = browser.webRequest.onBeforeRequest.addListener.yield(_request);
            fake.responses.webRequest.onBeforeRequest = result;
          }

          if (browser.webRequest.onCompleted.addListener.callCount) {
            const result = browser.webRequest.onCompleted.addListener.yield(_request);
            fake.responses.webRequest.onCompleted = result;
          }

          if (browser.tabs.onUpdated.addListener.callCount) {
            tab.status = 'complete';
            const result = browser.tabs.onUpdated.addListener.yield(tab.id, {status: 'complete'}, tab);
            fake.responses.tabs.onUpdated = result;
          }
        }

        return tab;
      });
      browser.tabs.get.callsFake(async tabId => {
        return _tabs.find(tab => tab.id === tabId);
      });
      browser.tabs.query.callsFake(async query => {
        let tabs = _tabs;
        if (query.cookieStoreId) {
          tabs = _tabs.filter(tab => tab.cookieStoreId === query.cookieStoreId);
        }
        return tabs;
      });
    }
  };
};