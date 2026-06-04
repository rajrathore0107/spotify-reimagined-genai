import React, { useState, useEffect, useRef } from 'react';

// ── Palette (Spotify) ─────────────────────────────────────────────────────────
const C = {
  bg: '#121212', surface: '#181818', surfaceHover: '#282828',
  green: '#1DB954', greenHover: '#1ed760',
  white: '#FFFFFF', sub: '#b3b3b3', muted: '#535353',
  border: '#333',
};

// ── Mock data ─────────────────────────────────────────────────────────────────
const PLAYLISTS = [
  { id: 1, name: 'Liked Songs', count: 342, color: '#4B0082', emoji: '💜' },
  { id: 2, name: 'Morning Hustle', count: 48, color: '#E8115B', emoji: '☀️' },
  { id: 3, name: 'Late Night Drive', count: 31, color: '#0D73EC', emoji: '🌙' },
  { id: 4, name: 'Deep Focus', count: 27, color: '#1DB954', emoji: '🎯' },
  { id: 5, name: 'Workout Mix', count: 62, color: '#F59B23', emoji: '💪' },
];

const TRACKS = [
  { id: 1, title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', duration: '3:20', mood: 'energetic' },
  { id: 2, title: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia', duration: '3:24', mood: 'happy' },
  { id: 3, title: 'drivers license', artist: 'Olivia Rodrigo', album: 'SOUR', duration: '4:02', mood: 'sad' },
  { id: 4, title: 'Heat Waves', artist: 'Glass Animals', album: 'Dreamland', duration: '3:59', mood: 'chill' },
  { id: 5, title: 'Watermelon Sugar', artist: 'Harry Styles', album: 'Fine Line', duration: '2:54', mood: 'happy' },
  { id: 6, title: 'Circles', artist: 'Post Malone', album: 'Hollywood\'s Bleeding', duration: '3:35', mood: 'chill' },
];

const MOOD_PLAYLISTS = {
  anxious: {
    name: '🧘 Calm Before the Storm',
    narrative: 'You\'re feeling anxious — that\'s okay. This arc starts with grounding, drifts into gentle focus, then builds toward quiet confidence. Let the music do the work.',
    tracks: ['Holocene — Bon Iver', 'Re: Stacks — Bon Iver', 'In My Life — The Beatles', 'Such Great Heights — The Postal Service', 'Lua — Bright Eyes'],
    arc: ['Ground ↓', 'Breathe ↓', 'Centre →', 'Lift ↑', 'Arrive ↑'],
    color: '#4B9CD3',
  },
  sad: {
    name: '🌧️ Feel It, Then Rise',
    narrative: 'Sometimes you need to sit with it. This playlist lets you feel what you\'re feeling, then gently carries you toward something hopeful by the end.',
    tracks: ['Skinny Love — Bon Iver', 'The Night Will Always Win — Manchester Orchestra', 'Motion Picture Soundtrack — Radiohead', 'Holocene — Bon Iver', 'First Day of My Life — Bright Eyes'],
    arc: ['Feel ↓', 'Sink ↓', 'Hold →', 'Turn ↑', 'Hope ↑'],
    color: '#7C3AED',
  },
  happy: {
    name: '✨ Riding the High',
    narrative: 'You\'re in a great space — let\'s keep that energy going and take it somewhere even better. Pure vibes from start to finish.',
    tracks: ['Levitating — Dua Lipa', 'Blinding Lights — The Weeknd', 'Dynamite — BTS', 'Can\'t Stop the Feeling — Justin Timberlake', 'Happy — Pharrell Williams'],
    arc: ['Start ↑', 'Build ↑', 'Peak ↑', 'Peak ↑', 'Float ↑'],
    color: '#F59B23',
  },
  focused: {
    name: '🎯 Deep Work Mode',
    narrative: 'No lyrics, no distractions — just clean instrumental architecture built for sustained concentration. Your brain will thank you.',
    tracks: ['Experience — Ludovico Einaudi', 'Comptine d\'un autre été — Yann Tiersen', 'Time — Hans Zimmer', 'Spiegel im Spiegel — Arvo Pärt', 'The Scientist (Instrumental) — Coldplay'],
    arc: ['Settle →', 'Focus →', 'Deep →', 'Deep →', 'Flow →'],
    color: '#1DB954',
  },
  tired: {
    name: '☁️ Gentle Drift',
    narrative: 'You\'re running on low — this is designed to hold you without demanding anything. Slow, warm, unhurried. Rest while it plays.',
    tracks: ['Breathe (2 AM) — Anna Nalick', 'The Night — Zac Brown Band', 'Slow Dancing in a Burning Room — John Mayer', 'Flightless Bird — Iron & Wine', 'Moon River — Frank Ocean'],
    arc: ['Slow ↓', 'Softer ↓', 'Float →', 'Drift →', 'Rest →'],
    color: '#0D73EC',
  },
};

const CHAT_RESPONSES = {
  default: [
    { query: 'artists like radiohead but more hopeful', response: 'Great contrast! Radiohead\'s harmonic complexity meets something brighter. I\'d suggest **Daughter** (melancholic but alive), **Bon Iver** (fragile but luminous), **Frightened Rabbit** (Scottish indie with cathartic arc), **The National** (literary but grounded), and **Phoebe Bridgers** (dark but ultimately tender). Want me to build a session from these?' },
    { query: 'lo-fi but with vocals', response: 'Perfect niche. You\'re after that bedroom-recording warmth with actual human presence. Try **Rex Orange County**, **Men I Trust**, **Still Woozy**, **Clairo**, and **Raveena**. I\'ll queue a 45-min session with a consistent lo-fi-adjacent production palette — soft compression, room tone, real instruments. Generate it?' },
    { query: 'something for a rainy sunday morning', response: 'Context unlocked 🌧️. Sunday-morning rain calls for a very specific texture: unhurried, warm, slightly melancholic but not dark. I\'m thinking **Nick Drake**, **Bill Withers**, **Joni Mitchell** (Blue era), **Elliott Smith** (the gentler side), and **José González**. Want this as a 2-hour ambient session with gradual tempo build toward afternoon?' },
  ]
};

// ── Styles helper ─────────────────────────────────────────────────────────────
const S = {
  flex: (dir='row', align='center', justify='flex-start', gap=0) => ({
    display:'flex', flexDirection:dir, alignItems:align, justifyContent:justify, gap
  }),
  card: (bg=C.surface, p='16px', r='8px') => ({
    background:bg, padding:p, borderRadius:r, cursor:'pointer',
    transition:'background 0.2s',
  }),
  text: (size=14, color=C.white, weight=400) => ({
    fontSize:size, color, fontWeight:weight, fontFamily:'Inter, sans-serif', margin:0
  }),
  btn: (bg=C.green, color='#000', px=24, py=12, r=50) => ({
    background:bg, color, border:'none', borderRadius:r,
    padding:`${py}px ${px}px`, cursor:'pointer', fontWeight:700,
    fontSize:14, transition:'all 0.2s', fontFamily:'Inter, sans-serif',
  }),
  input: () => ({
    background:'#2a2a2a', border:`1px solid ${C.border}`, borderRadius:24,
    color:C.white, padding:'12px 18px', fontSize:14, fontFamily:'Inter, sans-serif',
    outline:'none', width:'100%', boxSizing:'border-box',
  }),
};

// ── Components ────────────────────────────────────────────────────────────────

function Sidebar({ activeView, setActiveView }) {
  const navItems = [
    { id:'home', icon:'🏠', label:'Home' },
    { id:'search', icon:'🔍', label:'Search' },
    { id:'moodsync', icon:'🎭', label:'MoodSync AI', badge:'AI' },
    { id:'discovery', icon:'💬', label:'Discovery Chat', badge:'AI' },
    { id:'context', icon:'🌦️', label:'Context Conductor', badge:'AI' },
  ];
  return (
    <div style={{ width:220, background:'#000', height:'100vh', padding:'16px', boxSizing:'border-box', display:'flex', flexDirection:'column', gap:4, flexShrink:0 }}>
      <div style={{ ...S.text(22,'#fff',700), fontFamily:'Georgia, serif', marginBottom:20, paddingLeft:4 }}>
        <span style={{ color:C.green }}>s</span>pot<span style={{ color:C.green }}>.</span>ai
      </div>
      {navItems.map(item => (
        <div key={item.id}
          onClick={() => setActiveView(item.id)}
          style={{
            ...S.flex('row','center','flex-start',12),
            padding:'10px 12px', borderRadius:6, cursor:'pointer',
            background: activeView===item.id ? C.surfaceHover : 'transparent',
            transition:'background 0.15s',
          }}
        >
          <span style={{ fontSize:17 }}>{item.icon}</span>
          <span style={{ ...S.text(13, activeView===item.id ? C.white : C.sub, activeView===item.id?600:400) }}>{item.label}</span>
          {item.badge && (
            <span style={{ marginLeft:'auto', background:C.green, color:'#000', fontSize:9, fontWeight:700, padding:'2px 6px', borderRadius:10 }}>
              {item.badge}
            </span>
          )}
        </div>
      ))}
      <div style={{ marginTop:20, borderTop:`1px solid ${C.border}`, paddingTop:16 }}>
        <div style={{ ...S.text(10, C.muted, 600), letterSpacing:1.5, marginBottom:10, paddingLeft:12 }}>YOUR LIBRARY</div>
        {PLAYLISTS.map(pl => (
          <div key={pl.id} style={{ ...S.flex('row','center','flex-start',10), padding:'8px 12px', borderRadius:6, cursor:'pointer' }}>
            <div style={{ width:32, height:32, borderRadius:4, background:pl.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, flexShrink:0 }}>{pl.emoji}</div>
            <div>
              <div style={{ ...S.text(12,C.white,500) }}>{pl.name}</div>
              <div style={{ ...S.text(10,C.muted,400) }}>Playlist · {pl.count} songs</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HomeView() {
  return (
    <div style={{ padding:28 }}>
      <h1 style={{ ...S.text(26, C.white, 700), marginBottom:24 }}>Good evening</h1>

      {/* AI Feature Banner */}
      <div style={{ background:'linear-gradient(135deg, #1a3a2a, #1DB954 80%)', borderRadius:12, padding:'24px 28px', marginBottom:32, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', right:-20, top:-20, fontSize:100, opacity:0.12 }}>🎭</div>
        <div style={{ ...S.text(11, '#b3ffcc', 600), letterSpacing:2, marginBottom:6 }}>NEW · MOODSYNC AI</div>
        <div style={{ ...S.text(22, C.white, 700), marginBottom:8 }}>How are you feeling right now?</div>
        <div style={{ ...S.text(13, '#d4ffe0'), marginBottom:16, maxWidth:480 }}>
          Tell us your mood and GenAI will craft a playlist arc that meets you where you are — and takes you somewhere better.
        </div>
        <button style={{ ...S.btn(C.white, '#000', 20, 10) }}>Try MoodSync →</button>
      </div>

      {/* Recent tracks */}
      <h2 style={{ ...S.text(18, C.white, 700), marginBottom:16 }}>Recently played</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(180px, 1fr))', gap:16, marginBottom:32 }}>
        {PLAYLISTS.map(pl => (
          <div key={pl.id} style={{ background:C.surface, borderRadius:8, padding:16, cursor:'pointer', transition:'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background=C.surfaceHover}
            onMouseLeave={e => e.currentTarget.style.background=C.surface}
          >
            <div style={{ width:'100%', paddingBottom:'100%', borderRadius:6, background:pl.color, marginBottom:12, display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
              <span style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', fontSize:40 }}>{pl.emoji}</span>
            </div>
            <div style={{ ...S.text(14, C.white, 600), marginBottom:4 }}>{pl.name}</div>
            <div style={{ ...S.text(12, C.sub) }}>{pl.count} songs</div>
          </div>
        ))}
      </div>

      {/* Now playing */}
      <h2 style={{ ...S.text(18, C.white, 700), marginBottom:16 }}>Queue</h2>
      <div style={{ background:C.surface, borderRadius:8, overflow:'hidden' }}>
        {TRACKS.map((t, i) => (
          <div key={t.id} style={{ ...S.flex('row','center','flex-start',16), padding:'12px 16px', borderBottom:`1px solid ${C.border}`, cursor:'pointer',
            transition:'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background=C.surfaceHover}
            onMouseLeave={e => e.currentTarget.style.background='transparent'}
          >
            <span style={{ ...S.text(13, C.muted), width:20, textAlign:'center' }}>{i+1}</span>
            <div style={{ width:40, height:40, borderRadius:4, background:`hsl(${i*60},60%,35%)`, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>🎵</div>
            <div style={{ flex:1 }}>
              <div style={{ ...S.text(14, C.white, 500) }}>{t.title}</div>
              <div style={{ ...S.text(12, C.sub) }}>{t.artist}</div>
            </div>
            <span style={{ ...S.text(12, C.sub) }}>{t.album}</span>
            <span style={{ ...S.text(12, C.sub), marginLeft:24 }}>{t.duration}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MoodSyncView() {
  const [step, setStep] = useState('select'); // select | input | result
  const [selectedMood, setSelectedMood] = useState(null);
  const [customInput, setCustomInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const moods = [
    { key:'anxious', label:'Anxious', emoji:'😰', color:'#4B9CD3', desc:'Worried, restless, tense' },
    { key:'sad', label:'Sad', emoji:'😔', color:'#7C3AED', desc:'Low, heavy, melancholy' },
    { key:'happy', label:'Happy', emoji:'😄', color:'#F59B23', desc:'Energised, good vibes' },
    { key:'focused', label:'Focused', emoji:'🎯', color:'#1DB954', desc:'Need to concentrate' },
    { key:'tired', label:'Tired', emoji:'😴', color:'#0D73EC', desc:'Exhausted, running low' },
  ];

  function handleGenerate() {
    setLoading(true);
    setTimeout(() => {
      const moodKey = selectedMood || 'happy';
      setResult(MOOD_PLAYLISTS[moodKey]);
      setStep('result');
      setLoading(false);
    }, 1800);
  }

  if (step === 'result' && result) return (
    <div style={{ padding:28 }}>
      <button onClick={() => { setStep('select'); setResult(null); setSelectedMood(null); }}
        style={{ background:'none', border:`1px solid ${C.border}`, color:C.sub, padding:'8px 16px', borderRadius:20, cursor:'pointer', marginBottom:24, fontSize:13 }}>
        ← Back
      </button>
      <div style={{ background:`linear-gradient(135deg, ${result.color}22, ${C.surface})`, border:`1px solid ${result.color}44`, borderRadius:16, padding:28, marginBottom:24 }}>
        <div style={{ ...S.text(11, result.color, 700), letterSpacing:2, marginBottom:8 }}>MOODSYNC AI · GENERATED FOR YOU</div>
        <div style={{ ...S.text(24, C.white, 700), marginBottom:12 }}>{result.name}</div>
        <div style={{ ...S.text(14, C.sub), lineHeight:1.6, marginBottom:20, maxWidth:600 }}>{result.narrative}</div>
        <button style={{ ...S.btn(result.color, '#fff', 24, 12) }}>▶ Play from beginning</button>
        <button style={{ ...S.btn('transparent', C.white, 20, 10), border:`1px solid ${C.border}`, marginLeft:12 }}>+ Save playlist</button>
      </div>

      {/* Emotional arc */}
      <div style={{ background:C.surface, borderRadius:12, padding:20, marginBottom:20 }}>
        <div style={{ ...S.text(13, result.color, 700), letterSpacing:1, marginBottom:16 }}>EMOTIONAL ARC</div>
        <div style={{ display:'flex', gap:0, alignItems:'stretch' }}>
          {result.arc.map((a, i) => (
            <div key={i} style={{ flex:1, textAlign:'center' }}>
              <div style={{ ...S.text(10, result.color, 700), marginBottom:6 }}>{a}</div>
              <div style={{ height:3, background: i === 2 ? result.color : `${result.color}55`, margin:'0 2px', borderRadius:2 }} />
              <div style={{ ...S.text(10, C.muted), marginTop:6 }}>Track {i+1}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Track list */}
      <div style={{ background:C.surface, borderRadius:12, overflow:'hidden' }}>
        <div style={{ padding:'16px 20px', borderBottom:`1px solid ${C.border}` }}>
          <div style={{ ...S.text(13, C.white, 600) }}>5 AI-curated tracks · ~18 minutes</div>
        </div>
        {result.tracks.map((t, i) => (
          <div key={i} style={{ ...S.flex('row','center','flex-start',16), padding:'14px 20px', borderBottom:`1px solid ${C.border}`, cursor:'pointer' }}
            onMouseEnter={e => e.currentTarget.style.background=C.surfaceHover}
            onMouseLeave={e => e.currentTarget.style.background='transparent'}
          >
            <span style={{ ...S.text(13, C.muted), width:24 }}>{i+1}</span>
            <div style={{ width:42, height:42, borderRadius:4, background:`hsl(${i*70 + 180},50%,30%)`, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>🎵</div>
            <div style={{ flex:1 }}>
              <div style={{ ...S.text(14, C.white, 500) }}>{t.split(' — ')[0]}</div>
              <div style={{ ...S.text(12, C.sub) }}>{t.split(' — ')[1]}</div>
            </div>
            <div style={{ ...S.text(10, result.color, 600), background:`${result.color}22`, padding:'3px 10px', borderRadius:12 }}>{result.arc[i]}</div>
          </div>
        ))}
      </div>

      {/* Post-listen feedback */}
      <div style={{ background:C.surface, borderRadius:12, padding:20, marginTop:20 }}>
        <div style={{ ...S.text(13, C.white, 600), marginBottom:12 }}>🔄 After listening, how did it land?</div>
        <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
          {['Spot on 🎯', 'Too intense', 'Too mellow', 'Loved it ❤️', 'Not my vibe'].map(fb => (
            <button key={fb} style={{ ...S.btn(C.surfaceHover, C.white, 14, 8, 20), border:`1px solid ${C.border}`, fontSize:12 }}>{fb}</button>
          ))}
        </div>
        <div style={{ ...S.text(11, C.muted), marginTop:10 }}>Your feedback trains MoodSync AI to get sharper for you over time.</div>
      </div>
    </div>
  );

  return (
    <div style={{ padding:28 }}>
      <div style={{ ...S.text(11, C.green, 700), letterSpacing:2, marginBottom:8 }}>🎭 MOODSYNC AI</div>
      <h1 style={{ ...S.text(28, C.white, 700), marginBottom:8 }}>How are you feeling?</h1>
      <p style={{ ...S.text(14, C.sub), marginBottom:28, lineHeight:1.6 }}>
        MoodSync AI reads your emotional state and crafts a personalised playlist arc — one that meets you where you are and takes you where you want to be.
      </p>

      {step === 'select' && (
        <>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:14, marginBottom:28 }}>
            {moods.map(m => (
              <div key={m.key}
                onClick={() => { setSelectedMood(m.key); setStep('input'); }}
                style={{
                  background: C.surface, borderRadius:12, padding:20, cursor:'pointer', textAlign:'center',
                  border: `2px solid ${selectedMood === m.key ? m.color : 'transparent'}`,
                  transition:'all 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background=C.surfaceHover}
                onMouseLeave={e => e.currentTarget.style.background=C.surface}
              >
                <div style={{ fontSize:36, marginBottom:10 }}>{m.emoji}</div>
                <div style={{ ...S.text(14, C.white, 600), marginBottom:4 }}>{m.label}</div>
                <div style={{ ...S.text(11, C.sub) }}>{m.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ ...S.text(12, C.muted), textAlign:'center' }}>Or describe in your own words below ↓</div>
          <div style={{ display:'flex', gap:10, marginTop:12 }}>
            <input style={{ ...S.input(), flex:1 }} value={customInput}
              onChange={e => setCustomInput(e.target.value)}
              placeholder='"I just had a rough meeting and need something calming but not sleepy..."' />
            <button onClick={() => { setSelectedMood('focused'); setStep('input'); }}
              style={{ ...S.btn(C.green,'#000',20,12) }}>→</button>
          </div>
        </>
      )}

      {step === 'input' && (
        <div style={{ maxWidth:540 }}>
          <div style={{ background:C.surface, borderRadius:12, padding:24, marginBottom:20 }}>
            <div style={{ ...S.text(13, moods.find(m=>m.key===selectedMood)?.color || C.green, 700), marginBottom:6 }}>
              Selected: {moods.find(m=>m.key===selectedMood)?.emoji} {moods.find(m=>m.key===selectedMood)?.label}
            </div>
            <div style={{ ...S.text(13, C.sub), marginBottom:16, lineHeight:1.5 }}>
              Add any context to help MoodSync tailor this further (optional):
            </div>
            <input style={{ ...S.input(), marginBottom:12 }} placeholder="e.g. working late, need to stay calm, 60 minutes..." />
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={handleGenerate} disabled={loading}
                style={{ ...S.btn(C.green, '#000', 24, 12), opacity: loading?0.7:1 }}>
                {loading ? '⏳ Generating arc...' : '✨ Generate my playlist'}
              </button>
              <button onClick={() => setStep('select')}
                style={{ ...S.btn('transparent', C.sub, 20, 12), border:`1px solid ${C.border}` }}>Back</button>
            </div>
          </div>
          {loading && (
            <div style={{ background:C.surface, borderRadius:12, padding:20, textAlign:'center' }}>
              <div style={{ ...S.text(13, C.sub), marginBottom:8 }}>🧠 AI is analysing your mood...</div>
              <div style={{ ...S.text(11, C.muted) }}>Selecting tracks → building emotional arc → writing narrative</div>
              <div style={{ marginTop:14, height:3, background:C.surfaceHover, borderRadius:2, overflow:'hidden' }}>
                <div style={{ height:'100%', background:C.green, width:'60%', borderRadius:2, animation:'shimmer 1.2s infinite' }} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DiscoveryView() {
  const [messages, setMessages] = useState([
    { role:'ai', text:'Hi! I\'m your Discovery Dialogue assistant. Tell me what kind of music you\'re looking for — any mood, reference artist, activity, or feeling. I\'ll reason across Spotify\'s catalogue and build you something tailored.\n\nTry: "Artists like Radiohead but more hopeful" or "Lo-fi with vocals for a Sunday morning"' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:'smooth' });
  }, [messages]);

  function getResponse(q) {
    const lower = q.toLowerCase();
    if (lower.includes('radiohead') || lower.includes('hopeful')) return CHAT_RESPONSES.default[0].response;
    if (lower.includes('lo-fi') || lower.includes('vocal') || lower.includes('lofi')) return CHAT_RESPONSES.default[1].response;
    if (lower.includes('rain') || lower.includes('sunday') || lower.includes('morning')) return CHAT_RESPONSES.default[2].response;
    return `Great request! I'm searching Spotify's full catalogue for music that matches: **"${q}"**\n\nBased on your description, I'd explore artists known for that specific combination of qualities — texture, mood, tempo, and lyrical content all considered. Want me to generate a 45-minute curated session with liner notes explaining each pick?`;
  }

  function send() {
    if (!input.trim()) return;
    const userMsg = { role:'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role:'ai', text: getResponse(userMsg.text) }]);
      setLoading(false);
    }, 1400);
  }

  function renderText(text) {
    return text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
      i % 2 === 1
        ? <strong key={i} style={{ color:C.white }}>{part}</strong>
        : part
    );
  }

  return (
    <div style={{ padding:28, display:'flex', flexDirection:'column', height:'calc(100vh - 120px)' }}>
      <div style={{ ...S.text(11, C.green, 700), letterSpacing:2, marginBottom:6 }}>💬 DISCOVERY DIALOGUE</div>
      <h1 style={{ ...S.text(22, C.white, 700), marginBottom:4 }}>Conversational Music Discovery</h1>
      <p style={{ ...S.text(13, C.sub), marginBottom:20 }}>Tell the AI what you're looking for in natural language. It reasons across Spotify's full catalogue.</p>

      <div style={{ flex:1, overflowY:'auto', background:C.surface, borderRadius:12, padding:20, marginBottom:16, display:'flex', flexDirection:'column', gap:16 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display:'flex', flexDirection: msg.role==='user'?'row-reverse':'row', gap:12, alignItems:'flex-start' }}>
            <div style={{ width:34, height:34, borderRadius:17, background: msg.role==='ai' ? C.green : '#7C3AED', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>
              {msg.role==='ai' ? '🤖' : '🎧'}
            </div>
            <div style={{
              background: msg.role==='ai' ? C.surfaceHover : '#3730a3',
              borderRadius: msg.role==='ai' ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
              padding:'12px 16px', maxWidth:'75%',
            }}>
              <p style={{ ...S.text(13, C.sub), whiteSpace:'pre-line', lineHeight:1.6, margin:0 }}>
                {renderText(msg.text)}
              </p>
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
            <div style={{ width:34, height:34, borderRadius:17, background:C.green, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>🤖</div>
            <div style={{ background:C.surfaceHover, borderRadius:'4px 14px 14px 14px', padding:'16px 20px' }}>
              <span style={{ ...S.text(13,C.muted) }}>Searching catalogue</span>
              <span style={{ color:C.green, animation:'dots 1s infinite' }}> ...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ display:'flex', gap:10 }}>
        <input style={{ ...S.input(), flex:1 }} value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key==='Enter' && send()}
          placeholder='Try: "Find me something like Bon Iver but more upbeat..."' />
        <button onClick={send} style={{ ...S.btn(C.green,'#000',20,12) }}>Send</button>
      </div>

      <div style={{ display:'flex', gap:8, marginTop:10, flexWrap:'wrap' }}>
        {['Artists like Radiohead but more hopeful', 'Lo-fi with vocals for Sunday morning', 'Rainy day indie folk'].map(s => (
          <button key={s} onClick={() => { setInput(s); }}
            style={{ ...S.btn(C.surfaceHover,C.sub,12,6,12), border:`1px solid ${C.border}`, fontSize:11 }}>{s}</button>
        ))}
      </div>
    </div>
  );
}

function ContextView() {
  const [active, setActive] = useState(false);
  const [detected, setDetected] = useState(null);
  const [step, setStep] = useState(0);

  const steps = [
    { icon:'🕐', label:'Reading time of day', value:'8:42 PM — evening wind-down window' },
    { icon:'📍', label:'Checking location context', value:'Home (opted-in) — low-energy mode likely' },
    { icon:'📅', label:'Scanning calendar', value:'No events tonight — free evening detected' },
    { icon:'🌡️', label:'Ambient signal', value:'Weather: 19°C, overcast — calm texture match' },
    { icon:'🎵', label:'Generating session', value:'Queuing: Evening Calm Mix · 52 min · no lyrics' },
  ];

  function activate() {
    setActive(true);
    setStep(0);
    setDetected(null);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setStep(i);
      if (i >= steps.length) {
        clearInterval(timer);
        setDetected({
          name: '🌙 Evening Wind-Down',
          desc: 'Context Conductor detected: 8pm at home on a free weeknight — a low-stimulation, no-lyric session is queued automatically.',
          tracks: ['Experience — Ludovico Einaudi', 'Comptine d\'un autre été — Yann Tiersen', 'River Flows in You — Yiruma', 'Gymnopédie No.1 — Erik Satie', 'Clair de Lune — Debussy'],
          signals: ['🕐 Time: 8:42 PM', '🏠 Location: Home', '📅 Calendar: Free evening', '🌧️ Weather: Overcast 19°C'],
        });
      }
    }, 800);
  }

  return (
    <div style={{ padding:28 }}>
      <div style={{ ...S.text(11, C.green, 700), letterSpacing:2, marginBottom:8 }}>🌦️ CONTEXT CONDUCTOR</div>
      <h1 style={{ ...S.text(26, C.white, 700), marginBottom:8 }}>Music that knows your world</h1>
      <p style={{ ...S.text(14, C.sub), marginBottom:24, lineHeight:1.6, maxWidth:580 }}>
        Context Conductor reads your time, location (opt-in), calendar, and ambient signals — then silently queues the perfect music before you even think to ask.
      </p>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:28 }}>
        {[
          { icon:'🕐', title:'Time-Aware', desc:'7am queues energising commute music. 10pm queues wind-down ambience. Automatic.' },
          { icon:'📅', title:'Calendar-Linked', desc:'"Big presentation at 9am" → confidence-building music queued the night before.' },
          { icon:'📍', title:'Location Context', desc:'Detects home vs commute vs gym. Adapts genre, tempo, and energy level silently.' },
          { icon:'🔒', title:'Fully Opt-In', desc:'Every signal is optional. Turn on only what you\'re comfortable sharing. On-device processing.' },
        ].map((f, i) => (
          <div key={i} style={{ background:C.surface, borderRadius:10, padding:20 }}>
            <span style={{ fontSize:28 }}>{f.icon}</span>
            <div style={{ ...S.text(14, C.white, 600), margin:'10px 0 6px' }}>{f.title}</div>
            <div style={{ ...S.text(12, C.sub), lineHeight:1.5 }}>{f.desc}</div>
          </div>
        ))}
      </div>

      {!active && (
        <div style={{ textAlign:'center', padding:40 }}>
          <div style={{ ...S.text(16, C.sub), marginBottom:20 }}>Simulate Context Conductor running right now</div>
          <button onClick={activate} style={{ ...S.btn(C.green,'#000',32,14) }}>▶ Run Context Analysis</button>
        </div>
      )}

      {active && (
        <div style={{ background:C.surface, borderRadius:12, padding:24 }}>
          <div style={{ ...S.text(13, C.green, 700), letterSpacing:1, marginBottom:16 }}>CONTEXT CONDUCTOR · RUNNING</div>
          <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:detected?24:0 }}>
            {steps.slice(0, step).map((st, i) => (
              <div key={i} style={{ ...S.flex('row','center','flex-start',14), background:C.surfaceHover, borderRadius:8, padding:'12px 16px' }}>
                <span style={{ fontSize:20 }}>{st.icon}</span>
                <div>
                  <div style={{ ...S.text(12, C.muted), marginBottom:2 }}>{st.label}</div>
                  <div style={{ ...S.text(13, C.white, 500) }}>{st.value}</div>
                </div>
                <span style={{ marginLeft:'auto', color:C.green, fontWeight:700 }}>✓</span>
              </div>
            ))}
            {step < steps.length && (
              <div style={{ ...S.flex('row','center','flex-start',14), background:C.surfaceHover, borderRadius:8, padding:'12px 16px', opacity:0.5 }}>
                <span style={{ fontSize:20 }}>{steps[step]?.icon}</span>
                <div style={{ ...S.text(13, C.sub) }}>{steps[step]?.label}...</div>
              </div>
            )}
          </div>

          {detected && (
            <div style={{ background:`linear-gradient(135deg, #0D73EC22, ${C.surfaceHover})`, border:'1px solid #0D73EC44', borderRadius:12, padding:20 }}>
              <div style={{ ...S.text(11, '#0D73EC', 700), letterSpacing:2, marginBottom:8 }}>SESSION QUEUED</div>
              <div style={{ ...S.text(20, C.white, 700), marginBottom:8 }}>{detected.name}</div>
              <div style={{ ...S.text(13, C.sub), lineHeight:1.6, marginBottom:16 }}>{detected.desc}</div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:16 }}>
                {detected.signals.map(sg => (
                  <span key={sg} style={{ background:'#0D73EC22', color:'#7AB8FF', fontSize:11, padding:'4px 10px', borderRadius:12 }}>{sg}</span>
                ))}
              </div>
              <div style={{ ...S.text(12, C.sub), marginBottom:12 }}>Queued tracks:</div>
              {detected.tracks.map((t, i) => (
                <div key={i} style={{ ...S.flex('row','center','flex-start',12), padding:'8px 0', borderBottom:`1px solid ${C.border}` }}>
                  <span style={{ ...S.text(12, C.muted), width:20 }}>{i+1}</span>
                  <span style={{ ...S.text(13, C.white) }}>{t}</span>
                </div>
              ))}
              <div style={{ display:'flex', gap:10, marginTop:16 }}>
                <button style={{ ...S.btn('#0D73EC', C.white, 20, 10) }}>▶ Play now</button>
                <button onClick={() => { setActive(false); setDetected(null); setStep(0); }}
                  style={{ ...S.btn('transparent', C.sub, 16, 10), border:`1px solid ${C.border}` }}>Reset</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function NowPlayingBar() {
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(38);
  return (
    <div style={{ height:80, background:'#181818', borderTop:`1px solid ${C.border}`, display:'flex', alignItems:'center', padding:'0 24px', gap:20, position:'fixed', bottom:0, left:0, right:0, zIndex:100 }}>
      <div style={{ ...S.flex('row','center','flex-start',12), flex:1 }}>
        <div style={{ width:50, height:50, borderRadius:4, background:'#2EA043', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>🎵</div>
        <div>
          <div style={{ ...S.text(13, C.white, 500) }}>Blinding Lights</div>
          <div style={{ ...S.text(11, C.sub) }}>The Weeknd</div>
        </div>
        <span style={{ marginLeft:14, fontSize:18, cursor:'pointer' }}>❤️</span>
      </div>
      <div style={{ ...S.flex('column','center','center',6), flex:2 }}>
        <div style={{ display:'flex', gap:20, alignItems:'center' }}>
          <button style={{ background:'none', border:'none', color:C.sub, fontSize:18, cursor:'pointer' }}>⏮</button>
          <button onClick={() => setPlaying(!playing)}
            style={{ background:C.white, border:'none', borderRadius:20, width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:16 }}>
            {playing ? '⏸' : '▶'}
          </button>
          <button style={{ background:'none', border:'none', color:C.sub, fontSize:18, cursor:'pointer' }}>⏭</button>
        </div>
        <div style={{ ...S.flex('row','center','flex-start',8), width:'100%', maxWidth:480 }}>
          <span style={{ ...S.text(10, C.muted) }}>1:24</span>
          <div style={{ flex:1, height:4, background:C.muted, borderRadius:2, cursor:'pointer', position:'relative' }}
            onClick={e => { const rect=e.currentTarget.getBoundingClientRect(); setProgress(Math.round((e.clientX-rect.left)/rect.width*100)); }}>
            <div style={{ height:'100%', width:`${progress}%`, background:C.green, borderRadius:2 }} />
          </div>
          <span style={{ ...S.text(10, C.muted) }}>3:20</span>
        </div>
      </div>
      <div style={{ ...S.flex('row','center','flex-end',12), flex:1 }}>
        <span style={{ ...S.text(11, C.green, 700), background:'#1DB95422', padding:'3px 10px', borderRadius:10 }}>🎭 MoodSync Active</span>
        <span style={{ fontSize:16, cursor:'pointer' }}>🔊</span>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [activeView, setActiveView] = useState('home');

  const views = { home: HomeView, moodsync: MoodSyncView, discovery: DiscoveryView, context: ContextView };
  const View = views[activeView] || HomeView;

  return (
    <div style={{ display:'flex', background:C.bg, minHeight:'100vh', fontFamily:'Inter, sans-serif' }}>
      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #121212; }
        ::-webkit-scrollbar-thumb { background: #535353; border-radius: 3px; }
        @keyframes shimmer { 0%{width:20%} 50%{width:80%} 100%{width:20%} }
        @keyframes dots { 0%,100%{opacity:0.2} 50%{opacity:1} }
      `}</style>
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div style={{ flex:1, overflowY:'auto', paddingBottom:100 }}>
        <View />
      </div>
      <NowPlayingBar />
    </div>
  );
}
