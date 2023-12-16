console.log("Is content script running");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message);
  if (message.type === "copyProduct") {
    ExtractProductDetails();
    sendResponse({ success: true });
  }

  if (message.type === "getProduct") {
    console.log("Getting products!...");
    getProductDetails();
    sendResponse({ success: true });
  }

  if (message.type === "pageRefreshed") {
    getProductDetails();
    sendResponse({ success: true });
  }
});

// Extract Product Information from Product Details page and Save to Chrome Sync Storage
function ExtractProductDetails() {
  const title = document
    .querySelector(".crayons-article__header__meta h1")
    .innerHTML.trim();
  const description = document.querySelector("#article-body").innerHTML;
  const parser = new DOMParser();
  const parsedHTML = parser.parseFromString(description, "text/html");
  const textContent = parsedHTML.body.textContent;
  const formattedDescription = textContent.replace(/\n\s*\n/g, "\n");

  chrome.storage.local.set({
    title: title,
    description: formattedDescription,
  });
}

function getProductDetails() {
  const title_input = document.getElementById("article-form-title");
  const description_input = document.getElementById("article_body_markdown");

  chrome.storage.local.get(
    ["title", "description", "autoUploadCheckbox"],
    (data) => {
      console.log(data);
      setTimeout(() => {
        title_input.value = data.title ?? "";
        title_input.dispatchEvent(new Event("input", { bubbles: true }));
      }, 0);

      // Description input
      setTimeout(() => {
        description_input.value = data.description ?? "";
        description_input.dispatchEvent(new Event("input", { bubbles: true }));
      }, 100);

      if (data.autoUploadCheckbox) {
        setTimeout(() => {
          const publishButton = document.querySelector(
            ".crayons-article-form__footer .c-btn--primary"
          );
          if (publishButton) {
            console.log(publishButton);
            console.log("Post submitted successfully");
            publishButton.click();
            // Submit the form
            // articleForm.submit();
            chrome.storage.local.set({ autoUploadCheckbox: false });
          }
        }, 3000);
      }
    }
  );
}
