import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { format, addMonths, subMonths } from 'date-fns';

const FinanceContext = createContext();

export const useFinance = () => {
    const context = useContext(FinanceContext);
    if (!context) throw new Error('useFinance must be used within a FinanceProvider');
    return context;
};

const defaultIncomeCategories = [
    'Salary', 'Bonus', 'Freelance', 'Business / Dividends', 'Investments & Deposits',
    'Real Estate', 'Transfer from family / friends', 'Debt repayment', 'Selling items',
    'Scholarship / Grant', 'Social benefits', 'Other income'
];

const defaultExpenseCategories = [
    'Rent', 'Mobile phone', 'Internet', 'Insurance', 'Subscriptions', 'Utilities',
    'Family', 'Pets', 'Personal', 'Self-care', 'Charity', 'Transportation',
    'Taxi', 'Food', 'Cafes & Restaurants', 'Car', 'Gasoline', 'Travel', 'Hobbies'
];

const defaultDebtCategories = ['Loans', 'Debts', 'Credit Cards', 'Mortgage', 'Liabilities'];

const initialState = {
    currentMonth: format(new Date(), 'yyyy-MM'),
    startingAmount: 0,
    incomeCategories: defaultIncomeCategories,
    expenseCategories: defaultExpenseCategories,
    debtCategories: defaultDebtCategories,
    // { 'yyyy-MM': { income: [{ source, plan, actual }], expenses: [...], debts: [...] } }
    monthlyData: {}
};

export const FinanceProvider = ({ children }) => {
    const [state, setState] = useState(() => {
        const saved = localStorage.getItem('financeTracker');
        if (saved) {
            const parsed = JSON.parse(saved);
            return { ...initialState, ...parsed };
        }
        return initialState;
    });

    useEffect(() => {
        localStorage.setItem('financeTracker', JSON.stringify(state));
    }, [state]);

    // Navigation
    const setMonth = useCallback((month) => {
        setState(prev => ({ ...prev, currentMonth: month }));
    }, []);

    const nextMonth = useCallback(() => {
        const current = new Date(state.currentMonth + '-01');
        setState(prev => ({ ...prev, currentMonth: format(addMonths(current, 1), 'yyyy-MM') }));
    }, [state.currentMonth]);

    const prevMonth = useCallback(() => {
        const current = new Date(state.currentMonth + '-01');
        setState(prev => ({ ...prev, currentMonth: format(subMonths(current, 1), 'yyyy-MM') }));
    }, [state.currentMonth]);

    // Set starting amount
    const setStartingAmount = useCallback((amount) => {
        setState(prev => ({ ...prev, startingAmount: parseFloat(amount) || 0 }));
    }, []);

    // Get current month data
    const getMonthData = useCallback(() => {
        return state.monthlyData[state.currentMonth] || {
            income: [],
            expenses: [],
            debts: []
        };
    }, [state.currentMonth, state.monthlyData]);

    // Add/Update income entry
    const updateIncome = useCallback((index, data) => {
        setState(prev => {
            const monthData = prev.monthlyData[prev.currentMonth] || { income: [], expenses: [], debts: [] };
            const income = [...monthData.income];

            if (index >= income.length) {
                income.push({ source: '', plan: 0, actual: 0, ...data });
            } else {
                income[index] = { ...income[index], ...data };
            }

            return {
                ...prev,
                monthlyData: {
                    ...prev.monthlyData,
                    [prev.currentMonth]: { ...monthData, income }
                }
            };
        });
    }, []);

    // Add/Update expense entry
    const updateExpense = useCallback((index, data) => {
        setState(prev => {
            const monthData = prev.monthlyData[prev.currentMonth] || { income: [], expenses: [], debts: [] };
            const expenses = [...monthData.expenses];

            if (index >= expenses.length) {
                expenses.push({ source: '', plan: 0, actual: 0, ...data });
            } else {
                expenses[index] = { ...expenses[index], ...data };
            }

            return {
                ...prev,
                monthlyData: {
                    ...prev.monthlyData,
                    [prev.currentMonth]: { ...monthData, expenses }
                }
            };
        });
    }, []);

    // Add/Update debt entry
    const updateDebt = useCallback((index, data) => {
        setState(prev => {
            const monthData = prev.monthlyData[prev.currentMonth] || { income: [], expenses: [], debts: [] };
            const debts = [...monthData.debts];

            if (index >= debts.length) {
                debts.push({ source: '', debt: 0, paidOut: 0, ...data });
            } else {
                debts[index] = { ...debts[index], ...data };
            }

            return {
                ...prev,
                monthlyData: {
                    ...prev.monthlyData,
                    [prev.currentMonth]: { ...monthData, debts }
                }
            };
        });
    }, []);

    // Calculate statistics
    const getStats = useCallback(() => {
        const monthData = getMonthData();

        const incomePlan = monthData.income.reduce((sum, i) => sum + (parseFloat(i.plan) || 0), 0);
        const incomeActual = monthData.income.reduce((sum, i) => sum + (parseFloat(i.actual) || 0), 0);
        const expensesPlan = monthData.expenses.reduce((sum, e) => sum + (parseFloat(e.plan) || 0), 0);
        const expensesActual = monthData.expenses.reduce((sum, e) => sum + (parseFloat(e.actual) || 0), 0);
        const totalDebts = monthData.debts.reduce((sum, d) => sum + (parseFloat(d.debt) || 0), 0);
        const totalPaidOut = monthData.debts.reduce((sum, d) => sum + (parseFloat(d.paidOut) || 0), 0);

        const balancePlan = incomePlan - expensesPlan;
        const balanceActual = incomeActual - expensesActual;
        const totalBalancePlan = state.startingAmount + balancePlan;
        const totalBalanceActual = state.startingAmount + balanceActual;

        return {
            incomePlan,
            incomeActual,
            expensesPlan,
            expensesActual,
            balancePlan,
            balanceActual,
            totalBalancePlan,
            totalBalanceActual,
            debts: totalDebts - totalPaidOut
        };
    }, [getMonthData, state.startingAmount]);

    // Get expense breakdown by category
    const getExpensesByCategory = useCallback(() => {
        const monthData = getMonthData();
        const categories = {};

        monthData.expenses.forEach(e => {
            if (e.source && e.actual > 0) {
                categories[e.source] = (categories[e.source] || 0) + parseFloat(e.actual);
            }
        });

        return Object.entries(categories).map(([name, value]) => ({ name, value }));
    }, [getMonthData]);

    // Get income breakdown by category
    const getIncomeByCategory = useCallback(() => {
        const monthData = getMonthData();
        const categories = {};

        monthData.income.forEach(i => {
            if (i.source && i.actual > 0) {
                categories[i.source] = (categories[i.source] || 0) + parseFloat(i.actual);
            }
        });

        return Object.entries(categories).map(([name, value]) => ({ name, value }));
    }, [getMonthData]);

    // Category management
    const addIncomeCategory = useCallback((category) => {
        if (category && !state.incomeCategories.includes(category)) {
            setState(prev => ({
                ...prev,
                incomeCategories: [...prev.incomeCategories, category]
            }));
        }
    }, [state.incomeCategories]);

    const deleteIncomeCategory = useCallback((category) => {
        setState(prev => ({
            ...prev,
            incomeCategories: prev.incomeCategories.filter(c => c !== category)
        }));
    }, []);

    const addExpenseCategory = useCallback((category) => {
        if (category && !state.expenseCategories.includes(category)) {
            setState(prev => ({
                ...prev,
                expenseCategories: [...prev.expenseCategories, category]
            }));
        }
    }, [state.expenseCategories]);

    const deleteExpenseCategory = useCallback((category) => {
        setState(prev => ({
            ...prev,
            expenseCategories: prev.expenseCategories.filter(c => c !== category)
        }));
    }, []);

    const addDebtCategory = useCallback((category) => {
        if (category && !state.debtCategories.includes(category)) {
            setState(prev => ({
                ...prev,
                debtCategories: [...prev.debtCategories, category]
            }));
        }
    }, [state.debtCategories]);

    const deleteDebtCategory = useCallback((category) => {
        setState(prev => ({
            ...prev,
            debtCategories: prev.debtCategories.filter(c => c !== category)
        }));
    }, []);

    const value = {
        ...state,
        setMonth,
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
    };

    return (
        <FinanceContext.Provider value={value}>
            {children}
        </FinanceContext.Provider>
    );
};
