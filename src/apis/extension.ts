module.exports = () => {
  const mozExtProtocol = 'moz-extension:';
  return {
    fakeApi(browser) {
      const extension = {
        getURL(path) {
          if (path.startsWith('//')) {
            return `${mozExtProtocol}${path}`;
          }
          if (path.startsWith('/')) {
            return `${mozExtProtocol}//fake${path}`;
          }
          return `${mozExtProtocol}//fake/${path}`;
        }
      };

      browser.extension.getURL.callsFake(extension.getURL);
      browser.extension._getURL = extension.getURL;
    }
  };
};