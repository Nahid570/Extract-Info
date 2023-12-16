document.addEventListener("DOMContentLoaded", () => {
  const PRODUCT_EXTRACT_URL = "https://dev.to/";

  const createPostButton = document.getElementById("create_post");

  createPostButton.addEventListener("click", function () {
    chrome.tabs.create({ url: "https://dev.to/new" });
  });

  document.getElementById("copyBtn").addEventListener("click", async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const activeTab = tabs[0];
    if (
      activeTab.status === "complete" &&
      activeTab.url.includes(PRODUCT_EXTRACT_URL)
    ) {
      chrome.tabs
        .sendMessage(activeTab.id, { type: "copyProduct" })
        .then((response) => {
          const copyBtn = document.getElementById("copyBtn");
          if (response.success) {
            copyBtn.innerText = "Copied";
          }
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  });

  // Is auto upload checkbox is checked or not

  chrome.storage.local.get("autoUploadCheckbox", function (data) {
    if (data.autoUploadCheckbox) {
      chrome.storage.local.set({ autoUploadCheckbox: false });
    }
  });

  const upload_checkbox = document.getElementById("autoUploadCheckbox");
  upload_checkbox.addEventListener("change", function () {
    chrome.storage.local.set({ autoUploadCheckbox: this.checked });
  });
  //
  //
});
