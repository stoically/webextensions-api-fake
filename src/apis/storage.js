module.exports = () => {
  const _storage = {};

  return {
    fakeApi(browser) {
      browser.storage.local.get.callsFake(async key => {
        if (!key) {
          return _storage;
        }
        let result = {};
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
      });
      browser.storage.local.set.callsFake(async (key, value) => {
        if (typeof key === 'object') {
          // TODO support nested objects
          Object.keys(key).map(oKey => {
            _storage[oKey] = key[oKey];
          });
        } else {
          _storage[key] = value;
        }
      });
      browser.storage.local.remove.callsFake(async (key) => {
        if (Array.isArray(key)) {
          key.map(aKey => {
            delete _storage[aKey];
          });
        } else {
          delete _storage[key];
        }
      });
    }
  };
};