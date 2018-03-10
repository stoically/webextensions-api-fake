module.exports = () => {
  const _tabs = [];
  let _tabId = 1;
  let _requestId = 1;

  return {
    fakeApi(browser) {
      const _tabDefaults = {
        active: true,
        cookieStoreId: 'firefox-default',
        openInReaderMode: false,
        pinned: false,
        windowId: browser.windows.WINDOW_ID_CURRENT
      };
      const tabs = {
        async create(createProperties, fake = {}) {
          const tab = Object.assign({}, _tabDefaults, createProperties);
          tab.id = _tabId;
          _tabs.push(tab);
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
          let promises = [];
          const url = tab.url;
          tab.status = 'complete';
          if (tab.url && !tab.url.startsWith('about:') && !tab.url.startsWith('moz-ext:')) {
            _networkTab = true;
            tab.status = 'loading';
            tab.url = 'about:blank';
          }

          if (browser.tabs.onCreated.addListener.callCount) {
            const result = browser.tabs.onCreated.addListener.yield(tab);
            fake.responses.tabs.onCreated = result;
            promises = promises.concat(result);
          }

          if (_networkTab) {
            const fakeWebRequestOptions = fake.options.webRequest || {};
            const requestPromises = await tabs._fakeWebRequest(tab, fake, url, browser, fakeWebRequestOptions);
            promises = promises.concat(requestPromises);
          }

          fake.responses.promises = promises;
          await Promise.all(promises);

          return tab;
        },

        async update(tabId, updateProperties, fake = {}) {
          let tab = _tabs.find(tab => tab.id === tabId);
          if (!tab) {
            throw new Error('Tab not found');
          }

          if (!fake.options) {
            fake.options = {};
          }
          if (!fake.responses) {
            fake.responses = {};
          }
          fake.responses.tabs = {},
          fake.responses.webRequest = {};

          let promises;
          if (updateProperties.url &&
              !updateProperties.url.startsWith('about:') &&
              !updateProperties.url.startsWith('moz-ext:')) {
            const url = tab.url;
            Object.assign(tab, updateProperties, {url});
            tab.status = 'loading';
            const fakeWebRequestOptions = fake.options.webRequest || {};
            promises = await tabs._fakeWebRequest(tab, fake, updateProperties.url, browser, fakeWebRequestOptions);
          } else {
            Object.assign(tab, updateProperties);
          }

          fake.responses.promises = promises;
          await Promise.all(promises);

          return tab;
        },

        async get(tabId) {
          const tab = _tabs.find(tab => tab.id === tabId);
          if (!tab) {
            throw new Error('Tab not found');
          }
          return tab;
        },

        async query(query) {
          const tabs = _tabs.filter(tab => {
            return Object.keys(query).every(key => {
              if (key === 'currentWindow') {
                return (tab.windowId === browser.windows.WINDOW_ID_CURRENT) === query[key];
              }
              return tab[key] === query[key];
            });
          });
          return tabs;
        },

        async _fakeWebRequest (tab, fake, url, browser, fakeWebRequestOptions) {
          let promises = [];
          const _request = {
            frameId: fakeWebRequestOptions.frameId || 0,
            tabId: fakeWebRequestOptions.tabId || tab.id,
            url: fakeWebRequestOptions.url || url,
            requestId: fakeWebRequestOptions.requestId || _requestId++
          };
          if (browser.webRequest.onBeforeRequest.addListener.callCount) {
            const result = browser.webRequest.onBeforeRequest.addListener.yield(_request);
            fake.responses.webRequest.onBeforeRequest = result;
            await Promise.all(result);
            promises = promises.concat(result);
          }

          tab.status = 'complete';
          tab.url = url;

          if (browser.webRequest.onCompleted.addListener.callCount) {
            const result = browser.webRequest.onCompleted.addListener.yield(_request);
            fake.responses.webRequest.onCompleted = result;
            await Promise.all(result);
            promises = promises.concat(result);
          }

          if (browser.tabs.onUpdated.addListener.callCount) {
            const result = browser.tabs.onUpdated.addListener.yield(tab.id, {status: 'complete'}, tab);
            fake.responses.tabs.onUpdated = result;
            await Promise.all(result);
            promises = promises.concat(result);
          }

          return promises;
        }
      };

      browser.tabs.create.callsFake(tabs.create);
      browser.tabs._create = tabs.create;

      browser.tabs.update.callsFake(tabs.update);
      browser.tabs._update = tabs.update;

      browser.tabs.get.callsFake(tabs.get);
      browser.tabs._get = tabs.get;

      browser.tabs.query.callsFake(tabs.query);
      browser.tabs._query = tabs.query;
    }
  };
};