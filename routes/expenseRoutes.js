const express = require('express');
const { addExpense, getUserExpenses, getAllExpenses, downloadBalanceSheet } = require('../controllers/expenseController');
const router = express.Router();

router.post('/expenses', addExpense); // Add a new expense
router.get('/expenses/user/:user_id', getUserExpenses); // Get user's expenses
router.get('/expenses', getAllExpenses); // Get all expenses
router.get('/balance/download/:user_id', downloadBalanceSheet); // Download balance sheet

module.exports = router;
