import { BrowserFake } from '../types';

export default (): any => {
  const _tabs: any = [];
  let _tabId = 0;
  let _index = -1;
  let _requestId = 0;
  const _requests: any = {};
  const _redirects: any = {};

  return {
    fakeApi(browser: BrowserFake): void {
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
          muted: false,
        },
        pinned: false,
        sharingState: {
          camera: false,
          microphone: false,
          screen: undefined,
        },
        status: 'complete',
        title: 'New Tab',
        url: 'about:blank',
        width: 800,
        windowId: browser.windows.WINDOW_ID_CURRENT,
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
        type: 'main_frame',
      };

      const tabs = {
        async create(createProperties: any, fake: any = {}): Promise<any> {
          if (typeof createProperties !== 'object') {
            throw new Error('Incorrect argument types for tabs.create.');
          }
          const tab: any = {
            lastAccessed: new Date().getTime(),
          };
          Object.assign(tab, _tabDefaults, createProperties);
          if (!tab.url) {
            tab.url = 'about:blank';
          }
          if (createProperties.openInReaderMode) {
            tab.isInReaderMode = true;
            delete tab.openInReaderMode;
          }
          if (typeof createProperties.index === 'undefined') {
            tab.index = ++_index;
          }
          _tabs.push(tab);
          if (!tab.id) {
            _tabId++;
            tab.id = _tabId;
          }

          if (!fake.options) {
            fake.options = {};
          }
          if (!fake.responses) {
            fake.responses = {};
          }
          (fake.responses.tabs = {}), (fake.responses.webRequest = {});

          let _networkTab = false;
          let promises: any = [];
          const url = tab.url;
          if (tab.url && !tab.url.startsWith('about:')) {
            tab.url = 'about:blank';
            if (!tab.url.startsWith('moz-ext:')) {
              _networkTab = true;
            }
          }

          if (browser.tabs.onCreated.addListener.callCount) {
            const result = browser.tabs.onCreated.addListener.yield(tab);
            fake.responses.tabs.onCreated = result;
            promises = promises.concat(result);
          }

          tab.status = 'loading';
          if (_networkTab) {
            const fakeWebRequestOptions = fake.options.webRequest || {};
            const fakeWebRequestRedirects =
              fake.options.webRequestRedirects || [];
            const fakeWebRequestDontYield =
              fake.options.webRequestDontYield || [];
            const fakeWebRequestError = fake.options.webRequestError || false;
            const requestPromises = await tabs._fakeWebRequest(
              tab,
              fake,
              url,
              fakeWebRequestOptions,
              fakeWebRequestRedirects,
              fakeWebRequestDontYield,
              fakeWebRequestError
            );
            promises = promises.concat(requestPromises);
          } else if (tab.url !== url) {
            tab.url = url;
            if (browser.tabs.onUpdated.addListener.callCount) {
              const result = browser.tabs.onUpdated.addListener.yield(
                tab.id,
                { status: tab.status, url: tab.url },
                tab
              );
              fake.responses.tabs.onUpdated = result;
              promises = promises.concat(result);

              tab.status = 'complete';

              const resultComplete = browser.tabs.onUpdated.addListener.yield(
                tab.id,
                { status: tab.status },
                tab
              );
              fake.responses.tabs.onUpdated.concat(resultComplete);
              promises = promises.concat(resultComplete);
            } else if (createProperties.status === undefined) {
              tab.status = 'complete';
            }
          }

          fake.responses.promises = promises;
          await Promise.all(promises);

          return tab;
        },

        async update(
          tabId: any,
          updateProperties: any,
          fake: any = {}
        ): Promise<any> {
          const tab = _tabs.find((tab: any) => tab.id === tabId);
          if (!tab) {
            throw new Error('Tab not found');
          }

          if (!fake.options) {
            fake.options = {};
          }
          if (!fake.responses) {
            fake.responses = {};
          }
          (fake.responses.tabs = {}), (fake.responses.webRequest = {});

          let promises: any = [];
          if (
            updateProperties.url &&
            !updateProperties.url.startsWith('about:') &&
            !updateProperties.url.startsWith('moz-ext:')
          ) {
            const url = tab.url;
            Object.assign(tab, updateProperties, { url });
            tab.status = 'loading';
            const fakeWebRequestOptions = fake.options.webRequest || {};
            const fakeWebRequestRedirects =
              fake.options.webRequestRedirects || [];
            const fakeWebRequestDontYield =
              fake.options.webRequestDontYield || [];
            const fakeWebRequestError = fake.options.webRequestError || false;
            promises = await tabs._fakeWebRequest(
              tab,
              fake,
              updateProperties.url,
              fakeWebRequestOptions,
              fakeWebRequestRedirects,
              fakeWebRequestDontYield,
              fakeWebRequestError
            );
          } else {
            Object.assign(tab, updateProperties);
          }

          fake.responses.promises = promises;
          await Promise.all(promises);

          return tab;
        },

        async get(tabId: any): Promise<any> {
          const tab = _tabs.find((tab: any) => tab.id === tabId);
          if (!tab) {
            throw new Error('Tab not found');
          }
          return tab;
        },

        async query(query: any): Promise<any> {
          return _tabs.filter((tab: any) => {
            return Object.keys(query).every(key => {
              if (key === 'currentWindow') {
                return (
                  (tab.windowId === browser.windows.WINDOW_ID_CURRENT) ===
                  query[key]
                );
              }
              return tab[key] === query[key];
            });
          });
        },

        async remove(tabId: any): Promise<any> {
          const removeTab = (tabId: any): any => {
            const tabIndex = _tabs.findIndex((tab: any) => tab.id === tabId);
            if (tabIndex === -1) {
              throw new Error('Couldnt find Tab');
            }
            const tab = Object.assign({}, _tabs[tabIndex]);
            _tabs.splice(tabIndex, 1);

            if (browser.tabs.onRemoved.addListener.callCount) {
              browser.tabs.onRemoved.addListener.yield(tab.id);
            }
          };

          if (Array.isArray(tabId)) {
            tabId.map(id => removeTab(id));
          } else {
            removeTab(tabId);
          }
        },

        async _fakeWebRequest(
          tab: any,
          fake: any,
          url: any,
          fakeWebRequestOptions: any,
          fakeRedirects: any,
          fakeDontYield: any,
          fakeError: any
        ): Promise<any> {
          let promises: any = [];

          if (
            browser.tabs.onUpdated.addListener.callCount &&
            (!fakeDontYield || !fakeDontYield.includes('onUpdated'))
          ) {
            const result: any = browser.tabs.onUpdated.addListener.yield(
              tab.id,
              {
                status: tab.status,
              },
              tab
            );
            if (!fake.responses.tabs.onUpdated) {
              fake.responses.tabs.onUpdated = [];
            }
            if (Array.isArray(result)) {
              fake.responses.tabs.onUpdated = fake.responses.tabs.onUpdated.concat(
                result
              );
              await Promise.all(result);
            }
            promises = promises.concat(result);
          }

          const request = Object.assign(
            {},
            _requestDefaults,
            {
              tabId: tab.id,
              timeStamp: new Date().getTime(),
              url,
            },
            fakeWebRequestOptions
          );
          if (!request.requestId) {
            request.requestId = ++_requestId;
          }
          if (!_requests[tab.id]) {
            _requests[tab.id] = {
              last: request,
              requests: [request],
            };
          } else {
            _requests[tab.id].last = request;
            _requests[tab.id].requests.push(request);
          }
          fake.responses.webRequest.request = request;
          if (
            browser.webRequest.onBeforeRequest.addListener.callCount &&
            (!fakeDontYield || !fakeDontYield.includes('onBeforeRequest'))
          ) {
            const result: any = browser.webRequest.onBeforeRequest.addListener.yield(
              request
            );
            if (!fake.responses.webRequest.onBeforeRequest) {
              fake.responses.webRequest.onBeforeRequest = [];
            }
            if (Array.isArray(result)) {
              fake.responses.webRequest.onBeforeRequest = fake.responses.webRequest.onBeforeRequest.concat(
                result
              );
              promises = promises.concat(result);
            }
            if (!fake.options.instantRedirects) {
              await Promise.all(result);
            }
            if (fakeRedirects.length || _redirects[url]) {
              let lastRedirectUrl = false;
              let redirectPromises: any = [];
              const redirects = _redirects[url] || fakeRedirects;
              for (let redirectUrl of redirects) {
                let redirectRequest;
                if (typeof redirectUrl === 'object') {
                  redirectRequest = Object.assign(
                    {},
                    request,
                    redirectUrl.webRequest
                  );
                  redirectRequest.url = redirectUrl.url;
                  redirectUrl = redirectUrl.url;
                } else {
                  redirectRequest = Object.assign({}, request, {
                    url: redirectUrl,
                  });
                }

                if (lastRedirectUrl) {
                  tab.url = lastRedirectUrl;
                }
                const result = browser.webRequest.onBeforeRequest.addListener.yield(
                  redirectRequest
                );
                if (Array.isArray(result)) {
                  fake.responses.webRequest.onBeforeRequest = fake.responses.webRequest.onBeforeRequest.concat(
                    result
                  );
                  redirectPromises = redirectPromises.concat(result);
                }

                url = lastRedirectUrl = redirectUrl;
                if (!fake.options.instantRedirects) {
                  await Promise.all(redirectPromises);
                }
              }
              promises = promises.concat(redirectPromises);
              await Promise.all(promises);
            }
          }

          if (
            browser.webRequest.onBeforeSendHeaders.addListener.callCount &&
            (!fakeDontYield || !fakeDontYield.includes('onBeforeSendHeaders'))
          ) {
            const result = browser.webRequest.onBeforeSendHeaders.addListener.yield(
              request
            );
            if (!fake.responses.webRequest.onBeforeSendHeaders) {
              fake.responses.webRequest.onBeforeSendHeaders = [];
            }
            if (Array.isArray(result)) {
              fake.responses.webRequest.onBeforeSendHeaders = fake.responses.webRequest.onBeforeSendHeaders.concat(
                result
              );
              promises = promises.concat(result);
            }
            await Promise.all(promises);
          }

          if (!fakeError) {
            if (
              browser.webRequest.onCompleted.addListener.callCount &&
              (!fakeDontYield || !fakeDontYield.includes('onCompleted'))
            ) {
              const result: any = browser.webRequest.onCompleted.addListener.yield(
                request
              );
              fake.responses.webRequest.onCompleted = result;
              await Promise.all(result);
              promises = promises.concat(result);
            }
          } else {
            if (
              browser.webRequest.onErrorOccurred.addListener.callCount &&
              (!fakeDontYield || !fakeDontYield.includes('onErrorOccurred'))
            ) {
              const result: any = browser.webRequest.onErrorOccurred.addListener.yield(
                request
              );
              fake.responses.webRequest.onErrorOccurred = result;
              await Promise.all(result);
              promises = promises.concat(result);
            }
          }

          tab.url = url;

          if (
            browser.tabs.onUpdated.addListener.callCount &&
            (!fakeDontYield || !fakeDontYield.includes('onUpdated'))
          ) {
            const result: any = browser.tabs.onUpdated.addListener.yield(
              tab.id,
              {
                status: tab.status,
                url: tab.url,
              },
              tab
            );
            if (!fake.responses.tabs.onUpdated) {
              fake.responses.tabs.onUpdated = [];
            }
            if (Array.isArray(result)) {
              fake.responses.tabs.onUpdated = fake.responses.tabs.onUpdated.concat(
                result
              );
              await Promise.all(result);
            }
            promises = promises.concat(result);
          }

          tab.status = 'complete';

          if (
            browser.tabs.onUpdated.addListener.callCount &&
            (!fakeDontYield || !fakeDontYield.includes('onUpdated'))
          ) {
            const result: any = browser.tabs.onUpdated.addListener.yield(
              tab.id,
              {
                status: tab.status,
              },
              tab
            );
            if (!fake.responses.tabs.onUpdated) {
              fake.responses.tabs.onUpdated = [];
            }
            if (Array.isArray(result)) {
              fake.responses.tabs.onUpdated = fake.responses.tabs.onUpdated.concat(
                result
              );
              await Promise.all(result);
            }
            promises = promises.concat(result);
          }

          return promises;
        },

        async _redirect(
          tabId: any,
          fakeRedirects: any = [],
          fakeWebRequest: any = {}
        ): Promise<any> {
          if (!Array.isArray(fakeRedirects) || !fakeRedirects.length) {
            throw new Error('redirects required for redirect');
          }
          const tab = _tabs[_tabs.findIndex((tab: any) => tab.id === tabId)];
          tab.url = 'about:blank';
          let promises: any = [];
          let finalUrl;
          for (let url of fakeRedirects) {
            let request: any = _requestDefaults;
            if (_requests[tab.id]) {
              request = _requests[tab.id].last;
            }
            request = Object.assign(
              {},
              request,
              {
                timeStamp: new Date().getTime(),
              },
              fakeWebRequest
            );

            if (typeof url === 'object') {
              Object.assign(request, url.webRequest);
              url = url.url;
            }

            if (!request.requestId) {
              request.requestId = ++_requestId;
            }
            request.tabId = tab.id;
            request.url = url;
            if (browser.webRequest.onBeforeRequest.addListener.callCount) {
              const result = browser.webRequest.onBeforeRequest.addListener.yield(
                request
              );
              if (Array.isArray(result)) {
                promises = promises.concat(result);
              }
              await result;
            }
            finalUrl = url;
          }

          tab.url = finalUrl;
          await Promise.all(promises);
          return promises;
        },

        async _navigate(
          tabId: any,
          url: any,
          fakeWebRequest: any = {}
        ): Promise<any> {
          const tab: any = tabs.get(tabId);
          const request = Object.assign(
            {},
            _requestDefaults,
            {
              tabId,
              url,
              timeStamp: new Date().getTime(),
            },
            fakeWebRequest
          );

          if (!request.requestId) {
            request.requestId = ++_requestId;
          }

          const results: any = {};
          if (browser.webRequest.onBeforeRequest.addListener.callCount) {
            results.onBeforeRequest = browser.webRequest.onBeforeRequest.addListener.yield(
              request
            );
            await Promise.all(results.onBeforeRequest);
          }

          if (browser.webRequest.onBeforeSendHeaders.addListener.callCount) {
            results.onBeforeSendHeaders = browser.webRequest.onBeforeSendHeaders.addListener.yield(
              request
            );
            await Promise.all(results.onBeforeSendHeaders);
          }

          tab.url = url;
          return results;
        },

        _registerRedirects(targetUrl: any, redirectUrls: any): void {
          _redirects[targetUrl] = redirectUrls;
        },

        _unregisterRedirects(targetUrl: any): void {
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

      browser.tabs.remove.callsFake(tabs.remove);
      browser.tabs._remove = tabs.remove;

      browser.tabs._navigate = tabs._navigate;
      browser.tabs._redirect = tabs._redirect;
      browser.tabs._lastRequestId = (): number => {
        return _requestId;
      };
      browser.tabs._registerRedirects = tabs._registerRedirects;
      browser.tabs._unregisterRedirects = tabs._unregisterRedirects;
    },
  };
};
