import React, { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import QuoteSection from './QuoteSection';
import OverallProgress from './OverallProgress';
import HabitTrackerGrid from './HabitTrackerGrid';
import DayColumn from './DayColumn';
import styles from './Dashboard.module.css';

const Dashboard = () => {
    const { getWeekDates, resetAll } = useTasks();
    const weekDates = getWeekDates();
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    const handleReset = () => {
        resetAll();
        setShowResetConfirm(false);
    };

    return (
        <div className={styles.dashboard}>
            {/* Reset Button */}
            <button
                className={styles.resetButton}
                onClick={() => setShowResetConfirm(true)}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14M10 11v6M14 11v6" />
                </svg>
                Reset
            </button>

            {/* Reset Confirmation Modal */}
            {showResetConfirm && (
                <div className={styles.modalOverlay} onClick={() => setShowResetConfirm(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <h3>⚠️ Reset Weekly Tracker?</h3>
                        <p>This will permanently delete all tasks, habits, and notes. This action cannot be undone.</p>
                        <div className={styles.modalButtons}>
                            <button onClick={() => setShowResetConfirm(false)}>Cancel</button>
                            <button className={styles.dangerButton} onClick={handleReset}>Yes, Reset All</button>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.topRow}>
                <QuoteSection />
                <OverallProgress />
                <HabitTrackerGrid />
            </div>

            <div className={styles.weekGrid}>
                {weekDates.map(date => (
                    <DayColumn key={date} date={date} />
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
