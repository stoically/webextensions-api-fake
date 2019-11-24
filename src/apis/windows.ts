import { BrowserFake } from '../types';

export default (): any => {
  return {
    fakeApi(browser: BrowserFake): void {
      const windows = {
        async getCurrent(): Promise<any> {
          return {};
        },
      };

      browser.windows.getCurrent.callsFake(windows.getCurrent);
      browser.windows._getCurrent = windows.getCurrent;
    },
  };
};
