import React from 'react';
import { useTasks } from '../../context/TaskContext';
import QuoteSection from './QuoteSection';
import OverallProgress from './OverallProgress';
import HabitTrackerGrid from './HabitTrackerGrid';
import DayColumn from './DayColumn';
import styles from './Dashboard.module.css';

const Dashboard = () => {
    const { getWeekDates } = useTasks();
    const weekDates = getWeekDates();

    return (
        <div className={styles.dashboard}>
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
