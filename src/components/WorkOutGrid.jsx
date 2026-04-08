import React, { useState, useEffect } from 'react';
import { Trash2, Check, Scale, Plus, Ruler, Activity, ArrowLeft, TrendingUp } from 'lucide-react';

const WorkoutGrid = ({ monthName, monthId, year, onBack }) => {
  // --- STATE ---
  const [exercises, setExercises] = useState(() => {
    const saved = localStorage.getItem(`exercises-${year}-${monthId}`);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [newExName, setNewExName] = useState("");
  const [ticks, setTicks] = useState(() => {
    const saved = localStorage.getItem(`ticks-${year}-${monthId}`);
    return saved ? JSON.parse(saved) : {};
  });

  const [weightLogs, setWeightLogs] = useState(() => {
    const saved = localStorage.getItem(`weightLogs-${year}-${monthId}`);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [height, setHeight] = useState("");
  const [currentWeight, setCurrentWeight] = useState("");
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- PERSISTENCE & DASHBOARD SYNC ---
  useEffect(() => {
    localStorage.setItem(`exercises-${year}-${monthId}`, JSON.stringify(exercises));
    localStorage.setItem(`ticks-${year}-${monthId}`, JSON.stringify(ticks));
    localStorage.setItem(`weightLogs-${year}-${monthId}`, JSON.stringify(weightLogs));

    const dashboardKey = `workout_tracker_${year}`;
    const dashboardStats = JSON.parse(localStorage.getItem(dashboardKey) || '{}');
    const daysInMonth = new Date(year, monthId, 0).getDate();

    for (let d = 1; d <= daysInMonth; d++) {
      const isDayDone = exercises.some(ex => ticks[`${d}-${ex.id}`] === true);
      dashboardStats[`${monthId}-${d}`] = isDayDone;
    }
    localStorage.setItem(dashboardKey, JSON.stringify(dashboardStats));
  }, [exercises, ticks, weightLogs, monthId, year]);

  const addExercise = () => {
    if (!newExName.trim()) return;
    setExercises([...exercises, { id: Date.now(), name: newExName }]);
    setNewExName("");
  };

  const toggleTick = (day, exId) => {
    const key = `${day}-${exId}`;
    setTicks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // --- CALENDAR & GRAPH LOGIC ---
  const daysInMonthCount = new Date(year, monthId, 0).getDate();
  const daysArray = Array.from({ length: daysInMonthCount }, (_, i) => i + 1);
  const graphColors = ['#22C55E', '#3B82F6', '#EF4444', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'];

  const getPathData = (ex) => {
    let runningTotal = 0;
    const points = [];
    const width = 1000;
    const height = 200;
    const stepX = width / (daysInMonthCount - 1);

    daysArray.forEach((day, i) => {
      if (ticks[`${day}-${ex.id}`]) runningTotal++;
      const x = i * stepX;
      const percentage = (runningTotal / daysInMonthCount) * 100;
      const y = height - (percentage * (height / 100));
      points.push(`${x},${y}`);
    });
    return points.join(' ');
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
      backgroundColor: '#fff' 
    },
    stickyCol: { 
      position: 'sticky', left: 0, backgroundColor: '#F0FDF4', 
      zIndex: 10, borderRight: '2px solid #BBF7D0', padding: '12px',
      color: '#166534', fontWeight: 'bold', textAlign: 'center', minWidth: '60px'
    },
    inputBox: { 
      flex: 1, display: 'flex', alignItems: 'center', gap: '8px', 
      backgroundColor: '#FFFFFF', padding: '10px 15px', borderRadius: '10px', 
      border: '2px solid #BBF7D0' 
    },
    inputField: { 
      border: 'none', outline: 'none', fontWeight: 'bold', 
      color: '#16A34A', width: '100%', fontSize: '16px', backgroundColor: 'transparent' 
    },
    btn: { 
      backgroundColor: '#22C55E', color: 'white', border: 'none', 
      padding: '12px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' 
    },
    chartCard: {
      marginTop: '30px', padding: '25px', backgroundColor: '#FFFFFF',
      borderRadius: '20px', border: '2px solid #BBF7D0'
    },
    legendGrid: { 
      display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '20px', 
      paddingTop: '15px', borderTop: '1px solid #F0FDF4' 
    }
  };

  return (
    <div style={s.wrapper}>
      <button onClick={onBack} style={{ color: '#22C55E', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '800', marginBottom: '15px' }}>
        <ArrowLeft size={18} style={{verticalAlign: 'middle'}}/> BACK
      </button>
      <div style={s.greenBanner}>{monthName.toUpperCase()} {year}</div>

      {/* Exercise Input Section */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <div style={s.inputBox}>
          <input 
            style={s.inputField} 
            placeholder="Type a new exercise..." 
            value={newExName}
            onChange={(e) => setNewExName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addExercise()}
          />
        </div>
        <button style={s.btn} onClick={addExercise}><Plus size={20} /></button>
      </div>

      {/* --- CONDITIONAL RENDER: Only show if exercises exist --- */}
      {exercises.length > 0 ? (
        <>
          <div style={s.tableContainer}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr>
                  <th style={s.stickyCol}>DAY</th>
                  {exercises.map(ex => (
                    <th key={ex.id} style={{ backgroundColor: '#F0FDF4', color: '#166534', padding: '15px', borderBottom: '2px solid #BBF7D0', minWidth: '120px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                        <span style={{fontSize: '11px', fontWeight: '900'}}>{ex.name.toUpperCase()}</span>
                        <Trash2 size={14} color="#FDA4AF" cursor="pointer" onClick={() => setExercises(exercises.filter(e => e.id !== ex.id))} />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {daysArray.map(day => (
                  <tr key={day}>
                    <td style={s.stickyCol}>{day}</td>
                    {exercises.map(ex => (
                      <td key={ex.id} style={{ borderBottom: '1px solid #DCFCE7', borderRight: '1px solid #DCFCE7', padding: '10px', textAlign: 'center' }}>
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
                ))}
              </tbody>
            </table>
          </div>

          <div style={s.chartCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <TrendingUp color="#166534" size={24} />
              <h3 style={{ margin: 0, color: '#166534', fontSize: '18px', fontWeight: '900' }}>WORKOUT PROGRESS</h3>
            </div>
            
            <div style={{ position: 'relative', height: '200px', borderLeft: '2px solid #BBF7D0', borderBottom: '2px solid #BBF7D0', margin: '10px 10px 20px 40px' }}>
              <div style={{ position: 'absolute', left: '-40px', top: '0', fontSize: '10px', fontWeight: 'bold', color: '#166534' }}>100%</div>
              <div style={{ position: 'absolute', left: '-40px', bottom: '0', fontSize: '10px', fontWeight: 'bold', color: '#166534' }}>0%</div>
              
              <svg viewBox="0 0 1000 200" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block', overflow: 'visible' }}>
                {exercises.map((ex, i) => (
                  <polyline
                    key={ex.id}
                    fill="none"
                    stroke={graphColors[i % graphColors.length]}
                    strokeWidth="4"
                    points={getPathData(ex)}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ))}
              </svg>
            </div>

            <div style={s.legendGrid}>
              {exercises.map((ex, i) => (
                <div key={ex.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '700', color: '#166534' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: graphColors[i % graphColors.length] }} />
                  {ex.name}
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div style={{ padding: '60px', textAlign: 'center', backgroundColor: '#F0FDF4', borderRadius: '20px', border: '2px dashed #BBF7D0' }}>
          <Activity size={40} color="#BBF7D0" style={{ marginBottom: '10px' }} />
          <p style={{ color: '#166534', fontWeight: 'bold', margin: 0 }}>Add an exercise!</p>
        </div>
      )}

      {/* Weight Tracker - Always Visible */}
      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#F0FDF4', borderRadius: '20px', border: '2px solid #BBF7D0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Activity color="#166534" size={24} />
          <h2 style={{ color: '#166534', margin: 0, fontSize: '18px', fontWeight: '900' }}>BODY TRACKING</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '10px', marginBottom: '20px' }}>
          <div style={s.inputBox}>
            <Ruler size={18} color="#15803D" />
            <input type="number" style={s.inputField} placeholder="Height (cm)" value={height} onChange={e => setHeight(e.target.value)} />
          </div>
          <div style={s.inputBox}>
            <Scale size={18} color="#15803D" />
            <input type="number" style={s.inputField} placeholder="Weight (kg)" value={currentWeight} onChange={e => setCurrentWeight(e.target.value)} />
          </div>
          <button style={s.btn} onClick={handleWeightUpdate}>UPDATE</button>
        </div>

        <div style={{ overflowX: 'auto', backgroundColor: '#fff', borderRadius: '12px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#BBF7D0' }}>
              <tr>
                <th style={{ padding: '12px', color: '#166534', fontSize: '12px' }}>DATE</th>
                <th style={{ padding: '12px', color: '#166534', fontSize: '12px' }}>WEIGHT</th>
                <th style={{ padding: '12px', color: '#166534', fontSize: '12px' }}>BMI</th>
              </tr>
            </thead>
            <tbody>
              {weightLogs.map(log => (
                <tr key={log.id} style={{ borderBottom: '1px solid #F0FDF4', textAlign: 'center' }}>
                  <td style={{ padding: '12px', color: '#15803D', fontSize: '14px' }}>{log.date}</td>
                  <td style={{ padding: '12px', color: '#15803D', fontWeight: 'bold' }}>{log.weight}kg</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ backgroundColor: log.bmiColor, color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '900' }}>
                      {log.bmi} - {log.bmiLabel.toUpperCase()}
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