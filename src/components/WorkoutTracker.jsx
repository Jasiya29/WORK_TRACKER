import React, { useState, useEffect } from 'react';
import WorkoutGrid from './WorkOutGrid';
import { Dumbbell, Grid, Calendar } from 'lucide-react';

const WorkoutTracker = ({ year = new Date().getFullYear() }) => {
  // --- SYSTEM DATE DETECTION ---
  const now = new Date();
  const actualYear = now.getFullYear();
  const currentMonthIndex = now.getMonth(); // 0-11
  const todayDate = now.getDate(); // 1-31

  // --- STATE MANAGEMENT ---
  const isSelectedYearCurrent = year === actualYear;

  // Default to today if current year, else January 1st
  const [selectedMonth, setSelectedMonth] = useState(isSelectedYearCurrent ? currentMonthIndex : 0);
  const [selectedDay, setSelectedDay] = useState(isSelectedYearCurrent ? todayDate : 1);
  const [viewMode, setViewMode] = useState('daily'); 
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync state if the 'year' prop changes from parent
  useEffect(() => {
    if (isSelectedYearCurrent) {
      setSelectedMonth(currentMonthIndex);
      setSelectedDay(todayDate);
    } else {
      setSelectedMonth(0);
      setSelectedDay(1);
    }
    setViewMode('daily');
  }, [year, isSelectedYearCurrent, currentMonthIndex, todayDate]);

  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  const getCardStyle = (index) => {
    const colors = [
      { bg: '#DCFCE7', border: '#BBF7D0', text: '#166534' }, 
      { bg: '#F0FDF4', border: '#86EFAC', text: '#15803D' }, 
      { bg: '#ECFDF5', border: '#A7F3D0', text: '#047857' }   
    ];
    const color = colors[index % 3];
    const isThisMonth = index === currentMonthIndex && isSelectedYearCurrent;
    
    return {
      backgroundColor: color.bg,
      border: isThisMonth ? `3px solid #22C55E` : `2px solid ${color.border}`,
      borderRadius: isMobile ? '20px' : '24px',
      height: isMobile ? '120px' : '160px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: isMobile ? 'flex-start' : 'center',
      paddingLeft: isMobile ? '20px' : '0',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: isThisMonth ? '0 0 15px rgba(34, 197, 94, 0.2)' : '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
      position: 'relative',
      overflow: 'hidden'
    };
  };

  const navBtnStyle = (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: active ? '#22C55E' : '#F0FDF4',
    border: `2px solid ${active ? '#166534' : '#BBF7D0'}`,
    color: active ? '#FFFFFF' : '#166534',
    padding: '10px 20px',
    borderRadius: '12px',
    fontWeight: '800',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  });

  const NavigationHeader = () => (
    <div style={{ 
      display: 'flex', 
      gap: '12px', 
      marginBottom: '25px', 
      justifyContent: isMobile ? 'center' : 'flex-start' 
    }}>
      <button 
        onClick={() => { setSelectedDay(null); setViewMode('archive'); }} 
        style={navBtnStyle(viewMode === 'archive')}
      >
        <Grid size={18} /> {year} ARCHIVE
      </button>

      <button 
        onClick={() => { 
          if (isSelectedYearCurrent) {
            setSelectedMonth(currentMonthIndex);
            setSelectedDay(todayDate); 
          }
          setViewMode('daily'); 
        }} 
        style={navBtnStyle(viewMode === 'daily')}
      >
        <Calendar size={18} /> {isSelectedYearCurrent ? 'TODAY' : 'VIEW DAY'}
      </button>
    </div>
  );

  if (viewMode === 'archive') {
    return (
      <div style={{ animation: 'fadeIn 0.5s ease', padding: isMobile ? '10px' : '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
          <Dumbbell size={28} color="#22C55E" style={{ marginRight: '12px' }} />
          <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#166534', margin: 0 }}>{year} Workout Archive</h2>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fill, minmax(220px, 1fr))', gap: isMobile ? '12px' : '25px' }}>
          {months.map((name, index) => (
            <div 
              key={name} 
              style={getCardStyle(index)} 
              onClick={() => { 
                setSelectedMonth(index); 
                setSelectedDay(null); 
                setViewMode('daily'); 
              }}
            >
              <span style={{ position: 'absolute', top: '10px', right: '15px', fontSize: '35px', fontWeight: '900', color: 'rgba(255, 255, 255, 0.4)' }}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 style={{ fontSize: isMobile ? '16px' : '20px', fontWeight: '900', color: '#166534', margin: 0 }}>{name.toUpperCase()}</h3>
              {index === currentMonthIndex && isSelectedYearCurrent && (
                <div style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: '#22C55E', color: 'white', fontSize: '9px', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>
                  CURRENT
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: isMobile ? '10px' : '20px', animation: 'fadeIn 0.3s ease' }}>
      <style>
        {` @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } `}
      </style>
      
      <NavigationHeader />
      
      <WorkoutGrid 
        year={year}
        monthName={months[selectedMonth]} 
        monthId={selectedMonth + 1} 
        initialDay={selectedDay} 
        onBack={() => { 
          setSelectedDay(null); 
          setViewMode('archive'); 
        }} 
      />
    </div>
  );
};

export default WorkoutTracker;