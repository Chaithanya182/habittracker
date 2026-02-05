import React, { useState } from 'react';
import { format, startOfWeek } from 'date-fns';
import { useTasks } from '../../context/TaskContext';
import styles from './SetupScreen.module.css';

const SetupScreen = () => {
    const { completeSetup } = useTasks();

    const [quote, setQuote] = useState('Inspiration comes only during work');
    const [weekStart, setWeekStart] = useState(() => {
        const today = new Date();
        const sunday = startOfWeek(today, { weekStartsOn: 0 });
        return format(sunday, 'yyyy-MM-dd');
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        completeSetup(weekStart, quote);
    };

    return (
        <div className={styles.setupContainer}>
            <form className={styles.setupCard} onSubmit={handleSubmit}>
                <h1 className={styles.title}>
                    Select the first day of the week for the tracker to update, and write a quote that will motivate you!
                </h1>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Your Motivational Quote</label>
                    <textarea
                        className={styles.quoteInput}
                        value={quote}
                        onChange={(e) => setQuote(e.target.value)}
                        placeholder="Enter a quote that motivates you..."
                        rows={2}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Start of the Week</label>
                    <div className={styles.datePickerWrapper}>
                        <span className={styles.dateLabel}>Start of the week</span>
                        <input
                            type="date"
                            className={styles.dateInput}
                            value={weekStart}
                            onChange={(e) => setWeekStart(e.target.value)}
                        />
                    </div>
                </div>

                <button type="submit" className={styles.startButton}>
                    Get Started
                </button>

                {quote && (
                    <div className={styles.preview}>
                        <p className={styles.previewLabel}>Preview</p>
                        <p className={styles.previewQuote}>"{quote}"</p>
                    </div>
                )}
            </form>
        </div>
    );
};

export default SetupScreen;
