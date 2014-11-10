var availableId = 'ctl00_ContentMiddle_TicketList1_GridView1';
var tableCells = document.getElementById(availableId).getElementsByTagName('td')
if (tableCells.length == 1 && tableCells[0].firstChild.data == "Keine Tickets vorhanden") {
  setTimeout(reload, 500);
} else {
  //Ticket available send message to background.js
  chrome.runtime.sendMessage({msg: "available"}, function(response) {
  });

  //find first button an invoke href javascript action
  var intoBasketButtons = document.getElementsByClassName('butt1');
  if (intoBasketButtons.length > 0) {
    var button = intoBasketButtons[0];
    window.location.href = button.href;
  }
}


function reload() {
  location.reload()
}
