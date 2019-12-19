import { BrowserFake } from '../types';

export default (): any => {
  // default firefox containers
  const _containerColors: { [key: string]: string } = {
    blue: '#37adff',
    turquoise: '#00c79a',
    green: '#51cd00',
    yellow: '#ffcb00',
    orange: '#ff9f00',
    red: '#ff613d',
    pink: '#ff4bda',
    purple: '#af51f5',
  };
  const _containers: Array<{ [key: string]: string }> = [
    {
      color: 'blue',
      colorCode: _containerColors['blue'],
      cookieStoreId: 'firefox-container-1',
      icon: 'fingerprint',
      iconUrl: 'resource://usercontext-content/fingerprint.svg',
      name: 'Personal',
    },
    {
      color: 'orange',
      colorCode: _containerColors['orange'],
      cookieStoreId: 'firefox-container-2',
      icon: 'briefcase',
      iconUrl: '"resource://usercontext-content/briefcase.svg"',
      name: 'Work',
    },
    {
      color: 'green',
      colorCode: _containerColors['green'],
      cookieStoreId: 'firefox-container-3',
      icon: 'dollar',
      iconUrl: 'resource://usercontext-content/dollar.svg',
      name: 'Banking',
    },
    {
      color: 'pink',
      colorCode: _containerColors['pink'],
      cookieStoreId: 'firefox-container-4',
      icon: 'cart',
      iconUrl: 'resource://usercontext-content/cart.svg',
      name: 'Shopping',
    },
  ];
  let _userContextId = 5;

  return {
    fakeApi(browser: BrowserFake): void {
      const contextualIdentities = {
        async create(container: any): Promise<any> {
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
            browser.contextualIdentities.onCreated.addListener.yield(
              newContainer
            );
          }

          return newContainer;
        },

        async remove(cookieStoreId: any): Promise<any> {
          const containerIndex = _containers.findIndex(
            container => container.cookieStoreId === cookieStoreId
          );
          if (containerIndex === -1) {
            throw new Error('Couldnt find contextualIdentity');
          }
          const container = Object.assign({}, _containers[containerIndex]);
          _containers.splice(containerIndex, 1);

          if (browser.contextualIdentities.onRemoved.addListener.callCount) {
            browser.contextualIdentities.onRemoved.addListener.yield(container);
          }

          return container;
        },

        async query(query: any): Promise<any> {
          return _containers.filter(container => {
            return Object.keys(query).every(key => {
              return container[key] === query[key];
            });
          });
        },

        async get(cookieStoreId: any): Promise<any> {
          return _containers.find(
            container => container.cookieStoreId === cookieStoreId
          );
        },

        async update(cookieStoreId: any, details: any): Promise<any> {
          const containerIdx = _containers.findIndex(
            container => container.cookieStoreId === cookieStoreId
          );
          if (containerIdx === -1) {
            throw new Error('Container not found');
          }

          _containers[containerIdx] = {
            ..._containers[containerIdx],
            ...details,
          };

          if (browser.contextualIdentities.onUpdated.addListener.callCount) {
            browser.contextualIdentities.onUpdated.addListener.yield({
              contextualIdentity: _containers[containerIdx],
            });
          }

          return _containers[containerIdx];
        },
      };

      browser.contextualIdentities.create.callsFake(
        contextualIdentities.create
      );
      browser.contextualIdentities._create = contextualIdentities.create;

      browser.contextualIdentities.remove.callsFake(
        contextualIdentities.remove
      );
      browser.contextualIdentities._remove = contextualIdentities.remove;

      browser.contextualIdentities.query.callsFake(contextualIdentities.query);
      browser.contextualIdentities._query = contextualIdentities.query;

      browser.contextualIdentities.get.callsFake(contextualIdentities.get);
      browser.contextualIdentities._get = contextualIdentities.get;

      browser.contextualIdentities.update.callsFake(
        contextualIdentities.update
      );
      browser.contextualIdentities._update = contextualIdentities.update;
    },
  };
};
