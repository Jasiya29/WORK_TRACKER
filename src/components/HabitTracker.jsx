import React, { useState, useEffect } from 'react';
import MonthGrid from './MonthGrid';
import { Calendar, Grid } from 'lucide-react';

const HabitTracker = ({ year }) => {
  const now = new Date();
  const currentMonthIndex = now.getMonth();
  
  // Logic automatically shifts based on the prop passed from Home
  const isSelectedYearCurrent = year === now.getFullYear();

  // Initialize selectedMonth based on the current year status
  const [selectedMonth, setSelectedMonth] = useState(isSelectedYearCurrent ? currentMonthIndex : 0);
  const [showAllMonths, setShowAllMonths] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync logic: When year changes at the Home level, the tracker stays on 
  // the current month view but updates its data source automatically.
  useEffect(() => {
    // If we are in "Current Today" mode and the year changes, 
    // we reset to Month 0 (January) or Current Month.
    if (!showAllMonths && isSelectedYearCurrent) {
      setSelectedMonth(currentMonthIndex);
    }
  }, [year, isSelectedYearCurrent, currentMonthIndex]);

  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  const getCardStyle = (index) => {
    const isCurrent = index === currentMonthIndex && isSelectedYearCurrent;
    return {
      backgroundColor: isCurrent ? '#EFF6FF' : '#FFFFFF',
      border: isCurrent ? `3px solid #2563EB` : `2px solid #E2E8F0`,
      borderRadius: '24px',
      height: isMobile ? '120px' : '160px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      position: 'relative',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      transition: 'transform 0.1s ease'
    };
  };

  if (!showAllMonths && selectedMonth !== null) {
    return (
      <div style={{ padding: '20px' }}>
        <button 
          onClick={() => setShowAllMonths(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#FFFFFF',
            border: '2px solid #E2E8F0', color: '#2563EB', padding: '10px 20px',
            borderRadius: '12px', fontWeight: '900', fontSize: '12px', cursor: 'pointer',
            marginBottom: '20px'
          }}
        >
          <Grid size={18} /> VIEW {year} ARCHIVE
        </button>

        <MonthGrid 
          year={year}
          monthId={selectedMonth + 1} 
          monthName={months[selectedMonth]} 
          onBack={() => setShowAllMonths(true)} 
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
        <Calendar size={28} color="#2563EB" style={{ marginRight: '12px' }} />
        <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#1E3A8A', margin: 0 }}>
          {year} Habit Tracker
        </h2>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? '140px' : '220px'}, 1fr))`, 
        gap: '20px' 
      }}>
        {months.map((name, index) => (
          <div key={name} style={getCardStyle(index)} onClick={() => { setSelectedMonth(index); setShowAllMonths(false); }}>
            <span style={{ position: 'absolute', top: '10px', right: '15px', fontSize: '30px', fontWeight: '900', color: '#F1F5F9' }}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#1E40AF', margin: 0 }}>{name.toUpperCase()}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HabitTracker;