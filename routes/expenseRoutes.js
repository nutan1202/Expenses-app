const express = require('express');
const router = express.Router();
const { addExpense, getUserExpenses, getAllExpenses, downloadBalanceSheet } = require('../controllers/expenseController');

// Add a new expense
router.post('/expense', addExpense);

// Get expenses for a specific user
router.get('/expenses/:user_id', getUserExpenses);

// Get all expenses for all users
router.get('/expenses/all', getAllExpenses);

// Download balance sheet for a user or for all users
router.get('/download/balance-sheet/:user_id?', downloadBalanceSheet);

module.exports = router;
