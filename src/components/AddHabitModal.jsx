import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import styles from './AddHabitModal.module.css';

const COLORS = [
    '#8b5cf6', // Violet
    '#10b981', // Emerald
    '#3b82f6', // Blue
    '#f59e0b', // Amber
    '#ef4444', // Red
    '#ec4899', // Pink
    '#6366f1', // Indigo
    '#14b8a6', // Teal
];

const AddHabitModal = ({ isOpen, onClose }) => {
    const { addHabit } = useHabits();
    const [name, setName] = useState('');
    const [color, setColor] = useState(COLORS[0]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        addHabit({
            name,
            color,
            frequency: 'daily'
        });

        setName('');
        setColor(COLORS[0]);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className={styles.backdrop}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <motion.div
                        className={`glass-panel ${styles.modal}`}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    >
                        <div className={styles.header}>
                            <h2>New Habit</h2>
                            <button onClick={onClose} className={styles.closeBtn}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.field}>
                                <label>Habit Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g., Read 30 mins"
                                    autoFocus
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.field}>
                                <label>Color Tag</label>
                                <div className={styles.colors}>
                                    {COLORS.map(c => (
                                        <button
                                            key={c}
                                            type="button"
                                            className={`${styles.colorBtn} ${color === c ? styles.selected : ''}`}
                                            style={{ backgroundColor: c }}
                                            onClick={() => setColor(c)}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className={styles.actions}>
                                <button type="button" onClick={onClose} className={styles.cancelBtn}>
                                    Cancel
                                </button>
                                <button type="submit" className={styles.submitBtn}>
                                    Create Habit
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AddHabitModal;
