import React from 'react';
import styles from './CircularProgress.module.css';

const CircularProgress = ({
    percentage = 0,
    size = 100,
    strokeWidth = 8,
    showPercentage = true,
    color = 'var(--green-ring)',
    backgroundColor = 'var(--gray-200)'
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className={styles.container} style={{ width: size, height: size }}>
            <svg width={size} height={size} className={styles.svg}>
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={backgroundColor}
                    strokeWidth={strokeWidth}
                />
                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className={styles.progressCircle}
                />
            </svg>
            {showPercentage && (
                <div className={styles.percentageText}>
                    {percentage}%
                </div>
            )}
        </div>
    );
};

export default CircularProgress;
