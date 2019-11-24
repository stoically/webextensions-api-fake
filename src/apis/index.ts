import alarms from './alarms';
import contextualIdentities from './contextualIdentities';
import cookies from './cookies';
import extension from './extension';
import i18n from './i18n';
import runtime from './runtime';
import storage from './storage';
import tabs from './tabs';
import windows from './windows';

export default (options: any): any => {
  return {
    alarms: alarms(),
    contextualIdentities: contextualIdentities(),
    cookies: cookies(),
    extension: extension(),
    i18n: i18n(options),
    runtime: runtime(),
    storage: storage(),
    tabs: tabs(),
    windows: windows(),
  };
};
