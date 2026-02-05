import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { format, addDays, startOfWeek, parseISO } from 'date-fns';

const TaskContext = createContext();

export const useTasks = () => {
    const context = useContext(TaskContext);
    if (!context) throw new Error('useTasks must be used within a TaskProvider');
    return context;
};

const getDefaultWeekStart = () => {
    const today = new Date();
    const sunday = startOfWeek(today, { weekStartsOn: 0 });
    return format(sunday, 'yyyy-MM-dd');
};

const initialState = {
    isSetupComplete: false,
    weekStartDate: getDefaultWeekStart(),
    quote: "Inspiration comes only during work",
    tasks: {},
    habits: [],
    notes: {} // { 'yyyy-MM-dd': { notes: ['', '', ''], improvements: ['', '', ''], thanks: ['', '', ''] } }
};

export const TaskProvider = ({ children }) => {
    const [state, setState] = useState(() => {
        const saved = localStorage.getItem('weeklyTaskTracker');
        if (saved) {
            const parsed = JSON.parse(saved);
            return { ...initialState, ...parsed };
        }
        return initialState;
    });

    useEffect(() => {
        localStorage.setItem('weeklyTaskTracker', JSON.stringify(state));
    }, [state]);

    // Get array of 7 dates for the current week
    const getWeekDates = useCallback(() => {
        const start = parseISO(state.weekStartDate);
        return Array.from({ length: 7 }, (_, i) => format(addDays(start, i), 'yyyy-MM-dd'));
    }, [state.weekStartDate]);

    // Setup actions
    const completeSetup = useCallback((weekStartDate, quote) => {
        setState(prev => ({
            ...prev,
            isSetupComplete: true,
            weekStartDate,
            quote
        }));
    }, []);

    const updateQuote = useCallback((quote) => {
        setState(prev => ({ ...prev, quote }));
    }, []);

    const updateWeekStart = useCallback((weekStartDate) => {
        setState(prev => ({ ...prev, weekStartDate }));
    }, []);

    // Task actions
    const addTask = useCallback((date, text) => {
        setState(prev => {
            const dateTasks = prev.tasks[date] || [];
            return {
                ...prev,
                tasks: {
                    ...prev.tasks,
                    [date]: [...dateTasks, {
                        id: crypto.randomUUID(),
                        text,
                        completed: false
                    }]
                }
            };
        });
    }, []);

    const toggleTask = useCallback((date, taskId) => {
        setState(prev => ({
            ...prev,
            tasks: {
                ...prev.tasks,
                [date]: prev.tasks[date]?.map(task =>
                    task.id === taskId ? { ...task, completed: !task.completed } : task
                ) || []
            }
        }));
    }, []);

    const deleteTask = useCallback((date, taskId) => {
        setState(prev => ({
            ...prev,
            tasks: {
                ...prev.tasks,
                [date]: prev.tasks[date]?.filter(task => task.id !== taskId) || []
            }
        }));
    }, []);

    // Habit actions
    const addHabit = useCallback((name) => {
        setState(prev => ({
            ...prev,
            habits: [...prev.habits, {
                id: crypto.randomUUID(),
                name,
                completedDays: []
            }]
        }));
    }, []);

    const toggleHabitDay = useCallback((habitId, date) => {
        setState(prev => ({
            ...prev,
            habits: prev.habits.map(habit => {
                if (habit.id === habitId) {
                    const isCompleted = habit.completedDays.includes(date);
                    return {
                        ...habit,
                        completedDays: isCompleted
                            ? habit.completedDays.filter(d => d !== date)
                            : [...habit.completedDays, date]
                    };
                }
                return habit;
            })
        }));
    }, []);

    const deleteHabit = useCallback((habitId) => {
        setState(prev => ({
            ...prev,
            habits: prev.habits.filter(h => h.id !== habitId)
        }));
    }, []);

    // Statistics calculations
    const getTaskStats = useCallback(() => {
        const weekDates = getWeekDates();
        let totalTasks = 0;
        let completedTasks = 0;
        const dailyStats = {};

        weekDates.forEach(date => {
            const dayTasks = state.tasks[date] || [];
            const dayCompleted = dayTasks.filter(t => t.completed).length;
            const dayTotal = dayTasks.length;

            totalTasks += dayTotal;
            completedTasks += dayCompleted;

            dailyStats[date] = {
                total: dayTotal,
                completed: dayCompleted,
                percentage: dayTotal > 0 ? Math.round((dayCompleted / dayTotal) * 100) : 0
            };
        });

        return {
            totalTasks,
            completedTasks,
            percentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
            dailyStats
        };
    }, [state.tasks, getWeekDates]);

    const getHabitProgress = useCallback((habitId) => {
        const habit = state.habits.find(h => h.id === habitId);
        if (!habit) return 0;

        const weekDates = getWeekDates();
        const completedInWeek = weekDates.filter(date => habit.completedDays.includes(date)).length;
        return Math.round((completedInWeek / 7) * 100);
    }, [state.habits, getWeekDates]);

    // Notes actions
    const getNotes = useCallback((date) => {
        return state.notes[date] || {
            notes: ['', '', ''],
            improvements: ['', '', ''],
            thanks: ['', '', '']
        };
    }, [state.notes]);

    // Reset all data
    const resetAll = useCallback(() => {
        setState({
            ...initialState,
            weekStartDate: getDefaultWeekStart()
        });
        localStorage.removeItem('weeklyTaskTracker');
    }, []);

    const updateNote = useCallback((date, section, index, value) => {
        setState(prev => {
            const currentNotes = prev.notes[date] || {
                notes: ['', '', ''],
                improvements: ['', '', ''],
                thanks: ['', '', '']
            };
            const newSectionNotes = [...currentNotes[section]];
            newSectionNotes[index] = value;
            return {
                ...prev,
                notes: {
                    ...prev.notes,
                    [date]: {
                        ...currentNotes,
                        [section]: newSectionNotes
                    }
                }
            };
        });
    }, []);

    const value = {
        ...state,
        getWeekDates,
        completeSetup,
        updateQuote,
        updateWeekStart,
        addTask,
        toggleTask,
        deleteTask,
        addHabit,
        toggleHabitDay,
        deleteHabit,
        getTaskStats,
        getHabitProgress,
        getNotes,
        updateNote,
        resetAll
    };

    return (
        <TaskContext.Provider value={value}>
            {children}
        </TaskContext.Provider>
    );
};
