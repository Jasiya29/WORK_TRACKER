import React, { useState, useEffect } from 'react';
import MonthGrid from './MonthGrid';
import { Calendar } from 'lucide-react';

const HabitTracker = () => {
  const [selectedMonth, setSelectedMonth] = useState(null);
  
  // 1. Mobile Detection Logic
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // 2. Dynamic Card Styles
  const getCardStyle = (index) => {
    const colors = [
      { bg: '#E0F2FE', border: '#BAE6FD', text: '#0369A1' }, // Sky Blue
      { bg: '#DBEAFE', border: '#BFDBFE', text: '#1E40AF' }, // Royal Blue
      { bg: '#EFF6FF', border: '#DBEAFE', text: '#2563EB' }  // Soft Azure
    ];
    const color = colors[index % 3];

    return {
      backgroundColor: color.bg,
      border: `2px solid ${color.border}`,
      borderRadius: isMobile ? '20px' : '24px', // Slightly smaller radius on mobile
      height: isMobile ? '120px' : '160px',     // Shorter cards on mobile
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
      position: 'relative',
      overflow: 'hidden',
      padding: '10px'
    };
  };

  const textStyle = (index) => {
    const textColors = ['#0369A1', '#1E40AF', '#2563EB'];
    return {
      fontSize: isMobile ? '18px' : '22px', // Smaller text for smaller cards
      fontWeight: '800',
      color: textColors[index % 3],
      letterSpacing: '1px',
      zIndex: 2,
      margin: 0
    };
  };

  // --- VIEW: MONTH DETAIL ---
  if (selectedMonth !== null) {
    return <MonthGrid monthId={selectedMonth + 1} monthName={months[selectedMonth]} onBack={() => setSelectedMonth(null)} />;
  }

  // --- VIEW: MONTH SELECTION GRID ---
  return (
    <div style={{ animation: 'fadeIn 0.5s ease', padding: isMobile ? '5px' : '0' }}>
      
      {/* Header Section */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: isMobile ? '20px' : '30px',
        justifyContent: isMobile ? 'center' : 'flex-start' 
      }}>
        <Calendar size={isMobile ? 24 : 28} color="#3B82F6" style={{ marginRight: '10px' }} />
        <h2 style={{ 
          fontSize: isMobile ? '22px' : '28px', 
          fontWeight: '800', 
          color: '#1E3A8A', 
          margin: 0 
        }}>Habit Months</h2>
      </div>

      {/* 3. Responsive Grid Layout */}
      <div style={{ 
        display: 'grid', 
        // On mobile, we use a smaller minimum (140px) to allow 2 columns on most phones
        gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? '140px' : '220px'}, 1fr))`, 
        gap: isMobile ? '15px' : '25px' 
      }}>
        {months.map((name, index) => (
          <div 
            key={name} 
            style={getCardStyle(index)} 
            onClick={() => setSelectedMonth(index)}
            onMouseEnter={(e) => !isMobile && (e.currentTarget.style.transform = 'translateY(-5px)')}
            onMouseLeave={(e) => !isMobile && (e.currentTarget.style.transform = 'translateY(0)')}
          >
            {/* Background Month Number */}
            <span style={{ 
              position: 'absolute', 
              top: isMobile ? '5px' : '10px', 
              right: isMobile ? '10px' : '15px', 
              fontSize: isMobile ? '30px' : '40px', 
              fontWeight: '900', 
              color: 'rgba(255, 255, 255, 0.5)',
              userSelect: 'none'
            }}>
                {String(index + 1).padStart(2, '0')}
            </span>

            <h3 style={textStyle(index)}>{name.toUpperCase()}</h3>
            
            {/* Aesthetic accent line */}
            <div style={{ 
              marginTop: '8px', 
              width: isMobile ? '30px' : '40px', 
              height: '4px', 
              backgroundColor: 'rgba(255,255,255,0.7)', 
              borderRadius: '2px' 
            }} />
          </div>
        ))}
      </div>

      {/* Global Animation Style */}
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