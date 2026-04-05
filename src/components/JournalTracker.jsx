import React, { useState, useEffect } from 'react';
import JournalCalendar from './JournalCalendar';
import { BookOpen } from 'lucide-react';

const JournalTracker = () => {
  const [selectedMonth, setSelectedMonth] = useState(null);
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

  const getCardStyle = (index) => {
    const colors = [
      { bg: '#FCE7F3', border: '#FBCFE8', text: '#9D174D' }, 
      { bg: '#FDF2F8', border: '#F9A8D4', text: '#BE185D' }, 
      { bg: '#FFF1F2', border: '#FECDD3', text: '#E11D48' }  
    ];
    const color = colors[index % 3];

    return {
      backgroundColor: color.bg,
      border: `2px solid ${color.border}`,
      borderRadius: isMobile ? '20px' : '24px',
      // Thinner cards on mobile to save vertical space
      height: isMobile ? '100px' : '160px', 
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: isMobile ? 'flex-start' : 'center', // Align left on mobile
      paddingLeft: isMobile ? '20px' : '0',
      cursor: 'pointer',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
      position: 'relative',
      overflow: 'hidden',
      WebkitTapHighlightColor: 'transparent' // Removes blue flash on tap for mobile
    };
  };

  if (selectedMonth !== null) {
    return (
      <JournalCalendar 
        month={{ id: selectedMonth + 1, name: months[selectedMonth] }} 
        onBack={() => setSelectedMonth(null)} 
      />
    );
  }

  return (
    <div style={{ 
      animation: 'fadeIn 0.5s ease', 
      padding: isMobile ? '10px' : '20px',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: isMobile ? '20px' : '30px' 
      }}>
        <BookOpen size={isMobile ? 24 : 28} color="#EC4899" style={{ marginRight: '12px' }} />
        <h2 style={{ 
          fontSize: isMobile ? '22px' : '28px', 
          fontWeight: '800', 
          color: '#9D174D', 
          margin: 0 
        }}>
          Journal Archive
        </h2>
      </div>

      <div style={{
        display: 'grid',
        // On mobile, show 2 columns. On tablet/desktop, use auto-fill.
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: isMobile ? '12px' : '25px'
      }}>
        {months.map((name, index) => (
          <div
            key={name}
            style={getCardStyle(index)}
            onClick={() => setSelectedMonth(index)}
            onMouseEnter={(e) => {
              if (!isMobile) {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isMobile) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.05)';
              }
            }}
          >
            <span style={{
              position: 'absolute', 
              top: isMobile ? '5px' : '10px', 
              right: isMobile ? '10px' : '15px',
              fontSize: isMobile ? '28px' : '40px', 
              fontWeight: '900', 
              color: 'rgba(255, 255, 255, 0.5)'
            }}>
              {String(index + 1).padStart(2, '0')}
            </span>

            <h3 style={{ 
              fontSize: isMobile ? '16px' : '22px', 
              fontWeight: '800', 
              color: '#9D174D', 
              zIndex: 2,
              margin: 0
            }}>
              {name.toUpperCase()}
            </h3>
            
            {/* The little decorative bar stays visible but smaller on mobile */}
            <div style={{ 
              marginTop: '8px', 
              width: isMobile ? '20px' : '40px', 
              height: '3px', 
              backgroundColor: 'rgba(255,255,255,0.6)', 
              borderRadius: '2px' 
            }} />
          </div>
        ))}
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

export default JournalTracker;