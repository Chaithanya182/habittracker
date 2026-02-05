import React, { useState } from 'react';
import { format } from 'date-fns';
import { useHabits } from '../../context/HabitContext';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import styles from './HabitDashboard.module.css';

const HabitDashboard = ({ onBack }) => {
    const {
        currentMonth,
        habits,
        nextMonth,
        prevMonth,
        addHabit,
        deleteHabit,
        toggleCompletion,
        getMonthDays,
        isCompleted,
        getHabitStats,
        getMonthStats,
        getDayStats,
        getMentalState,
        setMentalState,
        getYearlyStats,
        resetAll
    } = useHabits();

    const [newHabitName, setNewHabitName] = useState('');
    const [newHabitEmoji, setNewHabitEmoji] = useState('📌');
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    const handleReset = () => {
        resetAll();
        setShowResetConfirm(false);
    };

    const monthDays = getMonthDays();
    const monthStats = getMonthStats();
    const monthName = format(new Date(currentMonth + '-01'), 'MMMM yyyy');

    // Group days by week
    const weeks = [];
    let currentWeek = 1;
    let weekDays = [];

    monthDays.forEach((day, index) => {
        weekDays.push(day);
        if (day.dayOfWeek === 6 || index === monthDays.length - 1) {
            weeks.push({ week: currentWeek, days: weekDays });
            currentWeek++;
            weekDays = [];
        }
    });

    // Chart data
    const chartData = monthDays.map(day => ({
        day: day.day,
        progress: getDayStats(day.date).percentage
    }));

    // Mental state chart data
    const mentalStateData = monthDays.map(day => {
        const mentalState = getMentalState(day.date);
        return {
            day: day.day,
            mood: mentalState.mood || 0,
            motivation: mentalState.motivation || 0
        };
    });

    // Yearly stats
    const yearlyStats = getYearlyStats();

    const handleAddHabit = () => {
        if (newHabitName.trim()) {
            addHabit(newHabitName.trim(), newHabitEmoji);
            setNewHabitName('');
            setNewHabitEmoji('📌');
        }
    };

    return (
        <div className={styles.habitDashboard}>
            <button className={styles.backButton} onClick={onBack}>
                ← Back to Home
            </button>

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
                    <div className={styles.resetModal} onClick={e => e.stopPropagation()}>
                        <h3>⚠️ Reset Habit Tracker?</h3>
                        <p>This will permanently delete all habits, completions, and mental state data. This action cannot be undone.</p>
                        <div className={styles.modalButtons}>
                            <button onClick={() => setShowResetConfirm(false)}>Cancel</button>
                            <button className={styles.dangerButton} onClick={handleReset}>Yes, Reset All</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className={styles.header}>
                <div className={styles.monthNav}>
                    <button className={styles.navBtn} onClick={prevMonth}>◀</button>
                    <h1 className={styles.monthTitle}>{monthName}</h1>
                    <button className={styles.navBtn} onClick={nextMonth}>▶</button>
                </div>

                <div className={styles.statsRow}>
                    <div className={styles.statItem}>
                        <div className={styles.statLabel}>Number of habits</div>
                        <div className={styles.statValue}>{monthStats.numberOfHabits}</div>
                    </div>
                    <div className={styles.statItem}>
                        <div className={styles.statLabel}>Completed habits</div>
                        <div className={styles.statValue}>{monthStats.completedHabits}</div>
                    </div>
                    <div className={styles.progressBar}>
                        <div className={styles.statLabel}>Progress</div>
                        <div className={styles.progressTrack}>
                            <div
                                className={styles.progressFill}
                                style={{ width: `${monthStats.percentage}%` }}
                            />
                        </div>
                    </div>
                    <div className={styles.statItem}>
                        <div className={styles.statLabel}>Progress in %</div>
                        <div className={styles.statValue}>{monthStats.percentage}%</div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className={styles.mainContent}>
                {/* Calendar Grid */}
                <div className={styles.calendarSection}>
                    <table className={styles.calendarTable}>
                        <thead>
                            <tr>
                                <th className={styles.habitNameCell}>My Habits</th>
                                {weeks.map((week, wi) => (
                                    <React.Fragment key={wi}>
                                        <th colSpan={week.days.length} className={styles.weekHeader}>
                                            Week {week.week}
                                        </th>
                                    </React.Fragment>
                                ))}
                            </tr>
                            <tr>
                                <th></th>
                                {monthDays.map(day => (
                                    <th key={day.date}>
                                        <div className={styles.dayHeader}>
                                            {['Sa', 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr'][day.dayOfWeek]}
                                        </div>
                                        <div className={styles.dayNumber}>{day.day}</div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {habits.length === 0 ? (
                                <tr>
                                    <td colSpan={monthDays.length + 1} className={styles.emptyState}>
                                        No habits yet. Add one below!
                                    </td>
                                </tr>
                            ) : (
                                habits.map(habit => (
                                    <tr key={habit.id}>
                                        <td className={styles.habitNameCell}>
                                            <button
                                                className={styles.deleteBtn}
                                                onClick={() => deleteHabit(habit.id)}
                                            >
                                                ×
                                            </button>
                                            <span className={styles.habitEmoji}>{habit.emoji}</span>
                                            {habit.name}
                                        </td>
                                        {monthDays.map(day => (
                                            <td key={day.date}>
                                                <input
                                                    type="checkbox"
                                                    className={styles.checkbox}
                                                    checked={isCompleted(habit.id, day.date)}
                                                    onChange={() => toggleCompletion(habit.id, day.date)}
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                            {/* Daily Progress Row */}
                            <tr>
                                <td className={styles.habitNameCell}>
                                    <strong>Progress</strong>
                                </td>
                                {monthDays.map(day => {
                                    const stats = getDayStats(day.date);
                                    return (
                                        <td key={day.date} style={{ fontSize: 10 }}>
                                            {stats.percentage}%
                                        </td>
                                    );
                                })}
                            </tr>
                            <tr>
                                <td className={styles.habitNameCell}>Done</td>
                                {monthDays.map(day => {
                                    const stats = getDayStats(day.date);
                                    return <td key={day.date} style={{ fontSize: 10 }}>{stats.done}</td>;
                                })}
                            </tr>
                            <tr>
                                <td className={styles.habitNameCell}>Not Done</td>
                                {monthDays.map(day => {
                                    const stats = getDayStats(day.date);
                                    return <td key={day.date} style={{ fontSize: 10 }}>{stats.notDone}</td>;
                                })}
                            </tr>
                            {/* Mood Row */}
                            <tr className={styles.mentalStateRow}>
                                <td className={styles.habitNameCell}>😊 Mood</td>
                                {monthDays.map(day => {
                                    const mentalState = getMentalState(day.date);
                                    return (
                                        <td key={day.date}>
                                            <select
                                                className={styles.mentalStateSelect}
                                                value={mentalState.mood || ''}
                                                onChange={(e) => setMentalState(day.date, 'mood', e.target.value ? parseInt(e.target.value) : null)}
                                            >
                                                <option value="">-</option>
                                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                                    <option key={n} value={n}>{n}</option>
                                                ))}
                                            </select>
                                        </td>
                                    );
                                })}
                            </tr>
                            {/* Motivation Row */}
                            <tr className={styles.mentalStateRow}>
                                <td className={styles.habitNameCell}>🔥 Motivation</td>
                                {monthDays.map(day => {
                                    const mentalState = getMentalState(day.date);
                                    return (
                                        <td key={day.date}>
                                            <select
                                                className={styles.mentalStateSelect}
                                                value={mentalState.motivation || ''}
                                                onChange={(e) => setMentalState(day.date, 'motivation', e.target.value ? parseInt(e.target.value) : null)}
                                            >
                                                <option value="">-</option>
                                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                                    <option key={n} value={n}>{n}</option>
                                                ))}
                                            </select>
                                        </td>
                                    );
                                })}
                            </tr>
                        </tbody>
                    </table>

                    {/* Add Habit Form */}
                    <div className={styles.addHabitRow}>
                        <select
                            className={styles.addInput}
                            value={newHabitEmoji}
                            onChange={(e) => setNewHabitEmoji(e.target.value)}
                            style={{ maxWidth: 60 }}
                        >
                            <option value="📌">📌</option>
                            <option value="⏰">⏰</option>
                            <option value="💪">💪</option>
                            <option value="📚">📚</option>
                            <option value="📝">📝</option>
                            <option value="💰">💰</option>
                            <option value="🧘">🧘</option>
                            <option value="🏃">🏃</option>
                            <option value="💧">💧</option>
                            <option value="🥗">🥗</option>
                            <option value="😴">😴</option>
                            <option value="🎯">🎯</option>
                        </select>
                        <input
                            type="text"
                            className={styles.addInput}
                            value={newHabitName}
                            onChange={(e) => setNewHabitName(e.target.value)}
                            placeholder="New habit name..."
                            onKeyDown={(e) => e.key === 'Enter' && handleAddHabit()}
                        />
                        <button className={styles.addBtn} onClick={handleAddHabit}>
                            + Add Habit
                        </button>
                    </div>
                </div>

                {/* Analysis Section */}
                <div className={styles.analysisSection}>
                    <div className={styles.analysisTitle}>Analysis</div>
                    <table className={styles.analysisTable}>
                        <thead>
                            <tr>
                                <th>Goal</th>
                                <th>Actual</th>
                                <th>Progress</th>
                            </tr>
                        </thead>
                        <tbody>
                            {habits.map(habit => {
                                const stats = getHabitStats(habit.id);
                                return (
                                    <tr key={habit.id}>
                                        <td>{stats.goal}</td>
                                        <td>{stats.actual}</td>
                                        <td>
                                            <div
                                                className={styles.analysisBar}
                                                style={{ width: `${Math.min(stats.percentage, 100)}%` }}
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Progress Chart */}
            <div className={styles.chartSection}>
                <div className={styles.chartTitle}>Daily Progress</div>
                <ResponsiveContainer width="100%" height="85%">
                    <AreaChart data={chartData}>
                        <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
                        <Tooltip />
                        <Area
                            type="monotone"
                            dataKey="progress"
                            stroke="var(--green-primary)"
                            fill="var(--green-light)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Mental State Chart */}
            <div className={styles.chartSection}>
                <div className={styles.chartTitle}>Mental State (Mood & Motivation)</div>
                <ResponsiveContainer width="100%" height="85%">
                    <AreaChart data={mentalStateData}>
                        <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} domain={[0, 10]} />
                        <Tooltip />
                        <Area
                            type="monotone"
                            dataKey="mood"
                            name="Mood"
                            stroke="#e91e63"
                            fill="#f8bbd9"
                        />
                        <Area
                            type="monotone"
                            dataKey="motivation"
                            name="Motivation"
                            stroke="#ff5722"
                            fill="#ffccbc"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Yearly Statistics */}
            <div className={styles.yearlySection}>
                <div className={styles.yearlyTitle}>Yearly Statistics</div>

                {/* Yearly Chart */}
                <div className={styles.yearlyChart}>
                    <ResponsiveContainer width="100%" height={150}>
                        <AreaChart data={yearlyStats}>
                            <XAxis dataKey="month" tick={{ fontSize: 9 }} interval={0} angle={-45} textAnchor="end" height={50} />
                            <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
                            <Tooltip />
                            <Area
                                type="monotone"
                                dataKey="percentage"
                                name="Progress %"
                                stroke="var(--green-primary)"
                                fill="var(--green-light)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Monthly Cards */}
                <div className={styles.monthlyCards}>
                    {yearlyStats.map(month => (
                        <div key={month.monthKey} className={styles.monthCard}>
                            <div className={styles.monthCardTitle}>{month.month}</div>
                            <div className={styles.monthCardStats}>
                                <div className={styles.monthStat}>
                                    <span className={styles.monthStatLabel}>Habits</span>
                                    <span className={styles.monthStatValue}>{month.numberOfHabits}</span>
                                </div>
                                <div className={styles.monthStat}>
                                    <span className={styles.monthStatLabel}>Completed</span>
                                    <span className={styles.monthStatValue}>{month.completed}</span>
                                </div>
                                <div className={styles.monthStat}>
                                    <span className={styles.monthStatLabel}>Progress</span>
                                    <span className={styles.monthStatValue}>{month.percentage}%</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HabitDashboard;
