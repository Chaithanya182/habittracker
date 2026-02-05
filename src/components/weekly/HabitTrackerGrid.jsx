import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { useTasks } from '../../context/TaskContext';
import styles from './HabitTrackerGrid.module.css';

const HabitTrackerGrid = () => {
    const { habits, getWeekDates, addHabit, toggleHabitDay, deleteHabit, getHabitProgress } = useTasks();
    const [showAddForm, setShowAddForm] = useState(false);
    const [newHabitName, setNewHabitName] = useState('');

    const weekDates = getWeekDates();
    const dayLabels = weekDates.map(date => format(parseISO(date), 'EEE'));

    const handleAddHabit = (e) => {
        e.preventDefault();
        if (newHabitName.trim()) {
            addHabit(newHabitName.trim());
            setNewHabitName('');
            setShowAddForm(false);
        }
    };

    return (
        <div className={styles.habitTracker}>
            <div className={styles.header}>
                <span>Habit Tracker</span>
                <button
                    className={styles.addButton}
                    onClick={() => setShowAddForm(!showAddForm)}
                >
                    + Add
                </button>
            </div>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Habit</th>
                        {dayLabels.map((day, i) => (
                            <th key={i}>{day}</th>
                        ))}
                        <th>Progress</th>
                    </tr>
                </thead>
                <tbody>
                    {habits.length === 0 ? (
                        <tr>
                            <td colSpan={9} className={styles.emptyState}>
                                No habits yet. Add one above!
                            </td>
                        </tr>
                    ) : (
                        habits.map(habit => (
                            <tr key={habit.id}>
                                <td>
                                    <div className={styles.habitName}>
                                        <button
                                            className={styles.deleteHabit}
                                            onClick={() => deleteHabit(habit.id)}
                                            title="Delete habit"
                                        >
                                            ×
                                        </button>
                                        {habit.name}
                                    </div>
                                </td>
                                {weekDates.map(date => (
                                    <td key={date}>
                                        <input
                                            type="checkbox"
                                            className={styles.checkbox}
                                            checked={habit.completedDays.includes(date)}
                                            onChange={() => toggleHabitDay(habit.id, date)}
                                        />
                                    </td>
                                ))}
                                <td className={styles.progressCell}>
                                    <div className={styles.progressBar}>
                                        <div
                                            className={styles.progressFill}
                                            style={{ width: `${getHabitProgress(habit.id)}%` }}
                                        />
                                    </div>
                                    <span className={styles.progressText}>
                                        {getHabitProgress(habit.id) === 100 && <span className={styles.trophy}>🏆</span>}
                                        {getHabitProgress(habit.id)}%
                                    </span>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {showAddForm && (
                <form className={styles.addForm} onSubmit={handleAddHabit}>
                    <input
                        type="text"
                        className={styles.habitInput}
                        value={newHabitName}
                        onChange={(e) => setNewHabitName(e.target.value)}
                        placeholder="Enter habit name..."
                        autoFocus
                    />
                    <button type="submit" className={styles.submitButton}>
                        Add
                    </button>
                </form>
            )}
        </div>
    );
};

export default HabitTrackerGrid;
