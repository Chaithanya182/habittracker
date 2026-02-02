import React from 'react';
import { HabitProvider } from './context/HabitContext';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <HabitProvider>
      <Dashboard />
    </HabitProvider>
  );
}

export default App;
