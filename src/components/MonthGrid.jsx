import React, { useState, useEffect } from 'react';
import { Trash2, Check, ArrowLeft, Plus, LineChart, Activity } from 'lucide-react';

const MonthGrid = ({ monthId, monthName, year, onBack }) => {
  const [habits, setHabits] = useState(() => {
    const storageKey = `habits_${year}_${monthName}`;
    const savedData = localStorage.getItem(storageKey);
    return savedData ? JSON.parse(savedData) : [];
  });

  const [newHabit, setNewHabit] = useState("");
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const storageKey = `habits_${year}_${monthName}`;
    localStorage.setItem(storageKey, JSON.stringify(habits));

    const dashboardKey = `habit_tracker_${year}`;
    const dashboardStats = JSON.parse(localStorage.getItem(dashboardKey) || '{}');
    const daysInMonthCount = new Date(year, monthId, 0).getDate();
    
    for (let d = 1; d <= daysInMonthCount; d++) {
      const isAnyHabitDone = habits.some(h => h.completed && h.completed[d]);
      dashboardStats[`${monthId}-${d}`] = isAnyHabitDone;
    }
    localStorage.setItem(dashboardKey, JSON.stringify(dashboardStats));
  }, [habits, monthName, monthId, year]);

  const addHabit = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (e.key === 'Enter') e.preventDefault();
      if (!newHabit.trim()) return;
      setHabits(prev => [...prev, { id: Date.now(), name: newHabit, completed: {} }]);
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

  const daysInMonthCount = new Date(year, monthId, 0).getDate();
  const daysArray = Array.from({ length: daysInMonthCount }, (_, i) => i + 1);

  const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'];
  
  const getPathData = (habit) => {
    let runningTotal = 0;
    const points = [];
    const width = 1000;
    const height = 200;
    const stepX = width / (daysInMonthCount - 1);

    daysArray.forEach((day, i) => {
      if (habit.completed?.[day]) runningTotal++;
      const x = i * stepX;
      const percentage = (runningTotal / daysInMonthCount) * 100;
      const y = height - (percentage * (height / 100));
      points.push(`${x},${y}`);
    });
    return points.join(' ');
  };

  const styles = {
    container: { padding: isMobile ? '12px' : '30px', backgroundColor: '#F1F5F9', minHeight: '100vh' },
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' },
    inputContainer: { 
      display: 'flex', 
      gap: '8px', 
      marginBottom: '20px', 
      padding: '8px 12px', 
      backgroundColor: '#FFFFFF', 
      borderRadius: '12px', 
      border: '2px solid #E2E8F0',
    },
    input: { 
      flex: 1, border: 'none', outline: 'none', fontSize: isMobile ? '14px' : '16px', 
      fontWeight: '600', color: '#1E3A8A', backgroundColor: 'transparent' 
    },
    addBtn: { 
      backgroundColor: '#2563EB', color: 'white', border: 'none', borderRadius: '8px', 
      padding: isMobile ? '8px 12px' : '10px 20px', cursor: 'pointer', 
      display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '800', fontSize: '12px' 
    },
    card: { backgroundColor: '#FFF', borderRadius: '20px', padding: isMobile ? '10px' : '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', marginBottom: '20px' },
    stickyCol: { 
      position: 'sticky', left: 0, backgroundColor: '#FFFFFF', zIndex: 5, 
      borderRight: '1px solid #E2E8F0', padding: '10px', fontWeight: '900', 
      textAlign: 'center', color: '#64748B', fontSize: '13px' 
    },
    chartContainer: { padding: isMobile ? '15px' : '25px', backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0' },
    legendGrid: { display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '15px', padding: '10px', borderTop: '1px solid #F1F5F9' },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#2563EB', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px' }}>
          <ArrowLeft size={16} /> BACK
        </button>
        <h2 style={{ margin: 0, fontSize: isMobile ? '18px' : '24px', fontWeight: '900', color: '#1E3A8A' }}>
          {monthName.toUpperCase()} {year}
        </h2>
      </div>

      <div style={styles.inputContainer}>
        <input 
          style={styles.input}
          placeholder="Add habit..."
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          onKeyDown={addHabit}
        />
        <button onClick={addHabit} style={styles.addBtn}>
          <Plus size={18} /> {isMobile ? '' : 'ADD'}
        </button>
      </div>

      {habits.length > 0 ? (
        <>
          <div style={styles.card}>
            <p style={{ fontSize: '10px', color: '#94A3B8', textAlign: 'right', margin: '0 0 8px 0', fontWeight: 'bold' }}>
              {isMobile ? 'SCROLL RIGHT →' : ''}
            </p>
            <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #F1F5F9' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                <thead>
                  <tr style={{ backgroundColor: '#F8FAFC' }}>
                    <th style={styles.stickyCol}>DAY</th>
                    {habits.map(h => (
                      <th key={h.id} style={{ padding: '12px', fontSize: '11px', color: '#1E40AF', fontWeight: '900', borderBottom: '1px solid #E2E8F0', minWidth: isMobile ? '100px' : '140px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                          {h.name.toUpperCase()}
                          <Trash2 size={13} color="#FDA4AF" onClick={() => deleteHabit(h.id)} style={{ cursor: 'pointer' }} />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {daysArray.map(day => (
                    <tr key={day}>
                      <td style={styles.stickyCol}>{day}</td>
                      {habits.map(h => (
                        <td key={h.id} style={{ textAlign: 'center', borderBottom: '1px solid #F8FAFC', padding: '8px' }}>
                          <div 
                            onClick={() => toggleDay(h.id, day)}
                            style={{
                              width: '24px', height: '24px', borderRadius: '6px', margin: '0 auto', cursor: 'pointer',
                              backgroundColor: h.completed?.[day] ? '#2563EB' : '#F8FAFC',
                              border: h.completed?.[day] ? '2px solid #2563EB' : '2px solid #E2E8F0',
                              display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                          >
                            {h.completed?.[day] && <Check size={14} color="white" strokeWidth={4} />}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={styles.chartContainer}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <LineChart color="#2563EB" size={20} />
              <h3 style={{ margin: 0, color: '#1E293B', fontSize: '16px', fontWeight: '900' }}>PROGRESS</h3>
            </div>

            <div style={{ 
              position: 'relative', 
              height: isMobile ? '150px' : '200px', 
              borderLeft: '2px solid #F1F5F9', 
              borderBottom: '2px solid #F1F5F9', 
              margin: isMobile ? '10px 5px 20px 35px' : '10px 10px 20px 45px' 
            }}>
              <div style={{ position: 'absolute', left: isMobile ? '-35px' : '-45px', top: '0', fontSize: '10px', fontWeight: 'bold', color: '#CBD5E1' }}>100%</div>
              <div style={{ position: 'absolute', left: isMobile ? '-35px' : '-45px', bottom: '0', fontSize: '10px', fontWeight: 'bold', color: '#CBD5E1' }}>0%</div>

              <svg viewBox="0 0 1000 200" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block', overflow: 'visible' }}>
                {habits.map((h, i) => (
                  <polyline
                    key={h.id}
                    fill="none"
                    stroke={colors[i % colors.length]}
                    strokeWidth={isMobile ? "6" : "4"}
                    points={getPathData(h)}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ))}
              </svg>
            </div>

            <div style={styles.legendGrid}>
              {habits.map((h, i) => (
                <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '800', color: '#64748B' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: colors[i % colors.length] }} />
                  {h.name}
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div style={styles.placeholder}>
          <Activity size={40} color="#CBD5E1" style={{ marginBottom: '15px' }} />
          <h3 style={{ margin: '0 0 10px 0', color: '#475569', fontSize: '16px' }}>No Habits Tracked</h3>
          <p style={{ margin: 0, fontSize: '12px' }}>Add a habit above to start tracking.</p>
        </div>
      )}
    </div>
  );
};

export default MonthGrid;