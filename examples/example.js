browser.tabs.onCreated.addListener(async tab => {
  await browser.storage.local.set({
    lastCreatedTab: tab,
  });
});

const firstWeDoThis = async () => {
  const container = await browser.contextualIdentities.create({
    name: 'My Container',
    color: 'blue',
    icon: 'fingerprint',
  });

  await browser.storage.local.set({
    lastCreatedContainer: container.cookieStoreId,
  });
};

const thenWeDoThat = async () => {
  const { lastCreatedContainer } = await browser.storage.local.get(
    'lastCreatedContainer'
  );
  await browser.tabs.create({
    cookieStoreId: lastCreatedContainer,
  });
};

const myFancyFeature = async () => {
  await firstWeDoThis();
  await thenWeDoThat();
};

myFancyFeature();
