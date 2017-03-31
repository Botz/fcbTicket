var activated = false;
var filters = null;

chrome.runtime.onInstalled.addListener(function() {
  // Replace all rules ...
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    // With a new rule ...
    chrome.declarativeContent.onPageChanged.addRules([
      {
        // That fires when a page's URL contains a 'g' ...
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: 'tickets.fcbayern.com' },
          })
        ],
        // And shows the extension's page action.
        actions: [ new chrome.declarativeContent.ShowPageAction() ]
      }
    ]);
  });
});

chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){
  if (changeInfo.status == "complete" && tab.url.indexOf("tickets.fcbayern.com") > 0 && activated) {
    sendFiltersToTab(filters, tabId);
  }
});

//register onmessage received listener to handle message from content_script.js
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    switch (request.msg) {
      case "startButtonClick": //Message from popup.js
        filters = request.filters;
        startButtonClick(request.tabId);
        sendResponse(activated);
        break;
      case "available": //Message from content_script.js
        activated = false;
        chrome.tabs.highlight({tabs: sender.tab.index}, function(window) {})
        break;
    }
});

//Action for "Start/Stop" Button in Popup
function startButtonClick(tabId) {
  activated = !activated;
  if (activated) {
    sendFiltersToTab(filters, tabId);
  }
}

function sendFiltersToTab(filterObject, tabId) {
  chrome.tabs.sendMessage(tabId, {action:"start", filters:filterObject});
}
