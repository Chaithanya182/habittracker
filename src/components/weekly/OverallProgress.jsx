import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { format, parseISO } from 'date-fns';
import { useTasks } from '../../context/TaskContext';
import CircularProgress from './CircularProgress';
import styles from './OverallProgress.module.css';

const OverallProgress = () => {
    const { getWeekDates, getTaskStats } = useTasks();
    const weekDates = getWeekDates();
    const stats = getTaskStats();

    const chartData = weekDates.map(date => {
        const dayStats = stats.dailyStats[date] || { total: 0, completed: 0 };
        const dayName = format(parseISO(date), 'EEE');
        return {
            name: dayName,
            tasks: dayStats.total,
            completed: dayStats.completed
        };
    });

    return (
        <div className={styles.overallProgress}>
            <div className={styles.header}>Overall Progress</div>
            <div className={styles.content}>
                <div className={styles.chartContainer}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#666' }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#666' }}
                                allowDecimals={false}
                            />
                            <Bar dataKey="tasks" radius={[4, 4, 0, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.completed === entry.tasks && entry.tasks > 0
                                            ? '#14b8a6'
                                            : '#ccfbf1'}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className={styles.progressContainer}>
                    <CircularProgress
                        percentage={stats.percentage}
                        size={90}
                        strokeWidth={8}
                        color="#14b8a6"
                    />
                    <div className={styles.completedText}>
                        <span className={styles.completedCount}>
                            {stats.completedTasks} / {stats.totalTasks}
                        </span> Completed
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverallProgress;
