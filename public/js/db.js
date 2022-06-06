/* This is creating a new database called my_budget. */
let DbGlobal;
const request = indexedDB.open("my_budget", 1);
request.onupgradeneeded = function (event) {
  const db = event.target.result;
  db.createObjectStore("new_budget", { autoIncrement: true });
};

/* This is creating a new database called my_budget. */
request.onsuccess = function (event) {
  DbGlobal = event.target.result;
  if (navigator.onLine) {
    SetBudget();
  }
};

/* This is a function that is called when an error occurs. */
request.onerror = function (event) {
  console.log(event.target.errorCode);
};

/**
 * The function takes a record as an argument, creates a transaction, creates an object store, and adds
 * the record to the object store.
 *
 * Let's break it down.
 *
 * The first line of the function creates a transaction.
 *
 * The transaction takes two arguments:
 *
 * 1. The name of the object store to be used in the transaction.
 * 2. The mode of the transaction.
 *
 * The second argument is optional. If you don't specify a mode, the transaction defaults to readonly.
 *
 * The second line of the function creates an object store.
 *
 * The object store takes one argument:
 *
 * 1. The name of the object store.
 *
 * The third line of the function adds the record to the object store.
 *
 * The add method takes one argument:
 *
 * 1. The record to be added to the object store.
 *
 * The add method returns a promise
 * @param record - The record to be saved.
 */
function RecordSave(record) {
  const transaction = DbGlobal.transaction(["new_budget"], "readwrite");
  const budgetObjectStore = transaction.objectStore("new_budget");
  budgetObjectStore.add(record);
}

/**
 * It gets all the records from the IndexedDB database, sends them to the server, and then clears the
 * IndexedDB database
 */
function SetBudget() {
  const transaction = DbGlobal.transaction(["new_budget"], "readwrite");
  const budgetObjectStore = transaction.objectStore("new_budget");
  const getAll = budgetObjectStore.getAll();
  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((serverResponse) => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }
          const transaction = DbGlobal.transaction(["new_budget"], "readwrite");
          const budgetObjectStore = transaction.objectStore("new_budget");
          budgetObjectStore.clear();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
}

/* Listening for the online event and then calling the SetBudget function. */
window.addEventListener("online", SetBudget);
