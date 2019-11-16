/* eslint-disable @typescript-eslint/class-name-casing */
/// <reference types="sinon"/>
/// <reference types="firefox-webext-browser"/>

export interface SinonEventStub {
  addListener: sinon.SinonStub;
  removeListener: sinon.SinonStub;
  hasListener: sinon.SinonStub;
}

export interface ActivityLog {
  onExtensionActivity: SinonEventStub;
}
export interface Alarms {
  onAlarm: SinonEventStub;
  create: sinon.SinonStub;
  get: sinon.SinonStub;
  getAll: sinon.SinonStub;
  clear: sinon.SinonStub;
  clearAll: sinon.SinonStub;
}
export interface Bookmarks {
  onCreated: SinonEventStub;
  onRemoved: SinonEventStub;
  onChanged: SinonEventStub;
  onMoved: SinonEventStub;
  onChildrenReordered: SinonEventStub;
  onImportBegan: SinonEventStub;
  onImportEnded: SinonEventStub;
  get: sinon.SinonStub;
  getChildren: sinon.SinonStub;
  getRecent: sinon.SinonStub;
  getTree: sinon.SinonStub;
  getSubTree: sinon.SinonStub;
  search: sinon.SinonStub;
  create: sinon.SinonStub;
  move: sinon.SinonStub;
  update: sinon.SinonStub;
  remove: sinon.SinonStub;
  removeTree: sinon.SinonStub;
  import: sinon.SinonStub;
  export: sinon.SinonStub;
}
export interface BrowserAction {
  onClicked: SinonEventStub;
  setTitle: sinon.SinonStub;
  getTitle: sinon.SinonStub;
  setIcon: sinon.SinonStub;
  setPopup: sinon.SinonStub;
  getPopup: sinon.SinonStub;
  setBadgeText: sinon.SinonStub;
  getBadgeText: sinon.SinonStub;
  setBadgeBackgroundColor: sinon.SinonStub;
  getBadgeBackgroundColor: sinon.SinonStub;
  setBadgeTextColor: sinon.SinonStub;
  getBadgeTextColor: sinon.SinonStub;
  enable: sinon.SinonStub;
  disable: sinon.SinonStub;
  isEnabled: sinon.SinonStub;
  openPopup: sinon.SinonStub;
}
export interface BrowserSettings {}
export interface BrowsingData {
  settings: sinon.SinonStub;
  remove: sinon.SinonStub;
  removeAppcache: sinon.SinonStub;
  removeCache: sinon.SinonStub;
  removeCookies: sinon.SinonStub;
  removeDownloads: sinon.SinonStub;
  removeFileSystems: sinon.SinonStub;
  removeFormData: sinon.SinonStub;
  removeHistory: sinon.SinonStub;
  removeIndexedDB: sinon.SinonStub;
  removeLocalStorage: sinon.SinonStub;
  removePluginData: sinon.SinonStub;
  removePasswords: sinon.SinonStub;
  removeWebSQL: sinon.SinonStub;
}
export interface CaptivePortal {
  onStateChanged: SinonEventStub;
  onConnectivityAvailable: SinonEventStub;
  getState: sinon.SinonStub;
  getLastChecked: sinon.SinonStub;
}
export interface Clipboard {
  setImageData: sinon.SinonStub;
}
export interface Commands {
  onCommand: SinonEventStub;
  update: sinon.SinonStub;
  reset: sinon.SinonStub;
  getAll: sinon.SinonStub;
}
export interface ContentScripts {
  register: sinon.SinonStub;
}
export interface ContextMenus {
  onClicked: SinonEventStub;
  onShown: SinonEventStub;
  onHidden: SinonEventStub;
  create: sinon.SinonStub;
  update: sinon.SinonStub;
  remove: sinon.SinonStub;
  removeAll: sinon.SinonStub;
  overrideContext: sinon.SinonStub;
  refresh: sinon.SinonStub;
}
export interface ContextualIdentities {
  onUpdated: SinonEventStub;
  onCreated: SinonEventStub;
  onRemoved: SinonEventStub;
  get: sinon.SinonStub;
  query: sinon.SinonStub;
  create: sinon.SinonStub;
  update: sinon.SinonStub;
  remove: sinon.SinonStub;
}
export interface Cookies {
  onChanged: SinonEventStub;
  get: sinon.SinonStub;
  getAll: sinon.SinonStub;
  set: sinon.SinonStub;
  remove: sinon.SinonStub;
  getAllCookieStores: sinon.SinonStub;
}
export interface Devtools {}
export interface DevtoolsInspectedWindow {
  onResourceAdded: SinonEventStub;
  onResourceContentCommitted: SinonEventStub;
  eval: sinon.SinonStub;
  reload: sinon.SinonStub;
  getResources: sinon.SinonStub;
}
export interface DevtoolsNetwork {
  onRequestFinished: SinonEventStub;
  onNavigated: SinonEventStub;
  getHAR: sinon.SinonStub;
}
export interface DevtoolsPanels {
  onThemeChanged: SinonEventStub;
  create: sinon.SinonStub;
  setOpenResourceHandler: sinon.SinonStub;
  openResource: sinon.SinonStub;
}
export interface Dns {
  resolve: sinon.SinonStub;
}
export interface Downloads {
  onCreated: SinonEventStub;
  onErased: SinonEventStub;
  onChanged: SinonEventStub;
  download: sinon.SinonStub;
  search: sinon.SinonStub;
  pause: sinon.SinonStub;
  resume: sinon.SinonStub;
  cancel: sinon.SinonStub;
  getFileIcon: sinon.SinonStub;
  open: sinon.SinonStub;
  show: sinon.SinonStub;
  showDefaultFolder: sinon.SinonStub;
  erase: sinon.SinonStub;
  removeFile: sinon.SinonStub;
  acceptDanger: sinon.SinonStub;
  drag: sinon.SinonStub;
  setShelfEnabled: sinon.SinonStub;
}
export interface Events {}
export interface Experiments {}
export interface Extension {
  onRequest: SinonEventStub;
  onRequestExternal: SinonEventStub;
  getURL: sinon.SinonStub;
  getViews: sinon.SinonStub;
  getBackgroundPage: sinon.SinonStub;
  isAllowedIncognitoAccess: sinon.SinonStub;
  isAllowedFileSchemeAccess: sinon.SinonStub;
  setUpdateUrlData: sinon.SinonStub;
}
export interface ExtensionTypes {}
export interface Find {
  find: sinon.SinonStub;
  highlightResults: sinon.SinonStub;
  removeHighlighting: sinon.SinonStub;
}
export interface GeckoProfiler {
  onRunning: SinonEventStub;
  start: sinon.SinonStub;
  stop: sinon.SinonStub;
  pause: sinon.SinonStub;
  resume: sinon.SinonStub;
  dumpProfileToFile: sinon.SinonStub;
  getProfile: sinon.SinonStub;
  getProfileAsArrayBuffer: sinon.SinonStub;
  getProfileAsGzippedArrayBuffer: sinon.SinonStub;
  getSymbols: sinon.SinonStub;
}
export interface History {
  onVisited: SinonEventStub;
  onVisitRemoved: SinonEventStub;
  onTitleChanged: SinonEventStub;
  search: sinon.SinonStub;
  getVisits: sinon.SinonStub;
  addUrl: sinon.SinonStub;
  deleteUrl: sinon.SinonStub;
  deleteRange: sinon.SinonStub;
  deleteAll: sinon.SinonStub;
}
export interface I18n {
  getAcceptLanguages: sinon.SinonStub;
  getMessage: sinon.SinonStub;
  getUILanguage: sinon.SinonStub;
  detectLanguage: sinon.SinonStub;
}
export interface Identity {
  onSignInChanged: SinonEventStub;
  getAccounts: sinon.SinonStub;
  getAuthToken: sinon.SinonStub;
  getProfileUserInfo: sinon.SinonStub;
  removeCachedAuthToken: sinon.SinonStub;
  launchWebAuthFlow: sinon.SinonStub;
  getRedirectURL: sinon.SinonStub;
}
export interface Idle {
  onStateChanged: SinonEventStub;
  queryState: sinon.SinonStub;
  setDetectionInterval: sinon.SinonStub;
}
export interface Management {
  onDisabled: SinonEventStub;
  onEnabled: SinonEventStub;
  onInstalled: SinonEventStub;
  onUninstalled: SinonEventStub;
  getAll: sinon.SinonStub;
  get: sinon.SinonStub;
  install: sinon.SinonStub;
  getSelf: sinon.SinonStub;
  uninstallSelf: sinon.SinonStub;
  setEnabled: sinon.SinonStub;
}
export interface Menus {
  onClicked: SinonEventStub;
  onShown: SinonEventStub;
  onHidden: SinonEventStub;
  create: sinon.SinonStub;
  update: sinon.SinonStub;
  remove: sinon.SinonStub;
  removeAll: sinon.SinonStub;
  overrideContext: sinon.SinonStub;
  refresh: sinon.SinonStub;
}
export interface NetworkStatus {
  onConnectionChanged: SinonEventStub;
  getLinkInfo: sinon.SinonStub;
}
export interface NormandyAddonStudy {
  onUnenroll: SinonEventStub;
  getStudy: sinon.SinonStub;
  endStudy: sinon.SinonStub;
  getClientMetadata: sinon.SinonStub;
}
export interface Notifications {
  onClosed: SinonEventStub;
  onClicked: SinonEventStub;
  onButtonClicked: SinonEventStub;
  onPermissionLevelChanged: SinonEventStub;
  onShowSettings: SinonEventStub;
  onShown: SinonEventStub;
  create: sinon.SinonStub;
  update: sinon.SinonStub;
  clear: sinon.SinonStub;
  getAll: sinon.SinonStub;
  getPermissionLevel: sinon.SinonStub;
}
export interface Omnibox {
  onInputStarted: SinonEventStub;
  onInputChanged: SinonEventStub;
  onInputEntered: SinonEventStub;
  onInputCancelled: SinonEventStub;
  setDefaultSuggestion: sinon.SinonStub;
}
export interface PageAction {
  onClicked: SinonEventStub;
  show: sinon.SinonStub;
  hide: sinon.SinonStub;
  isShown: sinon.SinonStub;
  setTitle: sinon.SinonStub;
  getTitle: sinon.SinonStub;
  setIcon: sinon.SinonStub;
  setPopup: sinon.SinonStub;
  getPopup: sinon.SinonStub;
  openPopup: sinon.SinonStub;
}
export interface Permissions {
  onAdded: SinonEventStub;
  onRemoved: SinonEventStub;
  getAll: sinon.SinonStub;
  contains: sinon.SinonStub;
  request: sinon.SinonStub;
  remove: sinon.SinonStub;
}
export interface Pkcs11 {
  isModuleInstalled: sinon.SinonStub;
  installModule: sinon.SinonStub;
  uninstallModule: sinon.SinonStub;
  getModuleSlots: sinon.SinonStub;
}
export interface Privacy {}
export interface PrivacyNetwork {}
export interface PrivacyServices {}
export interface PrivacyWebsites {}
export interface Proxy {
  onRequest: SinonEventStub;
  onError: SinonEventStub;
  onProxyError: SinonEventStub;
  register: sinon.SinonStub;
  unregister: sinon.SinonStub;
  registerProxyScript: sinon.SinonStub;
}
export interface Runtime {
  onStartup: SinonEventStub;
  onInstalled: SinonEventStub;
  onSuspend: SinonEventStub;
  onSuspendCanceled: SinonEventStub;
  onUpdateAvailable: SinonEventStub;
  onBrowserUpdateAvailable: SinonEventStub;
  onConnect: SinonEventStub;
  onConnectExternal: SinonEventStub;
  onMessage: SinonEventStub;
  onMessageExternal: SinonEventStub;
  onRestartRequired: SinonEventStub;
  getBackgroundPage: sinon.SinonStub;
  openOptionsPage: sinon.SinonStub;
  getManifest: sinon.SinonStub;
  getURL: sinon.SinonStub;
  setUninstallURL: sinon.SinonStub;
  reload: sinon.SinonStub;
  requestUpdateCheck: sinon.SinonStub;
  restart: sinon.SinonStub;
  connect: sinon.SinonStub;
  connectNative: sinon.SinonStub;
  sendMessage: sinon.SinonStub;
  sendNativeMessage: sinon.SinonStub;
  getBrowserInfo: sinon.SinonStub;
  getPlatformInfo: sinon.SinonStub;
  getPackageDirectoryEntry: sinon.SinonStub;
}
export interface Search {
  get: sinon.SinonStub;
  search: sinon.SinonStub;
}
export interface Sessions {
  onChanged: SinonEventStub;
  forgetClosedTab: sinon.SinonStub;
  forgetClosedWindow: sinon.SinonStub;
  getRecentlyClosed: sinon.SinonStub;
  getDevices: sinon.SinonStub;
  restore: sinon.SinonStub;
  setTabValue: sinon.SinonStub;
  getTabValue: sinon.SinonStub;
  removeTabValue: sinon.SinonStub;
  setWindowValue: sinon.SinonStub;
  getWindowValue: sinon.SinonStub;
  removeWindowValue: sinon.SinonStub;
}
export interface SidebarAction {
  setTitle: sinon.SinonStub;
  getTitle: sinon.SinonStub;
  setIcon: sinon.SinonStub;
  setPanel: sinon.SinonStub;
  getPanel: sinon.SinonStub;
  open: sinon.SinonStub;
  close: sinon.SinonStub;
  isOpen: sinon.SinonStub;
}
export interface Storage {
  onChanged: SinonEventStub;
}
export interface Tabs {
  onCreated: SinonEventStub;
  onUpdated: SinonEventStub;
  onMoved: SinonEventStub;
  onSelectionChanged: SinonEventStub;
  onActiveChanged: SinonEventStub;
  onActivated: SinonEventStub;
  onHighlightChanged: SinonEventStub;
  onHighlighted: SinonEventStub;
  onDetached: SinonEventStub;
  onAttached: SinonEventStub;
  onRemoved: SinonEventStub;
  onReplaced: SinonEventStub;
  onZoomChange: SinonEventStub;
  get: sinon.SinonStub;
  getCurrent: sinon.SinonStub;
  connect: sinon.SinonStub;
  sendRequest: sinon.SinonStub;
  sendMessage: sinon.SinonStub;
  getSelected: sinon.SinonStub;
  getAllInWindow: sinon.SinonStub;
  create: sinon.SinonStub;
  duplicate: sinon.SinonStub;
  query: sinon.SinonStub;
  highlight: sinon.SinonStub;
  update: sinon.SinonStub;
  move: sinon.SinonStub;
  reload: sinon.SinonStub;
  remove: sinon.SinonStub;
  discard: sinon.SinonStub;
  detectLanguage: sinon.SinonStub;
  toggleReaderMode: sinon.SinonStub;
  captureTab: sinon.SinonStub;
  captureVisibleTab: sinon.SinonStub;
  executeScript: sinon.SinonStub;
  insertCSS: sinon.SinonStub;
  removeCSS: sinon.SinonStub;
  setZoom: sinon.SinonStub;
  getZoom: sinon.SinonStub;
  setZoomSettings: sinon.SinonStub;
  getZoomSettings: sinon.SinonStub;
  print: sinon.SinonStub;
  printPreview: sinon.SinonStub;
  saveAsPDF: sinon.SinonStub;
  show: sinon.SinonStub;
  hide: sinon.SinonStub;
  moveInSuccession: sinon.SinonStub;
}
export interface Telemetry {
  submitPing: sinon.SinonStub;
  canUpload: sinon.SinonStub;
  scalarAdd: sinon.SinonStub;
  scalarSet: sinon.SinonStub;
  scalarSetMaximum: sinon.SinonStub;
  recordEvent: sinon.SinonStub;
  registerScalars: sinon.SinonStub;
  registerEvents: sinon.SinonStub;
  setEventRecordingEnabled: sinon.SinonStub;
}
export interface Test {
  onMessage: SinonEventStub;
  notifyFail: sinon.SinonStub;
  notifyPass: sinon.SinonStub;
  log: sinon.SinonStub;
  sendMessage: sinon.SinonStub;
  fail: sinon.SinonStub;
  succeed: sinon.SinonStub;
  assertTrue: sinon.SinonStub;
  assertFalse: sinon.SinonStub;
  assertBool: sinon.SinonStub;
  checkDeepEq: sinon.SinonStub;
  assertEq: sinon.SinonStub;
  assertNoLastError: sinon.SinonStub;
  assertLastError: sinon.SinonStub;
  assertRejects: sinon.SinonStub;
  assertThrows: sinon.SinonStub;
}
export interface Theme {
  onUpdated: SinonEventStub;
  getCurrent: sinon.SinonStub;
  update: sinon.SinonStub;
  reset: sinon.SinonStub;
}
export interface TopSites {
  get: sinon.SinonStub;
}
export interface Types {}
export interface Urlbar {
  onBehaviorRequested: SinonEventStub;
  onQueryCanceled: SinonEventStub;
  onResultsRequested: SinonEventStub;
}
export interface UrlbarContextualTip {
  onButtonClicked: SinonEventStub;
  onLinkClicked: SinonEventStub;
  set: sinon.SinonStub;
  remove: sinon.SinonStub;
}
export interface UserScripts {
  onBeforeScript: SinonEventStub;
}
export interface WebNavigation {
  onBeforeNavigate: SinonEventStub;
  onCommitted: SinonEventStub;
  onDOMContentLoaded: SinonEventStub;
  onCompleted: SinonEventStub;
  onErrorOccurred: SinonEventStub;
  onCreatedNavigationTarget: SinonEventStub;
  onReferenceFragmentUpdated: SinonEventStub;
  onTabReplaced: SinonEventStub;
  onHistoryStateUpdated: SinonEventStub;
  getFrame: sinon.SinonStub;
  getAllFrames: sinon.SinonStub;
}
export interface WebRequest {
  onBeforeRequest: SinonEventStub;
  onBeforeSendHeaders: SinonEventStub;
  onSendHeaders: SinonEventStub;
  onHeadersReceived: SinonEventStub;
  onAuthRequired: SinonEventStub;
  onResponseStarted: SinonEventStub;
  onBeforeRedirect: SinonEventStub;
  onCompleted: SinonEventStub;
  onErrorOccurred: SinonEventStub;
  handlerBehaviorChanged: sinon.SinonStub;
  filterResponseData: sinon.SinonStub;
  getSecurityInfo: sinon.SinonStub;
}
export interface Windows {
  onCreated: SinonEventStub;
  onRemoved: SinonEventStub;
  onFocusChanged: SinonEventStub;
  get: sinon.SinonStub;
  getCurrent: sinon.SinonStub;
  getLastFocused: sinon.SinonStub;
  getAll: sinon.SinonStub;
  create: sinon.SinonStub;
  update: sinon.SinonStub;
  remove: sinon.SinonStub;
}
export interface BrowserFake {
  activityLog: ActivityLog;
  alarms: Alarms;
  bookmarks: Bookmarks;
  browserAction: BrowserAction;
  browserSettings: BrowserSettings;
  browsingData: BrowsingData;
  captivePortal: CaptivePortal;
  clipboard: Clipboard;
  commands: Commands;
  contentScripts: ContentScripts;
  contextMenus: ContextMenus;
  contextualIdentities: ContextualIdentities;
  cookies: Cookies;
  devtools: {
    inspectedWindow: DevtoolsInspectedWindow;
    network: DevtoolsNetwork;
    panels: DevtoolsPanels;
  };
  dns: Dns;
  downloads: Downloads;
  events: Events;
  experiments: Experiments;
  extension: Extension;
  extensionTypes: ExtensionTypes;
  find: Find;
  geckoProfiler: GeckoProfiler;
  history: History;
  i18n: I18n;
  identity: Identity;
  idle: Idle;
  management: Management;
  menus: Menus;
  networkStatus: NetworkStatus;
  normandyAddonStudy: NormandyAddonStudy;
  notifications: Notifications;
  omnibox: Omnibox;
  pageAction: PageAction;
  permissions: Permissions;
  pkcs11: Pkcs11;
  privacy: {
    network: PrivacyNetwork;
    services: PrivacyServices;
    websites: PrivacyWebsites;
  };
  proxy: Proxy;
  runtime: Runtime;
  search: Search;
  sessions: Sessions;
  sidebarAction: SidebarAction;
  storage: Storage;
  tabs: Tabs;
  telemetry: Telemetry;
  test: Test;
  theme: Theme;
  topSites: TopSites;
  types: Types;
  urlbar: {
    contextualTip: UrlbarContextualTip;
  };
  userScripts: UserScripts;
  webNavigation: WebNavigation;
  webRequest: WebRequest;
  windows: Windows;
}
