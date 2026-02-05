import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';

const quotes = [
    { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
    { text: "Your limitation—it's only your imagination.", author: "Unknown" },
    { text: "Great things never come from comfort zones.", author: "Unknown" },
];

const HomePage = () => {
    const navigate = useNavigate();
    const [showCoffeePopup, setShowCoffeePopup] = useState(false);
    const [copied, setCopied] = useState(false);
    const [currentQuote, setCurrentQuote] = useState(quotes[0]);

    useEffect(() => {
        setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    }, []);

    const cards = [
        {
            id: 'weekly-tracker',
            icon: '📅',
            title: 'Weekly Tracker',
            description: 'Plan your week with daily tasks, habits, and personal notes. Visualize your schedule.',
            color: 'blue',
            buttonText: 'Open Planner'
        },
        {
            id: 'task-list',
            icon: '✅',
            title: 'Task List',
            description: 'Manage tasks with priorities, categories, and due dates. Never miss a deadline again.',
            color: 'emerald',
            buttonText: 'View Tasks'
        },
        {
            id: 'habit-tracker',
            icon: '🎯',
            title: 'Habit Tracker',
            description: 'Build lasting habits with monthly tracking and detailed streak analysis. Stay consistent.',
            color: 'rose',
            buttonText: 'Track Habits'
        },
        {
            id: 'finance-tracker',
            icon: '💰',
            title: 'Finance Tracker',
            description: 'Track income, expenses, and debts with visual analytics. Take control of your money.',
            color: 'amber',
            buttonText: 'Manage Finance'
        }
    ];

    const handleCopyUPI = () => {
        navigator.clipboard.writeText('8688346526@ybl');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shuffleQuote = () => {
        let newQuote;
        do {
            newQuote = quotes[Math.floor(Math.random() * quotes.length)];
        } while (newQuote.text === currentQuote.text && quotes.length > 1);
        setCurrentQuote(newQuote);
    };

    return (
        <div className={styles.homePage}>
            {/* Navigation */}
            <nav className={styles.nav}>
                <div className={styles.logo}>
                    Track<span>log</span>
                </div>
                <div className={styles.statusBadge}>
                    <span className={styles.statusDot}></span>
                    <span>All Systems Operational</span>
                </div>
            </nav>

            {/* Hero Section */}
            <header className={styles.hero}>
                <div className={styles.blobContainer}>
                    <div className={`${styles.blob} ${styles.blob1}`}></div>
                    <div className={`${styles.blob} ${styles.blob2}`}></div>
                    <div className={`${styles.blob} ${styles.blob3}`}></div>
                </div>

                <h1 className={styles.heroTitle}>
                    Master Your Life,<br />
                    <span className={styles.gradientText}>One Track at a Time</span>
                </h1>
                <p className={styles.heroSubtitle}>
                    Choose a tracker to get started. Build lasting habits, organize your finances,
                    and reclaim your weekly schedule with our intuitive tools.
                </p>

                <div className={styles.statsBadge}>
                    <span className={styles.statsIcon}>📈</span>
                    <span>85% Habit Success Rate</span>
                </div>
            </header>

            {/* Cards Grid */}
            <main className={styles.cardsContainer}>
                {cards.map((card, index) => (
                    <div
                        key={card.id}
                        className={`${styles.card} ${styles[`card${card.color.charAt(0).toUpperCase() + card.color.slice(1)}`]}`}
                        onClick={() => navigate(`/${card.id}`)}
                        style={{ animationDelay: `${index * 0.5}s` }}
                    >
                        <div className={styles.cardArrowHover}>→</div>
                        <div className={`${styles.cardIcon} ${styles[`icon${card.color.charAt(0).toUpperCase() + card.color.slice(1)}`]}`}>
                            {card.icon}
                        </div>
                        <h3 className={styles.cardTitle}>{card.title}</h3>
                        <p className={styles.cardDescription}>{card.description}</p>
                        <button className={`${styles.cardButton} ${styles[`btn${card.color.charAt(0).toUpperCase() + card.color.slice(1)}`]}`}>
                            {card.buttonText}
                        </button>
                    </div>
                ))}
            </main>

            {/* Quote Section */}
            <section className={styles.quoteSection}>
                <div className={styles.quoteGlow}></div>
                <div className={styles.quoteContent}>
                    <div className={styles.quoteHeader}>
                        <span className={styles.sunIcon}>☀️</span>
                        <span className={styles.quoteLabel}>Daily Inspiration</span>
                    </div>
                    <blockquote className={styles.quoteText}>
                        "{currentQuote.text}"
                    </blockquote>
                    <cite className={styles.quoteAuthor}>— {currentQuote.author}</cite>
                </div>
                <button className={styles.shuffleButton} onClick={shuffleQuote}>
                    🔀 New Quote
                </button>
            </section>

            {/* Footer */}
            <footer className={styles.footer}>
                <p className={styles.footerText}>
                    Made with <span className={styles.heart}>❤️</span> by{' '}
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
                <p className={styles.copyright}>© 2026 TrackLog Inc. All rights reserved.</p>
            </footer>

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
