export default (): any => {
  const _storage: {
    [key: string]: string;
  } = {};

  return {
    fakeApi(browser: any): void {
      const storage = {
        async get(key: any): Promise<any> {
          if (!key) {
            return _storage;
          }
          const result: {
            [key: string]: string;
          } = {};
          if (Array.isArray(key)) {
            key.map(akey => {
              if (typeof _storage[akey] !== 'undefined') {
                result[akey] = _storage[akey];
              }
            });
          } else if (typeof key === 'object') {
            // TODO support nested objects
            Object.keys(key).map(oKey => {
              if (typeof _storage[oKey] !== 'undefined') {
                result[oKey] = _storage[oKey];
              } else {
                result[oKey] = key[oKey];
              }
            });
          } else {
            result[key] = _storage[key];
          }
          return result;
        },

        async set(key: any, value: any): Promise<any> {
          if (typeof key === 'object') {
            // TODO support nested objects
            Object.keys(key).map(oKey => {
              _storage[oKey] = key[oKey];
            });
          } else {
            _storage[key] = value;
          }
        },

        async remove(key: any): Promise<any> {
          if (Array.isArray(key)) {
            key.map(aKey => {
              delete _storage[aKey];
            });
          } else {
            delete _storage[key];
          }
        },
      };

      browser.storage.local.get.callsFake(storage.get);
      browser.storage.local._get = storage.get;

      browser.storage.local.set.callsFake(storage.set);
      browser.storage.local._set = storage.set;

      browser.storage.local.remove.callsFake(storage.remove);
      browser.storage.local._remove = storage.remove;
    },
  };
};
