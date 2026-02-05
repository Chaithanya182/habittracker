import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { format, getDaysInMonth, startOfMonth, getDay, addMonths, subMonths } from 'date-fns';

const HabitContext = createContext();

export const useHabits = () => {
    const context = useContext(HabitContext);
    if (!context) throw new Error('useHabits must be used within a HabitProvider');
    return context;
};

const initialState = {
    currentMonth: format(new Date(), 'yyyy-MM'),
    habits: [],
    completions: {}, // { 'habitId': { '2025-02-01': true, '2025-02-02': false } }
    mentalState: {} // { '2025-02-01': { mood: 7, motivation: 8 } }
};

export const HabitProvider = ({ children }) => {
    const [state, setState] = useState(() => {
        const saved = localStorage.getItem('habitTracker');
        if (saved) {
            const parsed = JSON.parse(saved);
            return { ...initialState, ...parsed };
        }
        return initialState;
    });

    useEffect(() => {
        localStorage.setItem('habitTracker', JSON.stringify(state));
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

    // Habit CRUD
    const addHabit = useCallback((name, emoji, goal = 30) => {
        setState(prev => ({
            ...prev,
            habits: [...prev.habits, {
                id: crypto.randomUUID(),
                name,
                emoji,
                goal
            }]
        }));
    }, []);

    const deleteHabit = useCallback((habitId) => {
        setState(prev => ({
            ...prev,
            habits: prev.habits.filter(h => h.id !== habitId),
            completions: Object.fromEntries(
                Object.entries(prev.completions).filter(([key]) => key !== habitId)
            )
        }));
    }, []);

    // Toggle completion
    const toggleCompletion = useCallback((habitId, date) => {
        setState(prev => {
            const habitCompletions = prev.completions[habitId] || {};
            return {
                ...prev,
                completions: {
                    ...prev.completions,
                    [habitId]: {
                        ...habitCompletions,
                        [date]: !habitCompletions[date]
                    }
                }
            };
        });
    }, []);

    // Mental State
    const setMentalState = useCallback((date, type, value) => {
        setState(prev => ({
            ...prev,
            mentalState: {
                ...prev.mentalState,
                [date]: {
                    ...(prev.mentalState[date] || {}),
                    [type]: value
                }
            }
        }));
    }, []);

    const getMentalState = useCallback((date) => {
        return state.mentalState[date] || { mood: null, motivation: null };
    }, [state.mentalState]);

    // Yearly Statistics
    const getYearlyStats = useCallback(() => {
        const months = [];
        const today = new Date();

        // Get last 12 months
        for (let i = 11; i >= 0; i--) {
            const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthKey = format(monthDate, 'yyyy-MM');
            const monthName = format(monthDate, 'MMMM');
            const daysInMonth = getDaysInMonth(monthDate);

            // Calculate stats for this month
            let completed = 0;
            const totalPossible = state.habits.length * daysInMonth;

            for (let day = 1; day <= daysInMonth; day++) {
                const dateKey = `${monthKey}-${String(day).padStart(2, '0')}`;
                state.habits.forEach(habit => {
                    if (state.completions[habit.id]?.[dateKey]) {
                        completed++;
                    }
                });
            }

            months.push({
                month: monthName,
                monthKey,
                numberOfHabits: state.habits.length,
                completed,
                totalPossible,
                percentage: totalPossible > 0 ? Math.round((completed / totalPossible) * 100) : 0
            });
        }

        return months;
    }, [state.habits, state.completions]);

    // Get days in current month
    const getMonthDays = useCallback(() => {
        const monthDate = new Date(state.currentMonth + '-01');
        const daysInMonth = getDaysInMonth(monthDate);
        const firstDayOfWeek = getDay(startOfMonth(monthDate));

        const days = [];
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                day: i,
                date: `${state.currentMonth}-${String(i).padStart(2, '0')}`,
                dayOfWeek: (firstDayOfWeek + i - 1) % 7
            });
        }
        return days;
    }, [state.currentMonth]);

    // Get habit completion for a specific day
    const isCompleted = useCallback((habitId, date) => {
        return state.completions[habitId]?.[date] || false;
    }, [state.completions]);

    // Statistics
    const getHabitStats = useCallback((habitId) => {
        const habit = state.habits.find(h => h.id === habitId);
        if (!habit) return { actual: 0, goal: 30, percentage: 0 };

        const monthDays = getMonthDays();
        const completions = monthDays.filter(d => isCompleted(habitId, d.date)).length;

        return {
            actual: completions,
            goal: habit.goal,
            percentage: Math.round((completions / habit.goal) * 100)
        };
    }, [state.habits, getMonthDays, isCompleted]);

    const getMonthStats = useCallback(() => {
        const monthDays = getMonthDays();
        const totalPossible = state.habits.length * monthDays.length;
        let completed = 0;

        state.habits.forEach(habit => {
            monthDays.forEach(day => {
                if (isCompleted(habit.id, day.date)) completed++;
            });
        });

        return {
            numberOfHabits: state.habits.length,
            completedHabits: completed,
            percentage: totalPossible > 0 ? Math.round((completed / totalPossible) * 100) : 0
        };
    }, [state.habits, getMonthDays, isCompleted]);

    const getDayStats = useCallback((date) => {
        const total = state.habits.length;
        const done = state.habits.filter(h => isCompleted(h.id, date)).length;
        return {
            total,
            done,
            notDone: total - done,
            percentage: total > 0 ? Math.round((done / total) * 100) : 0
        };
    }, [state.habits, isCompleted]);

    // Reset all data
    const resetAll = useCallback(() => {
        setState(initialState);
        localStorage.removeItem('habitTracker');
    }, []);

    const value = {
        ...state,
        setMonth,
        nextMonth,
        prevMonth,
        addHabit,
        deleteHabit,
        toggleCompletion,
        setMentalState,
        getMentalState,
        getMonthDays,
        isCompleted,
        getHabitStats,
        getMonthStats,
        getDayStats,
        getYearlyStats,
        resetAll
    };

    return (
        <HabitContext.Provider value={value}>
            {children}
        </HabitContext.Provider>
    );
};
