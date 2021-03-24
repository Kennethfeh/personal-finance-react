import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  const totalBalance = transactions.reduce((total, transaction) => {
    return transaction.type === 'income' 
      ? total + transaction.amount 
      : total - transaction.amount;
  }, 0);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyIncome = transactions
    .filter(t => {
      const date = new Date(t.date);
      return t.type === 'income' && 
             date.getMonth() === currentMonth && 
             date.getFullYear() === currentYear;
    })
    .reduce((total, transaction) => total + transaction.amount, 0);

  const monthlyExpenses = transactions
    .filter(t => {
      const date = new Date(t.date);
      return t.type === 'expense' && 
             date.getMonth() === currentMonth && 
             date.getFullYear() === currentYear;
    })
    .reduce((total, transaction) => total + transaction.amount, 0);

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const activeBudgets = budgets.filter(budget => budget.isActive);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [transactionsRes, budgetsRes] = await Promise.all([
          api.get('/transactions'),
          api.get('/budgets')
        ]);
        
        setTransactions(transactionsRes.data.transactions);
        setBudgets(budgetsRes.data.budgets);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>Welcome back, {user?.name}!</h1>
      
      <div className="dashboard-grid">
        <div className="card">
          <h3>Total Balance</h3>
          <p className="balance">${totalBalance.toFixed(2)}</p>
        </div>
        
        <div className="card">
          <h3>This Month's Income</h3>
          <p className="income">+${monthlyIncome.toFixed(2)}</p>
        </div>
        
        <div className="card">
          <h3>This Month's Expenses</h3>
          <p className="expense">-${monthlyExpenses.toFixed(2)}</p>
        </div>
        
        <div className="card">
          <h3>Active Budgets</h3>
          <p className="count">{activeBudgets.length}</p>
        </div>
      </div>

      <div className="recent-section">
        <div className="card">
          <h3>Recent Transactions</h3>
          {recentTransactions.length === 0 ? (
            <div className="empty-state">
              No transactions yet. <Link to="/transactions">Add your first transaction</Link>
            </div>
          ) : (
            <div className="transaction-list">
              {recentTransactions.map(transaction => (
                <div key={transaction._id} className="transaction-item">
                  <div className="transaction-info">
                    <strong>{transaction.description}</strong>
                    <span className="category">{transaction.category}</span>
                  </div>
                  <div className={`transaction-amount ${transaction.type}`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </div>
                </div>
              ))}
              <Link to="/transactions" className="view-all-link">View all transactions →</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;