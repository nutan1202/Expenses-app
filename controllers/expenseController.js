const Expense = require('../models/Expense');
const User = require('../models/User');
const mongoose = require('mongoose');
const { Parser } = require('json2csv');
const fs = require('fs').promises;

// Add a new expense
const addExpense = async (req, res) => {
  const { description, total_amount, split_method, participants } = req.body;

  try {
    // Validate participants
    for (let participant of participants) {
      if (!mongoose.Types.ObjectId.isValid(participant.user_id)) {
        return res.status(400).json({ msg: `Invalid user_id: ${participant.user_id}` });
      }

      if (split_method === 'exact' && (participant.amount === undefined || participant.amount === null)) {
        return res.status(400).json({ msg: 'Amount is required for each participant when using exact split.' });
      }

      if (split_method === 'percentage' && (!participant.percentage || participant.percentage <= 0)) {
        return res.status(400).json({ msg: 'Percentage must be provided and greater than 0 for each participant.' });
      }
    }

    // Validate that percentages sum to 100 if using 'percentage' split
    if (split_method === 'percentage') {
      const totalPercentage = participants.reduce((acc, p) => acc + (p.percentage || 0), 0);
      if (totalPercentage !== 100) {
        return res.status(400).json({ msg: 'Percentages must add up to 100%' });
      }
    }

    // Create and save the new expense
    const expense = new Expense({ description, total_amount, split_method, participants });
    await expense.save();

    res.status(201).json(expense);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// Retrieve individual expenses for a specific user
const getUserExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ "participants.user_id": req.params.user_id });
    res.json(expenses);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// Retrieve overall expenses for all users
const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// Download the balance sheet
const downloadBalanceSheet = async (req, res) => {
  const userId = req.params.user_id ? req.params.user_id.trim() : null;

  try {
    let expenses;
    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ msg: 'Invalid user ID' });
      }

      expenses = await Expense.find({ "participants.user_id": userId });

      if (expenses.length === 0) {
        return res.status(404).json({ msg: 'No expenses found for this user' });
      }
    } else {
      expenses = await Expense.find();
      if (expenses.length === 0) {
        return res.status(404).json({ msg: 'No expenses found' });
      }
    }

    // Prepare the CSV data
    const csvData = expenses.flatMap(expense =>
      expense.participants.map(participant => ({
        description: expense.description,
        total_amount: expense.total_amount,
        split_method: expense.split_method,
        user_id: participant.user_id,
        amount: participant.amount || '',
        percentage: participant.percentage || ''
      }))
    );

    // Define CSV fields
    const fields = ['description', 'total_amount', 'split_method', 'user_id', 'amount', 'percentage'];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(csvData);

    // Define file path and write to file
    const fileName = userId ? `balance_sheet_${userId}.csv` : 'balance_sheet_all_users.csv';
    const filePath = `${fileName}`;
    await fs.writeFile(filePath, csv);

    // Send the file for download
    res.download(filePath, (err) => {
      if (err) {
        console.error("Error downloading the file:", err);
        return res.status(500).send('Error downloading file');
      }

      // Delete file after it's sent
      fs.unlink(filePath).catch(err => console.error("Error deleting the file:", err));
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// Export all controllers
module.exports = {
  addExpense,
  getUserExpenses,
  getAllExpenses,
  downloadBalanceSheet
};
