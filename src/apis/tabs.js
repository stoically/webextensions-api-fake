module.exports = () => {
  const _tabs = [];
  let _tabId = 1;
  let _requestId = 1;

  return {
    fakeApi(browser) {
      browser.tabs.create.callsFake(async (tab, fakeOptions = {}) => {
        tab.id = _tabId;
        _tabs.push(tab);
        _tabId++;

        let _networkTab = false;
        tab.status = 'complete';
        if (tab.url && !tab.url.startsWith('about:') && !tab.url.startsWith('moz-ext:')) {
          _networkTab = true;
          tab.status = 'loading';
        }

        if (browser.tabs.onCreated.addListener.callCount) {
          browser.tabs.onCreated.addListener.yield(tab);
        }

        if (_networkTab) {
          const webRequest = fakeOptions.webRequest || {};
          const _request = {
            frameId: webRequest.frameId || 0,
            tabId: webRequest.tabId || tab.id,
            url: webRequest.tabUrl || tab.url,
            requestId: webRequest.requestId || _requestId++
          };
          if (browser.webRequest.onBeforeRequest.addListener.callCount) {
            const [promise] = browser.webRequest.onBeforeRequest.addListener.yield(_request);

            if (webRequest.onBeforeRequest && webRequest.onBeforeRequest.callback) {
              webRequest.onBeforeRequest.callback(promise);
            }
          }

          if (browser.webRequest.onCompleted.addListener.callCount) {
            const [promise] = browser.webRequest.onCompleted.addListener.yield(_request);

            if (webRequest.onCompleted && webRequest.onCompleted.callback) {
              webRequest.onCompleted.callback(promise);
            }
          }

          if (browser.tabs.onUpdated.addListener.callCount) {
            tab.status = 'complete';
            const [promise] = browser.tabs.onUpdated.addListener.yield(tab.id, {status: 'complete'}, tab);

            if (fakeOptions.tabs && fakeOptions.tabs.onUpdated &&
                fakeOptions.tabs.onUpdated.callback) {
              fakeOptions.tabs.onUpdated.callback(promise);
            }
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