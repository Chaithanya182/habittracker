import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { subDays, format } from 'date-fns';
import { useHabits } from '../context/HabitContext';
import styles from './ProgressChart.module.css';

const ProgressChart = () => {
    const { habits } = useHabits();

    const data = useMemo(() => {
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = subDays(new Date(), 6 - i);
            return {
                date: format(date, 'EEE'), // Mon, Tue...
                fullDate: format(date, 'yyyy-MM-dd'),
                count: 0
            };
        });

        habits.forEach(habit => {
            habit.completedDates.forEach(date => {
                const dayStat = last7Days.find(d => d.fullDate === date);
                if (dayStat) {
                    dayStat.count += 1;
                }
            });
        });

        return last7Days;
    }, [habits]);

    if (habits.length === 0) return null;

    return (
        <div className={`glass-panel ${styles.container}`}>
            <h3 className={styles.title}>Your Activity</h3>
            <div className={styles.chartWrapper}>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={data}>
                        <XAxis
                            dataKey="date"
                            stroke="#94a3b8"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            contentStyle={{
                                backgroundColor: '#1e293b',
                                border: 'none',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                        />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill="url(#colorGradient)" />
                            ))}
                        </Bar>
                        <defs>
                            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.3} />
                            </linearGradient>
                        </defs>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ProgressChart;
