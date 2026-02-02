import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from './Header';
import HabitList from './HabitList';
import AddHabitModal from './AddHabitModal';
import ProgressChart from './ProgressChart';
import styles from './Dashboard.module.css';

const Dashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className={styles.container}>
            <Header />
            <ProgressChart />

            <div className={styles.content}>
                <div className={styles.sectionHeader}>
                    <h2>Your Habits</h2>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsModalOpen(true)}
                        className={styles.fab}
                    >
                        <Plus size={24} />
                        <span className={styles.fabText}>New Habit</span>
                    </motion.button>
                </div>
                <HabitList />
            </div>

            <AddHabitModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default Dashboard;
