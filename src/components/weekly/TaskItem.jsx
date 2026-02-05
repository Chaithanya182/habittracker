import React from 'react';
import { useTasks } from '../../context/TaskContext';
import styles from './TaskItem.module.css';

const TaskItem = ({ task, date }) => {
    const { toggleTask, deleteTask } = useTasks();

    return (
        <div className={styles.taskItem}>
            <input
                type="checkbox"
                className={styles.checkbox}
                checked={task.completed}
                onChange={() => toggleTask(date, task.id)}
            />
            <span className={`${styles.taskText} ${task.completed ? styles.completed : ''}`}>
                {task.text}
            </span>
            <button
                className={styles.deleteButton}
                onClick={() => deleteTask(date, task.id)}
                title="Delete task"
            >
                ×
            </button>
        </div>
    );
};

export default TaskItem;
