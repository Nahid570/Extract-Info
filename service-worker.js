const PRODUCT_UPLOAD_URL = "https://dev.to/new";

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab.status === "complete" && tab.url.includes(PRODUCT_UPLOAD_URL)) {
      chrome.tabs
        .sendMessage(tab.id, { type: "getProduct" })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    tab.url.includes(PRODUCT_UPLOAD_URL)
  ) {
    chrome.tabs
      .sendMessage(tab.id, { type: "pageRefreshed" })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }
});
