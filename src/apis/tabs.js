module.exports = () => {
  const _tabs = [];
  let _tabId = 1;
  let _index = -1;
  let _requestId = 0;
  let _requests = {};
  let _redirects = {};

  return {
    fakeApi(browser) {
      const _tabDefaults = {
        active: true,
        audible: false,
        cookieStoreId: 'firefox-default',
        discarded: false,
        height: 600,
        hidden: false,
        highlighted: true,
        incognito: false,
        isArticle: undefined,
        isInReaderMode: false,
        mutedInfo: {
          muted: false
        },
        pinned: false,
        sharingState: {
          camera: false,
          microphone: false,
          screen: undefined
        },
        status: 'complete',
        title: 'New Tab',
        url: 'about:blank',
        width: 800,
        windowId: browser.windows.WINDOW_ID_CURRENT
      };
      const _requestDefaults = {
        documentUrl: undefined,
        frameAncestors: [],
        frameId: 0,
        ip: null,
        method: 'GET',
        originUrl: undefined,
        parentFrameId: -1,
        proxyInfo: null,
        type: 'main_frame'
      };

      const tabs = {
        async create(createProperties, fake = {}) {
          if (typeof createProperties !== 'object') {
            throw new Error('Incorrect argument types for tabs.create.');
          }
          const tab = {
            id: _tabId,
            lastAccessed: new Date().getTime()
          };
          Object.assign(tab, _tabDefaults, createProperties);
          if (createProperties.openInReaderMode) {
            tab.isInReaderMode = true;
            delete tab.openInReaderMode;
          }
          if (typeof createProperties.index === 'undefined') {
            tab.index = ++_index;
          }
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
          let url = tab.url;
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
            const fakeWebRequestRedirects = fake.options.webRequestRedirects || [];
            const requestPromises = await tabs._fakeWebRequest(tab, fake, url, fakeWebRequestOptions, fakeWebRequestRedirects);
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
            let url = tab.url;
            Object.assign(tab, updateProperties, {url});
            tab.status = 'loading';
            const fakeWebRequestOptions = fake.options.webRequest || {};
            const fakeWebRequestRedirects = fake.options.webRequestRedirects || [];
            promises = await tabs._fakeWebRequest(tab, fake, updateProperties.url, fakeWebRequestOptions, fakeWebRequestRedirects);
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

        async _fakeWebRequest (tab, fake, url, fakeWebRequestOptions, fakeRedirects) {
          let promises = [];

          if (browser.tabs.onUpdated.addListener.callCount) {
            const result = browser.tabs.onUpdated.addListener.yield(tab.id, {
              status: tab.status
            }, tab);
            if (!fake.responses.tabs.onUpdated) {
              fake.responses.tabs.onUpdated = [];
            }
            if (Array.isArray(result)) {
              fake.responses.tabs.onUpdated = fake.responses.tabs.onUpdated.concat(result);
              await Promise.all(result);
            }
            promises = promises.concat(result);
          }

          const request = Object.assign({}, _requestDefaults, {
            tabId: tab.id,
            timeStamp: new Date().getTime(),
            url: url,
          }, fakeWebRequestOptions);
          if (!request.requestId) {
            request.requestId = ++_requestId;
          }
          if (!_requests[tab.id]) {
            _requests[tab.id] = {
              last: request,
              requests: [request]
            };
          } else {
            _requests[tab.id].last = request;
            _requests[tab.id].requests.push(request);
          }
          fake.responses.webRequest.request = request;
          if (browser.webRequest.onBeforeRequest.addListener.callCount) {
            const result = browser.webRequest.onBeforeRequest.addListener.yield(request);
            if (!fake.responses.webRequest.onBeforeRequest) {
              fake.responses.webRequest.onBeforeRequest = [];
            }
            if (Array.isArray(result)) {
              fake.responses.webRequest.onBeforeRequest =
                fake.responses.webRequest.onBeforeRequest.concat(result);
              promises = promises.concat(result);
            }
            if (!fakeRedirects.length && !_redirects[url]) {
              await Promise.all(result);
            } else {
              let redirectPromises = [];
              const redirects = _redirects[url] || fakeRedirects;
              for (const redirectUrl of redirects) {
                const redirectRequest = Object.assign({}, request, {
                  url: redirectUrl
                });
                const result = browser.webRequest.onBeforeRequest.addListener.yield(redirectRequest);
                if (Array.isArray(result)) {
                  fake.responses.webRequest.onBeforeRequest =
                    fake.responses.webRequest.onBeforeRequest.concat(result);
                  redirectPromises = redirectPromises.concat(result);
                }
                url = redirectUrl;
              }
              promises = promises.concat(redirectPromises);
              await Promise.all(promises);
            }
          }

          if (browser.webRequest.onCompleted.addListener.callCount) {
            const result = browser.webRequest.onCompleted.addListener.yield(request);
            fake.responses.webRequest.onCompleted = result;
            await Promise.all(result);
            promises = promises.concat(result);
          }

          tab.url = url;

          if (browser.tabs.onUpdated.addListener.callCount) {
            const result = browser.tabs.onUpdated.addListener.yield(tab.id, {
              status: tab.status,
              url: tab.url
            }, tab);
            if (!fake.responses.tabs.onUpdated) {
              fake.responses.tabs.onUpdated = [];
            }
            if (Array.isArray(result)) {
              fake.responses.tabs.onUpdated = fake.responses.tabs.onUpdated.concat(result);
              await Promise.all(result);
            }
            promises = promises.concat(result);
          }

          tab.status = 'complete';

          if (browser.tabs.onUpdated.addListener.callCount) {
            const result = browser.tabs.onUpdated.addListener.yield(tab.id, {
              status: tab.status
            }, tab);
            if (!fake.responses.tabs.onUpdated) {
              fake.responses.tabs.onUpdated = [];
            }
            if (Array.isArray(result)) {
              fake.responses.tabs.onUpdated = fake.responses.tabs.onUpdated.concat(result);
              await Promise.all(result);
            }
            promises = promises.concat(result);
          }

          return promises;
        },

        async _redirect(tabId, fakeRedirects = [], fakeWebRequest = {}) {
          if (!Array.isArray(fakeRedirects) || !fakeRedirects.length) {
            throw new Error('redirects required for redirect');
          }
          const tab = _tabs[_tabs.findIndex(tab => tab.id === tabId)];
          tab.url = 'about:blank';
          let promises = [];
          let finalUrl;
          for (const url of fakeRedirects) {
            let request = _requestDefaults;
            if (_requests[tab.id]) {
              request = _requests[tab.id].last;
            }
            request = Object.assign({}, request, {
              timeStamp: new Date().getTime(),
            }, fakeWebRequest);
            if (!request.requestId) {
              request.requestId = ++_requestId;
            }
            request.tabId = tab.id;
            request.url = url;
            if (browser.webRequest.onBeforeRequest.addListener.callCount) {
              const result = browser.webRequest.onBeforeRequest.addListener.yield(request);
              if (Array.isArray(result)) {
                promises = promises.concat(result);
              }
            }
            finalUrl = url;
          }

          await Promise.all(promises);
          tab.url = finalUrl;
          return promises;
        },

        _registerRedirects(targetUrl, redirectUrls) {
          _redirects[targetUrl] = redirectUrls;
        },

        _unregisterRedirects(targetUrl) {
          delete _redirects[targetUrl];
        },
      };

      browser.tabs.create.callsFake(tabs.create);
      browser.tabs._create = tabs.create;

      browser.tabs.update.callsFake(tabs.update);
      browser.tabs._update = tabs.update;

      browser.tabs.get.callsFake(tabs.get);
      browser.tabs._get = tabs.get;

      browser.tabs.query.callsFake(tabs.query);
      browser.tabs._query = tabs.query;

      browser.tabs._redirect = tabs._redirect;
      browser.tabs._lastRequestId = () => {
        return _requestId;
      };
      browser.tabs._registerRedirects = tabs._registerRedirects;
      browser.tabs._unregisterRedirects = tabs._unregisterRedirects;
    }
  };
};