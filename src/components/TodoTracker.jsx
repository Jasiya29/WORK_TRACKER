import React, { useState, useEffect } from 'react';
import TodoGrid from './TodoGrid';
import { CheckSquare } from 'lucide-react';

const TodoTracker = () => {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // --- Handle Screen Resize ---
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
      { bg: '#FEF9C3', border: '#FEF08A', text: '#A16207' }, 
      { bg: '#FFFBEB', border: '#FDE68A', text: '#B45309' }, 
      { bg: '#FEFCE8', border: '#FEF9C3', text: '#CA8A04' }  
    ];
    const color = colors[index % 3];
    
    return {
      backgroundColor: color.bg,
      border: `2px solid ${color.border}`,
      borderRadius: isMobile ? '20px' : '24px',
      // Shorter cards on mobile to fit more on screen
      height: isMobile ? '110px' : '160px', 
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
      WebkitTapHighlightColor: 'transparent'
    };
  };

  if (selectedMonth !== null) {
    return (
      <TodoGrid 
        monthId={selectedMonth + 1} 
        monthName={months[selectedMonth]} 
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
        <CheckSquare size={isMobile ? 24 : 28} color="#EAB308" style={{ marginRight: '12px' }} />
        <h2 style={{ 
          fontSize: isMobile ? '22px' : '28px', 
          fontWeight: '800', 
          color: '#854D0E', 
          margin: 0 
        }}>
          To-Do Months
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
                fontSize: isMobile ? '30px' : '40px', 
                fontWeight: '900', 
                color: 'rgba(255, 255, 255, 0.6)' 
              }}>
                {String(index + 1).padStart(2, '0')}
              </span>

              <h3 style={{ 
                fontSize: isMobile ? '16px' : '22px', 
                fontWeight: '800', 
                color: style.text, 
                letterSpacing: '1px', 
                zIndex: 2,
                margin: 0
              }}>
                {name.toUpperCase()}
              </h3>
              
              <div style={{ 
                marginTop: '8px', 
                width: isMobile ? '20px' : '30px', 
                height: '3px', 
                backgroundColor: 'rgba(255,255,255,0.7)', 
                borderRadius: '2px' 
              }} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TodoTracker;