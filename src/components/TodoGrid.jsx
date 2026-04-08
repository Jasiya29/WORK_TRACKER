import React, { useState, useEffect } from 'react';
import { Check, Trash2, Plus, ArrowLeft } from 'lucide-react';

const TodoGrid = ({ monthId, monthName, year, onBack, initialDay }) => {
  // --- STATE ---
  const [selectedDay, setSelectedDay] = useState(initialDay || null);
  const [tasksByDate, setTasksByDate] = useState({}); 
  const [inputValue, setInputValue] = useState("");
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  // --- SYNC PROP TO STATE ---
  useEffect(() => {
    setSelectedDay(initialDay);
  }, [initialDay]);

  // --- LOCAL STORAGE & RESPONSIVENESS (Year-Aware) ---
  useEffect(() => {
    const storageKey = `todo_tasks_${year}`;
    const savedTasks = localStorage.getItem(storageKey);
    if (savedTasks) {
      setTasksByDate(JSON.parse(savedTasks));
    } else {
      setTasksByDate({}); // Clear state if switching to a year with no data
    }

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [year]);

  useEffect(() => {
    // Only save if we have a valid year
    if (year) {
      localStorage.setItem(`todo_tasks_${year}`, JSON.stringify(tasksByDate));
    }
  }, [tasksByDate, year]);

  // Calculates days in month specifically for the selected year
  const daysInMonth = new Date(year, monthId, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const dateKey = `${monthId}-${selectedDay}`;

  // --- HANDLERS ---
  const handleAddTask = (e) => {
    if ((e.key === 'Enter' || e.type === 'click') && inputValue.trim()) {
      const currentTasks = tasksByDate[dateKey] || [];
      const updatedTasks = {
        ...tasksByDate,
        [dateKey]: [...currentTasks, { id: Date.now(), text: inputValue, done: false }]
      };
      setTasksByDate(updatedTasks);
      setInputValue("");
    }
  };

  const toggleTask = (id) => {
    const updated = tasksByDate[dateKey].map(t => t.id === id ? { ...t, done: !t.done } : t);
    setTasksByDate({ ...tasksByDate, [dateKey]: updated });
  };

  const deleteTask = (id) => {
    const updated = tasksByDate[dateKey].filter(t => t.id !== id);
    setTasksByDate({ ...tasksByDate, [dateKey]: updated });
  };

  const styles = {
    container: { padding: isMobile ? '10px' : '20px', animation: 'fadeIn 0.3s ease' },
    dayGrid: { 
      display: 'grid', 
      gridTemplateColumns: isMobile ? 'repeat(4, 1fr)' : 'repeat(auto-fill, minmax(80px, 1fr))', 
      gap: isMobile ? '10px' : '15px' 
    },
    dayCard: {
      aspectRatio: '1/1', backgroundColor: '#FFFBEB', border: '2px solid #FEF08A',
      borderRadius: isMobile ? '14px' : '18px', display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontSize: isMobile ? '18px' : '20px', fontWeight: '800',
      color: '#A16207', cursor: 'pointer'
    },
    sheetContainer: {
      backgroundColor: '#FFFFFF', borderRadius: isMobile ? '20px' : '28px',
      border: '2px solid #FEF08A', padding: isMobile ? '15px' : '30px',
      maxWidth: '650px', margin: '0 auto', boxShadow: '0 10px 25px -5px rgba(161, 98, 7, 0.05)'
    },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: '10px', color: '#A16207', borderBottom: '2px solid #FEF9C3', fontSize: '10px', letterSpacing: '1px' },
    td: { padding: isMobile ? '12px 8px' : '15px 12px', borderBottom: '1px solid #FEF9C3' },
    checkbox: (isDone) => ({
      width: isMobile ? '28px' : '24px', height: isMobile ? '28px' : '24px',
      borderRadius: '8px', border: isDone ? 'none' : '2px solid #FEF08A',
      backgroundColor: isDone ? '#EAB308' : 'transparent', display: 'flex',
      alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
    }),
    inputField: {
      width: '100%', border: 'none', borderBottom: '2px solid #FEF9C3',
      outline: 'none', fontWeight: '600', color: '#A16207', fontSize: '16px',
      padding: '8px 0', backgroundColor: 'transparent'
    }
  };

  // --- VIEW 2: THE TASK SHEET ---
  if (selectedDay) {
    const activeTasks = tasksByDate[dateKey] || [];
    return (
      <div style={styles.container}>
        <button onClick={() => setSelectedDay(null)} style={{ background: 'none', border: 'none', color: '#A16207', fontWeight: 'bold', cursor: 'pointer', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowLeft size={18} /> BACK
        </button>

        <div style={styles.sheetContainer}>
          <h2 style={{ color: '#A16207', marginBottom: '20px', fontWeight: '900', fontSize: isMobile ? '1.2rem' : '1.5rem' }}>
            {selectedDay} {monthName} {year}
          </h2>
          
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{ ...styles.th, width: isMobile ? '40px' : '60px' }}>DONE</th>
                <th style={styles.th}>TASK</th>
                <th style={{ ...styles.th, width: '40px' }}></th>
              </tr>
            </thead>
            <tbody>
              {activeTasks.map(task => (
                <tr key={task.id}>
                  <td style={styles.td}>
                    <div style={styles.checkbox(task.done)} onClick={() => toggleTask(task.id)}>
                      {task.done && <Check size={16} color="white" strokeWidth={4} />}
                    </div>
                  </td>
                  <td style={{ ...styles.td, color: '#854D0E', fontWeight: '600', fontSize: '14px', textDecoration: task.done ? 'line-through' : 'none', opacity: task.done ? 0.5 : 1 }}>
                    {task.text}
                  </td>
                  <td style={styles.td}>
                    <Trash2 size={18} color="#FDA4AF" onClick={() => deleteTask(task.id)} style={{ cursor: 'pointer' }} />
                  </td>
                </tr>
              ))}
              
              <tr>
                <td style={{ ...styles.td, borderBottom: 'none' }}>
                  <Plus size={20} color="#EAB308" onClick={handleAddTask} style={{ cursor: 'pointer' }} />
                </td>
                <td colSpan="2" style={{ ...styles.td, borderBottom: 'none' }}>
                  <input 
                    style={styles.inputField}
                    placeholder="New task..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleAddTask}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // --- VIEW 1: THE DAY GRID ---
  return (
    <div style={styles.container}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#A16207', fontWeight: 'bold', cursor: 'pointer', marginBottom: '20px' }}>← BACK</button>
      <h2 style={{ color: '#A16207', fontWeight: '900', marginBottom: '20px', letterSpacing: '1px', fontSize: isMobile ? '1.1rem' : '1.4rem' }}>
        {monthName.toUpperCase()} {year}
      </h2>
      
      <div style={styles.dayGrid}>
        {daysArray.map(day => (
          <div 
            key={day} 
            style={styles.dayCard}
            onClick={() => setSelectedDay(day)}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoGrid;