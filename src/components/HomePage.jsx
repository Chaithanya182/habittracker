import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';

const HomePage = () => {
    const navigate = useNavigate();
    const [showCoffeePopup, setShowCoffeePopup] = useState(false);
    const [copied, setCopied] = useState(false);

    const cards = [
        {
            id: 'weekly-tracker',
            icon: '📅',
            title: 'Weekly Tracker',
            description: 'Plan your week with daily tasks, habits, and personal notes'
        },
        {
            id: 'task-list',
            icon: '✅',
            title: 'Task List',
            description: 'Manage tasks with priorities, categories, and due dates'
        },
        {
            id: 'habit-tracker',
            icon: '🎯',
            title: 'Habit Tracker',
            description: 'Build lasting habits with monthly tracking and analysis'
        },
        {
            id: 'finance-tracker',
            icon: '💰',
            title: 'Finance Tracker',
            description: 'Track income, expenses, and debts with visual analytics'
        }
    ];

    const handleCopyUPI = () => {
        navigator.clipboard.writeText('8688346526@ybl');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={styles.homePage}>
            <div className={styles.header}>
                <h1 className={styles.title}>
                    Productivity <span>Hub</span>
                </h1>
                <p className={styles.subtitle}>Choose a tracker to get started</p>
            </div>

            <div className={styles.cardsContainer}>
                {cards.map((card) => (
                    <div
                        key={card.id}
                        className={styles.card}
                        onClick={() => navigate(`/${card.id}`)}
                    >
                        <div className={styles.cardIcon}>{card.icon}</div>
                        <h2 className={styles.cardTitle}>{card.title}</h2>
                        <p className={styles.cardDescription}>{card.description}</p>
                        <div className={styles.cardArrow}>→</div>
                    </div>
                ))}
            </div>

            <div className={styles.footer}>
                <p className={styles.footerText}>
                    Made with ❤️ by{' '}
                    <a
                        href="https://www.linkedin.com/in/chaithanya-prasad-chalicheemala/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.footerLink}
                    >
                        Chaithanya
                    </a>
                </p>
                <button
                    className={styles.coffeeButton}
                    onClick={() => setShowCoffeePopup(true)}
                >
                    ☕ Buy me a coffee
                </button>
            </div>

            {/* Coffee Popup */}
            {showCoffeePopup && (
                <div className={styles.popupOverlay} onClick={() => setShowCoffeePopup(false)}>
                    <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
                        <button
                            className={styles.popupClose}
                            onClick={() => setShowCoffeePopup(false)}
                        >
                            ×
                        </button>
                        <div className={styles.popupIcon}>☕</div>
                        <h3 className={styles.popupTitle}>Support My Work</h3>
                        <p className={styles.popupText}>
                            If you find this app helpful, consider buying me a coffee!
                        </p>
                        <div className={styles.upiSection}>
                            <div className={styles.upiLabel}>UPI ID</div>
                            <div className={styles.upiBox}>
                                <span className={styles.upiId}>8688346526@ybl</span>
                                <button
                                    className={styles.copyButton}
                                    onClick={handleCopyUPI}
                                >
                                    {copied ? '✓ Copied!' : '📋 Copy'}
                                </button>
                            </div>
                        </div>
                        <p className={styles.popupThanks}>Thank you for your support! 🙏</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;
