import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './Budgets.css';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [newBudget, setNewBudget] = useState({
    category: '',
    amount: '',
    period: 'monthly',
    alertThreshold: 80
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBudget(prev => ({
      ...prev,
      [name]: name === 'amount' || name === 'alertThreshold' 
        ? parseFloat(value) || '' 
        : value
    }));
  };

  const loadBudgets = async () => {
    try {
      const response = await api.get('/budgets');
      setBudgets(response.data.budgets);
    } catch (error) {
      console.error('Error loading budgets:', error);
    }
  };

  const addBudget = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await api.post('/budgets', newBudget);
      setBudgets(prev => [...prev, response.data.budget]);
      
      // Reset form
      setNewBudget({
        category: '',
        amount: '',
        period: 'monthly',
        alertThreshold: 80
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding budget:', error);
    }
    
    setLoading(false);
  };

  const deleteBudget = async (id) => {
    if (!window.confirm('Are you sure you want to delete this budget?')) return;
    
    try {
      await api.delete(`/budgets/${id}`);
      setBudgets(prev => prev.filter(b => b._id !== id));
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  };

  const toggleBudget = async (id, currentStatus) => {
    try {
      const response = await api.put(`/budgets/${id}`, {
        isActive: !currentStatus
      });
      setBudgets(prev => prev.map(b => 
        b._id === id ? response.data.budget : b
      ));
    } catch (error) {
      console.error('Error updating budget:', error);
    }
  };

  const getProgressPercentage = (budget) => {
    return budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0;
  };

  const getBudgetStatus = (budget) => {
    const percentage = getProgressPercentage(budget);
    if (!budget.isActive) return 'Inactive';
    if (percentage >= 100) return 'Over Budget';
    if (percentage >= budget.alertThreshold) return 'Alert';
    return 'On Track';
  };

  const getStatusClass = (budget) => {
    const status = getBudgetStatus(budget);
    if (status === 'Over Budget') return 'status-over';
    if (status === 'Alert') return 'status-warning';
    if (status === 'Inactive') return 'status-inactive';
    return 'status-good';
  };

  useEffect(() => {
    loadBudgets();
  }, []);

  return (
    <div className="budgets">
      <div className="page-header">
        <h1>Budgets</h1>
        <button 
          onClick={() => setShowAddForm(!showAddForm)} 
          className="btn btn-primary"
        >
          {showAddForm ? 'Cancel' : 'Create Budget'}
        </button>
      </div>

      {showAddForm && (
        <div className="card add-form">
          <h3>Create New Budget</h3>
          <form onSubmit={addBudget}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category</label>
                <input
                  type="text"
                  name="category"
                  value={newBudget.category}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  name="amount"
                  value={newBudget.amount}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Period</label>
                <select
                  name="period"
                  value={newBudget.period}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Alert Threshold (%)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  name="alertThreshold"
                  value={newBudget.alertThreshold}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-success" disabled={loading}>
              {loading ? 'Creating...' : 'Create Budget'}
            </button>
          </form>
        </div>
      )}

      {budgets.length === 0 ? (
        <div className="empty-state card">
          <p>No budgets created yet.</p>
          <p>Create your first budget to start tracking your spending!</p>
        </div>
      ) : (
        <div className="budgets-grid">
          {budgets.map(budget => (
            <div key={budget._id} className="budget-card card">
              <div className="budget-header">
                <h3>{budget.category}</h3>
                <span className="budget-period">{budget.period}</span>
              </div>
              
              <div className="budget-amount">
                <span className="current">${budget.spent.toFixed(2)}</span>
                <span className="separator"> / </span>
                <span className="total">${budget.amount.toFixed(2)}</span>
              </div>
              
              <div className="progress-bar">
                <div 
                  className={`progress-fill ${getProgressPercentage(budget) > 100 ? 'over-budget' : ''}`}
                  style={{ width: `${Math.min(getProgressPercentage(budget), 100)}%` }}
                ></div>
              </div>
              
              <div className="budget-status">
                <span className={getStatusClass(budget)}>
                  {getBudgetStatus(budget)}
                </span>
                <span className="percentage">
                  {getProgressPercentage(budget).toFixed(1)}%
                </span>
              </div>
              
              <div className="budget-actions">
                <button 
                  onClick={() => toggleBudget(budget._id, budget.isActive)}
                  className={`btn btn-sm ${budget.isActive ? 'btn-danger' : 'btn-success'}`}
                >
                  {budget.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button 
                  onClick={() => deleteBudget(budget._id)} 
                  className="btn btn-danger btn-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Budgets;