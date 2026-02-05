import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { useTasks } from '../../context/TaskContext';
import CircularProgress from './CircularProgress';
import TaskItem from './TaskItem';
import DailyNotes from './DailyNotes';
import styles from './DayColumn.module.css';

const DayColumn = ({ date }) => {
    const { tasks, addTask, getTaskStats } = useTasks();
    const [showAddForm, setShowAddForm] = useState(false);
    const [newTaskText, setNewTaskText] = useState('');

    const dayTasks = tasks[date] || [];
    const stats = getTaskStats();
    const dayStats = stats.dailyStats[date] || { total: 0, completed: 0, percentage: 0 };

    const parsedDate = parseISO(date);
    const dayName = format(parsedDate, 'EEEE');
    const formattedDate = format(parsedDate, 'dd.MM.yyyy');

    const handleAddTask = (e) => {
        e.preventDefault();
        if (newTaskText.trim()) {
            addTask(date, newTaskText.trim());
            setNewTaskText('');
            setShowAddForm(false);
        }
    };

    return (
        <div className={styles.dayColumn}>
            <div className={styles.header}>
                <div className={styles.dayName}>{dayName}</div>
                <div className={styles.date}>{formattedDate}</div>
            </div>

            <div className={styles.progressSection}>
                <CircularProgress
                    percentage={dayStats.percentage}
                    size={80}
                    strokeWidth={6}
                    color="#14b8a6"
                />
            </div>

            <div className={styles.tasksSection}>
                <div className={styles.tasksHeader}>
                    <span>Tasks</span>
                    <button
                        className={styles.addTaskButton}
                        onClick={() => setShowAddForm(!showAddForm)}
                        title="Add task"
                    >
                        +
                    </button>
                </div>

                <div className={styles.tasksList}>
                    {dayTasks.length === 0 ? (
                        <div className={styles.emptyTasks}>No tasks yet</div>
                    ) : (
                        dayTasks.map(task => (
                            <TaskItem key={task.id} task={task} date={date} />
                        ))
                    )}
                </div>

                {showAddForm && (
                    <form className={styles.addTaskForm} onSubmit={handleAddTask}>
                        <input
                            type="text"
                            className={styles.taskInput}
                            value={newTaskText}
                            onChange={(e) => setNewTaskText(e.target.value)}
                            placeholder="New task..."
                            autoFocus
                        />
                        <button type="submit" className={styles.submitTask}>
                            Add
                        </button>
                    </form>
                )}
            </div>

            <div className={styles.footer}>
                <div className={styles.statRow}>
                    <span className={styles.statLabel}>Completed</span>
                    <span className={styles.statCompleted}>{dayStats.completed}</span>
                </div>
                <div className={styles.statRow}>
                    <span className={styles.statLabel}>Not Completed</span>
                    <span className={styles.statNotCompleted}>{dayStats.total - dayStats.completed}</span>
                </div>
            </div>

            <DailyNotes date={date} />
        </div>
    );
};

export default DayColumn;

