import React, { useState, useEffect } from 'react';
import JournalCalendar from './JournalCalendar';
import { BookOpen, Grid, List, PenLine } from 'lucide-react';

const JournalTracker = () => {
  // --- SYSTEM DATE DETECTION ---
  const now = new Date();
  const currentMonthIndex = now.getMonth(); // 0-11 (April is 3)
  const todayDate = now.getDate(); // 1-31 (Current Day)

  // State Management
  // We initialize these with the system's current date values
  const [selectedMonth, setSelectedMonth] = useState(currentMonthIndex);
  const [selectedDay, setSelectedDay] = useState(todayDate);
  
  // 'entry' mode tells the child component to skip the list and show the text area
  const [viewMode, setViewMode] = useState('entry'); 
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // --- NAVIGATION BAR ---
  const NavigationHeader = () => (
    <div style={{ 
      display: 'flex', 
      gap: '8px', 
      marginBottom: '20px', 
      overflowX: 'auto',
      paddingBottom: '5px',
      justifyContent: isMobile ? 'flex-start' : 'center'
    }}>
      <button onClick={() => setViewMode('archive')} style={navBtnStyle(viewMode === 'archive')}>
        <Grid size={14} /> ALL MONTHS
      </button>
      <button onClick={() => setViewMode('month')} style={navBtnStyle(viewMode === 'month')}>
        <List size={14} /> {months[selectedMonth]} LIST
      </button>
      <button onClick={() => { setSelectedDay(todayDate); setViewMode('entry'); }} style={navBtnStyle(viewMode === 'entry')}>
        <PenLine size={14} /> TODAY'S JOURNAL
      </button>
    </div>
  );

  const navBtnStyle = (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    whiteSpace: 'nowrap',
    backgroundColor: active ? '#EC4899' : '#FFFFFF',
    border: `2px solid ${active ? '#9D174D' : '#FBCFE8'}`,
    color: active ? '#FFFFFF' : '#9D174D',
    padding: '8px 14px',
    borderRadius: '12px',
    fontWeight: '800',
    fontSize: '10px',
    cursor: 'pointer',
    transition: '0.2s'
  });

  // 1. YEARLY ARCHIVE (If "ALL MONTHS" is clicked)
  if (viewMode === 'archive') {
    return (
      <div style={{ animation: 'fadeIn 0.3s ease', padding: isMobile ? '10px' : '20px' }}>
        <h2 style={{ color: '#9D174D', fontWeight: '900', textAlign: 'center' }}>Archive</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          {months.map((name, index) => (
            <div 
              key={name} 
              onClick={() => { setSelectedMonth(index); setViewMode('month'); }}
              style={{
                backgroundColor: index === currentMonthIndex ? '#FCE7F3' : '#FFF',
                border: index === currentMonthIndex ? '2px solid #EC4899' : '2px solid #F1F5F9',
                padding: '25px', borderRadius: '20px', textAlign: 'center'
              }}
            >
              <span style={{ fontWeight: '800', color: '#9D174D' }}>{name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. JOURNALING PAGE (Lands here automatically for Today)
  return (
    <div style={{ padding: isMobile ? '10px' : '20px', animation: 'fadeIn 0.3s ease' }}>
      <NavigationHeader />
      
      <JournalCalendar 
        month={{ id: selectedMonth + 1, name: months[selectedMonth] }} 
        // We pass the day and the mode to force the entry view
        selectedDay={selectedDay}
        viewMode={viewMode} // 'entry' or 'month'
        onDaySelect={(day) => {
          setSelectedDay(day);
          setViewMode('entry');
        }}
        onBack={() => setViewMode('archive')} 
      />
    </div>
  );
};

export default JournalTracker;