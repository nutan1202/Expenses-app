const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: function() {
      return this.parent().split_method === 'exact' || this.parent().split_method === 'equal'; // Require amount for 'exact' and 'equal' methods
    }
  },
  percentage: {
    type: Number,
    required: function() {
      return this.parent().split_method === 'percentage'; // Require percentage for 'percentage' method
    }
  }
});

const ExpenseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  total_amount: {
    type: Number,
    required: true
  },
  split_method: {
    type: String,
    enum: ['equal', 'exact', 'percentage'],
    required: true
  },
  participants: [participantSchema]
});

module.exports = mongoose.model('Expense', ExpenseSchema);
