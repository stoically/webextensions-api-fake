const alarms = require('./alarms');
const contextualIdentities = require('./contextualIdentities');
const cookies = require('./cookies');
const extension = require('./extension');
const i18n = require('./i18n');
const runtime = require('./runtime');
const storage = require('./storage');
const tabs = require('./tabs');
const windows = require('./windows');

module.exports = options => {
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