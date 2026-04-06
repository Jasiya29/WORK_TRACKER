import React, { useState, useEffect } from 'react';
import { Trash2, Check, Scale, Plus, Ruler, Activity, ArrowLeft } from 'lucide-react';

const WorkoutGrid = ({ monthName, monthId, onBack }) => {
  const [exercises, setExercises] = useState(() => {
    const saved = localStorage.getItem(`exercises-${monthId}`);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [newExName, setNewExName] = useState("");
  const [ticks, setTicks] = useState(() => {
    const saved = localStorage.getItem(`ticks-${monthId}`);
    return saved ? JSON.parse(saved) : {};
  });

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

  // --- PERSISTENCE & DASHBOARD SYNC ---
  useEffect(() => {
    localStorage.setItem(`exercises-${monthId}`, JSON.stringify(exercises));
    localStorage.setItem(`ticks-${monthId}`, JSON.stringify(ticks));
    localStorage.setItem(`weightLogs-${monthId}`, JSON.stringify(weightLogs));

    // SYNC WITH DASHBOARD: workout_tracker_2026
    const dashboardStats = JSON.parse(localStorage.getItem('workout_tracker_2026') || '{}');
    const daysInMonth = new Date(2026, monthId, 0).getDate();

    for (let d = 1; d <= daysInMonth; d++) {
      // Check if ANY exercise was ticked for this specific day
      const isDayDone = exercises.some(ex => ticks[`${d}-${ex.id}`] === true);
      dashboardStats[`${monthId}-${d}`] = isDayDone;
    }

    localStorage.setItem('workout_tracker_2026', JSON.stringify(dashboardStats));
  }, [exercises, ticks, weightLogs, monthId]);

  const addExercise = () => {
    if (!newExName.trim()) return;
    setExercises([...exercises, { id: Date.now(), name: newExName }]);
    setNewExName("");
  };

  const toggleTick = (day, exId) => {
    const key = `${day}-${exId}`;
    setTicks(prev => ({ ...prev, [key]: !prev[key] }));
  };

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
      backgroundColor: '#DCFCE7', padding: '12px', textAlign: 'center', 
      fontWeight: '900', color: '#166534', border: '2px solid #BBF7D0', 
      marginBottom: '20px', borderRadius: '12px', letterSpacing: '2px'
    },
    tableContainer: { 
      overflowX: 'auto', border: '1.5px solid #BBF7D0', borderRadius: '12px',
      WebkitOverflowScrolling: 'touch', backgroundColor: '#fff' 
    },
    table: { width: '100%', borderCollapse: 'separate', borderSpacing: 0 },
    stickyCol: { 
      position: 'sticky', left: 0, backgroundColor: '#F0FDF4', 
      zIndex: 10, borderRight: '2px solid #BBF7D0', padding: '12px',
      color: '#166534', fontWeight: 'bold', textAlign: 'center', minWidth: '60px'
    },
    th: { 
      backgroundColor: '#F0FDF4', color: '#166534', padding: '15px', 
      borderBottom: '2px solid #BBF7D0', fontSize: '12px', textAlign: 'center', minWidth: '120px' 
    },
    td: { 
      borderBottom: '1px solid #DCFCE7', borderRight: '1px solid #DCFCE7', 
      padding: '10px', textAlign: 'center' 
    },
    inputRow: { display: 'flex', gap: '10px', marginBottom: '20px' },
    input: { 
      border: 'none', outline: 'none', fontWeight: 'bold', color: '#166534', 
      width: '100%', fontSize: '16px', backgroundColor: '#FFFFFF' 
    },
    btn: { 
      backgroundColor: '#22C55E', color: 'white', border: 'none', 
      padding: '12px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' 
    }
  };

  const daysArray = Array.from({ length: new Date(2026, monthId, 0).getDate() }, (_, i) => i + 1);

  return (
    <div style={s.wrapper}>
      <button onClick={onBack} style={{ color: '#22C55E', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '800', marginBottom: '15px' }}>
        <ArrowLeft size={18} style={{verticalAlign: 'middle'}}/> BACK
      </button>
      <div style={s.greenBanner}>{monthName.toUpperCase()} 2026</div>

      <div style={s.inputRow}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#fff', padding: '10px 15px', borderRadius: '12px', border: '2px solid #BBF7D0' }}>
          <input 
            style={s.input} 
            placeholder="+ Add New Exercise..." 
            value={newExName}
            onChange={(e) => setNewExName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addExercise()}
          />
        </div>
        <button style={s.btn} onClick={addExercise}><Plus size={20} /></button>
      </div>

      <div style={s.tableContainer}>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.stickyCol}>DAY</th>
              {exercises.map(ex => (
                <th key={ex.id} style={s.th}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                    <span style={{fontSize: '11px'}}>{ex.name}</span>
                    <Trash2 size={14} color="#FDA4AF" cursor="pointer" onClick={() => setExercises(exercises.filter(e => e.id !== ex.id))} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {exercises.length > 0 ? (
              daysArray.map(day => (
                <tr key={day}>
                  <td style={s.stickyCol}>{day}</td>
                  {exercises.map(ex => (
                    <td key={ex.id} style={s.td}>
                      <div 
                        style={{
                          width: '28px', height: '28px', borderRadius: '6px', margin: '0 auto',
                          backgroundColor: ticks[`${day}-${ex.id}`] ? '#22C55E' : 'transparent',
                          border: ticks[`${day}-${ex.id}`] ? '2px solid #22C55E' : '2px solid #BBF7D0',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                        }} 
                        onClick={() => toggleTick(day, ex.id)}
                      >
                        {ticks[`${day}-${ex.id}`] && <Check size={16} color="white" strokeWidth={4} />}
                      </div>
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={100} style={{ padding: '60px', textAlign: 'center', color: '#94A3B8', fontStyle: 'italic' }}>
                  No exercises added. Add one above to start tracking!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#F0FDF4', borderRadius: '20px', border: '2px solid #BBF7D0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Activity color="#166534" size={24} />
          <h2 style={{ color: '#166534', margin: 0, fontSize: '18px' }}>Body Weight Tracker</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '10px', marginBottom: '20px' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#fff', padding: '10px', borderRadius: '12px', border: '2px solid #BBF7D0' }}>
            <Ruler size={18} color="#15803D" />
            <input type="number" style={s.input} placeholder="Ht(cm)" value={height} onChange={e => setHeight(e.target.value)} />
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#fff', padding: '10px', borderRadius: '12px', border: '2px solid #BBF7D0' }}>
            <Scale size={18} color="#15803D" />
            <input type="number" style={s.input} placeholder="Wt(kg)" value={currentWeight} onChange={e => setCurrentWeight(e.target.value)} />
          </div>
          <button style={s.btn} onClick={handleWeightUpdate}>Update</button>
        </div>

        <div style={{ overflowX: 'auto', backgroundColor: '#fff', borderRadius: '12px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#BBF7D0' }}>
              <tr>
                <th style={{ padding: '10px', color: '#166534' }}>Date</th>
                <th style={{ padding: '10px', color: '#166534' }}>Weight</th>
                <th style={{ padding: '10px', color: '#166534' }}>BMI</th>
              </tr>
            </thead>
            <tbody>
              {weightLogs.map(log => (
                <tr key={log.id} style={{ borderBottom: '1px solid #F0FDF4', textAlign: 'center' }}>
                  <td style={{ padding: '10px', color: '#15803D' }}>{log.date}</td>
                  <td style={{ padding: '10px', color: '#15803D', fontWeight: 'bold' }}>{log.weight}kg</td>
                  <td style={{ padding: '10px' }}>
                    <span style={{ backgroundColor: log.bmiColor, color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
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