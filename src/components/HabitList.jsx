import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useHabits } from '../context/HabitContext';
import HabitCard from './HabitCard';
import styles from './HabitList.module.css';

const HabitList = () => {
    const { habits } = useHabits();

    if (habits.length === 0) {
        return (
            <div className={styles.emptyState}>
                <p>No habits yet. Start by adding one!</p>
            </div>
        );
    }

    return (
        <div className={styles.grid}>
            <AnimatePresence>
                {habits.map(habit => (
                    <HabitCard key={habit.id} habit={habit} />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default HabitList;
