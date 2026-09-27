import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const ADDRESS = 'City Centre Mall, Millenium Park, Bistupur, Jamshedpur, Jharkhand 831001';

function GaneshMark() {
  return (
    <svg className="ganesh" viewBox="0 0 120 120" aria-label="Ganesha" role="img">
      <path d="M59 18c-13 0-23 10-23 23 0 9 4 15 10 20-9 3-15 11-15 20 0 12 9 21 21 21 8 0 14-3 18-8 4 5 10 8 18 8 12 0 21-9 21-21 0-9-6-17-15-20 6-5 10-11 10-20 0-13-10-23-23-23-3 0-6 1-9 2-3-1-6-2-9-2Z" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M48 40c-7 6-7 16 0 22 4 3 7 7 7 13 0 8-6 14-14 14M72 40c7 6 7 16 0 22-4 3-7 7-7 13 0 8 6 14 14 14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      <path d="M60 46v22c0 8-5 13-12 13M60 68c0 8 5 13 12 13M54 31c2 4 4 6 6 6s4-2 6-6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="51" cy="47" r="2.4" fill="currentColor"/><circle cx="69" cy="47" r="2.4" fill="currentColor"/>
      <path d="M44 96c5-4 10-6 16-6s11 2 16 6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}

function FloralCorner({ flip = false }) {
  return (
    <div className={`floral-corner ${flip ? 'flip' : ''}`} aria-hidden="true">
      <span className="leaf l1"/><span className="leaf l2"/><span className="leaf l3"/><span className="leaf l4"/>
      <span className="marigold m1"/><span className="marigold m2"/><span className="marigold m3"/>
      <span className="vine"/>
    </div>
  );
}

function MarigoldGarland() {
  return <div className="garland" aria-hidden="true"><span/><span/><span/><span/><span/><span/><span/></div>;
}

function Section({ id, className = '', children }) {
  return <section id={id} className={`sheet ${className}`}>{children}</section>;
}

function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const ctxRef = useRef(null);
  const nodesRef = useRef([]);

  const stop = () => {
    nodesRef.current.forEach(n => { try { n.stop?.(); n.disconnect?.(); } catch {} });
    nodesRef.current = [];
    setPlaying(false);
  };

  const play = async () => {
    if (playing) return stop();
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = ctxRef.current || new AudioCtx();
    ctxRef.current = ctx;
    if (ctx.state === 'suspended') await ctx.resume();

    const master = ctx.createGain();
    master.gain.value = 0.035;
    master.connect(ctx.destination);

    // Original, wordless ambient Indian-inspired drone + soft bell pattern.
    const drone = [146.83, 220, 293.66];
    drone.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = i === 0 ? 'sine' : 'triangle';
      osc.frequency.value = freq;
      gain.gain.value = i === 0 ? 0.65 : 0.18;
      osc.connect(gain); gain.connect(master); osc.start();
      nodesRef.current.push(osc);
    });

    let stopped = false;
    const loop = () => {
      if (stopped) return;
      const bell = ctx.createOscillator();
      const g = ctx.createGain();
      bell.type = 'sine';
      bell.frequency.value = [587.33, 659.25, 783.99, 880][Math.floor(Math.random()*4)];
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.11, ctx.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.8);
      bell.connect(g); g.connect(master); bell.start(); bell.stop(ctx.currentTime + 1.9);
      nodesRef.current.push(bell);
      window.setTimeout(loop, 3200);
    };
    loop();
    setPlaying(true);
  };

  useEffect(() => () => stop(), []);
  return <button className={`music-btn ${playing ? 'playing' : ''}`} onClick={play} aria-label={playing ? 'Pause music' : 'Play instrumental music'}>{playing ? 'Ⅱ' : '♪'} <span>{playing ? 'Music on' : 'Play music'}</span></button>;
}

function App() {
  const [entered, setEntered] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('locked', !entered);
    return () => document.body.classList.remove('locked');
  }, [entered]);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <>
      <div className="progress"><span style={{ width: `${progress}%` }}/></div>
      {!entered && (
        <div className="cover">
          <div className="cover-paper">
            <FloralCorner/><FloralCorner flip/>
            <div className="cover-inner">
              <div className="mini-label">श्री गणेशाय नमः</div>
              <GaneshMark/>
              <div className="cover-shlok">वक्रतुण्ड महाकाय<br/>सूर्यकोटि समप्रभ।<br/>निर्विघ्नं कुरु मे देव<br/>सर्वकार्येषु सर्वदा॥</div>
              <div className="rule"/>
              <p className="eyebrow">WITH THE BLESSINGS OF OUR FAMILIES</p>
              <h1><span>Shourya</span><i>&</i><span>Anisha</span></h1>
              <p className="invite-line">invite you to celebrate<br/>their wedding</p>
              <button className="open-btn" onClick={() => { setEntered(true); setTimeout(() => scrollTo('intro'), 50); }}>Open invitation <b>↓</b></button>
            </div>
            <div className="cover-bottom">December 2026 · Jamshedpur</div>
          </div>
        </div>
      )}

      <main className={entered ? 'visible' : ''}>
        <Section id="intro" className="intro-sheet">
          <MarigoldGarland/>
          <FloralCorner/><FloralCorner flip/>
          <div className="center-content">
            <div className="mini-label">WITH THE BLESSINGS OF OUR FAMILIES</div>
            <GaneshMark/>
            <p className="script-small">A beautiful beginning</p>
            <h2 className="names"><span>Shourya</span><em>&</em><span>Anisha</span></h2>
            <p className="lead">request the pleasure of your company<br/>as they begin their forever.</p>
            <div className="date-pill">01 · 02 DECEMBER 2026</div>
          </div>
          <div className="scroll-cue" onClick={() => scrollTo('haldi')}>scroll to explore <span>↓</span></div>
        </Section>

        <Section id="haldi" className="haldi-sheet">
          <MarigoldGarland/>
          <div className="event-topline">THE FIRST CELEBRATION</div>
          <h2 className="event-title yellow">Haldi</h2>
          <p className="event-poetry">A splash of haldi,<br/>a shade of sunshine,<br/>and a day full of joy.</p>
          <div className="haldi-scene">
            <div className="sun-orb"/>
            <div className="arch arch-yellow"/>
            <div className="seating">
              <div className="person groom"><span className="head"/><span className="body"/><span className="kurta"/></div>
              <div className="person bride"><span className="head"/><span className="hair"/><span className="body"/><span className="lehenga"/></div>
              <span className="bowl b1"/><span className="bowl b2"/><span className="flower f1"/><span className="flower f2"/><span className="flower f3"/>
            </div>
          </div>
          <div className="event-details">
            <div><small>DATE</small><strong>1st December, 2026</strong></div>
            <div><small>TIME</small><strong>12 PM onwards</strong></div>
            <div><small>VENUE</small><strong>Radisson Hotel Jamshedpur</strong><span>{ADDRESS}</span></div>
          </div>
        </Section>

        <Section id="sangeet" className="sangeet-sheet">
          <div className="stars" aria-hidden="true">✦ · ✧ · ✦ · ✧ · ✦</div>
          <div className="event-topline light">AN EVENING OF MUSIC & MERRIMENT</div>
          <h2 className="event-title ivory">Sangeet</h2>
          <p className="event-poetry light">Music, laughter, dance,<br/>and memories waiting to be made.</p>
          <div className="dance-scene">
            <div className="chandelier">✧<span>✦</span>✧</div>
            <div className="dancer d1"><span className="d-head"/><span className="d-body"/><span className="d-skirt"/></div>
            <div className="dancer d2"><span className="d-head"/><span className="d-body"/><span className="d-pants"/></div>
            <div className="floor-lines"/>
          </div>
          <div className="event-details dark-details">
            <div><small>DATE</small><strong>1st December, 2026</strong></div>
            <div><small>TIME</small><strong>8 PM onwards</strong></div>
            <div><small>VENUE</small><strong>Radisson Hotel Jamshedpur</strong><span>{ADDRESS}</span></div>
          </div>
        </Section>

        <Section id="shaadi" className="wedding-sheet">
          <FloralCorner/><FloralCorner flip/>
          <div className="event-topline">THE WEDDING</div>
          <p className="script-small">Two hearts, two families, one beautiful journey</p>
          <h2 className="event-title wedding-title">The Wedding</h2>
          <div className="mandap">
            <div className="pillar left-pillar"/><div className="pillar right-pillar"/>
            <div className="roof"><span>ॐ</span></div>
            <div className="fire"><i/><i/><i/></div>
            <div className="couple"><div className="groom-figure"/><div className="bride-figure"/></div>
            <div className="petals">✿ ❁ ✿ ❁ ✿</div>
          </div>
          <div className="wedding-copy">With sacred vows and the love of our families,<br/>we invite you to witness the beginning of our forever.</div>
          <div className="event-details">
            <div><small>DATE</small><strong>2nd December, 2026</strong></div>
            <div><small>TIME</small><strong>7 PM onwards</strong></div>
            <div><small>VENUE</small><strong>Radisson Hotel Jamshedpur</strong><span>{ADDRESS}</span></div>
          </div>
        </Section>

        <Section id="venue" className="venue-sheet">
          <div className="lotus">❧</div>
          <p className="event-topline">WHERE WE MEET</p>
          <h2 className="venue-title">Radisson Hotel<br/>Jamshedpur</h2>
          <div className="address-card">
            <div className="pin">⌖</div>
            <p>{ADDRESS}</p>
            <a href="https://www.google.com/maps/search/?api=1&query=Radisson+Hotel+Jamshedpur" target="_blank" rel="noreferrer">Open in Maps ↗</a>
          </div>
          <div className="venue-note">We would be delighted to have you with us<br/>for these moments of love and celebration.</div>
        </Section>

        <Section id="closing" className="closing-sheet">
          <FloralCorner/><FloralCorner flip/>
          <div className="closing-content">
            <p className="event-topline">YOUR PRESENCE MEANS THE WORLD TO US</p>
            <h2>Come celebrate<br/><span>with us.</span></h2>
            <p>As we begin this beautiful new chapter,<br/>your blessings and presence will make it complete.</p>
            <div className="closing-rule">✦</div>
            <div className="closing-names">Shourya <i>&</i> Anisha</div>
            <div className="closing-date">DECEMBER 2026 · Jamshedpur</div>
            <button className="back-btn" onClick={() => scrollTo('intro')}>↑ Back to the beginning</button>
          </div>
        </Section>
      </main>

      {entered && <MusicPlayer/>}
      {entered && <button className="top-btn" onClick={() => scrollTo('intro')} aria-label="Back to top">↑</button>}
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
