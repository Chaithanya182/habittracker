import React from 'react';
import styles from './Header.module.css';

const Header = () => {
    const hour = new Date().getHours();
    const getGreeting = () => {
        if (hour < 12) return 'Good Morning, Doer';
        if (hour < 18) return 'Good Afternoon, Doer';
        return 'Good Evening, Doer';
    };

    return (
        <header className={`glass-panel ${styles.header}`}>
            <div>
                <h1 className={styles.title}>{getGreeting()}</h1>
                <p className={styles.subtitle}>Let's crush your goals today.</p>
            </div>
            {/* Could add user avatar or total streaks here later */}
        </header>
    );
};

export default Header;
