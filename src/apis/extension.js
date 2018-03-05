module.exports = () => {
  const mozExtProtocol = 'moz-extension:';
  return {
    fakeApi(browser) {
      browser.extension.getURL.callsFake((path) => {
        if (path.startsWith('//')) {
          return `${mozExtProtocol}${path}`;
        }
        if (path.startsWith('/')) {
          return `${mozExtProtocol}//fake${path}`;
        }
        return `${mozExtProtocol}//fake/${path}`;
      });
    }
  };
};