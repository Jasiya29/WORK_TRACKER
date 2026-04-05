import React, { useState, useEffect } from 'react';
import HabitTracker from './components/HabitTracker';
import TodoTracker from './components/TodoTracker';
import JournalTracker from './components/JournalTracker';
import WorkoutTracker from './components/WorkoutTracker';
import { Layout, ArrowRight, BookOpen, CheckSquare, Dumbbell } from 'lucide-react';

const App = () => {
  // Navigation state
  const [view, setView] = useState('menu'); 
  
  // 1. Mobile Detection Logic
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 2. Dynamic Styles (Adapts based on isMobile)
  const styles = {
    container: {
      backgroundColor: '#FDFCF0',
      minHeight: '100vh',
      padding: isMobile ? '20px 15px' : '40px 20px',
      fontFamily: "'Inter', sans-serif",
      boxSizing: 'border-box'
    },
    header: { 
      textAlign: 'center', 
      marginBottom: isMobile ? '30px' : '50px',
      marginTop: isMobile ? '10px' : '0'
    },
    title: { 
      fontSize: isMobile ? '32px' : '46px', 
      fontStyle: 'italic', 
      color: '#64748B', 
      margin: '0', 
      fontWeight: '800',
      lineHeight: '1.2'
    },
    subtitle: { 
      fontSize: isMobile ? '11px' : '13px', 
      color: '#94A3B8', 
      letterSpacing: '3px', 
      textTransform: 'uppercase',
      marginTop: '8px'
    },
    menuStack: { 
      display: 'flex', 
      flexDirection: 'column', 
      gap: isMobile ? '12px' : '20px', 
      maxWidth: '750px', 
      margin: '0 auto' 
    },
    
    baseBar: (bgColor, borderColor) => ({
      backgroundColor: bgColor,
      border: `2px solid ${borderColor}`,
      borderRadius: isMobile ? '24px' : '35px',
      padding: isMobile ? '18px 20px' : '30px 40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      cursor: 'pointer',
      transition: 'transform 0.1s ease',
      width: '100%',
      boxSizing: 'border-box',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
    }),

    iconBox: {
      backgroundColor: '#FFFFFF',
      padding: isMobile ? '12px' : '16px',
      borderRadius: isMobile ? '16px' : '22px',
      marginRight: isMobile ? '15px' : '25px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 10px rgba(0,0,0,0.02)'
    },
    
    barTitle: (color) => ({ 
      fontSize: isMobile ? '18px' : '24px', 
      fontWeight: '900', 
      color: color, 
      margin: '0' 
    }),
    
    barSub: (color) => ({ 
      fontSize: isMobile ? '11px' : '14px', 
      fontWeight: '700', 
      marginTop: '2px', 
      textTransform: 'uppercase', 
      color: color, 
      opacity: 0.8 
    }),
    
    backBtn: (color) => ({
      background: 'none',
      border: `2px solid ${color}`,
      color: color,
      padding: '12px 20px',
      borderRadius: '14px',
      fontWeight: '900',
      cursor: 'pointer',
      marginBottom: '25px',
      fontSize: '13px',
      width: isMobile ? '100%' : 'auto',
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    })
  };

  const renderView = () => {
    switch(view) {
      case 'habits':
        return (
          <div>
            <button style={styles.backBtn('#3B82F6')} onClick={() => setView('menu')}>
              ← BACK TO MENU
            </button>
            <HabitTracker isMobile={isMobile} />
          </div>
        );
      case 'todos':
        return (
          <div>
            <button style={styles.backBtn('#EAB308')} onClick={() => setView('menu')}>
              ← BACK TO MENU
            </button>
            <TodoTracker isMobile={isMobile} />
          </div>
        );
      case 'journal':
        return (
          <div>
            <button style={styles.backBtn('#EC4899')} onClick={() => setView('menu')}>
              ← BACK TO MENU
            </button>
            <JournalTracker isMobile={isMobile} />
          </div>
        );
      case 'workout':
        return (
          <div>
            <button style={styles.backBtn('#22C55E')} onClick={() => setView('menu')}>
              ← BACK TO MENU
            </button>
            <WorkoutTracker isMobile={isMobile} />
          </div>
        );
      default:
        return (
          <div style={styles.menuStack}>
            {/* HABIT TRACKER */}
            <div style={styles.baseBar('#E0F2FE', '#BAE6FD')} onClick={() => setView('habits')}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={styles.iconBox}>
                  <Layout size={isMobile ? 24 : 32} color="#3B82F6" />
                </div>
                <div>
                  <h2 style={styles.barTitle('#1D4ED8')}>HABIT TRACKER</h2>
                  <p style={styles.barSub('#3B82F6')}>Monthly Sheets</p>
                </div>
              </div>
              <ArrowRight size={isMobile ? 22 : 28} color="#1D4ED8" />
            </div>

            {/* TO-DO LIST */}
            <div style={styles.baseBar('#FEF9C3', '#FEF08A')} onClick={() => setView('todos')}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={styles.iconBox}>
                  <CheckSquare size={isMobile ? 24 : 32} color="#EAB308" />
                </div>
                <div>
                  <h2 style={styles.barTitle('#A16207')}>TO-DO LIST</h2>
                  <p style={styles.barSub('#EAB308')}>Tasks & Priorities</p>
                </div>
              </div>
              <ArrowRight size={isMobile ? 22 : 28} color="#A16207" />
            </div>

            {/* JOURNAL */}
            <div style={styles.baseBar('#FCE7F3', '#FBCFE8')} onClick={() => setView('journal')}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={styles.iconBox}>
                  <BookOpen size={isMobile ? 24 : 32} color="#EC4899" />
                </div>
                <div>
                  <h2 style={styles.barTitle('#9D174D')}>JOURNAL</h2>
                  <p style={styles.barSub('#EC4899')}>Daily Thoughts</p>
                </div>
              </div>
              <ArrowRight size={isMobile ? 22 : 28} color="#9D174D" />
            </div>

            {/* WORKOUT */}
            <div style={styles.baseBar('#DCFCE7', '#BBF7D0')} onClick={() => setView('workout')}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={styles.iconBox}>
                  <Dumbbell size={isMobile ? 24 : 32} color="#22C55E" />
                </div>
                <div>
                  <h2 style={styles.barTitle('#166534')}>WORKOUT</h2>
                  <p style={styles.barSub('#22C55E')}>Fitness Log</p>
                </div>
              </div>
              <ArrowRight size={isMobile ? 22 : 28} color="#166534" />
            </div>
          </div>
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