import React, { useState, useEffect } from 'react';
import { Clock, Users, Star, ChevronRight, Loader2, RefreshCw } from 'lucide-react';

const FALLBACK_IMG = 'https://commons.wikimedia.org/wiki/Special:FilePath/Varanasi%20ghats%20at%20the%20sunrise.JPG?width=400';

// Clean fallback plans — your real packages, no emojis
const fallback = [
  {
    id: 'pkg_001',
    name: 'Kashi Spiritual Getaway',
    description: 'Experience the spiritual heart of Kashi with VIP temple darshan, a peaceful boat ride on the Ganga, guided sightseeing, and a comfortable AC stay.',
    duration: '2 Nights / 3 Days',
    groupSize: 'Min 2 People',
    price: 4999,
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Varanasi%20ghats%20at%20the%20sunrise.JPG?width=400',
  },
  {
    id: 'pkg_002',
    name: 'Kashi Complete Experience',
    description: 'The complete spiritual and cultural beauty of Varanasi — premium AC stay, VIP temple visits, full sightseeing including Sarnath, and airport transfers.',
    duration: '3 Nights / 4 Days',
    groupSize: 'Min 2 People',
    price: 6999,
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Evening%20Ganga%20Aarti%20at%20Dashashwamedh%20Ghat.JPG?width=400',
    featured: true,
  },
  {
    id: 'pkg_003',
    name: 'Spiritual Triangle Package',
    description: 'Visit the three holiest cities of Uttar Pradesh — Varanasi, Prayagraj, and Ayodhya — with comfortable stays, guided sightseeing, and seamless transfers.',
    duration: '5 Days / 4 Nights',
    groupSize: 'Min 2 People',
    price: 12999,
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ganga%20Aarti%20at%20Dawn.jpg?width=400',
  },
  {
    id: 'pkg_004',
    name: 'Varanasi Sightseeing',
    description: 'Explore the iconic temples, ghats, and heritage sites of Varanasi in a private AC vehicle with a knowledgeable local guide.',
    duration: 'Full Day',
    groupSize: 'As per vehicle',
    price: 3500,
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Dhamek%20Stupa%20Sarnath%20WLM22-01571.jpg?width=400',
  },
];

const PackageCard = ({ pkg, onBook }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: '28px', overflow: 'hidden', position: 'relative',
        background: pkg.featured
          ? 'linear-gradient(145deg, #fff3e0, #ffe0b2)'
          : 'linear-gradient(145deg, #fffbf5, #fff8ee)',
        boxShadow: hovered
          ? `0 28px 70px rgba(180,80,0,${pkg.featured?'0.28':'0.18'}), 0 4px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)`
          : `0 ${pkg.featured?'14':'8'}px ${pkg.featured?'50':'30'}px rgba(180,80,0,${pkg.featured?'0.18':'0.1'}), 0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)`,
        transform: hovered ? 'translateY(-8px)' : pkg.featured ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'all 0.4s cubic-bezier(.34,1.56,.64,1)',
        border: pkg.featured ? '1.5px solid rgba(234,88,12,0.25)' : '1px solid rgba(180,80,0,0.08)',
      }}
    >
      {/* Top shine */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'45%', background:'linear-gradient(180deg,rgba(255,255,255,0.6) 0%,transparent 100%)', borderRadius:'28px 28px 0 0', pointerEvents:'none' }} />

      {pkg.featured && (
        <div style={{
          position:'absolute', top:'20px', right:'20px', zIndex:2,
          background:'linear-gradient(135deg,#ea580c,#f97316)',
          color:'#fff', fontSize:'10px', fontWeight:'700', letterSpacing:'1.5px',
          padding:'5px 14px', borderRadius:'100px', textTransform:'uppercase',
          boxShadow:'0 4px 14px rgba(234,88,12,0.45)',
          fontFamily:"'DM Sans',sans-serif",
        }}>Most Popular</div>
      )}

      <div style={{ padding:'32px 32px 0' }}>
        <div style={{
          width:'70px', height:'70px', borderRadius:'22px', overflow:'hidden',
          background:'rgba(255,255,255,0.7)',
          boxShadow:'0 8px 24px rgba(180,80,0,0.15), inset 0 1px 0 rgba(255,255,255,0.9)',
          display:'flex', alignItems:'center', justifyContent:'center',
          marginBottom:'22px',
        }}>
          <img
            src={pkg.image || FALLBACK_IMG}
            alt={pkg.name || pkg.title || 'Package'}
            style={{ width:'100%', height:'100%', objectFit:'cover' }}
            onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
          />
        </div>

        <div style={{ display:'flex', gap:'3px', marginBottom:'12px' }}>
          {[...Array(5)].map((_,i) => <Star key={i} size={13} fill="#f59e0b" color="#f59e0b"/>)}
        </div>

        <h3 style={{ fontFamily:"'Playfair Display',serif", color:'#1a0f00', fontSize:'24px', fontWeight:'700', margin:'0 0 10px', lineHeight:1.25 }}>{pkg.name || pkg.title}</h3>
        <p style={{ color:'#78400a', fontSize:'15px', lineHeight:1.7, fontFamily:"'DM Sans',sans-serif", fontWeight:'300', margin:'0 0 22px' }}>{pkg.description}</p>

        <div style={{ display:'flex', gap:'10px', flexWrap:'wrap', marginBottom:'24px' }}>
          {pkg.duration && (
            <div style={{ display:'flex', alignItems:'center', gap:'6px', background:'rgba(255,255,255,0.6)', padding:'6px 14px', borderRadius:'100px', fontSize:'13px', color:'#5c3a1e', fontFamily:"'DM Sans',sans-serif", boxShadow:'inset 0 1px 0 rgba(255,255,255,0.8)' }}>
              <Clock size={13} color="#ea580c"/>{pkg.duration}
            </div>
          )}
          {pkg.groupSize && (
            <div style={{ display:'flex', alignItems:'center', gap:'6px', background:'rgba(255,255,255,0.6)', padding:'6px 14px', borderRadius:'100px', fontSize:'13px', color:'#5c3a1e', fontFamily:"'DM Sans',sans-serif", boxShadow:'inset 0 1px 0 rgba(255,255,255,0.8)' }}>
              <Users size={13} color="#ea580c"/>{pkg.groupSize}
            </div>
          )}
        </div>
      </div>

      <div style={{ padding:'0 32px 32px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'16px' }}>
        {pkg.price && (
          <div>
            <div style={{ fontSize:'11px', color:'#a06030', letterSpacing:'1.5px', textTransform:'uppercase', fontFamily:"'DM Sans',sans-serif", marginBottom:'2px' }}>Starting from</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:'28px', fontWeight:'700', color:'#ea580c', lineHeight:1 }}>
              ₹{typeof pkg.price==='number' ? pkg.price.toLocaleString('en-IN') : pkg.price}
            </div>
          </div>
        )}
        <button
          onClick={onBook}
          style={{
            display:'flex', alignItems:'center', gap:'8px',
            background: pkg.featured ? 'linear-gradient(135deg,#c2410c,#f97316)' : 'rgba(255,255,255,0.7)',
            color: pkg.featured ? 'white' : '#ea580c',
            border: pkg.featured ? 'none' : '1.5px solid rgba(234,88,12,0.3)',
            padding:'13px 24px', borderRadius:'50px',
            fontSize:'14px', fontFamily:"'DM Sans',sans-serif", fontWeight:'600',
            cursor:'pointer', transition:'all 0.3s ease',
            boxShadow: pkg.featured
              ? '0 6px 20px rgba(234,88,12,0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
              : '0 4px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
          }}
          onMouseEnter={e => e.currentTarget.style.transform='scale(1.04)'}
          onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
        >
          Book Now <ChevronRight size={14}/>
        </button>
      </div>
    </div>
  );
};

const SkeletonCard = () => (
  <div style={{
    borderRadius:'28px', overflow:'hidden',
    background:'linear-gradient(145deg,#fffbf5,#fff8ee)',
    boxShadow:'0 8px 30px rgba(180,80,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
    border:'1px solid rgba(180,80,0,0.07)', padding:'32px',
  }}>
    <style>{`
      @keyframes shimmer {
        0% { background-position: -400px 0; }
        100% { background-position: 400px 0; }
      }
      .skel {
        background: linear-gradient(90deg, #f0e8df 25%, #fdf0e8 50%, #f0e8df 75%);
        background-size: 800px 100%;
        animation: shimmer 1.5s infinite;
        border-radius: 12px;
      }
    `}</style>
    <div className="skel" style={{ width:'70px', height:'70px', borderRadius:'22px', marginBottom:'22px' }}/>
    <div className="skel" style={{ width:'40%', height:'12px', marginBottom:'14px' }}/>
    <div className="skel" style={{ width:'75%', height:'22px', marginBottom:'12px', borderRadius:'8px' }}/>
    <div className="skel" style={{ width:'100%', height:'14px', marginBottom:'8px' }}/>
    <div className="skel" style={{ width:'85%', height:'14px', marginBottom:'8px' }}/>
    <div className="skel" style={{ width:'60%', height:'14px', marginBottom:'24px' }}/>
    <div style={{ display:'flex', gap:'10px', marginBottom:'24px' }}>
      <div className="skel" style={{ width:'80px', height:'32px', borderRadius:'100px' }}/>
      <div className="skel" style={{ width:'90px', height:'32px', borderRadius:'100px' }}/>
    </div>
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
      <div className="skel" style={{ width:'100px', height:'36px', borderRadius:'10px' }}/>
      <div className="skel" style={{ width:'110px', height:'44px', borderRadius:'50px' }}/>
    </div>
  </div>
);

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [usedFallback, setUsedFallback] = useState(false);

  const loadPackages = async () => {
    setLoading(true);
    setRetrying(false);
    setUsedFallback(false);
    setAttempt(0);

    const tryFetch = async (retries = 5, delay = 4000) => {
      for (let i = 0; i < retries; i++) {
        setAttempt(i + 1);
        if (i > 0) setRetrying(true);
        try {
          const res = await fetch('/api/packages');
          if (res.ok) {
            const data = await res.json();
            if (data && data.length > 0) {
              setPackages(data);
              setLoading(false);
              setRetrying(false);
              return;
            }
          }
        } catch (e) {}
        if (i < retries - 1) await new Promise(r => setTimeout(r, delay));
      }
      setPackages(fallback);
      setUsedFallback(true);
      setLoading(false);
      setRetrying(false);
    };

    await tryFetch();
  };

  useEffect(() => { loadPackages(); }, []);

  return (
    <section id="packages" style={{ background:'linear-gradient(180deg,#fdf6ed 0%,#fff8f0 100%)', padding:'100px 0', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', bottom:'-100px', left:'-100px', width:'400px', height:'400px', borderRadius:'50%', background:'radial-gradient(circle,rgba(251,191,36,0.07) 0%,transparent 70%)', pointerEvents:'none' }} />

      <div style={{ maxWidth:'1200px', margin:'0 auto', padding:'0 32px' }}>
        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:'64px' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:'rgba(234,88,12,0.08)', border:'1px solid rgba(234,88,12,0.18)', borderRadius:'100px', padding:'6px 18px', marginBottom:'18px' }}>
            <span style={{ color:'#ea580c', fontSize:'11px', letterSpacing:'3px', textTransform:'uppercase', fontWeight:'600', fontFamily:"'DM Sans',sans-serif" }}>Curated for You</span>
          </div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(30px,4vw,50px)', fontWeight:'700', color:'#1a0f00', margin:'0 0 16px' }}>
            Sacred Journey <em style={{ color:'#ea580c', fontStyle:'italic' }}>Packages</em>
          </h2>
          <p style={{ color:'#78400a', fontSize:'18px', fontFamily:"'DM Sans',sans-serif", fontWeight:'300', maxWidth:'480px', margin:'0 auto', lineHeight:1.7 }}>
            Handcrafted experiences for every seeker — from a single sacred dawn to a full spiritual immersion.
          </p>
        </div>

        {/* Waking up notice */}
        {retrying && (
          <div style={{
            display:'flex', alignItems:'center', justifyContent:'center', gap:'12px',
            background:'linear-gradient(145deg,#fff7ed,#fde68a44)',
            border:'1px solid rgba(234,88,12,0.2)', borderRadius:'16px',
            padding:'14px 24px', marginBottom:'32px',
            boxShadow:'0 4px 16px rgba(180,80,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
          }}>
            <Loader2 size={18} color="#ea580c" style={{ animation:'spin 1s linear infinite' }}/>
            <span style={{ color:'#92400e', fontSize:'14px', fontFamily:"'DM Sans',sans-serif", fontWeight:'500' }}>
              Loading our latest packages...
            </span>
          </div>
        )}

        {/* Grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))', gap:'28px' }}>
          {loading
            ? [1,2,3].map(i => <SkeletonCard key={i}/>)
            : packages.map((p,i) => (
                <PackageCard
                  key={p._id||p.id||i}
                  pkg={p}
                  onBook={() => document.querySelector('#contact')?.scrollIntoView({ behavior:'smooth' })}
                />
              ))
          }
        </div>
      </div>

      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </section>
  );
};

export default Packages;
