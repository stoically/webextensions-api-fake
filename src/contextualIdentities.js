module.exports = () => {
  // default firefox containers
  const _containerColors = {
    'blue': '#37adff',
    'turquoise': '#00c79a',
    'green': '#51cd00',
    'yellow': '#ffcb00',
    'orange': '#ff9f00',
    'red': '#ff613d',
    'pink': '#ff4bda',
    'purple': '#af51f5',
  }
  const _containers = [{
    color: 'blue',
    colorCode: _containerColors['blue'],
    cookieStoreId: 'firefox-container-1',
    icon: 'fingerprint',
    iconUrl: 'resource://usercontext-content/fingerprint.svg',
    name: 'Personal',
  }, {
    color: 'orange',
    colorCode: _containerColors['orange'],
    cookieStoreId: 'firefox-container-2',
    icon: 'briefcase',
    iconUrl: '"resource://usercontext-content/briefcase.svg"',
    name: 'Work',
  }, {
    color: 'green',
    colorCode: _containerColors['green'],
    cookieStoreId: 'firefox-container-3',
    icon: 'dollar',
    iconUrl: 'resource://usercontext-content/dollar.svg',
    name: 'Banking',
  }, {
    color: 'pink',
    colorCode: _containerColors['pink'],
    cookieStoreId: 'firefox-container-4',
    icon: 'cart',
    iconUrl: 'resource://usercontext-content/cart.svg',
    name: 'Shopping',
  }];
  let _userContextId = 5;

  return {
    fakeApi(browser) {
      browser.contextualIdentities.create.callsFake(async container => {
        const newContainer = {
          color: container.color,
          colorCode: _containerColors[container.color],
          cookieStoreId: `firefox-container-${_userContextId}`,
          icon: container.icon,
          iconUrl: `resource://usercontext-content/${container.icon}.svg`,
          name: container.name,
        };
        _containers.push(newContainer);
        _userContextId++;

        if (browser.contextualIdentities.onCreated.addListener.callCount) {
          browser.contextualIdentities.onCreated.addListener.yield(newContainer);
        }

        return newContainer;
      });
      browser.contextualIdentities.remove.callsFake(async cookieStoreId => {
        const containerIndex = _containers.findIndex(container =>
          container.cookieStoreId === cookieStoreId
        );
        const container = Object.assign({}, _containers[containerIndex]);
        _containers.splice(containerIndex, 1);

        if (browser.contextualIdentities.onRemoved.addListener.callCount) {
          browser.contextualIdentities.onRemoved.addListener.yield(container);
        }
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