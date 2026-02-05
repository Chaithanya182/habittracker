import React, { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import styles from './QuoteSection.module.css';

const QuoteSection = () => {
    const { quote, weekStartDate, updateQuote, updateWeekStart } = useTasks();
    const [isEditing, setIsEditing] = useState(false);
    const [editedQuote, setEditedQuote] = useState(quote);

    const handleSave = () => {
        updateQuote(editedQuote);
        setIsEditing(false);
    };

    const handleDateChange = (e) => {
        updateWeekStart(e.target.value);
    };

    return (
        <div className={styles.quoteSection}>
            {isEditing ? (
                <>
                    <textarea
                        className={styles.quoteInput}
                        value={editedQuote}
                        onChange={(e) => setEditedQuote(e.target.value)}
                        rows={3}
                        autoFocus
                    />
                    <button className={styles.saveButton} onClick={handleSave}>
                        Save Quote
                    </button>
                </>
            ) : (
                <>
                    <div className={styles.quoteText}>
                        {quote}
                    </div>
                    <button
                        className={styles.editButton}
                        onClick={() => {
                            setEditedQuote(quote);
                            setIsEditing(true);
                        }}
                    >
                        Edit Quote
                    </button>
                </>
            )}

            <div className={styles.dateRow}>
                <span className={styles.dateLabel}>Start of the week</span>
                <input
                    type="date"
                    className={styles.dateInput}
                    value={weekStartDate}
                    onChange={handleDateChange}
                />
            </div>
        </div>
    );
};

export default QuoteSection;
