var availableId = 'ctl00_ContentMiddle_TicketList1_GridView1';
var tableCells = document.getElementById(availableId).getElementsByTagName('td');
var tableRows = document.getElementById(availableId).getElementsByTagName('tr');

console.log("Start ContentScript");

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action == "start") {
    start(message.filters);
  }
});

function start(filters) {
  if (tableCells.length == 1 && tableCells[0].firstChild.data == "Keine Tickets vorhanden") {
    setTimeout(reload, 500);
  } else {
    var filterArray = getFilterArray(filters); 

    for (i = 1; i < tableRows.length; i++) {
      var row = tableRows[i];
      var found = checkRow(row, filterArray);
      if (found) {
        break;
      }
    }
    if (!found) {
      setTimeout(reload, 500);
    }
  }
}

function checkRow(row, filterArray) {
  var cat = row.cells[0].innerHTML;
  var block = row.cells[1].innerHTML;

  if (filterArray.indexOf(cat) >= 0) {
    intoBasket(row);
    return true;
  }
  return false;
}

function reload() {
  location.reload()
}

function intoBasket(row) {
  var intoBasketButton = row.cells[6].firstElementChild
  window.location.href = intoBasketButton.href;

  //Ticket available send message to background.js
  chrome.runtime.sendMessage({msg: "available"}, function(response) {
  });
}

function getFilterArray(filters) {
  var loopStart = 0;
  if (filters && filters.cat) {
    loopStart = filters.cat;
  }

  var filterArray = [];
  for (i = loopStart; i <=5; i++) {
    filterArray.push("Kategorie "+i);
  }
  return filterArray;
}
