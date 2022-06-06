/* Creating an empty array and a variable. */
let SetTrans = [];
let SetChart;

/* This is a fetch request to the server. */
fetch("/api/transaction")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    SetTrans = data;

    ChartPop();
    TablePop();
    ChartPop();
  });

/**
 * The function ChartPop() is called when the page loads. It takes the total of all the transactions in
 * the SetTrans array and displays it in the HTML element with the id of "total".
 */
function ChartPop() {
  let total = SetTrans.reduce((total, t) => {
    return total + parseInt(t.value);
  }, 0);

  let Total_EL = document.querySelector("#total");
  Total_EL.textContent = total;
}

/**
 * It creates a chart using the Chart.js library.
 */
function ChartPop() {
  let reversed = SetTrans.slice().reverse();
  let sum = 0;

  let labels = reversed.map((t) => {
    let date = new Date(t.date);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  });

  let data = reversed.map((t) => {
    sum += parseInt(t.value);
    return sum;
  });

  if (SetChart) {
    SetChart.destroy();
  }

  let Context = document.getElementById("SetChart").getContext("");

  SetChart = new Chart(Context, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Time Over Total",
          fill: true,
          data,
        },
      ],
    },
  });
}

/**
 * It takes the SetTrans array and loops through it, creating a new table row for each transaction
 */
function TablePop() {
  let Body = document.querySelector("#Body");
  Body.innerHTML = "";
  SetTrans.forEach((transaction) => {
    let transact = document.createElement("transact");
    transact.innerHTML = `
      <td>${transaction.name}</td>
      <td>${transaction.value}</td>
    `;

    Body.appendChild(transact);
  });
}

/**
 * The function takes in a boolean value, and if the value is true, it adds the transaction to the
 * database, and if the value is false, it subtracts the transaction from the database
 * @param isAdding - a boolean value that determines whether the transaction is an expense or income
 */
function TransSend(isAdding) {
  let nameEl = document.querySelector("#TransName");
  let amountEl = document.querySelector("#TransAmount");
  let errorEl = document.querySelector(".form .err");

  if (nameEl.value === "" || amountEl.value === "") {
    errorEl.textContent = "Looks like something is missing";
    return;
  } else {
    errorEl.textContent = "";
  }

  let transaction = {
    name: nameEl.value,
    value: amountEl.value,
    date: new Date().toISOString(),
  };

  if (!isAdding) {
    transaction.value *= -1;
  }

  SetTrans.unshift(transaction);

  ChartPop();
  TablePop();
  ChartPop();

  fetch("/api/transaction", {
    method: "POST",
    body: JSON.stringify(transaction),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (data.errors) {
        errorEl.textContent = "Looks like something is missing";
      } else {
        nameEl.value = "";
        amountEl.value = "";
      }
    })
    .catch((err) => {
      saveRecord(transaction);

      nameEl.value = "";
      amountEl.value = "";
    });
}

/* Adding an event listener to the button with the id of "add-btn". When the button is clicked, it
calls the function TransSend() and passes in the value of true. */
document.querySelector("#add-btn").onclick = function () {
  TransSend(true);
};

/* Adding an event listener to the button with the id of "sub-btn". When the button is clicked, it
calls the function TransSend() and passes in the value of false. */
document.querySelector("#sub-btn").onclick = function () {
  TransSend(false);
};
