import React from 'react';
import { useTasks } from '../../context/TaskContext';
import styles from './DailyNotes.module.css';

const NoteSection = ({ title, items, onUpdate }) => (
    <div className={styles.section}>
        <div className={styles.sectionHeader}>{title}</div>
        <div className={styles.notesList}>
            {items.map((item, index) => (
                <div key={index} className={styles.noteRow}>
                    <span className={styles.noteNumber}>{index + 1}.</span>
                    <input
                        type="text"
                        className={styles.noteInput}
                        value={item}
                        onChange={(e) => onUpdate(index, e.target.value)}
                        placeholder="..."
                    />
                </div>
            ))}
        </div>
    </div>
);

const DailyNotes = ({ date }) => {
    const { getNotes, updateNote } = useTasks();
    const dayNotes = getNotes(date);

    return (
        <div className={styles.dailyNotes}>
            <NoteSection
                title="Notes"
                items={dayNotes.notes}
                onUpdate={(index, value) => updateNote(date, 'notes', index, value)}
            />
            <NoteSection
                title="What can be improved?"
                items={dayNotes.improvements}
                onUpdate={(index, value) => updateNote(date, 'improvements', index, value)}
            />
            <NoteSection
                title="Thanks"
                items={dayNotes.thanks}
                onUpdate={(index, value) => updateNote(date, 'thanks', index, value)}
            />
        </div>
    );
};

export default DailyNotes;
