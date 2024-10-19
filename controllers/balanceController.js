const json2csv = require('json2csv');
const Expense = require('../models/Expense');

exports.downloadBalanceSheet = async (req, res) => {
  try {
    const expenses = await Expense.find({ "participants.user_id": req.params.user_id });
    const csv = json2csv.parse(expenses);
    res.header('Content-Type', 'text/csv');
    res.attachment('balance-sheet.csv');
    res.send(csv);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};
