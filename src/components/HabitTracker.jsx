import React, { useState, useEffect } from 'react';
import MonthGrid from './MonthGrid';
import { Calendar, Grid } from 'lucide-react';

const HabitTracker = () => {
  // --- SYSTEM DATE DETECTION ---
  const now = new Date();
  const currentMonthIndex = now.getMonth(); // 0-11

  // --- STATE MANAGEMENT ---
  // Initial state lands on the current month from system
  const [selectedMonth, setSelectedMonth] = useState(currentMonthIndex);
  const [showAllMonths, setShowAllMonths] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // --- RESPONSIVENESS ---
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  const getCardStyle = (index) => {
    const colors = [
      { bg: '#E0F2FE', border: '#BAE6FD', text: '#0369A1' },
      { bg: '#DBEAFE', border: '#BFDBFE', text: '#1E40AF' },
      { bg: '#EFF6FF', border: '#DBEAFE', text: '#2563EB' }
    ];
    const color = colors[index % 3];
    const isCurrent = index === currentMonthIndex;

    return {
      backgroundColor: color.bg,
      border: isCurrent ? `3px solid #2563EB` : `2px solid ${color.border}`,
      borderRadius: isMobile ? '20px' : '24px',
      height: isMobile ? '120px' : '160px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: isCurrent ? '0 0 15px rgba(37, 99, 235, 0.2)' : '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
      position: 'relative',
      overflow: 'hidden',
      padding: '10px'
    };
  };

  // --- VIEW: MONTH DETAIL (Default View) ---
  if (!showAllMonths && selectedMonth !== null) {
    return (
      <div style={{ animation: 'fadeIn 0.5s ease' }}>
        <button 
          onClick={() => setShowAllMonths(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#EFF6FF',
            border: '2px solid #DBEAFE',
            color: '#2563EB',
            padding: '10px 20px',
            borderRadius: '12px',
            fontWeight: '900',
            fontSize: '12px',
            cursor: 'pointer',
            marginBottom: '20px',
            textTransform: 'uppercase',
            transition: 'all 0.2s ease'
          }}
        >
          <Grid size={18} /> VIEW ALL MONTHS
        </button>

        <MonthGrid 
          monthId={selectedMonth + 1} 
          monthName={months[selectedMonth]} 
          onBack={() => setShowAllMonths(true)} 
        />
      </div>
    );
  }

  // --- VIEW: ARCHIVE (All Months Grid) ---
  return (
    <div style={{ animation: 'fadeIn 0.5s ease', padding: isMobile ? '5px' : '0' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: '30px',
        justifyContent: isMobile ? 'center' : 'flex-start' 
      }}>
        <Calendar size={28} color="#3B82F6" style={{ marginRight: '12px' }} />
        <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#1E3A8A', margin: 0 }}>Habit Archive</h2>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? '140px' : '220px'}, 1fr))`, 
        gap: isMobile ? '15px' : '25px' 
      }}>
        {months.map((name, index) => {
          const isCurrent = index === currentMonthIndex;
          return (
            <div 
              key={name} 
              style={getCardStyle(index)} 
              onClick={() => {
                setSelectedMonth(index);
                setShowAllMonths(false);
              }}
            >
              {isCurrent && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  backgroundColor: '#2563EB',
                  color: 'white',
                  fontSize: '9px',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  zIndex: 3
                }}>CURRENT</div>
              )}

              <span style={{ 
                position: 'absolute', 
                top: '10px', 
                right: '15px', 
                fontSize: isMobile ? '30px' : '40px', 
                fontWeight: '900', 
                color: 'rgba(255, 255, 255, 0.4)',
                userSelect: 'none'
              }}>
                {String(index + 1).padStart(2, '0')}
              </span>

              <h3 style={{ 
                fontSize: isMobile ? '18px' : '22px', 
                fontWeight: '900', 
                color: '#1E40AF', 
                margin: 0,
                zIndex: 2 
              }}>
                {name.toUpperCase()}
              </h3>
              
              <div style={{ 
                marginTop: '10px', 
                width: isMobile ? '30px' : '40px', 
                height: '4px', 
                backgroundColor: 'rgba(255,255,255,0.8)', 
                borderRadius: '10px',
                zIndex: 2
              }} />
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default HabitTracker;