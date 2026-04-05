import React, { useState, useEffect } from 'react';
import { Trash2, Check, Scale, Plus, Ruler, Activity, ArrowLeft } from 'lucide-react';

const WorkoutGrid = ({ monthName, monthId, onBack }) => {
  const [workouts, setWorkouts] = useState(() => {
    const saved = localStorage.getItem(`workouts-${monthId}`);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [newWorkout, setNewWorkout] = useState("");
  const [weightLogs, setWeightLogs] = useState(() => {
    const saved = localStorage.getItem(`weightLogs-${monthId}`);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [height, setHeight] = useState("");
  const [currentWeight, setCurrentWeight] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem(`workouts-${monthId}`, JSON.stringify(workouts));
    localStorage.setItem(`weightLogs-${monthId}`, JSON.stringify(weightLogs));
  }, [workouts, weightLogs, monthId]);

  const calculateBMI = (w, h) => {
    if (!w || !h || h <= 0) return "0.0";
    const heightInMeters = h / 100;
    return (w / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const getBMICategory = (bmi) => {
    const val = parseFloat(bmi);
    if (val < 18.5) return { label: 'Underweight', color: '#3B82F6' };
    if (val < 25) return { label: 'Healthy', color: '#22C55E' };
    if (val < 30) return { label: 'Overweight', color: '#EAB308' };
    return { label: 'Obese', color: '#EF4444' };
  };

  const toggleTick = (workoutId, day) => {
    setWorkouts(prev => prev.map(w => {
      if (w.id === workoutId) {
        return { ...w, ticks: { ...w.ticks, [day]: !w.ticks[day] } };
      }
      return w;
    }));
  };

  const handleWeightUpdate = () => {
    if (!currentWeight || !height) return;
    const bmiValue = calculateBMI(currentWeight, height);
    const category = getBMICategory(bmiValue);
    const newLog = {
      id: Date.now(),
      weight: currentWeight,
      height: height,
      bmi: bmiValue,
      bmiColor: category.color,
      bmiLabel: category.label,
      date: new Date().toLocaleDateString(),
    };
    setWeightLogs([newLog, ...weightLogs]);
    setCurrentWeight("");
  };

  const s = {
    wrapper: { padding: isMobile ? '15px' : '20px', backgroundColor: '#fff', borderRadius: '24px' },
    greenBanner: { 
      backgroundColor: '#DCFCE7', 
      padding: '12px', 
      textAlign: 'center', 
      fontWeight: '900', 
      color: '#166534', 
      border: '2px solid #BBF7D0', 
      marginBottom: '20px', 
      borderRadius: '12px', 
      letterSpacing: isMobile ? '2px' : '5px',
      fontSize: isMobile ? '14px' : '18px'
    },
    tableContainer: { 
      overflowX: 'auto', 
      border: '1.5px solid #BBF7D0', 
      borderRadius: '12px',
      WebkitOverflowScrolling: 'touch' 
    },
    table: { width: '100%', borderCollapse: 'separate', borderSpacing: 0, minWidth: '600px' },
    stickyTh: { 
      position: 'sticky', 
      left: 0, 
      backgroundColor: '#F0FDF4', 
      zIndex: 10, 
      borderRight: '2px solid #BBF7D0',
      padding: '12px',
      color: '#166534',
      fontSize: '11px'
    },
    stickyTd: { 
      position: 'sticky', 
      left: 0, 
      backgroundColor: 'white', 
      zIndex: 5, 
      borderRight: '2px solid #BBF7D0',
      textAlign: 'left', 
      paddingLeft: '15px',
      color: '#15803D',
      fontWeight: '600'
    },
    th: { backgroundColor: '#F0FDF4', color: '#166534', padding: '12px', borderBottom: '1px solid #BBF7D0', borderRight: '1px solid #DCFCE7', fontSize: '11px' },
    td: { borderBottom: '1px solid #DCFCE7', borderRight: '1px solid #DCFCE7', height: '45px', textAlign: 'center', color: '#15803D' },
    inputGroup: { 
      display: 'flex', 
      flexDirection: isMobile ? 'column' : 'row', 
      gap: '12px', 
      marginBottom: '20px' 
    },
    inputWrapper: { 
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px', 
      backgroundColor: '#FFFFFF', // Explicit white for wrapper
      padding: '12px 15px', 
      borderRadius: '12px', 
      border: '2px solid #BBF7D0',
      flex: 1
    },
    // FIXED: Added explicit white background and removed default outlines to stop "black field" appearance
    input: { 
      border: 'none', 
      outline: 'none', 
      fontWeight: 'bold', 
      color: '#166534', 
      width: '100%', 
      fontSize: '16px',
      backgroundColor: '#FFFFFF', // Explicit white for the actual input field
      WebkitAppearance: 'none',
      appearance: 'none'
    },
    btn: { 
      backgroundColor: '#22C55E', 
      color: 'white', 
      border: 'none', 
      padding: '14px 25px', 
      borderRadius: '12px', 
      cursor: 'pointer', 
      fontWeight: 'bold', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      gap: '8px' 
    }
  };

  const daysInMonth = new Date(2026, monthId, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div style={s.wrapper}>
      <button onClick={onBack} style={{ color: '#22C55E', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '800', marginBottom: '15px' }}>← BACK</button>
      <div style={s.greenBanner}>{monthName.toUpperCase()} WORKOUT SHEET</div>

      <div style={s.tableContainer}>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.stickyTh}>EXERCISE</th>
              {daysArray.map(d => <th key={d} style={s.th}>{d}</th>)}
            </tr>
          </thead>
          <tbody>
            {workouts.map(w => (
              <tr key={w.id}>
                <td style={s.stickyTd}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minWidth: '120px' }}>
                    <span style={{fontSize: '13px'}}>{w.name}</span>
                    <Trash2 size={14} color="#FDA4AF" cursor="pointer" onClick={() => setWorkouts(workouts.filter(i => i.id !== w.id))} />
                  </div>
                </td>
                {daysArray.map(d => (
                  <td key={d} style={s.td}>
                    <div 
                      style={{
                        width: '24px', height: '24px', borderRadius: '6px', margin: '0 auto',
                        backgroundColor: w.ticks?.[d] ? '#22C55E' : 'transparent',
                        border: w.ticks?.[d] ? '2px solid #22C55E' : '2px solid #BBF7D0',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer'
                      }} 
                      onClick={() => toggleTick(w.id, d)}
                    >
                      {w.ticks?.[d] && <Check size={14} color="white" strokeWidth={4} />}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td style={{ ...s.stickyTd, padding: 0 }}>
                <input 
                  style={{ ...s.input, width: '100%', padding: '12px 15px', backgroundColor: '#F0FDF4', fontSize: '13px' }} 
                  placeholder="+ Exercise" value={newWorkout} 
                  onChange={(e) => setNewWorkout(e.target.value)} 
                  onKeyDown={(e) => e.key === 'Enter' && (setWorkouts([...workouts, { id: Date.now(), name: newWorkout, ticks: {} }]), setNewWorkout(""))} 
                />
              </td>
              {daysArray.map(d => <td key={d} style={{ ...s.td, backgroundColor: '#F8FAFC' }}></td>)}
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '30px', padding: isMobile ? '15px' : '25px', backgroundColor: '#F0FDF4', borderRadius: '20px', border: '2px solid #BBF7D0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Activity color="#166534" size={24} />
          <h2 style={{ color: '#166534', margin: 0, fontSize: isMobile ? '18px' : '20px' }}>Health Tracker</h2>
        </div>

        <div style={s.inputGroup}>
          <div style={s.inputWrapper}>
            <Ruler size={18} color="#15803D" />
            <input 
               type="number" 
               style={s.input} 
               placeholder="Height (cm)" 
               value={height} 
               onChange={(e) => setHeight(e.target.value)} 
            />
          </div>
          <div style={s.inputWrapper}>
            <Scale size={18} color="#15803D" />
            <input 
               type="number" 
               style={s.input} 
               placeholder="Weight (kg)" 
               value={currentWeight} 
               onChange={(e) => setCurrentWeight(e.target.value)} 
            />
          </div>
          <button style={s.btn} onClick={handleWeightUpdate}><Plus size={20} /> Update</button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '12px', minWidth: '300px' }}>
            <thead style={{ backgroundColor: '#BBF7D0' }}>
              <tr>
                <th style={{ padding: '10px', color: '#166534', fontSize: '12px' }}>Date</th>
                <th style={{ padding: '10px', color: '#166534', fontSize: '12px' }}>Wt</th>
                <th style={{ padding: '10px', color: '#166534', fontSize: '12px' }}>BMI</th>
              </tr>
            </thead>
            <tbody>
              {weightLogs.map(log => (
                <tr key={log.id} style={{ borderBottom: '1px solid #F0FDF4', textAlign: 'center' }}>
                  <td style={{ padding: '10px', color: '#15803D', fontSize: '12px' }}>{log.date}</td>
                  <td style={{ padding: '10px', color: '#15803D', fontWeight: 'bold', fontSize: '12px' }}>{log.weight}kg</td>
                  <td style={{ padding: '10px' }}>
                    <span style={{ backgroundColor: log.bmiColor, color: 'white', padding: '3px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: 'bold' }}>
                      {log.bmi}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WorkoutGrid;