import React, { useState } from 'react';
import { format, parseISO, isBefore, startOfDay } from 'date-fns';
import { useTaskList } from '../../context/TaskListContext';
import styles from './TaskListDashboard.module.css';

const TaskListDashboard = ({ onBack }) => {
    const {
        tasks,
        categories,
        priorities,
        statuses,
        addTask,
        updateTask,
        toggleTaskComplete,
        deleteTask,
        getStats
    } = useTaskList();

    const [showAddModal, setShowAddModal] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [filterPriority, setFilterPriority] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');

    // New task form state
    const [newTask, setNewTask] = useState({
        text: '',
        dueDate: format(new Date(), 'yyyy-MM-dd'),
        priority: 'medium',
        status: 'not-started',
        category: categories[0]?.id || '',
        note: ''
    });

    const stats = getStats();
    const today = startOfDay(new Date());

    // Filter tasks
    const filteredTasks = tasks.filter(task => {
        if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
        if (filterStatus !== 'all' && task.status !== filterStatus) return false;
        if (filterCategory !== 'all' && task.category !== filterCategory) return false;
        return true;
    });

    const handleAddTask = () => {
        if (newTask.text.trim()) {
            addTask(newTask);
            setNewTask({
                text: '',
                dueDate: format(new Date(), 'yyyy-MM-dd'),
                priority: 'medium',
                status: 'not-started',
                category: categories[0]?.id || '',
                note: ''
            });
            setShowAddModal(false);
        }
    };

    const isOverdue = (dueDate) => {
        if (!dueDate) return false;
        return isBefore(parseISO(dueDate), today);
    };

    const getCategoryInfo = (categoryId) => {
        return categories.find(c => c.id === categoryId) || { name: 'None', emoji: '' };
    };

    const getPriorityInfo = (priorityId) => {
        return priorities.find(p => p.id === priorityId) || { name: 'Medium', color: '#fdd835' };
    };

    const getStatusInfo = (statusId) => {
        return statuses.find(s => s.id === statusId) || { name: 'Not Started', icon: '⚠️' };
    };

    return (
        <div className={styles.taskListDashboard}>
            <button className={styles.backButton} onClick={onBack}>
                ← Back to Home
            </button>

            {/* Stats Header */}
            <div className={styles.statsHeader}>
                <div className={styles.dateSection}>
                    <div className={styles.dateLabel}>Date</div>
                    <div className={styles.dateValue}>{format(new Date(), 'dd/MM/yyyy')}</div>
                </div>
                <h1 className={styles.mainTitle}>TASK LIST</h1>
                <div className={styles.statBox}>
                    <div className={`${styles.statValue} ${styles.green}`}>{stats.today}</div>
                    <div className={styles.statLabel}>Today</div>
                </div>
                <div className={styles.statBox}>
                    <div className={`${styles.statValue} ${styles.gray}`}>{stats.total}</div>
                    <div className={styles.statLabel}>Total Tasks</div>
                </div>
                <div className={styles.statBox}>
                    <div className={`${styles.statValue} ${styles.yellow}`}>{stats.overdue}</div>
                    <div className={styles.statLabel}>Overdue</div>
                </div>
                <div className={styles.statBox}>
                    <div className={`${styles.statValue} ${styles.gray}`}>{stats.notCompleted}</div>
                    <div className={styles.statLabel}>Not Completed</div>
                </div>
                <div className={styles.statBox}>
                    <div className={`${styles.statValue} ${styles.gray}`}>{stats.completed}</div>
                    <div className={styles.statLabel}>Completed</div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className={styles.progressSection}>
                <div className={styles.progressBar}>
                    <span className={styles.progressPercent}>{stats.percentage}%</span>
                    <div className={styles.progressTrack}>
                        <div
                            className={styles.progressFill}
                            style={{ width: `${stats.percentage}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Settings Panel */}
            {showSettings && (
                <div className={styles.settingsPanel}>
                    <h2 className={styles.settingsTitle}>Settings</h2>
                    <div className={styles.settingsGrid}>
                        <div className={styles.settingsColumn}>
                            <div className={styles.settingsColumnTitle}>Categories</div>
                            <ul className={styles.settingsList}>
                                {categories.map(cat => (
                                    <li key={cat.id}>{cat.name} {cat.emoji}</li>
                                ))}
                            </ul>
                        </div>
                        <div className={styles.settingsColumn}>
                            <div className={styles.settingsColumnTitle}>Priority</div>
                            <ul className={styles.settingsList}>
                                {priorities.map(p => (
                                    <li key={p.id}>
                                        <span style={{
                                            display: 'inline-block',
                                            width: 10,
                                            height: 10,
                                            borderRadius: '50%',
                                            background: p.color,
                                            marginRight: 6
                                        }}></span>
                                        {p.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className={styles.settingsColumn}>
                            <div className={styles.settingsColumnTitle}>Status</div>
                            <ul className={styles.settingsList}>
                                {statuses.map(s => (
                                    <li key={s.id}>{s.icon} {s.name}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className={styles.tableContainer}>
                <div className={styles.toolbar}>
                    <button className={styles.addTaskBtn} onClick={() => setShowAddModal(true)}>
                        + Add Task
                    </button>
                    <div className={styles.filters}>
                        <select
                            className={styles.filterSelect}
                            value={filterPriority}
                            onChange={(e) => setFilterPriority(e.target.value)}
                        >
                            <option value="all">All Priorities</option>
                            {priorities.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                        <select
                            className={styles.filterSelect}
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">All Statuses</option>
                            {statuses.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                        <select
                            className={styles.filterSelect}
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                        >
                            <option value="all">All Categories</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
                            ))}
                        </select>
                        <button
                            className={styles.settingsToggle}
                            onClick={() => setShowSettings(!showSettings)}
                        >
                            ⚙️ Settings
                        </button>
                    </div>
                </div>

                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th style={{ width: 40 }}></th>
                            <th>Task</th>
                            <th>Due Date</th>
                            <th>Priority</th>
                            <th>Status</th>
                            <th>Category</th>
                            <th>Note</th>
                            <th style={{ width: 40 }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTasks.length === 0 ? (
                            <tr>
                                <td colSpan={8} className={styles.emptyState}>
                                    No tasks yet. Click "+ Add Task" to create one!
                                </td>
                            </tr>
                        ) : (
                            filteredTasks.map(task => (
                                <tr key={task.id}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            className={styles.taskCheckbox}
                                            checked={task.completed}
                                            onChange={() => toggleTaskComplete(task.id)}
                                        />
                                    </td>
                                    <td>
                                        <span className={`${styles.taskText} ${task.completed ? styles.completed : ''}`}>
                                            {task.text}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`${styles.dueDate} ${!task.completed && isOverdue(task.dueDate) ? styles.overdue : ''}`}>
                                            {task.dueDate ? format(parseISO(task.dueDate), 'dd.MM.yyyy') : '-'}
                                        </span>
                                    </td>
                                    <td>
                                        <select
                                            className={styles.inlineSelect}
                                            value={task.priority}
                                            onChange={(e) => updateTask(task.id, { priority: e.target.value })}
                                        >
                                            {priorities.map(p => (
                                                <option key={p.id} value={p.id}>{p.name}</option>
                                            ))}
                                        </select>
                                        <span
                                            className={styles.priorityDot}
                                            style={{ background: getPriorityInfo(task.priority).color }}
                                        ></span>
                                    </td>
                                    <td>
                                        <select
                                            className={styles.inlineSelect}
                                            value={task.status}
                                            onChange={(e) => updateTask(task.id, {
                                                status: e.target.value,
                                                completed: e.target.value === 'done'
                                            })}
                                        >
                                            {statuses.map(s => (
                                                <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <select
                                            className={styles.inlineSelect}
                                            value={task.category}
                                            onChange={(e) => updateTask(task.id, { category: e.target.value })}
                                        >
                                            {categories.map(c => (
                                                <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className={styles.noteCell} title={task.note}>
                                        {task.note || '-'}
                                    </td>
                                    <td>
                                        <button
                                            className={styles.deleteBtn}
                                            onClick={() => deleteTask(task.id)}
                                            title="Delete task"
                                        >
                                            ×
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Task Modal */}
            {showAddModal && (
                <div className={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>Add New Task</h3>
                            <button className={styles.modalClose} onClick={() => setShowAddModal(false)}>
                                ×
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Task Name *</label>
                                <input
                                    type="text"
                                    className={styles.formInput}
                                    value={newTask.text}
                                    onChange={(e) => setNewTask({ ...newTask, text: e.target.value })}
                                    placeholder="Enter task name..."
                                    autoFocus
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Due Date</label>
                                <input
                                    type="date"
                                    className={styles.formInput}
                                    value={newTask.dueDate}
                                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Priority</label>
                                <select
                                    className={styles.formSelect}
                                    value={newTask.priority}
                                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                                >
                                    {priorities.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Category</label>
                                <select
                                    className={styles.formSelect}
                                    value={newTask.category}
                                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                                >
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Note (optional)</label>
                                <input
                                    type="text"
                                    className={styles.formInput}
                                    value={newTask.note}
                                    onChange={(e) => setNewTask({ ...newTask, note: e.target.value })}
                                    placeholder="Add a note..."
                                />
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button className={styles.cancelBtn} onClick={() => setShowAddModal(false)}>
                                Cancel
                            </button>
                            <button className={styles.saveBtn} onClick={handleAddTask}>
                                Add Task
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskListDashboard;
