import React, { useState, useEffect } from 'react';
import WorkoutGrid from './WorkOutGrid';
import { Dumbbell } from 'lucide-react';

const WorkoutTracker = () => {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // --- Mobile Responsiveness Logic ---
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
      { bg: '#DCFCE7', border: '#BBF7D0', text: '#166534' }, // Mint
      { bg: '#F0FDF4', border: '#86EFAC', text: '#15803D' }, // Soft Green
      { bg: '#ECFDF5', border: '#A7F3D0', text: '#047857' }  // Emerald Tint
    ];
    const color = colors[index % 3];
    
    return {
      backgroundColor: color.bg,
      border: `2px solid ${color.border}`,
      borderRadius: isMobile ? '20px' : '24px',
      height: isMobile ? '120px' : '160px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: isMobile ? 'flex-start' : 'center',
      paddingLeft: isMobile ? '20px' : '0',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
      position: 'relative',
      overflow: 'hidden',
      WebkitTapHighlightColor: 'transparent' // Cleaner mobile taps
    };
  };

  if (selectedMonth !== null) {
    return (
      <WorkoutGrid 
        monthName={months[selectedMonth]} 
        monthId={selectedMonth + 1} 
        onBack={() => setSelectedMonth(null)} 
      />
    );
  }

  return (
    <div style={{ 
      animation: 'fadeIn 0.5s ease', 
      padding: isMobile ? '10px' : '20px' 
    }}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: isMobile ? '20px' : '30px' 
      }}>
        <Dumbbell size={isMobile ? 24 : 32} color="#22C55E" style={{ marginRight: '12px' }} />
        <h2 style={{ 
          fontSize: isMobile ? '24px' : '28px', 
          fontWeight: '900', 
          color: '#166534',
          margin: 0
        }}>
          Workout Months
        </h2>
      </div>

      <div style={{ 
        display: 'grid', 
        // 2 columns on mobile, auto-fill on desktop
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fill, minmax(220px, 1fr))', 
        gap: isMobile ? '12px' : '25px' 
      }}>
        {months.map((name, index) => {
          const style = getCardStyle(index);
          return (
            <div 
              key={name} 
              style={style} 
              onClick={() => setSelectedMonth(index)}
              onMouseEnter={(e) => {
                if (!isMobile) e.currentTarget.style.transform = 'translateY(-5px)';
              }}
              onMouseLeave={(e) => {
                if (!isMobile) e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span style={{ 
                position: 'absolute', 
                top: isMobile ? '5px' : '10px', 
                right: isMobile ? '10px' : '15px', 
                fontSize: isMobile ? '32px' : '40px', 
                fontWeight: '900', 
                color: 'rgba(255, 255, 255, 0.5)',
                zIndex: 1
              }}>
                {String(index + 1).padStart(2, '0')}
              </span>

              <h3 style={{ 
                fontSize: isMobile ? '16px' : '20px', 
                fontWeight: '900', 
                color: style.text, 
                letterSpacing: '1px', 
                zIndex: 2,
                margin: 0
              }}>
                {name.toUpperCase()}
              </h3>

              {/* Decorative Fitness Line */}
              <div style={{ 
                marginTop: '10px', 
                width: isMobile ? '30px' : '45px', 
                height: '4px', 
                backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                borderRadius: '10px',
                zIndex: 2
              }} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkoutTracker;