document.addEventListener("DOMContentLoaded", theDomHasLoaded, false);

function theDomHasLoaded() {
  document.getElementById('startButton').addEventListener('click', startButtonClick);
}

function startButtonClick() {
  //SEND Message to Background.js
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(array_of_Tabs) {
      var select = document.getElementById('catSelect');
      var value = select.options[select.selectedIndex].value;

      var tab = array_of_Tabs[0];
      chrome.runtime.sendMessage({msg: "startButtonClick", tabId:tab.id, filters:{cat:value}}, function(activated) {
        //Response from Background.js
        var value = "Start";
        if (activated) {
          value = "Stop"
        }
        document.getElementById('startButton').value = value;
      });
  });


}
