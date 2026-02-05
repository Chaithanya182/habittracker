import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { format, parseISO, isBefore, isToday, startOfDay } from 'date-fns';

const TaskListContext = createContext();

export const useTaskList = () => {
    const context = useContext(TaskListContext);
    if (!context) throw new Error('useTaskList must be used within a TaskListProvider');
    return context;
};

const defaultCategories = [
    { id: '1', name: 'Health', emoji: '💪' },
    { id: '2', name: 'Work', emoji: '💼' },
    { id: '3', name: 'Money', emoji: '💰' },
    { id: '4', name: 'Family', emoji: '👨‍👩‍👧' },
    { id: '5', name: 'Personal Growth', emoji: '📚' },
    { id: '6', name: 'Chores', emoji: '🧹' },
    { id: '7', name: 'Ideas', emoji: '💡' },
    { id: '8', name: 'Leisure', emoji: '🎮' },
    { id: '9', name: 'Spirituality', emoji: '🧘' }
];

const defaultPriorities = [
    { id: 'high', name: 'High', color: '#e53935' },
    { id: 'medium', name: 'Medium', color: '#fdd835' },
    { id: 'low', name: 'Low', color: '#1e88e5' },
    { id: 'optional', name: 'Optional', color: '#9e9e9e' }
];

const defaultStatuses = [
    { id: 'done', name: 'Done', icon: '✅' },
    { id: 'in-progress', name: 'In Progress', icon: '✏️' },
    { id: 'not-started', name: 'Not Started', icon: '⚠️' },
    { id: 'canceled', name: 'Canceled', icon: '❌' }
];

const initialState = {
    isSetupComplete: false,
    categories: defaultCategories,
    priorities: defaultPriorities,
    statuses: defaultStatuses,
    tasks: []
};

export const TaskListProvider = ({ children }) => {
    const [state, setState] = useState(() => {
        const saved = localStorage.getItem('taskListTracker');
        if (saved) {
            const parsed = JSON.parse(saved);
            return { ...initialState, ...parsed };
        }
        return initialState;
    });

    useEffect(() => {
        localStorage.setItem('taskListTracker', JSON.stringify(state));
    }, [state]);

    // Complete setup
    const completeSetup = useCallback(() => {
        setState(prev => ({ ...prev, isSetupComplete: true }));
    }, []);

    // Task CRUD
    const addTask = useCallback((task) => {
        setState(prev => ({
            ...prev,
            tasks: [...prev.tasks, {
                id: crypto.randomUUID(),
                text: task.text,
                dueDate: task.dueDate,
                priority: task.priority || 'medium',
                status: task.status || 'not-started',
                category: task.category || state.categories[0]?.id,
                note: task.note || '',
                completed: false,
                createdAt: new Date().toISOString()
            }]
        }));
    }, [state.categories]);

    const updateTask = useCallback((taskId, updates) => {
        setState(prev => ({
            ...prev,
            tasks: prev.tasks.map(task =>
                task.id === taskId ? { ...task, ...updates } : task
            )
        }));
    }, []);

    const toggleTaskComplete = useCallback((taskId) => {
        setState(prev => ({
            ...prev,
            tasks: prev.tasks.map(task =>
                task.id === taskId
                    ? {
                        ...task,
                        completed: !task.completed,
                        status: !task.completed ? 'done' : 'not-started'
                    }
                    : task
            )
        }));
    }, []);

    const deleteTask = useCallback((taskId) => {
        setState(prev => ({
            ...prev,
            tasks: prev.tasks.filter(task => task.id !== taskId)
        }));
    }, []);

    // Category management
    const addCategory = useCallback((name, emoji) => {
        setState(prev => ({
            ...prev,
            categories: [...prev.categories, {
                id: crypto.randomUUID(),
                name,
                emoji
            }]
        }));
    }, []);

    const deleteCategory = useCallback((categoryId) => {
        setState(prev => ({
            ...prev,
            categories: prev.categories.filter(c => c.id !== categoryId)
        }));
    }, []);

    // Statistics
    const getStats = useCallback(() => {
        const today = startOfDay(new Date());
        const todayStr = format(today, 'yyyy-MM-dd');

        const totalTasks = state.tasks.length;
        const completedTasks = state.tasks.filter(t => t.completed).length;
        const todayTasks = state.tasks.filter(t => t.dueDate === todayStr).length;
        const overdueTasks = state.tasks.filter(t => {
            if (t.completed) return false;
            if (!t.dueDate) return false;
            return isBefore(parseISO(t.dueDate), today);
        }).length;
        const notCompletedTasks = state.tasks.filter(t => !t.completed).length;
        const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        return {
            total: totalTasks,
            completed: completedTasks,
            today: todayTasks,
            overdue: overdueTasks,
            notCompleted: notCompletedTasks,
            percentage
        };
    }, [state.tasks]);

    const value = {
        ...state,
        completeSetup,
        addTask,
        updateTask,
        toggleTaskComplete,
        deleteTask,
        addCategory,
        deleteCategory,
        getStats
    };

    return (
        <TaskListContext.Provider value={value}>
            {children}
        </TaskListContext.Provider>
    );
};
