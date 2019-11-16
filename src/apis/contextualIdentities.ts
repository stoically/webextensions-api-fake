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
  };
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
      const contextualIdentities = {
        async create(container) {
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
        },

        async remove(cookieStoreId) {
          const containerIndex = _containers.findIndex(container =>
            container.cookieStoreId === cookieStoreId
          );
          if (containerIndex === -1) {
            throw new Error('Couldnt find contextualIdentity');
          }
          const container = Object.assign({}, _containers[containerIndex]);
          _containers.splice(containerIndex, 1);

          if (browser.contextualIdentities.onRemoved.addListener.callCount) {
            browser.contextualIdentities.onRemoved.addListener.yield(container);
          }
        },

        async query(query) {
          return _containers.filter(container => {
            return Object.keys(query).every(key => {
              return container[key] === query[key];
            });
          });
        },

        async get(cookieStoreId) {
          return _containers.find(container => container.cookieStoreId === cookieStoreId);
        }
      };

      browser.contextualIdentities.create.callsFake(contextualIdentities.create);
      browser.contextualIdentities._create = contextualIdentities.create;

      browser.contextualIdentities.remove.callsFake(contextualIdentities.remove);
      browser.contextualIdentities._remove = contextualIdentities.remove;

      browser.contextualIdentities.query.callsFake(contextualIdentities.query);
      browser.contextualIdentities._query = contextualIdentities.query;

      browser.contextualIdentities.get.callsFake(contextualIdentities.get);
      browser.contextualIdentities._get = contextualIdentities.get;
    }
  };
};