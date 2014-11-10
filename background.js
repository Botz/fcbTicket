var activated = false;

chrome.runtime.onInstalled.addListener(function() {
  // Replace all rules ...
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    // With a new rule ...
    chrome.declarativeContent.onPageChanged.addRules([
      {
        // That fires when a page's URL contains a 'g' ...
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: 'tickets.fcbayern.de' },
          })
        ],
        // And shows the extension's page action.
        actions: [ new chrome.declarativeContent.ShowPageAction() ]
      }
    ]);
  });
});


chrome.pageAction.onClicked.addListener(function(tab) {
    activated = !activated;
    if (activated) {
      chrome.tabs.executeScript(null, {file: "content_script.js"});
    }
});

chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){
  if (changeInfo.status == "complete" && tab.url.indexOf("tickets.fcbayern.de") > 0 && activated) {
    chrome.tabs.executeScript(tabId, {file: "content_script.js", runAt: "document_end"});
  }
});

//register onmessage received listener to handle message from content_script.js
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.msg == "available") {
      chrome.tabs.highlight({tabs: sender.tab.index}, function(window) {})
    }
});
