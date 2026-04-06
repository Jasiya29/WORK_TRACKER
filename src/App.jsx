import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import HabitTracker from './components/HabitTracker';
import TodoTracker from './components/TodoTracker';
import JournalTracker from './components/JournalTracker';
import WorkoutTracker from './components/WorkoutTracker';
import { Layout, ArrowRight, BookOpen, CheckSquare, Dumbbell, PieChart as PieIcon } from 'lucide-react';

const App = () => {
  const [view, setView] = useState('menu'); 
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const [stats, setStats] = useState({ habits: 0, workout: 0, todos: 0 });

  // System Date Constants
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const today = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), currentMonth, 0).getDate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    if (view === 'menu') calculateProgress();
    return () => window.removeEventListener('resize', handleResize);
  }, [view]);

  const calculateProgress = () => {
    // 1. Habit Progress (Monthly)
    const savedHabits = JSON.parse(localStorage.getItem('habit_tracker_2026') || '{}');
    let hDone = 0;
    for (let i = 1; i <= daysInMonth; i++) {
      if (savedHabits[`${currentMonth}-${i}`]) hDone++;
    }
    
    // 2. Workout Progress (Monthly)
    const savedWorkouts = JSON.parse(localStorage.getItem('workout_tracker_2026') || '{}');
    let wDone = 0;
    for (let i = 1; i <= daysInMonth; i++) {
      if (savedWorkouts[`${currentMonth}-${i}`]) wDone++;
    }

    // 3. Todo Progress (Today Only)
    const savedTodos = JSON.parse(localStorage.getItem('todo_tasks_2026') || '{}');
    const todaysTasks = savedTodos[`${currentMonth}-${today}`] || [];
    const tDone = todaysTasks.filter(t => t.done).length;

    setStats({
      habits: Math.round((hDone / daysInMonth) * 100) || 0,
      workout: Math.round((wDone / daysInMonth) * 100) || 0,
      todos: todaysTasks.length > 0 ? Math.round((tDone / todaysTasks.length) * 100) : 0
    });
  };

  const styles = {
    container: { backgroundColor: '#FDFCF0', minHeight: '100vh', padding: isMobile ? '20px 15px' : '40px 20px', fontFamily: "'Inter', sans-serif" },
    header: { textAlign: 'center', marginBottom: isMobile ? '30px' : '50px' },
    title: { fontSize: isMobile ? '32px' : '46px', fontStyle: 'italic', color: '#64748B', fontWeight: '800' },
    subtitle: { fontSize: isMobile ? '11px' : '13px', color: '#94A3B8', letterSpacing: '3px', textTransform: 'uppercase' },
    menuStack: { display: 'flex', flexDirection: 'column', gap: isMobile ? '12px' : '20px', maxWidth: '750px', margin: '0 auto' },
    baseBar: (bgColor, borderColor) => ({
      backgroundColor: bgColor, border: `2px solid ${borderColor}`, borderRadius: isMobile ? '24px' : '35px',
      padding: isMobile ? '18px 20px' : '25px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      cursor: 'pointer', transition: 'transform 0.1s ease', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
    }),
    iconBox: { backgroundColor: '#FFFFFF', padding: isMobile ? '12px' : '16px', borderRadius: isMobile ? '16px' : '22px', marginRight: isMobile ? '15px' : '25px', display: 'flex' },
    barTitle: (color) => ({ fontSize: isMobile ? '18px' : '24px', fontWeight: '900', color: color, margin: '0' }),
    barSub: (color) => ({ fontSize: isMobile ? '11px' : '14px', fontWeight: '700', textTransform: 'uppercase', color: color, opacity: 0.8 }),
    backBtn: (color) => ({ background: 'none', border: `2px solid ${color}`, color: color, padding: '12px 20px', borderRadius: '14px', fontWeight: '900', cursor: 'pointer', marginBottom: '25px' }),
    
    // Dashboard Styles
    dashboardSection: { marginTop: '40px', maxWidth: '750px', margin: '40px auto 0' },
    dashTitle: { fontSize: '14px', fontWeight: '900', color: '#94A3B8', letterSpacing: '2px', textAlign: 'center', marginBottom: '20px' },
    chartGrid: { display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '15px' },
    chartCard: { backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '28px', border: '2px solid #F1F5F9', textAlign: 'center' }
  };

  const renderProgressCard = (value, label, color) => {
    const data = [{ value: value }, { value: 100 - value }];
    return (
      <div style={styles.chartCard}>
        <p style={{ fontSize: '10px', fontWeight: '800', color: '#94A3B8', marginBottom: '10px' }}>{label.toUpperCase()}</p>
        <div style={{ height: '100px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} innerRadius={30} outerRadius={40} paddingAngle={5} dataKey="value" startAngle={90} endAngle={450}>
                <Cell fill={color} stroke="none" />
                <Cell fill="#FEE2E2" stroke="none" /> {/* Red/Pink for remaining */}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ fontSize: '18px', fontWeight: '900', color: color }}>{value}%</div>
      </div>
    );
  };

  const renderView = () => {
    switch(view) {
      case 'habits': return (<div><button style={styles.backBtn('#3B82F6')} onClick={() => setView('menu')}>← BACK</button><HabitTracker /></div>);
      case 'todos': return (<div><button style={styles.backBtn('#EAB308')} onClick={() => setView('menu')}>← BACK</button><TodoTracker /></div>);
      case 'journal': return (<div><button style={styles.backBtn('#EC4899')} onClick={() => setView('menu')}>← BACK</button><JournalTracker /></div>);
      case 'workout': return (<div><button style={styles.backBtn('#22C55E')} onClick={() => setView('menu')}>← BACK</button><WorkoutTracker /></div>);
      default:
        return (
          <>
            <div style={styles.menuStack}>
              {/* Menu Bars */}
              <div style={styles.baseBar('#E0F2FE', '#BAE6FD')} onClick={() => setView('habits')}>
                <div style={{ display: 'flex', alignItems: 'center' }}><div style={styles.iconBox}><Layout size={24} color="#3B82F6" /></div>
                <div><h2 style={styles.barTitle('#1D4ED8')}>HABIT TRACKER</h2><p style={styles.barSub('#3B82F6')}>Monthly Sheets</p></div></div>
                <ArrowRight size={22} color="#1D4ED8" />
              </div>

              <div style={styles.baseBar('#FEF9C3', '#FEF08A')} onClick={() => setView('todos')}>
                <div style={{ display: 'flex', alignItems: 'center' }}><div style={styles.iconBox}><CheckSquare size={24} color="#EAB308" /></div>
                <div><h2 style={styles.barTitle('#A16207')}>TO-DO LIST</h2><p style={styles.barSub('#EAB308')}>Today's Tasks</p></div></div>
                <ArrowRight size={22} color="#A16207" />
              </div>

              <div style={styles.baseBar('#FCE7F3', '#FBCFE8')} onClick={() => setView('journal')}>
                <div style={{ display: 'flex', alignItems: 'center' }}><div style={styles.iconBox}><BookOpen size={24} color="#EC4899" /></div>
                <div><h2 style={styles.barTitle('#9D174D')}>JOURNAL</h2><p style={styles.barSub('#EC4899')}>Daily Thoughts</p></div></div>
                <ArrowRight size={22} color="#9D174D" />
              </div>

              <div style={styles.baseBar('#DCFCE7', '#BBF7D0')} onClick={() => setView('workout')}>
                <div style={{ display: 'flex', alignItems: 'center' }}><div style={styles.iconBox}><Dumbbell size={24} color="#22C55E" /></div>
                <div><h2 style={styles.barTitle('#166534')}>WORKOUT</h2><p style={styles.barSub('#22C55E')}>Fitness Log</p></div></div>
                <ArrowRight size={22} color="#166534" />
              </div>
            </div>

            {/* PROGRESS DASHBOARD */}
            <section style={styles.dashboardSection}>
              <h3 style={styles.dashTitle}>LIVE PROGRESS</h3>
              <div style={styles.chartGrid}>
                {renderProgressCard(stats.habits, "Monthly Habits", "#3B82F6")}
                {renderProgressCard(stats.workout, "Monthly Workout", "#22C55E")}
                {renderProgressCard(stats.todos, "Today's Tasks", "#EAB308")}
              </div>
            </section>
          </>
        );
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Work Tracker</h1>
        <p style={styles.subtitle}>Organize your flow</p>
      </header>
      <main style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {renderView()}
      </main>
    </div>
  );
};

export default App;