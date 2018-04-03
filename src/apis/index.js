const contextualIdentities = require('./contextualIdentities');
const cookies = require('./cookies');
const extension = require('./extension');
const runtime = require('./runtime');
const storage = require('./storage');
const tabs = require('./tabs');
const windows = require('./windows');

module.exports = () => {
  return {
    contextualIdentities: contextualIdentities(),
    cookies: cookies(),
    extension: extension(),
    runtime: runtime(),
    storage: storage(),
    tabs: tabs(),
    windows: windows(),
  };
};