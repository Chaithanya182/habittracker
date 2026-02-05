import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { TaskProvider, useTasks } from './context/TaskContext';
import { TaskListProvider } from './context/TaskListContext';
import { HabitProvider } from './context/HabitContext';
import { FinanceProvider } from './context/FinanceContext';
import Dashboard from './components/weekly/Dashboard';
import SetupScreen from './components/weekly/SetupScreen';
import HomePage from './components/HomePage';
import TaskListDashboard from './components/tasklist/TaskListDashboard';
import HabitDashboard from './components/habits/HabitDashboard';
import FinanceDashboard from './components/finance/FinanceDashboard';

const WeeklyTrackerContent = () => {
  const { isSetupComplete } = useTasks();
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', padding: '12px' }}>
      <button
        onClick={() => navigate('/')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          background: 'none',
          border: 'none',
          color: '#14b8a6',
          fontSize: '14px',
          fontWeight: 500,
          cursor: 'pointer',
          padding: '8px',
          marginBottom: '12px'
        }}
      >
        ← Home
      </button>
      {isSetupComplete ? <Dashboard /> : <SetupScreen />}
    </div>
  );
};

const TaskListPage = () => {
  const navigate = useNavigate();
  return <TaskListDashboard onBack={() => navigate('/')} />;
};

const HabitPage = () => {
  const navigate = useNavigate();
  return <HabitDashboard onBack={() => navigate('/')} />;
};

const FinancePage = () => {
  const navigate = useNavigate();
  return <FinanceDashboard onBack={() => navigate('/')} />;
};

function App() {
  return (
    <BrowserRouter>
      <TaskProvider>
        <TaskListProvider>
          <HabitProvider>
            <FinanceProvider>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/weekly-tracker" element={<WeeklyTrackerContent />} />
                <Route path="/task-list" element={<TaskListPage />} />
                <Route path="/habit-tracker" element={<HabitPage />} />
                <Route path="/finance-tracker" element={<FinancePage />} />
              </Routes>
            </FinanceProvider>
          </HabitProvider>
        </TaskListProvider>
      </TaskProvider>
    </BrowserRouter>
  );
}

export default App;
