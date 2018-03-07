module.exports = () => {
  return {
    fakeApi(browser) {
      const windows = {
        async getCurrent() {
          return {};
        }
      };
      
      browser.windows.getCurrent.callsFake(windows.getCurrent);
      browser.windows._getCurrent = windows.getCurrent;
    }
  };
};

