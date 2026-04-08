import React, { useState, useEffect } from 'react';
import TodoGrid from './TodoGrid';
import { CheckSquare, Grid, List, Calendar } from 'lucide-react';

const TodoTracker = ({ year }) => {
  // --- SYSTEM DATE DETECTION ---
  const now = new Date();
  const actualYear = now.getFullYear();
  const currentMonthIndex = now.getMonth(); 
  const todayDate = now.getDate(); 

  // --- STATE MANAGEMENT ---
  const isCurrentYear = year === actualYear;
  
  // Default to today if current year, otherwise default to first month
  const [selectedMonth, setSelectedMonth] = useState(isCurrentYear ? currentMonthIndex : 0);
  const [selectedDay, setSelectedDay] = useState(isCurrentYear ? todayDate : 1);
  const [viewMode, setViewMode] = useState('daily'); 
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update defaults when the global year changes
  useEffect(() => {
    if (isCurrentYear) {
      setSelectedMonth(currentMonthIndex);
      setSelectedDay(todayDate);
      setViewMode('daily');
    } else {
      setSelectedMonth(0);
      setSelectedDay(1);
      setViewMode('daily');
    }
  }, [year]);

  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  const getCardStyle = (index) => {
    const colors = [
      { bg: '#FEF9C3', border: '#FEF08A', text: '#A16207' }, 
      { bg: '#FFFBEB', border: '#FDE68A', text: '#B45309' }, 
      { bg: '#FEFCE8', border: '#FEF9C3', text: '#CA8A04' }  
    ];
    const color = colors[index % 3];
    // Only highlight if it's actually the current month of the current year
    const isThisMonth = index === currentMonthIndex && isCurrentYear;
    
    return {
      backgroundColor: color.bg,
      border: isThisMonth ? `3px solid #EAB308` : `2px solid ${color.border}`,
      borderRadius: isMobile ? '20px' : '24px',
      height: isMobile ? '110px' : '160px', 
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: isMobile ? 'flex-start' : 'center',
      paddingLeft: isMobile ? '20px' : '0',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: isThisMonth ? '0 0 15px rgba(234, 179, 8, 0.2)' : '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
      position: 'relative',
      overflow: 'hidden'
    };
  };

  const NavigationHeader = () => (
    <div style={{ 
      display: 'flex', 
      gap: '10px', 
      marginBottom: '20px', 
      flexWrap: 'wrap',
      justifyContent: isMobile ? 'center' : 'flex-start' 
    }}>
      <button 
        onClick={() => {
          setSelectedDay(null);
          setViewMode('archive');
        }} 
        style={navBtnStyle(viewMode === 'archive')}
      >
        <Grid size={16} /> {year} ARCHIVE
      </button>

      <button 
        onClick={() => {
          setSelectedDay(null);
          setViewMode('month');
        }} 
        style={navBtnStyle(viewMode === 'month')}
      >
        <List size={16} /> {months[selectedMonth].toUpperCase()} LIST
      </button>

      <button 
        onClick={() => {
          if (isCurrentYear) {
            setSelectedDay(todayDate);
            setSelectedMonth(currentMonthIndex);
          }
          setViewMode('daily');
        }} 
        style={navBtnStyle(viewMode === 'daily')}
      >
        <Calendar size={16} /> {isCurrentYear ? 'TODAY' : 'VIEW DAY'}
      </button>
    </div>
  );

  const navBtnStyle = (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: active ? '#EAB308' : '#FEFCE8',
    border: `2px solid ${active ? '#854D0E' : '#FEF08A'}`,
    color: active ? '#FFFFFF' : '#854D0E',
    padding: '10px 16px',
    borderRadius: '12px',
    fontWeight: '800',
    fontSize: '11px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: active ? '0 4px 10px rgba(234, 179, 8, 0.3)' : 'none'
  });

  // 1. YEARLY ARCHIVE VIEW
  if (viewMode === 'archive') {
    return (
      <div style={{ animation: 'fadeIn 0.5s ease', padding: isMobile ? '10px' : '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
          <CheckSquare size={28} color="#EAB308" style={{ marginRight: '12px' }} />
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#854D0E', margin: 0 }}>{year} To-Do Archive</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fill, minmax(220px, 1fr))', gap: isMobile ? '12px' : '25px' }}>
          {months.map((name, index) => (
            <div key={name} style={getCardStyle(index)} onClick={() => { 
              setSelectedMonth(index); 
              setSelectedDay(null); 
              setViewMode('month'); 
            }}>
              <span style={{ position: 'absolute', top: '10px', right: '15px', fontSize: '35px', fontWeight: '900', color: 'rgba(255, 255, 255, 0.6)' }}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 style={{ fontSize: isMobile ? '16px' : '22px', fontWeight: '800', color: '#854D0E', margin: 0 }}>{name.toUpperCase()}</h3>
              {index === currentMonthIndex && isCurrentYear && <div style={badgeStyle}>CURRENT</div>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. DAILY TO-DO / MONTH LIST VIEW
  return (
    <div style={{ padding: isMobile ? '10px' : '20px', animation: 'fadeIn 0.3s ease' }}>
      <NavigationHeader />
      <TodoGrid 
        year={year} // Passing dynamic year to storage handler
        monthId={selectedMonth + 1} 
        monthName={months[selectedMonth]} 
        initialDay={selectedDay} 
        onBack={() => {
          setSelectedDay(null);
          setViewMode('archive');
        }} 
      />
    </div>
  );
};

const badgeStyle = {
  position: 'absolute', top: '10px', left: '10px', backgroundColor: '#EAB308',
  color: 'white', fontSize: '9px', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold'
};

export default TodoTracker;