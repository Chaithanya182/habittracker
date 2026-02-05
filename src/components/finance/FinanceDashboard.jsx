import React, { useState } from 'react';
import { format } from 'date-fns';
import { useFinance } from '../../context/FinanceContext';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import styles from './FinanceDashboard.module.css';

const COLORS = ['#0088FE', '#FF8042', '#00C49F', '#FFBB28', '#FF6384', '#36A2EB', '#9966FF', '#4BC0C0'];

const FinanceDashboard = ({ onBack }) => {
    const {
        currentMonth,
        startingAmount,
        incomeCategories,
        expenseCategories,
        debtCategories,
        nextMonth,
        prevMonth,
        setStartingAmount,
        getMonthData,
        updateIncome,
        updateExpense,
        updateDebt,
        getStats,
        getExpensesByCategory,
        getIncomeByCategory,
        addIncomeCategory,
        deleteIncomeCategory,
        addExpenseCategory,
        deleteExpenseCategory,
        addDebtCategory,
        deleteDebtCategory
    } = useFinance();

    const [showSettings, setShowSettings] = useState(false);
    const [newIncomeCat, setNewIncomeCat] = useState('');
    const [newExpenseCat, setNewExpenseCat] = useState('');
    const [newDebtCat, setNewDebtCat] = useState('');

    const monthData = getMonthData();
    const stats = getStats();
    const expensesByCategory = getExpensesByCategory();
    const incomeByCategory = getIncomeByCategory();
    const monthName = format(new Date(currentMonth + '-01'), 'MMMM yyyy');

    // Ensure we have enough rows
    const incomeRows = [...monthData.income];
    while (incomeRows.length < 10) {
        incomeRows.push({ source: '', plan: 0, actual: 0 });
    }

    const expenseRows = [...monthData.expenses];
    while (expenseRows.length < 12) {
        expenseRows.push({ source: '', plan: 0, actual: 0 });
    }

    const debtRows = [...monthData.debts];
    while (debtRows.length < 10) {
        debtRows.push({ source: '', debt: 0, paidOut: 0 });
    }

    // Plan vs Actual chart data
    const planActualData = [
        { name: 'Income', Plan: stats.incomePlan, Actual: stats.incomeActual },
        { name: 'Expenses', Plan: stats.expensesPlan, Actual: stats.expensesActual }
    ];

    const handleAddIncomeCategory = () => {
        if (newIncomeCat.trim()) {
            addIncomeCategory(newIncomeCat.trim());
            setNewIncomeCat('');
        }
    };

    const handleAddExpenseCategory = () => {
        if (newExpenseCat.trim()) {
            addExpenseCategory(newExpenseCat.trim());
            setNewExpenseCat('');
        }
    };

    const handleAddDebtCategory = () => {
        if (newDebtCat.trim()) {
            addDebtCategory(newDebtCat.trim());
            setNewDebtCat('');
        }
    };

    return (
        <div className={styles.financeDashboard}>
            <button className={styles.backButton} onClick={onBack}>
                ← Back to Home
            </button>

            {/* Header */}
            <div className={styles.header}>
                <div className={styles.monthNav}>
                    <h1 className={styles.monthTitle}>{monthName}</h1>
                    <div className={styles.navButtons}>
                        <button className={styles.navBtn} onClick={prevMonth}>◀ Prev</button>
                        <button className={styles.navBtn} onClick={nextMonth}>Next ▶</button>
                    </div>
                </div>

                <div className={styles.startingAmount}>
                    <span className={styles.startingLabel}>Starting Amount</span>
                    <input
                        type="number"
                        className={styles.startingInput}
                        value={startingAmount || ''}
                        onChange={(e) => setStartingAmount(e.target.value)}
                        placeholder="0"
                    />
                </div>

                <div className={styles.statsRow}>
                    <div className={styles.statCard}>
                        <div className={styles.statTitle}>Income</div>
                        <div className={styles.statValues}>
                            <div className={styles.statCol}>
                                <div className={styles.statLabel}>Plan</div>
                                <div className={styles.statValue}>{stats.incomePlan.toFixed(2)}</div>
                            </div>
                            <div className={styles.statCol}>
                                <div className={styles.statLabel}>Actual</div>
                                <div className={styles.statValue}>{stats.incomeActual.toFixed(2)}</div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statTitle}>Expenses</div>
                        <div className={styles.statValues}>
                            <div className={styles.statCol}>
                                <div className={styles.statLabel}>Plan</div>
                                <div className={styles.statValue}>{stats.expensesPlan.toFixed(2)}</div>
                            </div>
                            <div className={styles.statCol}>
                                <div className={styles.statLabel}>Actual</div>
                                <div className={styles.statValue}>{stats.expensesActual.toFixed(2)}</div>
                            </div>
                        </div>
                    </div>
                    <div className={`${styles.statCard} ${styles.balance}`}>
                        <div className={styles.statTitle}>Balance</div>
                        <div className={styles.statValues}>
                            <div className={styles.statCol}>
                                <div className={styles.statLabel}>Plan</div>
                                <div className={styles.statValue}>{stats.balancePlan.toFixed(2)}</div>
                            </div>
                            <div className={styles.statCol}>
                                <div className={styles.statLabel}>Actual</div>
                                <div className={styles.statValue}>{stats.balanceActual.toFixed(2)}</div>
                            </div>
                        </div>
                    </div>
                    <div className={`${styles.statCard} ${styles.balance}`}>
                        <div className={styles.statTitle}>Total Balance</div>
                        <div className={styles.statValues}>
                            <div className={styles.statCol}>
                                <div className={styles.statLabel}>Plan</div>
                                <div className={styles.statValue}>{stats.totalBalancePlan.toFixed(2)}</div>
                            </div>
                            <div className={styles.statCol}>
                                <div className={styles.statLabel}>Actual</div>
                                <div className={styles.statValue}>{stats.totalBalanceActual.toFixed(2)}</div>
                            </div>
                        </div>
                    </div>
                    <div className={`${styles.statCard} ${styles.debt}`}>
                        <div className={styles.statTitle}>Debts</div>
                        <div className={styles.statValues}>
                            <div className={styles.statValue}>{stats.debts.toFixed(2)}</div>
                        </div>
                    </div>
                </div>

                <button
                    className={styles.settingsToggle}
                    onClick={() => setShowSettings(!showSettings)}
                >
                    ⚙️ Settings
                </button>
            </div>

            {/* Settings Panel */}
            {showSettings && (
                <div className={styles.settingsPanel}>
                    <h2 className={styles.settingsTitle}>Settings</h2>
                    <p className={styles.settingsSubtitle}>Add or remove categories for your tracker</p>
                    <div className={styles.settingsGrid}>
                        <div className={styles.settingsColumn}>
                            <div className={styles.settingsColumnTitle}>Income</div>
                            <div className={styles.addCategoryRow}>
                                <input
                                    type="text"
                                    className={styles.addCategoryInput}
                                    value={newIncomeCat}
                                    onChange={(e) => setNewIncomeCat(e.target.value)}
                                    placeholder="New category..."
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddIncomeCategory()}
                                />
                                <button className={styles.addCategoryBtn} onClick={handleAddIncomeCategory}>+</button>
                            </div>
                            <ul className={styles.settingsList}>
                                {incomeCategories.map((cat, i) => (
                                    <li key={i}>
                                        <span>{cat}</span>
                                        <button
                                            className={styles.deleteCatBtn}
                                            onClick={() => deleteIncomeCategory(cat)}
                                        >×</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className={styles.settingsColumn}>
                            <div className={styles.settingsColumnTitle}>Expenses</div>
                            <div className={styles.addCategoryRow}>
                                <input
                                    type="text"
                                    className={styles.addCategoryInput}
                                    value={newExpenseCat}
                                    onChange={(e) => setNewExpenseCat(e.target.value)}
                                    placeholder="New category..."
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddExpenseCategory()}
                                />
                                <button className={styles.addCategoryBtn} onClick={handleAddExpenseCategory}>+</button>
                            </div>
                            <ul className={styles.settingsList}>
                                {expenseCategories.map((cat, i) => (
                                    <li key={i}>
                                        <span>{cat}</span>
                                        <button
                                            className={styles.deleteCatBtn}
                                            onClick={() => deleteExpenseCategory(cat)}
                                        >×</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className={styles.settingsColumn}>
                            <div className={styles.settingsColumnTitle}>Debts</div>
                            <div className={styles.addCategoryRow}>
                                <input
                                    type="text"
                                    className={styles.addCategoryInput}
                                    value={newDebtCat}
                                    onChange={(e) => setNewDebtCat(e.target.value)}
                                    placeholder="New category..."
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddDebtCategory()}
                                />
                                <button className={styles.addCategoryBtn} onClick={handleAddDebtCategory}>+</button>
                            </div>
                            <ul className={styles.settingsList}>
                                {debtCategories.map((cat, i) => (
                                    <li key={i}>
                                        <span>{cat}</span>
                                        <button
                                            className={styles.deleteCatBtn}
                                            onClick={() => deleteDebtCategory(cat)}
                                        >×</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Charts Row */}
            <div className={styles.chartsRow}>
                <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>Expenses by Category</div>
                    <div className={styles.chartBody}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={expensesByCategory}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={70}
                                    label={({ name }) => name}
                                >
                                    {expensesByCategory.map((_, index) => (
                                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>Plan / Actual</div>
                    <div className={styles.chartBody}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={planActualData}>
                                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                                <YAxis tick={{ fontSize: 10 }} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Plan" fill="#0088FE" />
                                <Bar dataKey="Actual" fill="#FF8042" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className={styles.chartCard}>
                    <div className={styles.chartHeader}>Income by Category</div>
                    <div className={styles.chartBody}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={incomeByCategory}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={70}
                                    label={({ name }) => name}
                                >
                                    {incomeByCategory.map((_, index) => (
                                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Tables Row */}
            <div className={styles.tablesRow}>
                {/* Planned Expenses */}
                <div className={styles.tableCard}>
                    <div className={styles.tableHeader}>Planned Expenses</div>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Source</th>
                                <th>Plan</th>
                                <th>Actual</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenseRows.map((row, i) => (
                                <tr key={i}>
                                    <td>
                                        <select
                                            className={styles.sourceSelect}
                                            value={row.source}
                                            onChange={(e) => updateExpense(i, { source: e.target.value })}
                                        >
                                            <option value="">Select...</option>
                                            {expenseCategories.map((cat, ci) => (
                                                <option key={ci} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            className={styles.amountInput}
                                            value={row.plan || ''}
                                            onChange={(e) => updateExpense(i, { plan: e.target.value })}
                                            placeholder="0.00"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            className={styles.amountInput}
                                            value={row.actual || ''}
                                            onChange={(e) => updateExpense(i, { actual: e.target.value })}
                                            placeholder="0.00"
                                        />
                                    </td>
                                </tr>
                            ))}
                            <tr className={styles.totalRow}>
                                <td>Total</td>
                                <td>{stats.expensesPlan.toFixed(2)}</td>
                                <td>{stats.expensesActual.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Planned Income */}
                <div className={styles.tableCard}>
                    <div className={styles.tableHeader}>Planned Income</div>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Source</th>
                                <th>Plan</th>
                                <th>Actual</th>
                            </tr>
                        </thead>
                        <tbody>
                            {incomeRows.map((row, i) => (
                                <tr key={i}>
                                    <td>
                                        <select
                                            className={styles.sourceSelect}
                                            value={row.source}
                                            onChange={(e) => updateIncome(i, { source: e.target.value })}
                                        >
                                            <option value="">Select...</option>
                                            {incomeCategories.map((cat, ci) => (
                                                <option key={ci} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            className={styles.amountInput}
                                            value={row.plan || ''}
                                            onChange={(e) => updateIncome(i, { plan: e.target.value })}
                                            placeholder="0.00"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            className={styles.amountInput}
                                            value={row.actual || ''}
                                            onChange={(e) => updateIncome(i, { actual: e.target.value })}
                                            placeholder="0.00"
                                        />
                                    </td>
                                </tr>
                            ))}
                            <tr className={styles.totalRow}>
                                <td>Total</td>
                                <td>{stats.incomePlan.toFixed(2)}</td>
                                <td>{stats.incomeActual.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Debts */}
                <div className={styles.tableCard}>
                    <div className={styles.tableHeader}>Debts</div>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Source</th>
                                <th>Debt</th>
                                <th>Paid Out</th>
                            </tr>
                        </thead>
                        <tbody>
                            {debtRows.map((row, i) => (
                                <tr key={i}>
                                    <td>
                                        <select
                                            className={styles.sourceSelect}
                                            value={row.source}
                                            onChange={(e) => updateDebt(i, { source: e.target.value })}
                                        >
                                            <option value="">Select...</option>
                                            {debtCategories.map((cat, ci) => (
                                                <option key={ci} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            className={styles.amountInput}
                                            value={row.debt || ''}
                                            onChange={(e) => updateDebt(i, { debt: e.target.value })}
                                            placeholder="0.00"
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            className={styles.amountInput}
                                            value={row.paidOut || ''}
                                            onChange={(e) => updateDebt(i, { paidOut: e.target.value })}
                                            placeholder="0.00"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FinanceDashboard;
