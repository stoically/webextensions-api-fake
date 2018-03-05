module.exports = () => {
  return {
    fakeApi(browser) {
      browser.windows.getCurrent.callsFake(async () => {
        return {};
      });
    }
  };
};

