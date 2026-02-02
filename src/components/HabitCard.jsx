import React from 'react';
import { motion } from 'framer-motion';
import { Check, Flame, Trash2 } from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import { format } from 'date-fns';
import clsx from 'clsx';
import styles from './HabitCard.module.css';

const HabitCard = ({ habit }) => {
    const { toggleHabit, deleteHabit } = useHabits();
    const today = format(new Date(), 'yyyy-MM-dd');
    const isCompleted = habit.completedDates.includes(today);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`glass-panel ${styles.card}`}
            style={{
                borderLeft: `4px solid ${habit.color || 'var(--accent-primary)'}`
            }}
        >
            <div className={styles.content}>
                <h3 className={styles.title}>{habit.name}</h3>
                <div className={styles.streak}>
                    <span className={clsx(styles.streak, habit.streak > 0 && styles.streakActive)}>
                        <Flame
                            size={16}
                            className={clsx(styles.fireIcon, habit.streak > 0 && styles.active)}
                        />
                        {habit.streak} Day Streak
                    </span>
                </div>
            </div>

            <button
                onClick={() => toggleHabit(habit.id)}
                className={clsx(styles.checkBtn, isCompleted && styles.completed)}
            >
                {isCompleted && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <Check size={20} />
                    </motion.div>
                )}
            </button>

            <button
                onClick={(e) => { e.stopPropagation(); deleteHabit(habit.id); }}
                className={styles.deleteBtn}
                title="Delete Habit"
            >
                <Trash2 size={16} />
            </button>
        </motion.div>
    );
};

export default HabitCard;
