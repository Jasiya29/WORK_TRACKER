import React, { useState, useEffect } from 'react';
import JournalCalendar from './JournalCalendar';
import { BookOpen, Grid, List, PenLine } from 'lucide-react';

const JournalTracker = ({ year }) => {
  // --- SYSTEM DATE DETECTION ---
  const now = new Date();
  const actualYear = now.getFullYear();
  const currentMonthIndex = now.getMonth(); // 0-11
  const todayDate = now.getDate(); 

  // --- STATE MANAGEMENT ---
  // If the selected year is the actual current year, default to today.
  // Otherwise, default to January 1st of that archived year.
  const isCurrentYear = year === actualYear;
  const [selectedMonth, setSelectedMonth] = useState(isCurrentYear ? currentMonthIndex : 0);
  const [selectedDay, setSelectedDay] = useState(isCurrentYear ? todayDate : 1);
  
  const [viewMode, setViewMode] = useState('entry'); 
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update selection if the user changes the year in the main menu
  useEffect(() => {
    if (isCurrentYear) {
      setSelectedMonth(currentMonthIndex);
      setSelectedDay(todayDate);
    } else {
      setSelectedMonth(0);
      setSelectedDay(1);
    }
  }, [year]);

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
        <Grid size={14} /> {year} MONTHS
      </button>
      <button onClick={() => setViewMode('month')} style={navBtnStyle(viewMode === 'month')}>
        <List size={14} /> {months[selectedMonth].toUpperCase()} LIST
      </button>
      <button 
        onClick={() => { 
          if(isCurrentYear) {
            setSelectedMonth(currentMonthIndex);
            setSelectedDay(todayDate);
          }
          setViewMode('entry'); 
        }} 
        style={navBtnStyle(viewMode === 'entry')}
      >
        <PenLine size={14} /> {isCurrentYear ? "TODAY'S JOURNAL" : "WRITE ENTRY"}
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

  // 1. YEARLY ARCHIVE
  if (viewMode === 'archive') {
    return (
      <div style={{ animation: 'fadeIn 0.3s ease', padding: isMobile ? '10px' : '20px' }}>
        <h2 style={{ color: '#9D174D', fontWeight: '900', textAlign: 'center', marginBottom: '20px' }}>
          {year} Journal Archive
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr', gap: '15px' }}>
          {months.map((name, index) => {
            const isThisMonth = index === currentMonthIndex && isCurrentYear;
            return (
              <div 
                key={name} 
                onClick={() => { setSelectedMonth(index); setViewMode('month'); }}
                style={{
                  backgroundColor: isThisMonth ? '#FCE7F3' : '#FFF',
                  border: isThisMonth ? '2px solid #EC4899' : '2px solid #F1F5F9',
                  padding: '25px', borderRadius: '20px', textAlign: 'center', cursor: 'pointer',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
                }}
              >
                <span style={{ fontWeight: '800', color: '#9D174D' }}>{name.toUpperCase()}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 2. JOURNALING PAGE / MONTH LIST
  return (
    <div style={{ padding: isMobile ? '10px' : '20px', animation: 'fadeIn 0.3s ease' }}>
      <NavigationHeader />
      
      <JournalCalendar 
        year={year} // Passing dynamic year
        month={{ id: selectedMonth + 1, name: months[selectedMonth] }} 
        selectedDay={selectedDay}
        viewMode={viewMode}
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