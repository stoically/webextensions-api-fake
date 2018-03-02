module.exports = () => {
  const _containers = [{
    color: 'blue',
    colorCode: '#37ADFF',
    cookieStoreId: 'firefox-container-1',
    icon: 'fingerprint',
    iconUrl: 'iconUrl',
    name: 'Personal',
  }];
  let _userContextId = 5;

  return {
    fakeApi(browser) {
      browser.contextualIdentities.create.callsFake(async container => {
        const newContainer = {
          color: container.color,
          colorCode: '#ffffff',
          cookieStoreId: `firefox-container-${_userContextId}`,
          icon: container.icon,
          iconUrl: 'iconUrl',
          name: container.name,
        };
        _containers.push(newContainer);
        _userContextId++;
        return newContainer;
      });
      browser.contextualIdentities.remove.callsFake(async cookieStoreId => {
        _containers.splice(_containers.findIndex(container =>
          container.cookieStoreId === cookieStoreId
        ), 1);
      });
      browser.contextualIdentities.query.callsFake(async () => {
        return _containers;
      });
      browser.contextualIdentities.get.callsFake(async cookieStoreId => {
        return _containers.filter(container => container.cookieStoreId === cookieStoreId);
      });
    }
  };
};