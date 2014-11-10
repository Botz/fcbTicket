document.addEventListener("DOMContentLoaded", theDomHasLoaded, false);

function theDomHasLoaded() {
  document.getElementById('startButton').addEventListener('click', startButtonClick);
}

function startButtonClick() {
  //SEND Message to Background.js
  chrome.runtime.sendMessage({msg: "startButtonClick"}, function(activated) {
    //Response from Background.js
    var value = "Start";
    if (activated) {
      value = "Stop"
    }
    document.getElementById('startButton').value = value;
  });
}
