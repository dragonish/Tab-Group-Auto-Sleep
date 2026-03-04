function discardTab(tab: chrome.tabs.Tab) {
  if (tab.id && tab.groupId > -1 && !tab.active && !tab.discarded && !tab.frozen) {
    chrome.tabs.discard(tab.id);
  }
}

chrome.tabs.onCreated.addListener(tab => {
  try {
    discardTab(tab);
  } catch {
    // do nothing
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (changeInfo.status === 'loading') {
    try {
      const tab = await chrome.tabs.get(tabId);
      discardTab(tab);
    } catch {
      // do nothing
    }
  }
});
