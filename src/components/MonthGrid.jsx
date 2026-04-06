import React, { useState, useEffect } from 'react';
import { Trash2, Check, ArrowLeft, Plus } from 'lucide-react';

const MonthGrid = ({ monthId, monthName, onBack }) => {
  // --- 1. INSTANT LOAD (Fixes the "disappearing" bug) ---
  const [habits, setHabits] = useState(() => {
    const storageKey = `habits_2026_${monthName}`;
    const savedData = localStorage.getItem(storageKey);
    return savedData ? JSON.parse(savedData) : [];
  });

  const [newHabit, setNewHabit] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- 2. SAVE & SYNC (Triggers only when habits actually change) ---
  useEffect(() => {
    const storageKey = `habits_2026_${monthName}`;
    
    // Save specific habit list
    localStorage.setItem(storageKey, JSON.stringify(habits));

    // UPDATE DASHBOARD KEY: habit_tracker_2026
    const dashboardStats = JSON.parse(localStorage.getItem('habit_tracker_2026') || '{}');
    const daysInMonth = new Date(2026, monthId, 0).getDate();
    
    for (let d = 1; d <= daysInMonth; d++) {
      const isAnyHabitDone = habits.some(h => h.completed && h.completed[d]);
      dashboardStats[`${monthId}-${d}`] = isAnyHabitDone;
    }
    
    localStorage.setItem('habit_tracker_2026', JSON.stringify(dashboardStats));
  }, [habits, monthName, monthId]);

  const addHabit = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (e.key === 'Enter') e.preventDefault();
      if (!newHabit.trim()) return;

      const newHabitObject = {
        id: Date.now(),
        name: newHabit,
        completed: {}
      };

      setHabits(prev => [...prev, newHabitObject]);
      setNewHabit("");
    }
  };

  const toggleDay = (habitId, day) => {
    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        const completed = { ...h.completed };
        completed[day] = !completed[day];
        return { ...h, completed };
      }
      return h;
    }));
  };

  const deleteHabit = (id) => {
    if (window.confirm("Delete habit?")) {
      setHabits(prev => prev.filter(h => h.id !== id));
    }
  };

  const daysArray = Array.from({ length: new Date(2026, monthId, 0).getDate() }, (_, i) => i + 1);

  // --- STYLES ---
  const styles = {
    container: { padding: isMobile ? '10px 5px' : '20px', animation: 'fadeIn 0.3s ease', maxWidth: '100vw' },
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', padding: '0 5px' },
    scrollContainer: { 
      overflowX: 'auto', 
      borderRadius: isMobile ? '15px' : '20px', 
      border: '1px solid #E2E8F0', 
      backgroundColor: '#FFF', 
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', 
      WebkitOverflowScrolling: 'touch' 
    },
    table: { width: '100%', borderCollapse: 'separate', borderSpacing: 0 },
    stickyCol: { 
      position: 'sticky', left: 0, backgroundColor: '#F8FAFC', zIndex: 10, 
      padding: '12px', color: '#64748B', fontSize: '12px', fontWeight: '800', 
      borderBottom: '1px solid #F1F5F9', borderRight: '2px solid #F1F5F9',
      textAlign: 'center', minWidth: '50px'
    },
    thHabit: { 
      backgroundColor: '#F8FAFC', padding: '15px', color: '#0369A1', 
      fontSize: '11px', fontWeight: '900', borderBottom: '2px solid #F1F5F9',
      borderRight: '1px solid #F1F5F9', minWidth: '100px', textAlign: 'center', textTransform: 'uppercase'
    },
    tdTick: { padding: '10px', borderBottom: '1px solid #F1F5F9', borderRight: '1px solid #F1F5F9', textAlign: 'center' },
    tickBox: (isDone) => ({
      width: '24px', height: '24px', borderRadius: '6px', cursor: 'pointer', margin: '0 auto',
      backgroundColor: isDone ? '#3B82F6' : 'transparent',
      border: isDone ? '2px solid #3B82F6' : '2px solid #E0F2FE',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }),
    inputRow: { padding: isMobile ? '15px' : '20px', backgroundColor: '#F8FAFC', borderTop: '2px solid #F1F5F9', display: 'flex', gap: '10px' },
    input: { flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: isMobile ? '16px' : '18px', fontWeight: '600', color: '#1E40AF' },
    mobileAddBtn: { backgroundColor: '#3B82F6', borderRadius: '50%', padding: '8px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none' }
  };

  return (
    <div style={styles.container}>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      <div style={styles.header}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#3B82F6', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: isMobile ? '12px' : '14px' }}>
          <ArrowLeft size={isMobile ? 16 : 18}/> BACK
        </button>
        <h2 style={{ color: '#1E3A8A', margin: 0, fontSize: isMobile ? '18px' : '22px', fontWeight: '900' }}>{monthName.toUpperCase()}</h2>
      </div>

      <div style={{...styles.inputRow, borderRadius: '15px', marginBottom: '15px', border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF'}}>
        <input 
          style={styles.input}
          placeholder="+ New Habit..."
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          onKeyDown={addHabit}
        />
        <button style={styles.mobileAddBtn} onClick={addHabit}>
          <Plus size={20} />
        </button>
      </div>

      <div style={styles.scrollContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.stickyCol}>DAY</th>
              {habits.map(habit => (
                <th key={habit.id} style={styles.thHabit}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <span>{habit.name}</span>
                    <Trash2 size={14} color="#FDA4AF" onClick={() => deleteHabit(habit.id)} style={{ cursor: 'pointer' }}/>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {habits.length > 0 ? (
              daysArray.map(day => (
                <tr key={day}>
                  <td style={styles.stickyCol}>{day}</td>
                  {habits.map(habit => {
                    const isChecked = habit.completed && habit.completed[day];
                    return (
                      <td key={habit.id} style={styles.tdTick}>
                        <div style={styles.tickBox(isChecked)} onClick={() => toggleDay(habit.id, day)}>
                          {isChecked && <Check size={14} color="white" strokeWidth={4} />}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={100} style={{ padding: '60px', textAlign: 'center', color: '#94A3B8', fontWeight: '600' }}>
                  No habits added for {monthName}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MonthGrid;