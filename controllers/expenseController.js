// Import necessary models
const Expense = require('../models/Expense');
const User = require('../models/User');
const mongoose = require('mongoose');

// Add a new expense
const addExpense = async (req, res) => {
  const { description, total_amount, split_method, participants } = req.body;

  try {
    // Validate participants
    for (let participant of participants) {
      // Check if user_id is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(participant.user_id)) {
        return res.status(400).json({ msg: `Invalid user_id: ${participant.user_id}` });
      }

      // Check if amount is provided
      if (split_method === 'exact' && (participant.amount === undefined || participant.amount === null)) {
        return res.status(400).json({ msg: 'Amount is required for each participant when using exact split.' });
      }

      // Validate percentage if using percentage split
      if (split_method === 'percentage' && (!participant.percentage || participant.percentage <= 0)) {
        return res.status(400).json({ msg: 'Percentage must be provided and greater than 0 for each participant.' });
      }
    }

    // If split method is percentage, validate that percentages sum up to 100
    if (split_method === 'percentage') {
      const totalPercentage = participants.reduce((acc, p) => acc + (p.percentage || 0), 0);
      if (totalPercentage !== 100) {
        return res.status(400).json({ msg: 'Percentages must add up to 100%' });
      }
    }

    // Create new expense
    const expense = new Expense({ description, total_amount, split_method, participants });
    await expense.save();

    res.status(201).json(expense);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// Retrieve expenses by user ID
const getUserExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ "participants.user_id": req.params.user_id });
    res.json(expenses);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// Retrieve all expenses
const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// Download balance sheet
const downloadBalanceSheet = (req, res) => {
  const userId = req.params.user_id;

  // Example balance sheet data (you'll need to customize this based on your actual app logic)
  const balanceSheet = {
    userId: userId,
    expenses: [
      { description: "Dinner", amount: 1000 },
      { description: "Movie", amount: 500 },
    ],
    total: 1500
  };

  res.json(balanceSheet); // Send the balance sheet as JSON
};

// Export all the controllers as a module
module.exports = {
  addExpense,
  getUserExpenses,
  getAllExpenses,
  downloadBalanceSheet
};
