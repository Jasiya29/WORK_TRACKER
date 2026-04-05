// import React, { useState, useEffect } from 'react';
// import { Trash2, Check, ArrowLeft, Plus } from 'lucide-react';

// const MonthGrid = ({ monthId, monthName, onBack }) => {
//   const [habits, setHabits] = useState([]);
//   const [newHabit, setNewHabit] = useState("");
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

//   // CHANGE 'localhost' to your IP Address if using a real mobile phone
//   const API_BASE = "http://localhost:8080/api/habits";

//   useEffect(() => {
//     fetchHabits();
//     const handleResize = () => setIsMobile(window.innerWidth < 768);
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, [monthName]);

//   const fetchHabits = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/month/${monthName}`);
//       const data = await res.json();
//       // Ensure we always have an array
//       setHabits(Array.isArray(data) ? data : []);
//     } catch (e) {
//       console.error("Fetch failed. Is the backend running?", e);
//     }
//   };

//   const addHabit = async (e) => {
//   // Trigger on 'Enter' key press OR a mouse click on the plus button
//   if (e.key === 'Enter' || e.type === 'click') {
    
//     // Prevent page refresh if inside a form
//     if (e.key === 'Enter') e.preventDefault();

//     if (!newHabit.trim()) return;

//     console.log("Sending to Backend:", newHabit);

//     try {
//       const res = await fetch(API_BASE, {
//         method: 'POST',
//         headers: { 
//           'Content-Type': 'application/json',
//           'Accept': 'application/json'
//         },
//         body: JSON.stringify({ 
//           name: newHabit, 
//           monthName: monthName, 
//           completed: {} 
//         })
//       });

//       if (res.ok) {
//         const savedHabit = await res.json();
//         setHabits(prev => [...prev, savedHabit]);
//         setNewHabit(""); // Clear input field
//         console.log("Success! Habit added.");
//       } else {
//         const errorData = await res.text();
//         console.error("Server refused request:", errorData);
//         alert("Server Error: Check your Spring Boot console.");
//       }
//     } catch (err) {
//       console.error("Connection Failed:", err);
//       alert("Network Error: Is Spring Boot running at " + API_BASE + "?");
//     }
//   }
// };

//   const toggleDay = async (habitId, day) => {
//   // 1. Optimistic Update (Immediate UI change)
//   setHabits(prev => prev.map(h => {
//     if (h.id === habitId) {
//       const currentStatus = h.completed ? (h.completed[day] || h.completed[String(day)]) : false;
//       return { 
//         ...h, 
//         completed: { ...h.completed, [day]: !currentStatus } 
//       };
//     }
//     return h;
//   }));

//   try {
//     // 2. The API call you just wrote
//     const response = await fetch(`${API_BASE}/${habitId}/toggle/${day}`, { 
//       method: 'PATCH' 
//     });

//     if (response.ok) {
//       const updatedHabit = await response.json();
//       // 3. Final Sync (Ensures the State matches the Database exactly)
//       setHabits(prev => prev.map(h => h.id === habitId ? updatedHabit : h));
//     }
//   } catch (error) {
//     console.error("Sync failed:", error);
//     fetchHabits(); // Revert on error
//   }
// };

//   const deleteHabit = async (id) => {
//     if (window.confirm("Delete habit?")) {
//       try {
//         const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
//         if (res.ok) {
//           setHabits(prev => prev.filter(h => h.id !== id));
//         }
//       } catch (e) {
//         console.error("Delete failed", e);
//       }
//     }
//   };

//   // --- HELPERS ---
//   const daysInMonth = new Date(2026, monthId, 0).getDate();
//   const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

//   const styles = {
//     container: { 
//       padding: isMobile ? '10px 5px' : '20px', 
//       animation: 'fadeIn 0.3s ease',
//       maxWidth: '100vw'
//     },
//     header: { 
//       display: 'flex', 
//       alignItems: 'center', 
//       justifyContent: 'space-between', 
//       marginBottom: '20px',
//       padding: '0 5px'
//     },
//     scrollContainer: { 
//       overflowX: 'auto', 
//       borderRadius: isMobile ? '15px' : '20px', 
//       border: '1px solid #E2E8F0', 
//       backgroundColor: '#FFF',
//       boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
//       WebkitOverflowScrolling: 'touch' // Smooth scroll for iOS
//     },
//     table: { 
//       width: '100%', 
//       borderCollapse: 'separate', 
//       borderSpacing: 0,
//       minWidth: isMobile ? '1000px' : '1200px' // Ensure enough room for 31 days
//     },
//     // STICKY COLUMN STYLE
//     stickyTh: {
//       position: 'sticky',
//       left: 0,
//       backgroundColor: '#F8FAFC',
//       zIndex: 10,
//       padding: '15px',
//       color: '#64748B',
//       fontSize: '12px',
//       fontWeight: '800',
//       borderBottom: '2px solid #F1F5F9',
//       borderRight: '2px solid #F1F5F9'
//     },
//     stickyTd: {
//       position: 'sticky',
//       left: 0,
//       backgroundColor: '#FFF',
//       zIndex: 5,
//       padding: '12px 15px',
//       color: '#0369A1',
//       fontWeight: '700',
//       borderBottom: '1px solid #F1F5F9',
//       borderRight: '2px solid #F1F5F9',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'space-between',
//       minWidth: '160px'
//     },
//     th: { 
//       padding: '12px', 
//       color: '#64748B', 
//       fontSize: '12px', 
//       borderBottom: '2px solid #F1F5F9', 
//       textAlign: 'center',
//       minWidth: '40px'
//     },
//     tickBox: (isDone) => ({
//       width: isMobile ? '28px' : '24px', // Larger on mobile for easier tapping
//       height: isMobile ? '28px' : '24px',
//       borderRadius: '8px',
//       cursor: 'pointer',
//       margin: '0 auto',
//       transition: 'all 0.2s ease',
//       backgroundColor: isDone ? '#3B82F6' : 'transparent',
//       border: isDone ? '2px solid #3B82F6' : '2px solid #E0F2FE',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center'
//     }),
//     inputRow: { 
//       padding: isMobile ? '15px' : '25px', 
//       backgroundColor: '#F8FAFC', 
//       borderTop: '2px solid #F1F5F9',
//       display: 'flex',
//       gap: '10px'
//     },
//     input: {
//       flex: 1,
//       border: 'none',
//       outline: 'none',
//       background: 'transparent',
//       fontSize: isMobile ? '16px' : '18px', // 16px prevents iOS auto-zoom
//       fontWeight: '600',
//       color: '#1E40AF'
//     },
//     mobileAddBtn: {
//         backgroundColor: '#3B82F6',
//         borderRadius: '50%',
//         padding: '8px',
//         color: 'white',
//         display: isMobile ? 'flex' : 'none',
//         alignItems: 'center',
//         justifyContent: 'center',
//         border: 'none'
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <div style={styles.header}>
//         <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#3B82F6', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: isMobile ? '12px' : '14px' }}>
//           <ArrowLeft size={isMobile ? 16 : 18}/> {isMobile ? 'BACK' : 'BACK TO MONTHS'}
//         </button>
//         <h2 style={{ color: '#1E3A8A', margin: 0, fontSize: isMobile ? '18px' : '24px' }}>{monthName} 2026</h2>
//       </div>

//       <div style={styles.scrollContainer}>
//         <table style={styles.table}>
//           <thead>
//             <tr>
//               <th style={styles.stickyTh}>HABIT</th>
//               {daysArray.map(d => <th key={d} style={styles.th}>{d}</th>)}
//             </tr>
//           </thead>
//           <tbody>
//             {habits.length > 0 ? (
//               habits.map(habit => (
//                 <tr key={habit.id}>
//                   <td style={styles.stickyTd}>
//                     <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{habit.name}</span>
//                     <Trash2 
//                       size={16} 
//                       color="#FDA4AF" 
//                       onClick={() => deleteHabit(habit.id)} 
//                       style={{ marginLeft: '10px', flexShrink: 0, cursor: 'pointer' }}
//                     />
//                   </td>
//                  {daysArray.map(day => {
//   // Check if the day exists as a number OR a string key
//   const isChecked = habit.completed && (habit.completed[day] === true || habit.completed[String(day)] === true);

//   return (
//     <td key={day} style={{ borderBottom: '1px solid #F1F5F9', textAlign: 'center' }}>
//       <div 
//         style={styles.tickBox(isChecked)} 
//         onClick={() => toggleDay(habit.id, day)}
//       >
//         {isChecked && <Check size={16} color="white" strokeWidth={4} />}
//       </div>
//     </td>
//   );
// })}
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={daysArray.length + 1} style={{ padding: '60px', textAlign: 'center', color: '#94A3B8', fontStyle: 'italic' }}>
//                   No habits yet.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>

//         <div style={styles.inputRow}>
//           <input 
//             style={styles.input}
//             placeholder={isMobile ? "+ New Habit..." : "+ Type a new habit and press Enter..."}
//             value={newHabit}
//             onChange={(e) => setNewHabit(e.target.value)}
//             onKeyDown={addHabit}
//           />
//           <button style={styles.mobileAddBtn} onClick={addHabit}>
//             <Plus size={20} />
//           </button>
//         </div>
//       </div>
      
//       <style>{`
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(5px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         /* Hide scrollbar for cleaner look but keep functionality */
//         ::-webkit-scrollbar { height: 6px; }
//         ::-webkit-scrollbar-thumb { background: #E2E8F0; borderRadius: 10px; }
//       `}</style>
//     </div>
//   );
// };

// export default MonthGrid;
import React, { useState, useEffect } from 'react';
import { Trash2, Check, ArrowLeft, Plus } from 'lucide-react';

const MonthGrid = ({ monthId, monthName, onBack }) => {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // --- LOCAL STORAGE LOGIC ---

  // 1. Load data from LocalStorage on mount
  useEffect(() => {
    const storageKey = `habits_2026_${monthName}`;
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      setHabits(JSON.parse(savedData));
    } else {
      setHabits([]); // Reset if no data for this month
    }

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [monthName]);

  // 2. Save data to LocalStorage whenever 'habits' state changes
  useEffect(() => {
    const storageKey = `habits_2026_${monthName}`;
    // Only save if habits is an array (prevents overwriting with null)
    if (Array.isArray(habits)) {
      localStorage.setItem(storageKey, JSON.stringify(habits));
    }
  }, [habits, monthName]);

  const addHabit = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (e.key === 'Enter') e.preventDefault();
      if (!newHabit.trim()) return;

      const newHabitObject = {
        id: Date.now(), // Unique ID using timestamp
        name: newHabit,
        monthName: monthName,
        completed: {}
      };

      setHabits(prev => [...prev, newHabitObject]);
      setNewHabit("");
    }
  };

  const toggleDay = (habitId, day) => {
    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        const completed = { ...h.completed };
        // Toggle the value (true -> false / undefined -> true)
        completed[day] = !completed[day];
        return { ...h, completed };
      }
      return h;
    }));
  };

  const deleteHabit = (id) => {
    if (window.confirm("Delete habit?")) {
      setHabits(prev => prev.filter(h => h.id !== id));
    }
  };

  // --- HELPERS ---
  const daysInMonth = new Date(2026, monthId, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const styles = {
    container: { padding: isMobile ? '10px 5px' : '20px', animation: 'fadeIn 0.3s ease', maxWidth: '100vw' },
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', padding: '0 5px' },
    scrollContainer: { overflowX: 'auto', borderRadius: isMobile ? '15px' : '20px', border: '1px solid #E2E8F0', backgroundColor: '#FFF', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', WebkitOverflowScrolling: 'touch' },
    table: { width: '100%', borderCollapse: 'separate', borderSpacing: 0, minWidth: isMobile ? '1000px' : '1200px' },
    stickyTh: { position: 'sticky', left: 0, backgroundColor: '#F8FAFC', zIndex: 10, padding: '15px', color: '#64748B', fontSize: '12px', fontWeight: '800', borderBottom: '2px solid #F1F5F9', borderRight: '2px solid #F1F5F9' },
    stickyTd: { position: 'sticky', left: 0, backgroundColor: '#FFF', zIndex: 5, padding: '12px 15px', color: '#0369A1', fontWeight: '700', borderBottom: '1px solid #F1F5F9', borderRight: '2px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', minWidth: '160px' },
    th: { padding: '12px', color: '#64748B', fontSize: '12px', borderBottom: '2px solid #F1F5F9', textAlign: 'center', minWidth: '40px' },
    tickBox: (isDone) => ({
      width: isMobile ? '28px' : '24px',
      height: isMobile ? '28px' : '24px',
      borderRadius: '8px',
      cursor: 'pointer',
      margin: '0 auto',
      transition: 'all 0.2s ease',
      backgroundColor: isDone ? '#3B82F6' : 'transparent',
      border: isDone ? '2px solid #3B82F6' : '2px solid #E0F2FE',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }),
    inputRow: { padding: isMobile ? '15px' : '25px', backgroundColor: '#F8FAFC', borderTop: '2px solid #F1F5F9', display: 'flex', gap: '10px' },
    input: { flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: isMobile ? '16px' : '18px', fontWeight: '600', color: '#1E40AF' },
    mobileAddBtn: { backgroundColor: '#3B82F6', borderRadius: '50%', padding: '8px', color: 'white', display: isMobile ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center', border: 'none' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#3B82F6', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: isMobile ? '12px' : '14px' }}>
          <ArrowLeft size={isMobile ? 16 : 18}/> {isMobile ? 'BACK' : 'BACK TO MONTHS'}
        </button>
        <h2 style={{ color: '#1E3A8A', margin: 0, fontSize: isMobile ? '18px' : '24px' }}>{monthName} 2026</h2>
      </div>

      <div style={styles.scrollContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.stickyTh}>HABIT</th>
              {daysArray.map(d => <th key={d} style={styles.th}>{d}</th>)}
            </tr>
          </thead>
          <tbody>
            {habits.length > 0 ? (
              habits.map(habit => (
                <tr key={habit.id}>
                  <td style={styles.stickyTd}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{habit.name}</span>
                    <Trash2 
                      size={16} 
                      color="#FDA4AF" 
                      onClick={() => deleteHabit(habit.id)} 
                      style={{ marginLeft: '10px', flexShrink: 0, cursor: 'pointer' }}
                    />
                  </td>
                  {daysArray.map(day => {
                    const isChecked = habit.completed && habit.completed[day] === true;
                    return (
                      <td key={day} style={{ borderBottom: '1px solid #F1F5F9', textAlign: 'center' }}>
                        <div 
                          style={styles.tickBox(isChecked)} 
                          onClick={() => toggleDay(habit.id, day)}
                        >
                          {isChecked && <Check size={16} color="white" strokeWidth={4} />}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={daysArray.length + 1} style={{ padding: '60px', textAlign: 'center', color: '#94A3B8', fontStyle: 'italic' }}>
                  No habits yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div style={styles.inputRow}>
          <input 
            style={styles.input}
            placeholder={isMobile ? "+ New Habit..." : "+ Type a new habit and press Enter..."}
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            onKeyDown={addHabit}
          />
          <button style={styles.mobileAddBtn} onClick={addHabit}>
            <Plus size={20} />
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        ::-webkit-scrollbar { height: 6px; }
        ::-webkit-scrollbar-thumb { background: #E2E8F0; borderRadius: 10px; }
      `}</style>
    </div>
  );
};

export default MonthGrid;