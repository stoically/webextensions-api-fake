import { BrowserFake } from '../types';

export default (): any => {
  const mozExtProtocol = 'moz-extension:';
  return {
    fakeApi(browser: BrowserFake): void {
      const extension = {
        getURL(path: string): string {
          if (path.startsWith('//')) {
            return `${mozExtProtocol}${path}`;
          }
          if (path.startsWith('/')) {
            return `${mozExtProtocol}//fake${path}`;
          }
          return `${mozExtProtocol}//fake/${path}`;
        },
      };

      browser.extension.getURL.callsFake(extension.getURL);
      browser.extension._getURL = extension.getURL;
    },
  };
};
