document.addEventListener("DOMContentLoaded", theDomHasLoaded, false);

function theDomHasLoaded() {
  document.getElementById('startButton').addEventListener('click', startButtonClick);
}

function startButtonClick() {
  //SEND Message to Background.js
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(array_of_Tabs) {
      var tab = array_of_Tabs[0];
      chrome.runtime.sendMessage({msg: "startButtonClick", tabId:tab.id, filters:false}, function(activated) {
        //Response from Background.js
        var value = "Start";
        if (activated) {
          value = "Stop"
        }
        document.getElementById('startButton').value = value;
      });
  });


}
