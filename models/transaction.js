/* This is importing the mongoose module. */
const mongoose = require("mongoose");

/* This is creating a new schema object. */
const Schema = mongoose.Schema;

/* This is creating a new schema object. */
const transactionSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: "Please enter a name to create transaction"
    },
    value: {
      type: Number,
      required: "Please enter a value to continue"
    },
    date: {
      type: Date,
      default: Date.now
    }
  }
);

/* This is creating a new model object. */
const Transaction = mongoose.model("Transaction", transactionSchema);

/* This is exporting the Transaction model. */
module.exports = Transaction;
