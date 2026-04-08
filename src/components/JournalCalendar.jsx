import React, { useState, useRef, useEffect } from 'react';
import { Image as ImageIcon, Save, Smile, X, ArrowLeft } from 'lucide-react';

const JournalCalendar = ({ month, year, onBack, selectedDay: propDay, viewMode }) => {
  const [selectedDay, setSelectedDay] = useState(propDay || null);
  const [entry, setEntry] = useState("");
  const [showEmojiBoard, setShowEmojiBoard] = useState(false);
  const [attachedImage, setAttachedImage] = useState(null);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (propDay) setSelectedDay(propDay);
  }, [propDay]);

  // --- PERSISTENCE LOGIC (Year-Aware) ---
  useEffect(() => {
    if (selectedDay) {
      // Use the dynamic year prop in the storage key
      const storageKey = `journal_${year}_${month.name}_${selectedDay}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setEntry(parsed.text || "");
        setAttachedImage(parsed.image || null);
      } else {
        setEntry("");
        setAttachedImage(null);
      }
    }
  }, [selectedDay, month.name, year]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const saveEntry = () => {
    const storageKey = `journal_${year}_${month.name}_${selectedDay}`;
    const data = { text: entry, image: attachedImage };
    localStorage.setItem(storageKey, JSON.stringify(data));
    alert(`Journal Saved for ${month.name} ${selectedDay}, ${year}! ✨`);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAttachedImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const addEmoji = (emoji) => {
    const cursor = textareaRef.current.selectionStart;
    const text = entry.slice(0, cursor) + emoji + entry.slice(cursor);
    setEntry(text);
    setTimeout(() => {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(cursor + emoji.length, cursor + emoji.length);
    }, 10);
  };

  const emojiCategories = {
    Smileys: ['😀', '😂', '😊', '😍', '😜', '😎', '🥳', '😔', '😭', '🙄'],
    Nature: ['🌸', '🌹', '🍃', '🌞', '🌙', '☁️', '❄️', '🔥', '🌊', '🌈'],
    Hearts: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '💔', '✨', '💕']
  };

  const styles = {
    wrapper: { padding: isMobile ? '10px' : '20px', animation: 'fadeIn 0.3s ease', maxWidth: '100%' },
    entryPage: {
      backgroundColor: '#FFFFFF', borderRadius: isMobile ? '25px' : '35px', 
      padding: isMobile ? '20px' : '35px', border: '2px solid #FBCFE8', 
      minHeight: isMobile ? '70vh' : '600px', display: 'flex', flexDirection: 'column', 
      boxShadow: '0 10px 30px rgba(157, 23, 77, 0.05)', position: 'relative'
    },
    toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #FDF2F8', paddingBottom: '15px' },
    emojiBoard: {
      position: 'absolute', top: '70px', left: isMobile ? '10px' : '35px', zIndex: 100, 
      backgroundColor: 'white', border: '1px solid #FBCFE8', borderRadius: '20px', 
      padding: '15px', width: isMobile ? 'calc(100% - 20px)' : '280px', boxShadow: '0 15px 40px rgba(157, 23, 77, 0.15)'
    },
    textarea: {
      width: '100%', flex: 1, border: 'none', outline: 'none', fontSize: '17px', 
      fontFamily: "'Georgia', serif", lineHeight: '1.6', color: '#475569', 
      resize: 'none', marginTop: '20px', backgroundColor: 'transparent'
    },
    dayGrid: { 
      display: 'grid', 
      gridTemplateColumns: isMobile ? 'repeat(4, 1fr)' : 'repeat(auto-fill, minmax(85px, 1fr))', 
      gap: isMobile ? '10px' : '15px' 
    }
  };

  // --- VIEW 1: JOURNAL ENTRY PAGE ---
  if (viewMode === 'entry' || (selectedDay && viewMode !== 'month')) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.entryPage}>
          <div style={styles.toolbar}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <Smile size={24} color="#EC4899" cursor="pointer" onClick={() => setShowEmojiBoard(!showEmojiBoard)} />
              {showEmojiBoard && (
                <div style={styles.emojiBoard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontWeight: '900', color: '#9D174D', fontSize: '12px' }}>EMOJIS</span>
                    <X size={18} cursor="pointer" color="#F9A8D4" onClick={() => setShowEmojiBoard(false)} />
                  </div>
                  {Object.entries(emojiCategories).map(([cat, list]) => (
                    <div key={cat} style={{ marginBottom: '10px' }}>
                      <div style={{ fontSize: '10px', color: '#F9A8D4', marginBottom: '5px' }}>{cat}</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {list.map(e => <span key={e} onClick={() => addEmoji(e)} style={{ fontSize: '20px', cursor: 'pointer' }}>{e}</span>)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleImageUpload} />
              <ImageIcon size={22} color="#EC4899" cursor="pointer" onClick={() => fileInputRef.current.click()} />
              <Save size={22} color="#EC4899" cursor="pointer" onClick={saveEntry} />
            </div>
          </div>

          <h2 style={{ color: '#9D174D', marginTop: '15px', fontSize: '24px', fontWeight: '900' }}>
            {month.name} {selectedDay}, {year}
          </h2>
          
          <textarea 
            ref={textareaRef}
            placeholder="What's on your mind today?" 
            style={styles.textarea}
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            onClick={() => setShowEmojiBoard(false)}
          />

          {attachedImage && (
            <div style={{ marginTop: '20px', position: 'relative', borderRadius: '15px', overflow: 'hidden' }}>
              <div 
                style={{ position: 'absolute', top: '5px', right: '5px', backgroundColor: 'white', borderRadius: '50%', padding: '4px', cursor: 'pointer' }}
                onClick={() => setAttachedImage(null)}
              >
                <X size={14} color="#EC4899" />
              </div>
              <img src={attachedImage} alt="memory" style={{ width: '100%', borderRadius: '10px' }} />
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- VIEW 2: MONTH GRID (ALL DAYS) ---
  // Calculates days correctly for the selected year (handles Leap Years)
  const daysInMonth = new Date(year, month.id, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div style={styles.wrapper}>
      <h2 style={{ color: '#9D174D', fontWeight: '900', marginBottom: '20px', fontSize: '22px' }}>
        {month.name} {year} Archive
      </h2>
      <div style={styles.dayGrid}>
        {daysArray.map(day => (
          <div 
            key={day} 
            style={{ 
              aspectRatio: '1/1', backgroundColor: '#FFF', border: '2px solid #FCE7F3', 
              borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', 
              fontSize: '20px', fontWeight: '800', color: '#EC4899', cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
            }}
            onClick={() => setSelectedDay(day)}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default JournalCalendar;