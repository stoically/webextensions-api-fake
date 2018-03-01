module.exports = () => {
  const _tabs = [];
  let _tabId = 1;

  return {
    fakeApi(browser) {
      browser.tabs.create.callsFake(async tab => {
        tab.id = _tabId;
        _tabs.push(tab);
        _tabId++;
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