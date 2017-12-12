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

    for (i = 3; i < tableRows.length; i++) {
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
  console.log(row)
  var block = row.cells[0].firstElementChild.firstElementChild.firstElementChild.innerHTML;
  if (filterArray.indexOf(parseInt(block)) >= 0) {
    intoBasket(row);
    return true;
  }
  return false;
}

function reload() {
  location.reload()
}

function intoBasket(row) {
  var intoBasketButton = row.cells[0].getElementsByClassName('cart-buttons-second-button')[0];
  window.location.href = intoBasketButton.href;

  //Ticket available send message to background.js
  chrome.runtime.sendMessage({msg: "available"}, function(response) {
  });
}

function getFilterArray(filters) {
  if (filters.cat == 6) { //EGAL
    var result = [];
    for (i = 99; i < 400; i++) {
      result.push(i);
    }
    return result;
  }

  var cats = {
    1: [101, 102, 103, 104, 105, 106, 107, 119, 120, 121],
    2: [226, 235, 214, 247],
    3: [],
    4: [308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 319, 320, 321, 322, 323, 332, 333, 334, 335, 336, 337, 338, 339, 340, 341, 342, 343, 344, 345, 346, 347],
    5: [109, 110, 111, 112, 113, 114, 115, 116, 117, 126, 127, 128, 129, 130, 131, 132, 133, 134]
  }

  return cats[filters.cat];
}
